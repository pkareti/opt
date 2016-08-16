/* eslint-disable react/prop-types */

import React from 'react';
import Urma from 'meteor/digi:urma-core';

export default class Login extends Urma.Login {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            loggingIn: false
        };
        this.logInOnNext = this.logInOnNext.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        // if we've already logged in and are coming back to this page
        this.props.buttonConfig(
            '/getting-started/welcome',
            '/getting-started/change-password',
            this.logInOnNext);

        this.props.enableNext();
    }

    componentWillReceiveProps() {
        if (this.props.loggedIn) {
            this.props.transitionToNext();
        }
    }

    logInOnNext(e) {
        const self = this;

        if (!self.props.loggedIn) {
            self.setState({ loggingIn: true });
            self.props.disableNext();

            const onSuccess = function onSuccess() {
                self.props.enableNext();
                self.setState({ loggingIn: false });
                self.props.transitionToNext();
            };

            const onError = function onError() {
                self.props.enableNext();
                self.setState({ loggingIn: false });
            };

            self.login(e, onSuccess, onError);
        } else {
            self.props.transitionToNext();
        }

        return {
            transitionToNext: false
        };
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    checkLoggedIn() {
        return (
            <div className="user-logged-in">
                <h1>You are already logged in.</h1>
            </div>
        );
    }

    renderLogin() {
        return (
            <div className="gsw-container js-wz-login">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                    </div>
                    <div className="wizard-content-text">
                        <p>Enter the username and password for this device.</p>
                        <p>Refer to the Quick Start Guide in the package to learn default values for each field.</p>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    <form>
                        <div>
                            <div className="box">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    placeholder="username"
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="box">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="password"
                                    onChange={this.onChange}
                                />
                            </div>
                            <p>Click NEXT to login to device.</p>

                            { this.state.loggingIn ?
                                <div className="skip-ahead-link">Logging in...</div>
                                : null
                            }
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.loggedIn ?
                    this.checkLoggedIn() :
                    this.renderLogin() }
            </div>

        );
    }
}
