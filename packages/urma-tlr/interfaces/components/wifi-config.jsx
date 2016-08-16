import { default as React, Component, PropTypes } from 'react';
import { UrmaForms } from 'meteor/digi:urma-core';
import Validations from '../wifi-validations.js';

const Form = UrmaForms.Formsy.Form;
const Input = UrmaForms.Input;
const InputNoValidate = UrmaForms.InputNoValidate;

// Define form data (should be replaced with descriptors)
const modeOptions = [{ title: 'Access Point', value: 'ap' }];
const onOffOptions = [{ title: 'On', value: 'on' }, { title: 'Off', value: 'off' }];

// Define form rows
export const editGlobalRows = [
    { label: '2.4GHz Channel', name: 'wifi_channel', validate: false, type: 'select', options: [] },
    { label: '5GHz Channel', name: 'wifi5g_channel', validate: false, type: 'select', options: [] }
];

export const editSelectedRows = [
    { label: 'Mode', name: 'mode', validate: false, type: 'select', options: modeOptions },
    { label: 'SSID', name: 'ssid', validate: true },
    { label: 'Password', name: 'password', validate: true, hide: true },
    { label: 'Description', name: 'description', validate: true, type: 'textarea' },
    { label: 'State', name: 'state', validate: false, type: 'radio', options: onOffOptions },
    { label: 'Broadcast SSID', name: 'broadcast_ssid', validate: false, type: 'radio', options: onOffOptions },
    { label: 'Isolation - Client', name: 'isolate_clients', validate: false, type: 'radio', options: onOffOptions },
    { label: 'Isolation - Access Point', name: 'isolate_ap', validate: false, type: 'radio', options: onOffOptions  },
    { label: 'Security', name: 'security', validate: false, type: 'select', options: [] },
    { label: 'Radius Server', name: 'radius_server', validate: true, errors: true }, // multiple error rules
    { label: 'Radius Port', name: 'radius_server_port', validate: true, required: true },
];



class WifiConfigure extends Component{
    componentDidMount() {
        this.initializeParentState();
    }

    resetForms() {
        // reset() with no argument resets to pristine values from 1st load, which is always wifi1,
        // therefore need to pass most recent saved values for selectedInterface
        const savedGlobalSettings = this.props.wifiGlobalSettings;
        const savedWifiSettings = this.props.selectedInterface;
        this.refs.editSelectedForm.reset(savedWifiSettings);
        this.refs.editGlobalForm.reset(savedGlobalSettings);
        this.initializeParentState();
    }

    initializeParentState() {
        const self = this;
        const stateObj = {
            wifiSettings: self.props.selectedInterface,
            globalSettings: self.props.wifiGlobalSettings,
            valid: self.isFormValid(),
            submitted: false,
            changed: false,
            applied: false
        };

        stateObj.wifiSettings._changed = false;
        stateObj.globalSettings._changed = false;
        this.props.updateParentState(stateObj);
    }

    handleGlobalFormChange(currentValues, isChanged) {
        const changed = this.isChanged(currentValues, 'wifiGlobalSettings');
        this.handleChange(currentValues, 'globalSettings', changed);
    }

    handleSelectedFormChange(currentValues, isChanged) {
        // isChanged needs to compare against current wifiSettings state, not pristine state.
        // ex)  if security changed from 'none' to 'wpa2_personal', and changed back,
        //      changing back wouldn't trigger isChanged in Formsy
        const changed = this.isChanged(currentValues, 'selectedInterface');
        this.handleChange(currentValues, 'wifiSettings', changed);
    }

    isChanged(currentValues, propName) {
        const currentSettings = this.props[propName];
        let updateState = false;

        Object.keys(currentValues).forEach(function (key) {
           if (currentValues[key] !== currentSettings[key]) {
               updateState = true;
           }
        });
        return updateState;
    }

    handleChange(currentValues, stateName, changed) {
        const stateObj = {
            [stateName]: currentValues,
            changed
        };

        if (changed) {
            stateObj.applied = false;
            stateObj.submitted = false;
        }

        stateObj[stateName]._changed = changed;
        if (stateName === 'wifiSettings') {
            stateObj.valid = this.isFormValid();
        }
        this.props.updateParentState(stateObj);
    }


    isFormValid() {
        let valid = true;
        this.refs.editSelectedForm.inputs.forEach(input => {
            if (!input.isValidValue(input.getValue())) {
                valid = false;
            }
        });
        return valid;
    }

    hideFieldIf(row) {
        if (row.name === 'password') {
            return this.props.wifiSettings.security === 'none';
        }
        return false;
    }

    addOptions(descriptors, row) {
        const updatedRow = row;

        if (row.options) {
            descriptors.element.forEach((el) => {
                if (el['@name'] === row.name && el.value) {
                    updatedRow.options = el.value;
                    return updatedRow;
                }
            });
        }

        return updatedRow;
    }

    outputRows(inputProps, row, i) {
        const self = this;

        if (row.hide) {
            if (self.hideFieldIf(row)) {
                return null;
            }
        }

        const InputType = row.validate ? Input : InputNoValidate;

        return (
            <tr className={`js-row-${row.name}`} key={`row-${i}`}>
                <td><label className="js-label">{row.label}</label></td>
                <td>
                    <InputType {...inputProps} />
                </td>
            </tr>
        );
    }

    render() {
        const self = this;
        const props = this.props;
        const savedWifiSettings = props.selectedInterface;
        const interfaceName = `${savedWifiSettings._groupName}${savedWifiSettings._groupIndex + 1}`;
        const isFormInvalid = this.props.submitted && !this.props.valid;

        return (
            <div className="js-wifi-configure wifi-configure">
                <div className="border-box">
                    <h4>Wireless Options</h4>
                    <Form
                        className="js-wifi-globals-form"
                        ref="editGlobalForm"
                        name="globalSettings"
                        onChange={this.handleGlobalFormChange.bind(this)}>
                        <div className="table-responsive">
                            <table>
                                <tbody>
                                    {editGlobalRows.map((row, i) => this.addOptions(this.props.wifiGlobalDescriptors, row, i))
                                        .map((row, i) =>
                                            this.outputRows(_getProps({ row, data: this.props.wifiGlobalDescriptors }), row, i))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Form>
                </div>

                <div className="border-box">
                    <h4>Edit Selected (<span style={{textTransform: 'lowercase'}}>{interfaceName}</span>)</h4>

                    <Form
                        ref="editSelectedForm"
                        name="wifiSettings"
                        className="js-wifi-interface-form"
                        onChange={this.handleSelectedFormChange.bind(this)}>
                        <div className="table-responsive">
                            <table>
                                <tbody>
                                    {editSelectedRows.map((row, i) => this.addOptions(this.props.wifiDescriptors, row, i))
                                        .map((row, i) =>
                                            this.outputRows(_getProps({ row, data: savedWifiSettings, _validations: Validations, invalidSubmission: isFormInvalid }), row, i)
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}


const _getProps = ({ row, data, _validations, invalidSubmission }) => {
    const inputProps = {
        name: row.name,
        type: row.type || 'text',
        value: row.value || data[row.name],
        options: row.options,
        required: row.required || false,
    };

    if (row.validate && _validations) {
        inputProps.invalidSubmission = invalidSubmission;
        inputProps.validations = _validations[row.name].validations;

        if (row.errors) {
            inputProps.validationErrors = _validations[row.name].errors;
        } else {
            inputProps.validationError = _validations[row.name].errors;
        }
    }

    return inputProps;
};

export default WifiConfigure;

WifiConfigure.propTypes = {
    wifiGlobalSettings: PropTypes.object.isRequired,
    wifiGlobalDescriptors: PropTypes.object.isRequired,
    wifiSettings: PropTypes.object.isRequired,
    selectedInterface: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    updateParentState: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    submitted: PropTypes.bool.isRequired
};

