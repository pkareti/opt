/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { Router, browserHistory } from 'react-router';
import Urma from 'meteor/digi:urma-core';
import { UrmaForms } from 'meteor/digi:urma-core';
import ChangePassword from './change-password.jsx';

const Form = UrmaForms.Formsy.Form;
const Input = UrmaForms.Input;
const Wizard = Urma.Wizard;

let changePassword,
    root,
    form,
    inputs,
    wizard,
    sandbox,
    nextButton,
    usernameInput,
    passwordInput,
    confirmPasswordInput,
    stubUser;

describe('Change Password Tests', () => {
    const stubProps = {
        buttonConfig: sinon.stub(),
        enableNext: sinon.stub(),
        disableNext: sinon.stub(),
        transitionToNext: sinon.stub()
    };

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        stubUser = sandbox.stub(Meteor, 'user', () => {
            return { username: 'useruser' };
        });
        changePassword = TestUtils.renderIntoDocument(
            <ChangePassword buttonConfig={stubProps.buttonConfig}
                enableNext={stubProps.enableNext}
                disableNext={stubProps.disableNext}
                transitionToNext={stubProps.transitionToNext}
                loggedIn
            />
        );
        form = TestUtils.findRenderedComponentWithType(changePassword, Form);
        inputs = TestUtils.scryRenderedComponentsWithType(form, Input);
        usernameInput = inputs[0];
        passwordInput = inputs[1];
        confirmPasswordInput = inputs[2];
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render change password form', function () {
        expect(form).to.not.be.undefined;
        sinon.assert.calledOnce(stubProps.enableNext);
    });

    it('should show username error on blur', function () {
        const username = TestUtils.findRenderedDOMComponentWithTag(usernameInput, 'input');

        TestUtils.Simulate.change(username, { target: { value: 'HighwaytotheDangerZoneRideintotheDangerZoneHeadinintotwilightSpreadinoutherwingstonightAndshovinintooverdriveHighwaytotheDangerZone' } });
        TestUtils.Simulate.blur(username);

        const error = TestUtils.findRenderedDOMComponentWithClass(usernameInput, 'error');

        expect(error.textContent).to.equal('Username cannot be more than 128 characters in length.');
    });

    it('should show password error on blur', function () {
        const password = TestUtils.findRenderedDOMComponentWithTag(passwordInput, 'input');

        TestUtils.Simulate.change(password, { target: { value: 'short' } });
        TestUtils.Simulate.blur(password);

        const error = TestUtils.findRenderedDOMComponentWithClass(passwordInput, 'error');

        expect(error.textContent).to.equal('Password must be at least 8 characters in length.');

        TestUtils.Simulate.change(password, { target: { value: 'nocharacterz' } });
        TestUtils.Simulate.blur(password);

        expect(error.textContent).to.equal('Password must contain at least one letter and one special character !@#$%^&*()_+.');
    });

    it('should show error if password and confirm password fields do not match', function () {
        const password = TestUtils.findRenderedDOMComponentWithTag(passwordInput, 'input');
        const confirmPassword = TestUtils.findRenderedDOMComponentWithTag(confirmPasswordInput, 'input');

        TestUtils.Simulate.change(password, { target: { value: 'notmatching!' } });
        TestUtils.Simulate.change(confirmPassword, { target: { value: 'notmatching?' } });
        TestUtils.Simulate.blur(confirmPassword);

        const error = TestUtils.findRenderedDOMComponentWithClass(confirmPasswordInput, 'error');
        expect(error.textContent).to.equal('Does not match password.');
    });
});

describe('Change Password Tests (Wizard)', () => {
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        stubUser = sandbox.stub(Meteor, 'user', () => {
            return { username: 'useruser' };
        });
        const stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        const stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };
        const stubState = {
            findOne: sandbox.stub()
        };

        const deviceCtx = {
            SubsManager: stubSubsManager,
            State: stubState
        };

        class WizardParent extends React.Component {
            getChildContext() {
                return {
                    device: deviceCtx
                };
            }

            render() {
                return (
                    <div>{this.props.children}</div>
                );
            }
        }

        WizardParent.childContextTypes = {
            device: React.PropTypes.object.isRequired
        };

        let routes = {
            component: WizardParent,
            public: true,
            childRoutes: [{
                name: 'wizard',
                path: '/',
                component: Wizard,
                indexRoute: {
                    name: 'change-password',
                    component: ChangePassword,
                    public: true
                }
            }]
        };

        root = TestUtils.renderIntoDocument(<Router routes={routes} history={browserHistory} />);
        wizard = TestUtils.findRenderedComponentWithType(root, Wizard);
        changePassword = TestUtils.findRenderedComponentWithType(wizard, ChangePassword);
        nextButton = TestUtils.findRenderedDOMComponentWithClass(wizard, 'next');
        inputs = TestUtils.scryRenderedComponentsWithType(changePassword, Input);
        usernameInput = inputs[0];
        passwordInput = inputs[1];
        confirmPasswordInput = inputs[2];
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should show username error on submit', function () {
        const username = TestUtils.findRenderedDOMComponentWithTag(usernameInput, 'input');

        TestUtils.Simulate.change(username, { target: { value: 'HighwaytotheDangerZoneRideintotheDangerZoneHeadinintotwilightSpreadinoutherwingstonightAndshovinintooverdriveHighwaytotheDangerZone' } });
        TestUtils.Simulate.click(nextButton);

        expect(changePassword.state.valid).to.equal(false);
        expect(changePassword.state.submitted).to.equal(true);

        const onNextError = TestUtils.findRenderedDOMComponentWithClass(changePassword, 'form-submitted-error');
        expect(onNextError.textContent).to.equal('Form could not be submitted. Please correct highlighted errors.');

        const error = TestUtils.findRenderedDOMComponentWithClass(usernameInput, 'error');
        expect(error.textContent).to.equal('Username cannot be more than 128 characters in length.');
    });

    it('should call Meteor.users.update on Next only if form valid', function () {
        const stubUsersUpdate = sandbox.stub(Meteor.users, 'update');
        const password = TestUtils.findRenderedDOMComponentWithTag(passwordInput, 'input');
        const confirmPassword = TestUtils.findRenderedDOMComponentWithTag(confirmPasswordInput, 'input');
        const username = TestUtils.findRenderedDOMComponentWithTag(usernameInput, 'input');

        TestUtils.Simulate.change(password, { target: { value: 'nocharacterz' } });
        TestUtils.Simulate.blur(password);
        TestUtils.Simulate.click(nextButton);

        sinon.assert.notCalled(stubUsersUpdate);


        const error = TestUtils.findRenderedDOMComponentWithClass(passwordInput, 'error');
        expect(error.textContent).to.equal('Password must contain at least one letter and one special character !@#$%^&*()_+.');

        TestUtils.Simulate.change(username, { target: { value: 'uzername' } });
        TestUtils.Simulate.change(password, { target: { value: 'characterz!' } });
        TestUtils.Simulate.change(confirmPassword, { target: { value: 'characterz!' } });
        TestUtils.Simulate.click(nextButton);

        sinon.assert.calledWith(stubUsersUpdate, { '_id': undefined }, {
            '$set': {
                'username': 'uzername',
                'password': 'characterz!'
            }
        });
    });
});
