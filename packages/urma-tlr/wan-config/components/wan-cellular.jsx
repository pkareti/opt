import {default as React, Component, PropTypes} from 'react';
import Urma from 'meteor/digi:urma-core';
import Probing from './probing.jsx';
import {WanCellularState} from './wan-cellular-state.jsx';
import {WanCellularSettings} from './wan-cellular-settings.jsx';
import {composeWithTracker} from 'react-komposer';
import { getCustomData } from '../../data-containers/custom-data-containers.js';

let Accordion = Urma.Accordion;

export class WanCellularComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wanProbingSettings: {},
            resetProbing: false,
            submitted: false,
            valid: true,
            applied: false
        };
    }

    onChange(state, value) {
        this.setState({
            [state]: value,
            applied: false
        });
    }

    onCancel() {
        this.setState({
            resetProbing: !this.state.resetProbing,
            submitted: false
        });
    }

    onApply() {
        this.setState({ submitted: true });
        let wanProbingSettings = this.state.wanProbingSettings;
        if (this.state.valid && wanProbingSettings.changed) {
            let wanSettings = this.props.wanSettings;
            let Settings = this.props.context.device.Settings;
            let activateAfterInSeconds = parseInt(wanProbingSettings.activateAfter) * parseInt(wanProbingSettings.activateAfterUnit);
            let retryAfterInSeconds = parseInt(wanProbingSettings.retryAfter) * parseInt(wanProbingSettings.retryAfterUnit);
            let modifiedObj = {};
            modifiedObj['probe_host'] = wanProbingSettings.probeHost;
            modifiedObj['probe_interval'] = wanProbingSettings.probeInterval;
            modifiedObj['probe_size'] = wanProbingSettings.probeSize;
            modifiedObj['probe_timeout'] = wanProbingSettings.probeTimeout;
            modifiedObj['activate_after'] = activateAfterInSeconds;
            modifiedObj['retry_after'] = retryAfterInSeconds;
            modifiedObj['timeout'] = wanProbingSettings.timeout;
            /** Updating wan probing settings **/
            Settings.update(wanSettings._id, { $set: modifiedObj }, this.updateCompleted.bind(this));
        }
    }

    updateCompleted(err, result) {
        this.props.onUpdateComplete(err, result);
        if (!err) {
            this.setState({
                submitted: false,
                applied: true,
                wanProbingSettings: {}
            });
        }
    }

    getSubmitMessage() {
        if (this.state.submitted && !this.state.valid) {
            return { type: 'error' };
        } else if (this.state.applied) {
            return { type: 'success' };
        }
        return null;
    }

    render() {
        const buttons = [
            {
                buttonText: 'Apply',
                onclick: this.onApply.bind(this),
                className: 'btn-blue js-btn-apply'
            },
            {
                buttonText: 'Cancel',
                onclick: this.onCancel.bind(this),
                className: 'btn-gray js-btn-cancel'
            },
            {
                buttonText: 'Delete',
                onclick: this.props.onDelete.bind(this),
                className: 'btn-gray js-btn-delete'
            }
        ];

        let title, messageType, connection, status = {};
        let wrapperClassName = 'js-wan-cellular';
        if (this.props.ready) {
            title = `WAN ${this.props.wanSettings._groupIndex + 1}`;
            messageType = this.getSubmitMessage();
            connection = `Cellular(WAN/${this.props.wanSettings.interface})`;
            wrapperClassName = `js-wan-${this.props.wanSettings.interface}`;
            status = this.props.renderWanStatus(this.props.wan.state);
        }

        return (
            <div className={wrapperClassName}>
                {this.props.ready ?
                    <Accordion name={'wan'+(this.props.wanSettings._groupIndex + 1)}
                        title={title} connection={connection} icon="cellular.png" buttons={buttons}
                        location={this.props.location} message={messageType} status={status} movebutton="true"
                    >
                        <div>
                            <div className="accordion-column-wrapper">
                                <WanCellularSettings
                                    cellularSettings={this.props.cellular.settings}
                                    goToInterface={this.props.goToInterface.bind(this,this.state.wanProbingSettings.changed)}
                                    renderPassword={this.props.renderPassword.bind(this)}/>
                                <Probing
                                    key={"probing_" + this.state.resetProbing}
                                    onChange={this.onChange.bind(this)}
                                    initialWanSettings={this.props.wanSettings}
                                    submitted={this.state.submitted}/>

                                <WanCellularState cellularState={this.props.cellular.state}/>
                            </div>
                        </div>
                    </Accordion> :
                    <div>Loading...</div>
                }
            </div>
        )
    }
}

WanCellularComp.propTypes = {
    getData: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    wanSettings: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    goToInterface: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    location: PropTypes.object,
    renderPassword: PropTypes.func.isRequired,
    renderWanStatus: PropTypes.func.isRequired,
};

let WanCellular = composeWithTracker(getCustomData)(WanCellularComp);

export default WanCellular;