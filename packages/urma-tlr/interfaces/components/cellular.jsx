import { default as React, Component, PropTypes } from 'react';
import Urma from 'meteor/digi:urma-core';
import {composeWithTracker} from 'react-komposer';
import CellularDetails from './cellular-details.jsx';
import CellularConfigure from './cellular-config.jsx';
import { getCustomData } from '../../data-containers/custom-data-containers.js';

const Accordion = Urma.Accordion;

export class CellularInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedInterface:'cellular1',
            submitted: false,
            applied: false,
            valid:true,
            changed:false
        };
    }

    changeState(changeObj) {
        this.setState(changeObj);
    }

    onCancel() {
        let settings = this.getSelectedSettings();
        this.refs.cellularConfigure.resetForm(settings);
    }

    onApply() {
        this.setState({submitted: true});
        if (this.state.valid && this.state.changed) {
            let Settings = this.props.context.device.Settings;
            let cellularForm = this.refs.cellularConfigure.refs.form.getModel();
            let cellularSettings = this.getSelectedSettings();
            /**
             * Only when the state is on and other cellular settings are changed,
             * turn the cellular state off before updating the settings and turn state
             * on after update . Reason for not turning state off/on is, when cellular state
             * is set to off the cellular connection is down and it is costly to bring it up
             *  TODO : Should only update settings if the settings are changed
             **/
            const cellularStateLeftOn = (cellularSettings.state == 'on' &&  cellularForm.state == 'on');
            let modifiedObj = {
                description: cellularForm.description,
                apn: cellularForm.apn,
                preferred_mode: cellularForm.preferredMode,
                connection_attempts: cellularForm.connectionAttempts,
                /** SIM Pin is not currently supported **/
                //  sim_pin: cellularForm.simPin
            };
            /** if set changed off -> on or off -> off update state setting **/
            if(!cellularStateLeftOn){
                modifiedObj['state'] = cellularForm.state;
            }
            /** save password only if value is not empty **/
            if(cellularForm.apnPassword != ''){
                modifiedObj['apn_password'] = cellularForm.apnPassword;
            }

            /** if state is on . we set the state to off , update all the settings and turn it back on **/
            if(cellularStateLeftOn){
                /** Setting cellular state off before updating apn **/
                Settings.update(cellularSettings._id,{$set: {'state': 'off'}},this.props.onUpdateComplete.bind(this));
            }

            /** Updating cellular settings **/
            Settings.update(cellularSettings._id, {$set: modifiedObj}, this.updateCompleted.bind(this));

            if(cellularStateLeftOn){
                /** Setting cellular state off before updating apn **/
                Settings.update(cellularSettings._id,{$set: {'state': 'on'}},this.props.onUpdateComplete.bind(this));
            }
        }
    }

    updateCompleted(err, result) {
        this.props.onUpdateComplete(err, result);
        if (!err) {
            this.setState({
                submitted: false,
                applied: true,
                changed:false,
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

    getSelectedSettings() {
        let selectedSettings = {};
        let intialSettings = this.props.cellular.settings || [];
        if (intialSettings && intialSettings.length > 0) {
            selectedSettings = this.state.selectedInterface === 'cellular1' ? intialSettings[0] : intialSettings[1];
        }

        return selectedSettings;
    }

    goToWan(wan) {
        let changed = this.state.changed;
        let contextRouter = this.props.context.router;
        const url = '/wan?open='+wan;
        if (changed) {
            let updateShowDialog = this.props.setWrapperState;
            let showDialog = {
                dialog: 'wan',
                header: 'Confirmation',
                message: 'Your changes will be lost. Are you sure you want to navigate to Wan?',
                onDialogOk: function () {
                    updateShowDialog('showDialog', {});
                    contextRouter.push(url);
                }
            };
            updateShowDialog('showDialog', showDialog);
        } else {
            contextRouter.push(url);
        }
    }

    renderCellularStatus() {
        const operStatus = this.props.cellular.state[0].oper_status;
        let status = { type: 'error', text: 'Down' };
        if (operStatus === 'up') {
            status = { type: 'ok' };
        }
        return status;
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
        ];
        let messageType, status = {};
        if (this.props.dataReady) {
            messageType = this.getSubmitMessage();
        }

        return (
            <div className="js-interface-cellular">
                {
                    this.props.dataReady ?
                    <Accordion name="cellular" title="Cellular" connection="cellular"
                               icon="cellular.png" key="cellular" buttons={buttons}
                               location={this.props.location} message={messageType} status={this.renderCellularStatus()}
                    >
                        <CellularDetails
                            ref="cellularDetails"
                            cellularSettings={this.props.cellular.settings}
                            wanSettings={this.props.wan.settings}
                            goToWan={this.goToWan.bind(this)}
                            setParentState={this.changeState.bind(this)}
                            setWrapperState={this.props.setWrapperState.bind(this)}
                            changed={this.state.changed}
                            selectedInterface={this.state.selectedInterface}
                            renderPassword={this.props.renderPassword.bind(this)}/>
                        <CellularConfigure
                            ref="cellularConfigure"
                            key={this.state.selectedInterface + 'Configure'}
                            setParentState={this.changeState.bind(this)}
                            submitted={this.state.submitted}
                            valid={this.state.valid}
                            cellularSettings={this.getSelectedSettings()}
                            selectedInterface={this.state.selectedInterface}/>
                    </Accordion>
                    :
                    <div>Loading...</div>
                }
            </div>
        );
    }
}

CellularInfo.propTypes = {
    getData: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    onUpdateComplete: PropTypes.func.isRequired,
    setWrapperState: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    renderPassword: PropTypes.func.isRequired,

    // with data-container wrapper:
    dataReady: PropTypes.bool,
    wan: PropTypes.object,
    cellular: PropTypes.object
};

let Cellular =  composeWithTracker(getCustomData)(CellularInfo);

export default Cellular;
