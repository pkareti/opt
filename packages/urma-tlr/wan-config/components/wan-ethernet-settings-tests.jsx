import React from 'react';
import { expect } from 'chai';
import WanEthernetSettings from './wan-ethernet-settings.jsx';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import Urma from 'meteor/digi:urma-core';
import _ from 'lodash';
import { wan_data } from './wan-ethernet-tests-data.js';

describe('WAN Ethernet Config (Settings) Tests', function () {
    const wanSettings = wan_data.settings;
    const setEthSettings = () => {
    };

    const inputCheck = [
        { label: 'Configure Using:' },
        { label: 'IPv4:' },
        { label: 'Netmask:' },
        { label: 'Gateway:' },
        { label: 'DNS1:' },
        { label: 'DNS2:' },
    ];


    it('should render input fields with labels and settings prop as default values', function () {
        const wrapper = shallow(<WanEthernetSettings wanSettings={wanSettings} setEthSettings={setEthSettings}
            submitted={false}/>);
        const settingsContainer = wrapper.find('.js-wan-eth-settings');
        const inputs = settingsContainer.find('.js-wan-eth-input');
        inputs.forEach((input, i) => {
            const name = input.prop('name');
            expect(input.prop('value')).to.equal(wanSettings[name]);
        });

        const labels = settingsContainer.find('.js-wan-eth-label');
        labels.forEach((label, i) => {
            expect(label.text()).to.equal(inputCheck[i].label);
        });
    });

    it('should hide all text input fields if dhcp is selected', function () {
        const wanSettingsAuto = _.clone(wanSettings);
        wanSettingsAuto.dhcp = 'on';
        // Inputs are child element
        const wrapper = mount(<WanEthernetSettings wanSettings={wanSettingsAuto} setEthSettings={setEthSettings}
            submitted={false}/>);
        const inputs = wrapper.find('.js-wan-eth-input');
        expect(inputs).to.have.length(1);
        expect(wrapper.state(['hidden'])).to.equal(true);
    });

    it('should display an input error if an invalid IP is entered', function () {
        const wanSettingsInvalid = _.clone(wanSettings);
        wanSettingsInvalid.ip_address = 'invalid IP';
        const wrapper = mount(<WanEthernetSettings wanSettings={wanSettingsInvalid} setEthSettings={setEthSettings}
            submitted={false}/>);

        const ipInput = wrapper.find('input[name="ip_address"]');
        ipInput.simulate('change').simulate('blur');
        expect(ipInput.hasClass('input-error')).to.equal(true);
    });
});
