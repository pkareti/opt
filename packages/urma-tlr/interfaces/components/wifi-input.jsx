import { default as React, Component, PropTypes } from 'react';
import Urma from 'meteor/digi:urma-core';
import WifiDetails from './wifi-details.jsx';
import WifiConfigure from './wifi-config.jsx';

const Accordion = Urma.Accordion;

export default class WifiInput extends Component {

    constructor() {
        super();

        this.state = {
            // populated upon mount when data is ready
            selectedInterface: null,
            // current wifi form values (as changed in form)
            wifiSettings: {
                _changed: false,
            },
            // current global form values (as changed in form)
            globalSettings: {
                _changed: false,
            },
            valid: true,
            changed: false, // either form
            applied: false,
            submitted: false
        };
    }

    componentDidMount() {
        this.setInitialInterface();
    }

    componentWillReceiveProps() {
        // in case data is delayed until after initial render (may be unnecessary?)
        this.setInitialInterface();
    }

    setInitialInterface() {
        const props = this.props;
        if (props.dataReady && !this.state.selectedInterface) {
            const selectedInterface = props.wifi.settings[0];
            this.setState({ selectedInterface });
        }
    }

    onCancel() {
        this.refs.WifiConfigure.resetForms();
    }

    changeState(changeObj) {
        this.setState(changeObj, function (err, result) {
            // if changing selected interface, reset form to use new interface
            if (changeObj.selectedInterface) {
                this.refs.WifiConfigure.resetForms();
            }
        });
    }

    onApply() {
        this.setState({ submitted: true });
        // original settings of selected interface before changes
        const wifi = this.state.selectedInterface;
        // updated settings of selected interface from form
        const wifiSettings = this.state.wifiSettings;
        const globalSettings = this.state.globalSettings;

        const Settings = this.props.context.device.Settings;

        if (!this.state.valid) {
            return;  // accordion message and validation will be displayed
        }

        if (globalSettings._changed) {
            const id = this.props.wifi_global.settings._id;
            const modifier = {
                wifi_channel: globalSettings.wifi_channel,
                wifi5g_channel: globalSettings.wifi5g_channel,
            };
            Settings.update(id, { $set: modifier }, this.updateCompleted.bind(this));
        }

        if (wifiSettings._changed && this.state.valid) {
            const modifier = {
                ssid: wifiSettings.ssid,
                description: wifiSettings.description,
                state: wifiSettings.state,
                broadcast_ssid: wifiSettings.broadcast_ssid,
                isolate_clients: wifiSettings.isolate_clients,
                isolate_ap: wifiSettings.isolate_ap,
                security: wifiSettings.security,
                radius_server: wifiSettings.radius_server || '',
                radius_server_port: wifiSettings.radius_server_port,
            };

            // only set password if entered
            if (wifiSettings.password) {
                modifier.password = wifiSettings.password;
            }

            Settings.update(wifi._id, { $set: modifier }, this.updateCompleted.bind(this));
        }
    }

    updateCompleted(err, result) {
        this.props.onUpdateComplete(err, result);
        if (!err) {
            const wifiSettings = this.state.wifiSettings;
            wifiSettings._changed = false;
            const globalSettings = this.state.globalSettings;
            globalSettings._changed = false;

            this.setState({
                globalSettings,
                wifiSettings,
                applied: true,
                changed: false,
            });
        }
    }

    getSubmitMessage() {
        if (this.props.dataReady) {
            if (this.state.submitted && !this.state.valid) {
                return { type: 'error' };
            } else if (this.state.submitted && this.state.applied) {
                return { type: 'success' };
            }
        }
        return {};
    }

    getWifiStatus() {
        const wifiStatus = this.props.wifi.state;
        const wifi5gStatus = this.props.wifi5g.state;

        const wifiInterfacesDown = [];
        let operatingStatusUp = true;
        wifiStatus.forEach(wifi => {
            if (wifi.admin_status === 'up' && wifi.oper_status !== 'up') {
                wifiInterfacesDown.push(`wifi${wifi._groupIndex + 1}`);
                operatingStatusUp = false;
            }
        });

        wifi5gStatus.forEach(wifi => {
            if (wifi.admin_status === 'up' && wifi.oper_status !== 'up') {
                wifiInterfacesDown.push(`wifi5g${wifi._groupIndex + 1}`);
                operatingStatusUp = false;
            }
        });

        if (operatingStatusUp) {
            return { type: 'ok' };
        }

        const text = wifiInterfacesDown.length > 1 ? 'Wifi interfaces are down' : `${wifiInterfacesDown[0]} is down`;
        return { type: 'error', text };
    }

    getSelectedInterface() {
        // get selected intreface from collection before passing to 'WifiConfigure'
        // (state stored from selecting radio is a snapshot at that time)
        const selectedInterface = this.state.selectedInterface;
        return this.props[selectedInterface._groupName].settings.find(function (wifi) {
            if (wifi._id === selectedInterface._id) {
                return wifi;
            }
        });
    }

    render() {
        const props = this.props;
        const buttons = [
            {
                buttonText: 'Apply',
                onclick: this.onApply.bind(this),
                className: 'btn-blue js-apply'
            },
            {
                buttonText: 'Cancel',
                onclick: this.onCancel.bind(this),
                className: 'btn-gray js-cancel'
            },
        ];

        const accordionMessage = this.getSubmitMessage();
        const accordionStatus = this.getWifiStatus();

        let selectedInterface;
        if (props.dataReady && this.state.selectedInterface) {
            selectedInterface = this.getSelectedInterface();
        }

        const wifiDetailsOptions = {
            context: this.props.context,
            lan: props.lan,
            selectedInterface,
            setParentState: this.changeState.bind(this),
            setWrapperState: this.props.setWrapperState,
            changed: this.state.changed,
        };

        return (
            <div className="js-interface-wifi">
                <Accordion name="wifi" title="Wi-Fi" connection="Wi-Fi" icon="wifi24.png" key="1"
                  data-id="1" buttons={buttons} location={props.location} message={accordionMessage}
                  status={accordionStatus}
                >
                    {
                        props.dataReady && props.ready && selectedInterface ?
                            <div className="js-interface-wifi-content">
                                <WifiDetails
                                  wifi={this.props.wifi}
                                  {...wifiDetailsOptions}
                                />
                                <WifiDetails
                                  wifi5g={this.props.wifi5g}
                                  {...wifiDetailsOptions}
                                />

                                <WifiConfigure
                                    ref="WifiConfigure"
                                    context={props.context}
                                    valid={this.state.valid}
                                    submitted={this.state.submitted}
                                    wifiGlobalSettings={props.wifi_global.settings}
                                    wifiGlobalDescriptors={props.wifi_global_descriptor}
                                    wifiDescriptors={props.wifi_descriptor}
                                    selectedInterface={selectedInterface}
                                    wifiSettings={this.state.wifiSettings}
                                    updateParentState={this.changeState.bind(this)}
                                />
                            </div>
                        :
                            <h4 className="js-loading-message">Loading...</h4>
                    }
                </Accordion>
            </div>
        );
    }
}

WifiInput.propTypes = {
    context: PropTypes.object.isRequired,
    getData: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onUpdateComplete: PropTypes.func.isRequired,
    setWrapperState: PropTypes.func.isRequired,
    // if dataReady:
    dataReady: PropTypes.bool,
    wifi: PropTypes.object,
    wifi5g: PropTypes.object,
    wifi_global: PropTypes.object,
    lan: PropTypes.object,
};
