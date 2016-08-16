/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Welcome from './welcome.jsx';
/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

describe('Welcome (Wizard) tests', function () {
    let spyTransition;
    let spyButtonConfig;
    let spyEnableNext;
    let spyDisableNext;

    beforeEach(() => {
        spyTransition = sinon.spy();
        spyButtonConfig = sinon.spy();
        spyEnableNext = sinon.spy();
        spyDisableNext = sinon.spy();
    });

    it('should render welcome components', function () {
        const root = TestUtils.renderIntoDocument(
            <Welcome buttonConfig={spyButtonConfig} disableNext={spyDisableNext} enableNext={spyEnableNext} transitionToNext={spyTransition} loggedIn />
        );
        const header = TestUtils.findRenderedDOMComponentWithTag(root, 'h1');

        expect(header.textContent).to.equal('Welcome to the Getting Started Wizard');
    });

    it('should call buttonConfig, enableNext and not call transitionToNext when welcome is rendered', sinon.test(function () {
        TestUtils.renderIntoDocument(
            <Welcome loggedIn enableNext={spyEnableNext} buttonConfig={spyButtonConfig} transitionToNext={spyTransition} />
        );

        sinon.assert.calledOnce(spyButtonConfig);
        sinon.assert.calledOnce(spyEnableNext);
        sinon.assert.notCalled(spyTransition);
    }));

    it('should have links for quick start guide, online guide and verify the url value is not empty ', function () {
        const root = TestUtils.renderIntoDocument(
            <Welcome buttonConfig={spyButtonConfig} disableNext={spyDisableNext} enableNext={spyEnableNext} transitionToNext={spyTransition} loggedIn />
        );
        const links = TestUtils.scryRenderedDOMComponentsWithTag(root, 'a');
        expect(links.length).to.equal(2);
        expect(links[0].textContent).to.equal('Quick Start Guide');
        expect(links[1].textContent).to.equal('Online User Manual');
        expect(links[0].getAttribute('href').length).not.equal(0);
        expect(links[1].getAttribute('href').length).not.equal(0);
    });
});
