/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Urma from 'meteor/digi:urma-core';
import DRMconnect from './DRMconnect.jsx';
import SkipToDashboardLink from './skip-to-dashboard.jsx';

const alerts = Urma.alerts;

describe('DRMconnect (Wizard) tests', function () {
    // Define some stubs for functionality used by components created under DRMconnect.
    let sandbox;
    let stubState;
    let stubSetting;
    let deviceCtx;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        // Meteor collection stubs
        const stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        const stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };

        // State collection
        stubState = {
            findOne: sandbox.stub()
        };
        // Settings collection
        stubSetting = {
            findOne: sandbox.stub(),
            update: sandbox.stub()
        };
        stubSetting.findOne.returns({
            _id: 1,
            state: 'on',
            server: 'devtest.idigi.com'
        });
        stubState.findOne.returns({
            _id: 1,
            status: 'connected',
            server: 'devtest.idigi.com',
            deviceid: '00000000-00000000-0040FFFF-FF0F44B0'
        });

        deviceCtx = {
            SubsManager: stubSubsManager,
            Settings: stubSetting,
            State: stubState
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    class DRMconnectParent extends React.Component {
        getChildContext() {
            return {
                device: deviceCtx
            };
        }

        render() {
            return (
                < DRMconnect
                    buttonConfig={sandbox.stub()}
                    disableNext={sandbox.stub()}
                    enableNext={sandbox.stub()}
                    transitionToNext={sandbox.stub()}
                />
            );
        }
    }

    DRMconnectParent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    it('should render DRMconnect components', function () {
        const root = TestUtils.renderIntoDocument(<DRMconnectParent />);
        const skipToDashboard = TestUtils.findRenderedComponentWithType(root, SkipToDashboardLink);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');

        expect(skipToDashboard).to.not.be.undefined;
        expect(inputs.length).to.equal(2);
        expect(inputs[0].getAttribute('type')).to.equal('text');
        expect(inputs[1].getAttribute('type')).to.equal('password');
    });

    it('should transition to dashboard on successful login', function () {
        const root = TestUtils.renderIntoDocument(<DRMconnectParent />);
        const drmConnect = TestUtils.findRenderedComponentWithType(root, DRMconnect);
        const err = undefined;
        const result = 201;

        drmConnect.rmCallBackHandler(err, result);
        sinon.assert.called(drmConnect.props.transitionToNext);
    });

    it('should call meteor method to provision device on next', function () {
        const stubMeteorCall = sandbox.spy(Meteor, 'call');
        const root = TestUtils.renderIntoDocument(< DRMconnectParent />);
        const drmConnect = TestUtils.findRenderedComponentWithType(root, DRMconnect);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');
        const username = inputs.find((input) => input.placeholder === 'username');
        const password = inputs.find((input) => input.placeholder === 'password');

        TestUtils.Simulate.change(username, { target: { value: 'ssaggam' } });
        TestUtils.Simulate.change(password, { target: { value: '!ssaggam!' } });
        drmConnect.addDeviceToRemoteManger();
        sinon.assert.calledOnce(stubMeteorCall);
        sinon.assert.calledWith(stubMeteorCall, 'provisionDevice', 'ssaggam', '!ssaggam!', drmConnect.data.cloudDeviceId, drmConnect.data.cloudServer);
    });

    it('should call update settings on successful provision', function () {
        const stubMeteorCall = sandbox.stub(Meteor, 'call');
        stubMeteorCall.callsArgWith(5, undefined, {});
        const root = TestUtils.renderIntoDocument(< DRMconnectParent />);
        const drmConnect = TestUtils.findRenderedComponentWithType(root, DRMconnect);

        drmConnect.rmCallBackHandler(undefined, 201); // callback: error, results
        sinon.assert.calledOnce(stubSetting.update);
        sinon.assert.calledWithExactly(stubSetting.update, 1, { $set: { server: 'devtest.idigi.com', state: 'on' } });
    });

    it('should show error on failed provision', function () {
        const stubError = sandbox.stub(alerts, 'error');
        const root = TestUtils.renderIntoDocument(< DRMconnectParent />);
        const drmConnect = TestUtils.findRenderedComponentWithType(root, DRMconnect);
        const err = { error: 401, reason: 'You do not belong here.' };
        const result = undefined;

        drmConnect.rmCallBackHandler(err, result);
        sinon.assert.calledWithExactly(stubError, `${err.error} - ${err.reason}`, 'Provision Failed');
    });
});
