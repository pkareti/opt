/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import EthernetResults from './ethernet-results.jsx';
import SkipToDashboardLink from './skip-to-dashboard.jsx';

describe('Ethernet Results (Wizard) tests', function () {
    let sandbox;
    let deviceCtx;

    const ethIntState = {
        mac_address: '00:40:FF:0F:48:AC'
    };

    const wanEthState = {
        interface: 'eth1',
        ip_address: '10.20.1.22',
        dns1: '10.10.8.62',
        dns2: '8.8.8.8',
        gateway: '10.20.1.1',
        mask: '255.255.255.0'
    };

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        const stubSubsManager = { subscribe: sandbox.stub() };
        stubSubsManager.subscribe.returns({ ready: sandbox.stub().returns(true) });

        // State collection
        const stubState = { findOne: sandbox.stub() };
        stubState.findOne.withArgs({ _groupName: 'eth', _groupIndex: 0 }).returns(ethIntState);
        stubState.findOne.withArgs({ _groupName: 'wan', interface: 'eth1' }).returns(wanEthState);

        // Settings collection - for SkipToDashboardLink
        const stubSettings = {
            findOne: sandbox.stub()
        };
        stubSettings.findOne.returns({ _id: 3, wizard: 'on' });

        deviceCtx = {
            SubsManager: stubSubsManager,
            State: stubState,
            Settings: stubSettings
        };
    });

    afterEach(function () {
        sandbox.restore();
    });

    // Create a parent shell to render EthernetResults inside of with device context
    class EthernetResultsParent extends React.Component {
        getChildContext() {
            return {
                device: deviceCtx
            };
        }

        render() {
            return (
                <EthernetResults
                    buttonConfig={sandbox.stub()}
                    disableNext={sandbox.stub()}
                    enableNext={sandbox.stub()}
                    transitionToNext={sandbox.stub()}
                />
            );
        }
    }

    EthernetResultsParent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    it('should display ethernet results when data is ready', function () {
        const root = TestUtils.renderIntoDocument(<EthernetResultsParent />);
        const ethernetResults = TestUtils.findRenderedComponentWithType(root, EthernetResults);
        const header = TestUtils.findRenderedDOMComponentWithTag(ethernetResults, 'h6');
        expect(header.textContent).to.equal('Ethernet Connection Results');
    });

    it('should call buttonConfig, enableNext, and not transitionToNext', function () {
        const root = TestUtils.renderIntoDocument(<EthernetResultsParent />);
        const ethernetResults = TestUtils.findRenderedComponentWithType(root, EthernetResults);
        sinon.assert.calledOnce(ethernetResults.props.enableNext);
        sinon.assert.calledOnce(ethernetResults.props.buttonConfig);
        sinon.assert.notCalled(ethernetResults.props.transitionToNext);
    });

    it('should render the expected components and data fields on the page', function () {
        const root = TestUtils.renderIntoDocument(<EthernetResultsParent />);
        const ethernetResults = TestUtils.findRenderedComponentWithType(root, EthernetResults);
        const labels = TestUtils.scryRenderedDOMComponentsWithTag(ethernetResults, 'label');
        const spans = TestUtils.scryRenderedDOMComponentsWithTag(ethernetResults, 'span');
        const skipToDashboard = TestUtils.findRenderedComponentWithType(ethernetResults, SkipToDashboardLink);

        expect(labels[0].textContent).to.equal('MAC: ');
        expect(labels[1].textContent).to.equal('IPv4: ');
        expect(labels[2].textContent).to.equal('Subnet: ');
        expect(labels[3].textContent).to.equal('DNS: ');

        expect(spans[0].textContent).to.equal(ethIntState.mac_address);
        expect(spans[1].textContent).to.equal(wanEthState.ip_address);
        expect(spans[2].textContent).to.equal(wanEthState.mask);
        expect(spans[3].textContent).to.equal(wanEthState.dns1);

        expect(skipToDashboard).to.not.be.undefined;
    });
});
