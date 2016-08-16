/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { FWUpdate } from './firmware-update.jsx';
import FirmwareUpdateManual from '../../firmware/components/firmware-update-manual.jsx';

describe('FWUpdate (Wizard)', function () {
    let stubState;
    let deviceCtx;
    let router = {
        goBack() {
        }
    };
    let location = { query: { device: 'cellular' } };

    class FWUpdateParent extends React.Component {
        getChildContext() {
            return { device: deviceCtx };
        }

        render() {
            // Simulate wizard adding properties for buttonConfig, disableNext, ...
            return (<FWUpdate
                router={router}
                location={location}
                buttonConfig={sinon.stub()}
                disableNext={sinon.stub()}
                enableNext={sinon.stub()}
                transitionToNext={sinon.stub()}
            />);
        }
    }
    FWUpdateParent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    beforeEach(() => {
        // Meteor collection stubs
        const stubSubscriptionStub = { ready: sinon.stub().returns(true) };
        const stubSubsManager = { subscribe: sinon.stub().returns(stubSubscriptionStub) };
        // State collection
        stubState = {
            findOne: sinon.stub(),
            find: sinon.stub()
        };
        stubState.findOne.withArgs({ _groupName: 'system' }).returns({ _id: 1, firmware_version: '1.2.3.4' });
        stubState.findOne.withArgs({ _groupName: 'firmware_status' }).returns({ _id: 1, status: 0, progress: 0 });
        const stubFwFilesCursor = { fetch: sinon.stub().returns([{ _id: 1, name: 'fw1.bin', version: '1.2.3.5' }]) };
        stubState.find.withArgs({ _groupName: 'firmware_files' }).returns(stubFwFilesCursor);

        deviceCtx = {
            env: 'device',
            SubsManager: stubSubsManager,
            State: stubState
        };
    });


    it('should render manual firmware update components', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<FWUpdateParent />);
        const fwUpdate = TestUtils.findRenderedComponentWithType(root, FWUpdate);
        const fwUpdateManual = TestUtils.findRenderedComponentWithType(fwUpdate, FirmwareUpdateManual);
        const contentDiv = TestUtils.findRenderedDOMComponentWithClass(fwUpdate, 'wizard-content-text');
        const paragraph1 = contentDiv.getElementsByTagName('p')[0];

        expect(fwUpdate).to.not.be.undefined;
        expect(fwUpdateManual).to.not.be.undefined;
        expect(paragraph1.textContent).to.contain('download and install the latest firmware version');
    }));

    it('should toggle wizard next button onready', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<FWUpdateParent />);
        const fwUpdate = TestUtils.findRenderedComponentWithType(root, FWUpdate);

        // Default when component mounts is to disable next button
        sinon.assert.calledOnce(fwUpdate.props.disableNext);
        fwUpdate.props.disableNext.reset();

        fwUpdate.onReady(true);
        sinon.assert.calledOnce(fwUpdate.props.enableNext);
        fwUpdate.onReady(false);
        sinon.assert.calledOnce(fwUpdate.props.disableNext);
    }));

    it('should start firmware update on wizard next', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<FWUpdateParent />);
        const fwUpdate = TestUtils.findRenderedComponentWithType(root, FWUpdate);

        sinon.assert.calledOnce(fwUpdate.props.buttonConfig);
        sinon.assert.calledWithExactly(fwUpdate.props.buttonConfig,
            sinon.match.string, sinon.match.string, sinon.match.func);

        const args = fwUpdate.props.buttonConfig.args[0];
        expect(args.length).to.equal(3);
        const onNextCB = args[2];

        const stubStartEvent = sinon.stub(fwUpdate.firmwareManager, 'startUpdate');
        const e = { bogus: 'event' };
        onNextCB(e);

        sinon.assert.calledOnce(stubStartEvent);
        sinon.assert.calledWithExactly(stubStartEvent, sinon.match.object/* event*/);
    }));

    it('should transition to next wizard page on successful firmware update', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<FWUpdateParent />);
        const fwUpdate = TestUtils.findRenderedComponentWithType(root, FWUpdate);

        fwUpdate.onFirmwareUpdateComplete(true);
        sinon.assert.calledOnce(fwUpdate.props.transitionToNext);
    }));

    it('should remain on page on unsuccessful firmware update', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(<FWUpdateParent />);
        const fwUpdate = TestUtils.findRenderedComponentWithType(root, FWUpdate);

        fwUpdate.onFirmwareUpdateComplete(false);
        sinon.assert.notCalled(fwUpdate.props.transitionToNext);
    }));
});
