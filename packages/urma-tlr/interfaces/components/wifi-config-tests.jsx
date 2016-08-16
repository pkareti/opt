import React from 'react';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { default as WifiConfigure, editSelectedRows, editGlobalRows } from './wifi-config.jsx';
import { wifi_data } from './wifi-tests-data.js';
import wifiValidations from '../wifi-validations.js';

describe('Interface WiFi - Config Tests', function () {
    const fakeFunc = () => {};
    const _props = {
        wifiGlobalSettings: wifi_data.wifi_global.settings,
        wifiSettings: wifi_data.wifi.settings[0],
        selectedInterface: wifi_data.wifi.settings[0],
        context: {},
        updateParentState: fakeFunc,
        valid: true,
        submitted: false,
    };

    it('should render input fields with labels and display saved values', function () {
        const wrapper = shallow(<WifiConfigure {..._props}/>);

        const editGlobalLabels = wrapper.find('.js-wifi-globals-form').find('.js-label').map(node => node.text());
        const editSelectedLabels = wrapper.find('.js-wifi-interface-form').find('.js-label').map(node => node.text());

        const globalInputValues = wrapper.find('.js-wifi-globals-form').find('.js-input').map(node => node.prop('value'));
        const editSelectedInputValues = wrapper.find('.js-wifi-interface-form').find('.js-input').map(node => node.prop('value'));

        editGlobalLabels.forEach((label, i) => {
            expect(label).to.equal(editGlobalRows[i].label);
        });
        editSelectedLabels.forEach((label, i) => {
            expect(label).to.equal(editSelectedRows[i].label);
        });

        globalInputValues.forEach((value, i) => {
            expect(value).to.equal(_props.selectedInterface[editGlobalRows[i].name]);
        });
        editSelectedInputValues.forEach((value, i) => {
            expect(value).to.equal(_props.selectedInterface[editSelectedRows[i].name]);
        });
    });


    it('should display validation errors if incorrect input used', function () {
        const wrapper = mount(<WifiConfigure {..._props}/>);
        expect(wrapper.props().valid).to.equal(true);

        wrapper.find('input[name="ssid"]').simulate('change', { target: { value: 'This field is over 32 characters long' } }).simulate('blur');
        expect(wrapper.find('.js-input-ssid .error').text()).to.equal(wifiValidations.ssid.errors);

        // verify error goes away after changing field
        wrapper.find('input[name="ssid"]').simulate('change', { target: { value: 'valid field' } });
        expect(wrapper.find('.js-input-ssid .error').text()).to.equal("");

        wrapper.find('input[name="password"]').simulate('change', { target: { value: 'short' } }).simulate('blur');
        expect(wrapper.find('.js-input-password .error').text()).to.equal(wifiValidations.password.errors);
        wrapper.find('input[name="password"]').simulate('change', { target: { value: 'This field is over 64 characters long... blah blah blah blah blah' } });
        expect(wrapper.find('.js-input-password .error').text()).to.equal(wifiValidations.password.errors);

        wrapper.find('textarea[name="description"]').simulate('change', { target: { value: 'This field is over 255 characters long... blah blah blah blah blah.  More words, more words, more words, more words, more words, more words, more words, more words, more words, more words, more words, more words, more words, more words, more words, more words,' } }).simulate('blur');
        expect(wrapper.find('.js-input-description .error').text()).to.equal(wifiValidations.description.errors);

        // tested in eth config
        // wrapper.find('input[name="radius_server"]').simulate('change', { target: { value: 'invalidIp' } });

        wrapper.find('input[name="radius_server_port"]').simulate('change', { target: { value: 0 } }).simulate('blur');
        expect(wrapper.find('.js-input-radius_server_port .error').text()).to.equal(wifiValidations.radius_server_port.errors);
        wrapper.find('input[name="radius_server_port"]').simulate('change', { target: { value: wifiValidations.radius_server_port.validations.maxValue + 1 } }).simulate('blur');
        expect(wrapper.find('.js-input-radius_server_port .error').text()).to.equal(wifiValidations.radius_server_port.errors);
    });

    it('it should hide password field if security "none" is set', function () {
        _props.wifiSettings.security = 'none';
        const wrapper = mount(<WifiConfigure {..._props}/>);
        expect(wrapper.find('.js-row-password')).to.have.length(0);

        const securityOptions = [
            { title: 'WPA2-Personal', value: 'wpa2_personal' },
            { title: 'WPA/WPA2-Mixed-Mode-Personal', value: 'wpa_wpa2_personal' },
            { title: 'WPA2-Enterprise', value: 'wpa2_enterprise' },
            { title: 'WPA/WPA2-Mixed-Mode-Enterprise', value: 'wpa_wpa2_enterprise' },
        ];

        // verify fields show/hide password field
        securityOptions.forEach(option => {
            _props.wifiSettings.security = option.value;
            wrapper.setProps(_props);
            expect(wrapper.find('.js-row-password')).to.have.length(1);
            _props.wifiSettings.security = 'none';
            wrapper.setProps(_props);
            expect(wrapper.find('.js-row-password')).to.have.length(0);
        });
    });
});
