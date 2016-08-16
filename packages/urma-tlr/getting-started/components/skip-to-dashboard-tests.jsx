/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import SkipToDashboardLink from './skip-to-dashboard.jsx';

describe('SkipToDashboardLink (Wizard)', function () {
    let sandbox;
    let deviceCtx;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        const stubSubsManager = { subscribe: sandbox.stub() };
        stubSubsManager.subscribe.returns({ ready: sandbox.stub().returns(true) });

        // Settings collection
        const stubSettings = {
            findOne: sandbox.stub(),
            update: sandbox.stub()
        };
        stubSettings.findOne.returns({ _id: 3, wizard: 'on' });

        deviceCtx = {
            SubsManager: stubSubsManager,
            Settings: stubSettings
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    // Create a parent shell to render EthernetResults inside of with device context
    class Parent extends React.Component {
        getChildContext() {
            return {
                device: deviceCtx
            };
        }

        render() {
            return (
                <SkipToDashboardLink />
            );
        }
    }

    Parent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    it('should render skip to dashboard link', function () {
        const root = TestUtils.renderIntoDocument(<Parent />);
        const skipToDashboard = TestUtils.findRenderedComponentWithType(root, SkipToDashboardLink);
        const link = TestUtils.findRenderedDOMComponentWithTag(skipToDashboard, 'a');
        expect(link.textContent.trim()).to.equal('SKIP TO DASHBOARD');
    });

    it('should update wizard flag', function () {
        const root = TestUtils.renderIntoDocument(<Parent />);
        const skipToDashboard = TestUtils.findRenderedComponentWithType(root, SkipToDashboardLink);
        const link = TestUtils.findRenderedDOMComponentWithTag(skipToDashboard, 'a');
        TestUtils.Simulate.click(link);
        sinon.assert.calledOnce(deviceCtx.Settings.update);
        sinon.assert.calledWith(deviceCtx.Settings.update, 3, { $set: { wizard: 'off' } });
    });
});
