import { default as React, Component, PropTypes } from 'react';
import Urma from 'meteor/digi:urma-core';
import WanEthernetInterface from './wan-ethernet-interface.jsx';
import WanEthernetSettings from './wan-ethernet-settings.jsx';
import WanEthernetState from './wan-ethernet-state.jsx';
import Probing from './probing.jsx';
import { composeWithTracker } from 'react-komposer';
import { getCustomData } from '../../data-containers/custom-data-containers.js';

const Accordion = Urma.Accordion;

export class WanEthernetInput extends Component {
    constructor(props) {
        super(props);

        const wanEthSettings = props.wanSettings || {};
        wanEthSettings.changed = false;

        this.state = {
            wanEthSettings,
            wanProbingSettings: {
                changed: false
            },
            resetSettings: false,     // used to probing form
            submitted: false,
            applied: false,
            applySuccess: false,
            dialog: false
        };
    }

    onApply() {
        const wanEthSettings = this.state.wanEthSettings;
        const wanProbingSettings = this.state.wanProbingSettings;
        this.setState({ submitted: true });

        if (!wanEthSettings.valid || !wanProbingSettings.valid) {
            return; // submit error will be rendered.
        }

        if (wanEthSettings.changed || wanProbingSettings.changed) {
            // if changing from dhcp 'on' to 'off' or vice-versa, could lose connection, show dialog
            const savedEthSettings = this.props.wanSettings;
            const ipChanged = wanEthSettings.dhcp === 'off' && (
                savedEthSettings.ip_address !== wanEthSettings.ip_address ||
                savedEthSettings.mask !== wanEthSettings.mask ||
                savedEthSettings.gateway !== wanEthSettings.gateway);

            if (savedEthSettings.dhcp !== wanEthSettings.dhcp || ipChanged) {
                const showDialog = {
                    dialog: 'apply',
                    header: 'Apply Confirmation',
                    message: 'The device may lose connectivity while applying this change.'
                    + ' Do you want to apply the changes now?',
                    onDialogOk: this.applyWanEthUpdate.bind(this)
                };
                this.props.updateState('showDialog', showDialog);
                this.setState({ dialog: true });
            } else {
                this.applyWanEthUpdate();
            }
        }
    }

    applyWanEthUpdate() {
        const Settings = this.props.context.device.Settings;
        const wanEthSettings = this.state.wanEthSettings;
        const wanProbingSettings = this.state.wanProbingSettings;

        if (wanEthSettings.changed) {
            const ethWanId = this.props.wanSettings._id;

            let modifier;
            if (wanEthSettings.dhcp === 'on') {
                modifier = { dhcp: 'on' };
            } else {
                modifier = {
                    dhcp: 'off',
                    ip_address: wanEthSettings.ip_address,
                    mask: wanEthSettings.mask,
                    gateway: wanEthSettings.gateway,
                    dns1: wanEthSettings.dns1,
                    dns2: wanEthSettings.dns2
                };
            }
            Settings.update(ethWanId, { $set: modifier }, this.updateCompleted.bind(this));
        }

        if (wanProbingSettings.changed) {
            const wanSettings = this.props.wanSettings;
            const activateAfterInSeconds = (parseInt(wanProbingSettings.activateAfter) * parseInt(wanProbingSettings.activateAfterUnit)).toString();
            const retryAfterInSeconds = (parseInt(wanProbingSettings.retryAfter) * parseInt(wanProbingSettings.retryAfterUnit)).toString();

            const modifier = {
                probe_host: wanProbingSettings.probeHost,
                probe_interval: wanProbingSettings.probeInterval,
                probe_size: wanProbingSettings.probeSize,
                probe_timeout: wanProbingSettings.probeTimeout,
                activate_after: activateAfterInSeconds,
                retry_after: retryAfterInSeconds,
                timeout: wanProbingSettings.timeout
            };
            Settings.update(wanSettings._id, { $set: modifier }, this.updateCompleted.bind(this));
        }
    }

    updateCompleted(err, result) {
        this.props.onUpdateComplete(err, result);
        if (!err) {
            this.wanChangesApplied();
        }
    }

    wanChangesApplied() {
        const wanEthSettings = this.state.wanEthSettings;
        const wanProbingSettings = this.state.wanProbingSettings;

        wanEthSettings.changed = false;
        wanProbingSettings.changed = false;
        this.setState({
            applied: true,
            wanEthSettings,
            wanProbingSettings
        });

        if (this.state.dialog) {
            this.props.updateState('showDialog', {});
            this.setState({ dialog: false });
        }
    }

    onCancel() {
        const wanEthSettings = this.state.wanEthSettings;
        wanEthSettings.changed = false;

        this.setState({
            resetSettings: !this.state.resetSettings,    // for resetting probing form
            wanEthSettings,
            submitted: false
        });

        // reset wan eth form to saved settings.  Reset form triggers form change event.
        const savedSettings = this.props.wanSettings;
        this.refs.wanEthSettings.resetForm(savedSettings);
    }

    handleProbingSettingsChange(state, value) {
        // state returns: 'wanProbingSettings' || 'wanProbingSettings[state]' || 'valid';
        let wanProbingSettings = this.state.wanProbingSettings;
        if (state === 'valid') {
            wanProbingSettings.valid = value;
        } else {
            // settings passed without valid flag
            wanProbingSettings = value;
            wanProbingSettings.valid = this.state.wanProbingSettings.valid;
        }
        this.setState({ wanProbingSettings, submitted: false });
    }

    setEthSettings(settings) {
        if (settings.changed && this.state.submitted) {
            this.setState({ submitted: false });
        }
        this.setState({ wanEthSettings: settings });
    }

    getSubmitMessage() {
        const ethSettingsValid = this.state.wanEthSettings.valid;
        const probeSettingsValid = this.state.wanProbingSettings.valid;

        if (this.state.submitted && (!ethSettingsValid || !probeSettingsValid)) {
            return { type: 'error' };
        } else if (this.state.submitted && this.state.applied) {
            return { type: 'success' };
        }
        return null;
    }

    render() {
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
            {
                buttonText: 'Delete',
                onclick: this.props.onDelete.bind(this),
                className: 'btn-gray js-delete'
            }
        ];

        let title;
        let messageType;
        let ethNumber;
        let connection;
        let status = {};

        const wanIndex = this.props.wanSettings._groupIndex;
        const wanEthClass = `js-wan-eth${wanIndex + 1}`;

        if (this.props.dataReady) {
            title = `WAN ${wanIndex + 1}`;
            messageType = this.getSubmitMessage();
            ethNumber = this.props.wan.state._groupIndex + 1;
            connection = `Ethernet (WAN/${this.props.wanSettings.interface})`;
            status = this.props.renderWanStatus(this.props.wan.state);
        }

        return (
            <div className={wanEthClass}>
                { this.props.dataReady ?
                    <Accordion name={`wan${wanIndex + 1}`} title={title}
                        connection={connection} icon="ethernet.png" buttons={buttons}
                        location={this.props.location} message={messageType} status={status}
                        movebutton="true">

                        <div className="accordion-column-wrapper js-wan-eth-content">
                            <div className="accordion-column-wide">
                                <h5>Ethernet {ethNumber}</h5>
                                <WanEthernetInterface
                                    state={this.props.eth.state}
                                    goToInterface={this.props.goToInterface.bind(this, this.state.wanEthSettings.changed || this.state.wanProbingSettings.changed)}
                                />

                                <WanEthernetSettings
                                    ref="wanEthSettings"
                                    wanSettings={this.props.wanSettings}
                                    setEthSettings={this.setEthSettings.bind(this)}
                                    submitted={this.state.submitted}
                                />
                            </div>

                            <Probing
                                key={`probing-${this.state.resetSettings}`}
                                onChange={this.handleProbingSettingsChange.bind(this)}
                                initialWanSettings={this.props.wanSettings}
                                submitted={this.state.submitted}
                            />

                            <WanEthernetState wanState={this.props.wan.state} />
                        </div>
                    </Accordion>
                    : <div className="js-loading-message">Loading...</div> }
            </div>
        );
    }
}

const WanEthernet = composeWithTracker(getCustomData)(WanEthernetInput);


WanEthernetInput.propTypes = {
    getData: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    wanSettings: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    onUpdateComplete: PropTypes.func.isRequired,
    goToInterface: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    location: PropTypes.object,
    renderWanStatus: PropTypes.func.isRequired,

    // after composer wraps:
    dataReady: PropTypes.bool,
    eth: PropTypes.object,
    wan: PropTypes.object,
};

export default WanEthernet;