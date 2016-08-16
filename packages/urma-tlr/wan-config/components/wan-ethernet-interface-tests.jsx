import React from 'react';
import { expect } from 'chai';
import WanEthernetInterface from './wan-ethernet-interface.jsx';
import { shallow } from 'enzyme';
import Urma from 'meteor/digi:urma-core';
import { eth_data } from './wan-ethernet-tests-data.js';

describe('WAN Ethernet Config (Interface) Tests', function () {
    const ethState = eth_data.state;
    const goToInterface = sinon.spy();

    const pageInfo = [
        { label: 'State:', value: ethState.oper_status },
        { label: 'Description:', value: ethState.description },
        { label: 'Speed:', value: ethState.link_speed },
        { label: 'Duplex:', value: ethState.link_duplex }
    ];

    it('should render all ethernet components for displaying interface data', function () {
        const wrapper = shallow(<WanEthernetInterface goToInterface={goToInterface} state={ethState}/>);
        const interfaceContainer = wrapper.find('.js-wan-eth-interface');

        const labels = interfaceContainer.find('.js-label');
        const values = interfaceContainer.find('.js-value');

        labels.forEach((label, i) => {
            expect(label.text()).to.equal(pageInfo[i].label);
        });

        values.forEach((value, i) => {
            expect(value.text()).to.equal(pageInfo[i].value);
        });

        const linkLabel = interfaceContainer.find('.js-interface-link');
        expect(linkLabel.text()).to.equal(`ethernet${ethState._groupIndex + 1}`);
    });

    // test seems better suited for wan-ethernet.jsx
    it('should attempt to go to the proper interface page when link clicked', function () {
        const wrapper = shallow(<WanEthernetInterface goToInterface={goToInterface} state={ethState}/>);
        const linkToInterface = wrapper.find('.js-interface-link');
        linkToInterface.simulate('click');
        expect(goToInterface.calledOnce).to.equal(true);
    });
});
