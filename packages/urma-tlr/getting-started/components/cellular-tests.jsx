/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Cellular from './cellular.jsx';
import CellularSimStatus from '../../cellular/components/cellular-sim-status.jsx';
import CellularConfig from '../../cellular/components/cellular-config.jsx';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

describe('Cellular (Wizard) tests', function () {
    // Define some stubs for functionality used by components created under cellular.
    let sandbox, stubState, stubSetting;
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
        stubState.findOne.returns({
            _id: 1,
            sim_status: 'Using SIM1',
            signal_strength: 'Poor',
            signal_quality: 'Excellent',
            'ip_address': '10.52.18.176',
            _groupIndex: 1
        });
        stubSetting.findOne.returns({ _id: '1', state: 'ON', apn: 'xyz', _groupIndex: 1 });

        deviceCtx = {
            SubsManager: stubSubsManager,
            Settings: stubSetting,
            State: stubState
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    class CellularParent extends React.Component {
        getChildContext() {
            return {
                device: deviceCtx
            };
        }

        render() {
            return (
                <Cellular buttonConfig={sandbox.stub()}
                    disableNext={sandbox.stub()}
                    enableNext={sandbox.stub()}
                    transitionToNext={sandbox.stub()}
                    params="{_groupIndex:0}"
                />
            );
        }
    }

    CellularParent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    it('should render cellular components', function () {
        const root = TestUtils.renderIntoDocument(<CellularParent />);
        const cellular = TestUtils.findRenderedComponentWithType(root, Cellular);
        const cellularConfig = TestUtils.findRenderedComponentWithType(root, CellularConfig);
        const cellularSimStatus = TestUtils.findRenderedComponentWithType(root, CellularSimStatus);
        const header = TestUtils.findRenderedDOMComponentWithTag(cellularConfig, 'h6');
        expect(cellular).to.not.be.undefined;
        expect(cellularConfig).to.not.be.undefined;
        expect(cellularSimStatus).to.not.be.undefined;
        expect(header.textContent).to.equal('Specify Cellular Parameters');
    });

    it('should call buttonConfig, enableNext and not call transitionToNext when cellular is rendered', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<CellularParent />);
        const cellular = TestUtils.findRenderedComponentWithType(root, Cellular);
        sinon.assert.calledOnce(cellular.props.enableNext);
        sinon.assert.calledOnce(cellular.props.buttonConfig);
        sinon.assert.notCalled(cellular.props.transitionToNext);
    }));

    it('should start countdown timer on wizard next and not call transitionToNext', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<CellularParent />);
        const cellular = TestUtils.findRenderedComponentWithType(root, Cellular);
        const e = { bogus: 'event' };
        cellular.onVerify(e);
        const modalRetryDialog = TestUtils.findRenderedComponentWithType(cellular, ModalContainer);
        expect(modalRetryDialog).to.not.be.undefined;
        sinon.assert.notCalled(cellular.props.transitionToNext);
    }));

    it('should call update cellular settings with correct apn value after next button is clicked', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<CellularParent />);
        const cellular = TestUtils.findRenderedComponentWithType(root, Cellular);
        const cellularConfig = TestUtils.findRenderedComponentWithType(cellular, CellularConfig);
        const selects = TestUtils.scryRenderedDOMComponentsWithTag(cellularConfig, 'select');
        const country = selects.find((select) => {
            return select.name == 'cellular country';
        });
        const apn = selects.find((select) => {
            return select.name == 'cellular APN';
        });
        const provider = selects.find((select) => {
            return select.name == 'cellular provider';
        });
        const e = { bogus: 'event' };
        /** * Verify that by default when next is clicked the setting are called with correct apn value **/
        expect(country.value).to.equal('United Kingdom');
        expect(provider.value).to.equal('3');
        expect(apn.value).to.equal('3gpronto');
        cellular.onVerify(e);
        sinon.assert.calledTwice(stubSetting.update);
        sinon.assert.calledWith(stubSetting.update, cellular.data.cellularIntSettings._id, { $set: { 'state': 'off' } });
        sinon.assert.calledWith(stubSetting.update, cellular.data.cellularIntSettings._id, {
            $set: {
                'apn': cellular.state.cellularAPN,
                'state': 'on'
            }
        });

        // Simulate country change and verify provider, and apn are changed
        TestUtils.Simulate.change(country, { target: { value: 'Angola' } });
        expect(country.value).to.equal('Angola');
        expect(provider.value).to.equal('Movicel Angola');
        expect(apn.value).to.equal('internet.movicel.co.ao');
        cellular.onVerify(e);
        /** * Verify that after apn is changed and when next is clicked the setting are called with correct apn value **/
        sinon.assert.calledWith(stubSetting.update, cellular.data.cellularIntSettings._id, {
            $set: {
                'apn': cellular.state.cellularAPN,
                'state': 'on'
            }
        });
    }));

    it('should call update cellular settings with correct apn, username, password values after next button is clicked', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<CellularParent />);
        const cellular = TestUtils.findRenderedComponentWithType(root, Cellular);
        const cellularConfig = TestUtils.findRenderedComponentWithType(cellular, CellularConfig);
        const selects = TestUtils.scryRenderedDOMComponentsWithTag(cellularConfig, 'select');
        const country = selects.find((select) => {
            return select.name == 'cellular country';
        });
        const apn = selects.find((select) => {
            return select.name == 'cellular APN';
        });
        const provider = selects.find((select) => {
            return select.name == 'cellular provider';
        });
        const e = { bogus: 'event' };
        const advanced = TestUtils.findRenderedDOMComponentWithClass(root, 'expander-trigger');

        // Simulate advanced click and add country, username, password and verify settings.update is called correctly
        TestUtils.Simulate.click(advanced);
        TestUtils.Simulate.change(country, { target: { value: 'Angola' } });

        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(cellularConfig, 'input');
        const username = inputs.find((input) => {
            return input.id == 'cellularUsername';
        });
        const password = inputs.find((input) => {
            return input.id == 'cellularPassword';
        });
        TestUtils.Simulate.change(username, { target: { id: 'cellularUsername', value: 'admin' } });
        TestUtils.Simulate.change(password, { target: { id: 'cellularPassword', value: 'adminpwd' } });
        cellular.onVerify(e);
        expect(cellular.state.cellularUsername).to.equal('admin');
        expect(cellular.state.cellularPassword).to.equal('adminpwd');
        /** * Verify that after cellular config changes and when next is clicked the setting are called with correct values **/
        sinon.assert.calledThrice(stubSetting.update);
        sinon.assert.calledWith(stubSetting.update, cellular.data.cellularIntSettings._id, { $set: { 'state': 'off' } });
        sinon.assert.calledWith(stubSetting.update, cellular.data.cellularIntSettings._id, {
            $set: {
                'apn_username': cellular.state.cellularUsername,
                'apn_password': cellular.state.cellularPassword
            }
        });
        sinon.assert.calledWith(stubSetting.update, cellular.data.cellularIntSettings._id, {
            $set: {
                'apn': cellular.state.cellularAPN,
                'state': 'on'
            }
        });
    }));
});

