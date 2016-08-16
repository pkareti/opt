/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Connect from './connect.jsx';


let fakeFunc = function () {
};
const location = {
    query: {}
};

describe('Connect (Wizard) tests', function () {
    it('should render connect components', sinon.test(function () {
        const root = TestUtils.renderIntoDocument(
            < Connect
                location={location}
                buttonConfig={fakeFunc}
                disableNext={fakeFunc}
                enableNext={fakeFunc}
                transitionToNext={fakeFunc}
                loggedIn
            />
        );
        const contentDiv = TestUtils.findRenderedDOMComponentWithClass(root, 'wizard-content-text');
        const paragraph1 = contentDiv.getElementsByTagName('p')[0];
        expect(paragraph1.textContent).to.contain('Select the desired WAN connection type');

        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');

        expect(inputs.length).to.equal(2);
        expect(inputs[0].getAttribute('type')).to.equal('radio');
        expect(inputs[1].getAttribute('type')).to.equal('radio');
    }));

    it('should call buttonConfig and enableNext when connect is rendered', sinon.test(function () {
        let spyTransition = this.spy();
        let spyButtonConfig = this.spy();
        let spyEnableNext = this.spy();
        const root = TestUtils.renderIntoDocument(
            < Connect
                location={location}
                loggedIn
                enableNext={spyEnableNext}
                buttonConfig={spyButtonConfig}
                transitionToNext={spyTransition}
            />
        );

        sinon.assert.calledOnce(spyButtonConfig);
        sinon.assert.calledOnce(spyEnableNext);
        sinon.assert.notCalled(spyTransition);
    }));

    it('should have input for Select WAN connection type, verify options is checked ', function () {
        const root = TestUtils.renderIntoDocument(
            < Connect
                location={location}
                buttonConfig={fakeFunc}
                disableNext={fakeFunc}
                enableNext={fakeFunc}
                transitionToNext={fakeFunc}
                loggedIn
            />
        );
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');
        expect(inputs.length).to.equal(2);
        expect(inputs[1].hasAttribute('defaultChecked'));
        expect(inputs[0].getAttribute('value')).to.equal('Cellular');
        expect(inputs[1].getAttribute('value')).to.equal('Ethernet');
    });

    it('Should state updates on selecting different option', sinon.test(function () {
        let spyButtonConfig = this.spy();
        const root = TestUtils.renderIntoDocument(
            < Connect
                location={location}
                buttonConfig={spyButtonConfig}
                disableNext={fakeFunc}
                enableNext={fakeFunc}
                transitionToNext={fakeFunc}
                loggedIn
            />
        );

        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');
        expect(inputs[0].hasAttribute('checked'));
        TestUtils.Simulate.change(inputs[0], { target: { value: 'ethernet' } });
        expect(inputs[1].hasAttribute('checked'));
        sinon.assert.calledTwice(spyButtonConfig);
    }));

    it('Should render with ethernet selected if ethernet query in url', sinon.test(function () {
        location.query.device = 'ethernet';
        const root = TestUtils.renderIntoDocument(
            < Connect
                location={location}
                buttonConfig={fakeFunc}
                disableNext={fakeFunc}
                enableNext={fakeFunc}
                transitionToNext={fakeFunc}
                loggedIn
            />
        );

        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');
        expect(inputs[1].hasAttribute('checked'));
    }));
});
