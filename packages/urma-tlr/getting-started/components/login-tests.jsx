/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Login from './login.jsx';

let fakeFunc = sinon.spy();

describe('Login tests', function () {
    it('should display username and password fields', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(
            <Login
                buttonConfig={fakeFunc}
                loggedIn={false}
                enableNext={fakeFunc}
            />
        );

        // Not logged in. Should render a form with username and password fields.
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');
        const username = inputs.find((input) => input.placeholder === 'username');
        const password = inputs.find((input) => input.placeholder === 'password');

        expect(username.type).to.equal('text');
        expect(password.type).to.equal('password');
    }));

    it('should display notice that user is logged in if user already logged ', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(
            <Login
                buttonConfig={fakeFunc}
                loggedIn
                enableNext={fakeFunc}
            />
        );

        const container = TestUtils.findRenderedDOMComponentWithClass(root, 'user-logged-in');
        expect(container.textContent).to.equal('You are already logged in.');
    }));

    it('should call transitionToNext when next clicked if user already logged in', sinon.test(function () {
        let spyTransition = sinon.spy();
        const root = TestUtils.renderIntoDocument(
            <Login
                buttonConfig={fakeFunc}
                loggedIn
                enableNext={fakeFunc}
                transitionToNext={spyTransition}
            />
        );

        root.logInOnNext({});
        sinon.assert.calledOnce(spyTransition);
    }));

    it('should attempt login on next', sinon.test(function () {
        let spyTransition = sinon.spy();
        const root = TestUtils.renderIntoDocument(
            <Login
                buttonConfig={fakeFunc}
                loggedIn={false}
                enableNext={fakeFunc}
                disableNext={fakeFunc}
                transitionToNext={spyTransition}
            />
        );
        const loginObj = {
            login: fakeFunc,
            logout: fakeFunc
        };
        const spyLoginService = sinon.stub(root, 'loginService', () => loginObj);

        root.logInOnNext({
            preventDefault: fakeFunc
        });

        sinon.assert.notCalled(spyTransition);
        sinon.assert.calledOnce(spyLoginService);
    }));
});
