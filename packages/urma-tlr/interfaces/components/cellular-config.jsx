import {default as React, Component, PropTypes} from 'react';
import {UrmaForms} from 'meteor/digi:urma-core';
import Validations from '../cellular-validations.js';

let Form = UrmaForms.Formsy.Form;
let Input = UrmaForms.Input;
let InputNoValidate = UrmaForms.InputNoValidate;

export default class CellularConfigure extends Component {
        
    componentDidMount() {
        this.initializeParentState();
    }

    initializeParentState() {
        const self = this;
        const stateObj = {
            valid: self.isFormValid(),
            submitted: false,
            changed: false,
            applied: false
        };
        self.props.setParentState(stateObj);
    }

    resetForm(settings) {
        this.refs.form.reset(settings);
        this.initializeParentState();
    }

    handleFormChange(currentValues,isChanged) {
        if (isChanged) {
            const stateObj = {
                valid: this.isFormValid(),
                applied: false,
                changed: true
            };
            this.props.setParentState(stateObj);
        }
    }

    isInValidSubmission() {
        return this.props.submitted && !this.props.valid;
    }

    isFormValid() {
        let valid = true;
        this.refs.form.inputs.forEach(input => {
            if (!input.isValidValue(input.getValue())) {
                valid = false;
            }
        });
        return valid;
    }

    render() {
        const stateOptions = [
            {title: 'Off', value: 'off'},
            {title: 'On', value: 'on'},
            {title: 'On-demand', value: 'on-demand'}
        ];

        const preferredOptions = [
            {title: 'auto', value: 'auto'},
            {title: '4g', value: '4g'},
            {title: '3g', value: '3g'},
            {title: '2g', value: '2g'}
        ];

        return (
            <div className="cellular-configure js-cellular-edit">
                <div className="border-box">
                    <h4>Edit Selected</h4>
                    <Form ref="form"
                          key={this.props.cellularSettings._id}
                          className="cellular-edit-form"
                          onChange={this.handleFormChange.bind(this)}>
                        <div className="table-responsive">
                            <table>
                                <tbody>
                                <tr>
                                    <td className="js-label">Description</td>
                                    <td>
                                        <Input name="description"
                                               type="textarea"
                                               invalidSubmission={this.isInValidSubmission()}
                                               validations={Validations.description.validations}
                                               validationError={Validations.description.errors}
                                               value={this.props.cellularSettings.description}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="js-label">
                                        State
                                    </td>
                                    <td>
                                        <InputNoValidate name="state"
                                                         className="state"
                                                         type="radio"
                                                         options={stateOptions}
                                                         value={this.props.cellularSettings.state ||stateOptions[0].value}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>APN</label>
                                    </td>
                                    <td>
                                        <Input name="apn"
                                               type="text"
                                               invalidSubmission={this.isInValidSubmission()}
                                               validations={Validations.apn.validations}
                                               validationError={Validations.apn.errors}
                                               value={this.props.cellularSettings.apn}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>APN Password</label>
                                    </td>
                                    <td>
                                        <Input name="apnPassword"
                                               type="password"
                                               invalidSubmission={this.isInValidSubmission()}
                                               validations={Validations.apnPassword.validations}
                                               validationError={Validations.apnPassword.errors}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>SIM PIN</label>
                                    </td>
                                    <td>
                                        <Input name="simPin"
                                               type="text"
                                               invalidSubmission={this.isInValidSubmission()}
                                               validations={Validations.simPin.validations}
                                               validationError={Validations.simPin.errors}
                                               value={this.props.cellularSettings.sim_pin || ''}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Preferred Mode</label>
                                    </td>
                                    <td>
                                        <InputNoValidate name="preferredMode"
                                                         className="preferred-mode"
                                                         type="select"
                                                         options={preferredOptions}
                                                         value={this.props.cellularSettings.preferred_mode||preferredOptions[0].value}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Connection Attempts</label>
                                    </td>
                                    <td>
                                        <Input name="connectionAttempts"
                                               type="text"
                                               required={true}
                                               invalidSubmission={this.isInValidSubmission()}
                                               validations={Validations.connectionAttempts.validations}
                                               validationError={Validations.connectionAttempts.errors}
                                               value={this.props.cellularSettings.connection_attempts}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

CellularConfigure.propTypes = {
    setParentState: PropTypes.func.isRequired,
    cellularSettings: PropTypes.object.isRequired,
    submitted: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    selectedInterface: PropTypes.string.isRequired,
};
