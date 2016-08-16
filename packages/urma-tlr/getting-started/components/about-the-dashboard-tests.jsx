/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import AboutDashboard from './about-the-dashboard.jsx';

describe('About the Dashboard (Wizard) tests', function () {
    let root, spyTransition, spyButtonConfig, spyEnableNext, spyDisableNext;

    // Create a parent shell to render inside of with device context
    class Parent extends React.Component {
        getChildContext() {
            return {
                device: deviceCtx
            };
        }

        render() {
            return (
                <AboutDashboard
                    buttonConfig={spyButtonConfig}
                    disableNext={spyDisableNext}
                    enableNext={spyEnableNext}
                    transitionToNext={spyTransition}
                    loggedIn
                />
            );
        }
    }

    Parent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    beforeEach(() => {
        spyTransition = sinon.spy();
        spyButtonConfig = sinon.spy();
        spyEnableNext = sinon.spy();
        spyDisableNext = sinon.spy();

        const stubSubsManager = { subscribe: sinon.stub() };
        stubSubsManager.subscribe.returns({ ready: sinon.stub().returns(true) });
        const stubSettings = {
            findOne: sinon.stub(),
            update: sinon.stub()
        };
        stubSettings.findOne.returns({ _id: 3, wizard: 'on' });

        deviceCtx = {
            SubsManager: stubSubsManager,
            Settings: stubSettings
        };

        root = TestUtils.renderIntoDocument(
            <Parent />
        );
    });

    it('should render about dashboard components', function () {
        const dashboardText = TestUtils.findRenderedDOMComponentWithClass(root, 'js-wz-about-the-dashboard');
        const dashboardImage = TestUtils.findRenderedDOMComponentWithClass(root, 'about-the-dashboard-image');
        expect(dashboardText).to.not.be.undefined;
        expect(dashboardImage).to.not.be.undefined;

        const links = TestUtils.scryRenderedDOMComponentsWithTag(root, 'a');
        expect(links.length).to.equal(1);
        expect(links[0].textContent).to.equal('Online User Manual');
    });

    it('should call buttonConfig, enableNext and not call transitionToNext when welcome is rendered', function () {
        sinon.assert.calledOnce(spyButtonConfig);
        sinon.assert.calledOnce(spyEnableNext);
        sinon.assert.notCalled(spyTransition);
    });

    it('should update wizard flag', function () {
        sinon.assert.calledOnce(deviceCtx.Settings.update);
        sinon.assert.calledWith(deviceCtx.Settings.update, 3, { $set: { 'wizard': 'off' } });
    });
});
