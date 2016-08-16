import React from 'react';
import reactMixin from 'react-mixin';
import Urma from 'meteor/digi:urma-core';
import Validations from '../../forms/validations';
import { UrmaForms } from 'meteor/digi:urma-core';

let Form = UrmaForms.Formsy.Form;
let Input = UrmaForms.Input;
const alerts = Urma.alerts;

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.username = '';
        this.password = '';
        this.state = {
            submitted: false,
            valid: true
        };
        this.updateCreds = this.updateCreds.bind(this);
        this.setInputVals = this.setInputVals.bind(this);
    }

    componentWillMount() {
        // if we've already logged in and are coming back to this page
        this.props.buttonConfig(
            '/getting-started/welcome',
            '/getting-started/connect',
            this.updateCreds);

        this.props.enableNext();
    }

    getMeteorData() {
        return {
            user: Meteor.user()
        };
    }

    setInputVals(currentValues) {
        this.username = currentValues.username;
        this.password = currentValues.password;
    }

    setValid() {
        this.setState({ valid: true });
    }

    setInvalid() {
        this.setState({ valid: false });
    }

    updateCreds() {
        const userId = this.data.user._id;
        const username = this.username;
        const password = this.password;
        const self = this;
        const modifiedObj = {};

        this.setState({ submitted: true });

        if (username && username.length) {
            modifiedObj['username'] = username;
        }
        if (password && password.length) {
            modifiedObj['password'] = password;
        }

        const credsUnchanged = _.isEmpty(modifiedObj);

        if (this.state.valid && !credsUnchanged) {
            Meteor.users.update({ '_id': userId }, { $set: modifiedObj }, function (err, result) {
                if (err) {
                    alerts.error(err + ' Your changes have not been saved.');
                } else {
                    self.props.transitionToNext();
                }
            });
        } else if (credsUnchanged) {
            self.props.transitionToNext();
        }

        return {
            transitionToNext: false
        };
    }

    render() {
        return (
            <div className="gsw-container js-wz-change-password">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                    </div>
                    <div className="wizard-content-text">
                        <p>You may change the default username and password for improved device security.</p>
                        <p>Passwords must be at least 8 characters in length, including at least one number and one
                            character.
                        </p>
                        <p>Refer to the Quick Start Guide as needed.</p>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    {this.state.submitted && !this.state.valid ?
                        <p className="error form-submitted-error bold">Form could not be submitted. Please correct
                            highlighted errors.</p>
                        :
                        null
                    }
                    {this.data.user ?
                        <Form className="change-password-form" onValid={this.setValid.bind(this)}
                            onInvalid={this.setInvalid.bind(this)} onChange={this.setInputVals}
                        >
                            <Input name="username"
                                type="text"
                                title="Username"
                                invalidSubmission={this.state.submitted && !this.state.valid}
                                validations={Validations.username.validations}
                                validationErrors={Validations.username.errors}
                            />
                            <Input name="password"
                                type="password"
                                title="Password"
                                invalidSubmission={this.state.submitted && !this.state.valid}
                                validations={Validations.password.validations}
                                validationErrors={Validations.password.errors}
                            />
                            <Input name="confirmpassword"
                                type="password"
                                title="Confirm Password"
                                invalidSubmission={this.state.submitted && !this.state.valid}
                                validations="equalsFieldOrEmpty:password"
                                validationError="Does not match password."
                            />
                        </Form>
                        :
                        <p>Fetching user information...</p>

                    }
                </div>
            </div>
        );
    }
}

reactMixin(ChangePassword.prototype, ReactMeteorData);
