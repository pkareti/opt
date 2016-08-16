import React from 'react';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import WifiInput from './wifi-input.jsx';
import { wifi_data } from './wifi-tests-data.js';

describe('Interface WiFi - Tests', function () {
    const fakeFunc = () => {};
    const _props = {
        context: {
            device: {
                Settings: fakeFunc,
            }
        },
        getData: {},
        location: {},
        onUpdateComplete: fakeFunc,
        setWrapperState: fakeFunc,

        // data:
        ready: true,
        dataReady: true,
        // dataReady: false,
        wifi: wifi_data.wifi,
        wifi5g: wifi_data.wifi5g,
        wifi_global: wifi_data.wifi_global,
        lan: wifi_data.lan,
    };


    it('should display correct components if data is ready / not ready', function () {
        const wrapper = mount(<WifiInput {..._props}/>);
        wrapper.find('.expander-trigger').simulate('click');
        expect(wrapper.find('.js-interface-wifi-content')).to.have.length(1);
        expect(wrapper.find('.js-loading-message')).to.have.length(0);

        wrapper.setProps({ dataReady: false });
        expect(wrapper.find('.js-interface-wifi-content')).to.have.length(0);
        expect(wrapper.find('.js-loading-message').text()).to.equal('Loading...');
    });

    describe('button functions', function () {
        it('should reset input fields if cancel button is pressed', function() {
            const wrapper = mount(<WifiInput {..._props} />);
            // verify both global and selected interface forms are reset when updated
            wrapper.find('.expander-trigger').simulate('click');
            const wifi_channel = wrapper.find('select[name="wifi_channel"]');
            const ssid = wrapper.find('input[name="ssid"]');

            const intial2_4ghzValue = wifi_channel.props().value;
            const initalSsidValue = ssid.props().value;
            wifi_channel.simulate('change', {target: {value: '9'}});
            ssid.simulate('change', {target: {value: 'foobar'}});

            // verify change worked
            expect(wifi_channel.props().value).to.equal('9');
            expect(ssid.props().value).to.equal('foobar');

            wrapper.find('.js-cancel').simulate('click');
            expect(wifi_channel.props().value).to.equal(intial2_4ghzValue);
            expect(ssid.props().value).to.equal(initalSsidValue);
        });

        it('should trigger update after pressing apply only if valid changes made', function() {
            const settingUpdateStub = sinon.stub();
            _props.context.device.Settings.update = settingUpdateStub;

            const wrapper = mount(<WifiInput {..._props} />);
            wrapper.find('.expander-trigger').simulate('click');

            // should not run with no field changes
            const applyButton = wrapper.find('.js-apply');
            applyButton.simulate('click');
            sinon.assert.notCalled(settingUpdateStub);
            expect(wrapper.state().changed).to.equal(false);

            // Test update of selected interface settings
            const newSSID = 'Test SSID name';
            wrapper.find('input[name="ssid"]').simulate('change', { target: { value: newSSID } });
            applyButton.simulate('click');

            const wifiSettings = wrapper.state().wifiSettings;
            const selected = wrapper.state().selectedInterface;
            const settingsModifier = {
                ssid: newSSID,
                description: wifiSettings.description,
                state: wifiSettings.state,
                broadcast_ssid: wifiSettings.broadcast_ssid,
                isolate_clients: wifiSettings.isolate_clients,
                isolate_ap: wifiSettings.isolate_ap,
                security: wifiSettings.security,
                radius_server: wifiSettings.radius_server,
                radius_server_port: wifiSettings.radius_server_port,
            };

            sinon.assert.calledWith(settingUpdateStub, selected._id, { $set: settingsModifier });
            wrapper.instance().updateCompleted();
            expect(wrapper.state().changed).to.equal(false);
            expect(wrapper.state().submitted).to.equal(true);
            expect(wrapper.state().applied).to.equal(true);
            settingUpdateStub.reset();

            // Test update global interface settings
            wrapper.find('select[name="wifi_channel"]').simulate('change', { target: { value: '9' } });
            applyButton.simulate('click');
            const globalSettings = wrapper.state().globalSettings;
            const globalModifier = {
                wifi_channel: globalSettings.wifi_channel,
                wifi5g_channel: globalSettings.wifi5g_channel,
            };
            sinon.assert.calledWith(settingUpdateStub, globalSettings._id, { $set: globalModifier });
            wrapper.instance().updateCompleted();
            expect(wrapper.state().globalSettings._changed).to.equal(false);

            const message = wrapper.find('.js-submit-message');
            expect(message.text()).to.be.equal('Changes applied.');
        });

        it('should display error if submitting form with errors and not update settings', function() {
            const settingUpdateStub = sinon.stub();
            _props.context.device.Settings.update = settingUpdateStub;

            const wrapper = mount(<WifiInput {..._props} />);
            wrapper.find('.expander-trigger').simulate('click');

            wrapper.find('input[name="ssid"]').simulate('change', { target: { value: 'this field name is faaaaaaaar too many characters' } });
            expect(wrapper.state().valid).to.equal(false);

            wrapper.find('.js-apply').simulate('click');
            sinon.assert.notCalled(settingUpdateStub);
            const message = wrapper.find('.js-submit-message');
            expect(message.text()).to.equal('Please correct highlighted errors.');
        });

        it('should only apply password changes if password set', function () {
            const settingUpdateStub = sinon.stub();
            _props.context.device.Settings.update = settingUpdateStub;

            const wrapper = mount(<WifiInput {..._props} />);
            wrapper.find('.expander-trigger').simulate('click');

            // we already verified that not changing the password omits the password field in an earlier unit test
            const superSecretPassword = 'password123';
            wrapper.find('input[name="password"]').simulate('change', { target: { value: superSecretPassword } });
            wrapper.find('.js-apply').simulate('click');

            const wifiSettings = wrapper.state().wifiSettings;
            const selected = wrapper.state().selectedInterface;
            const settingsModifier = {
                ssid: wifiSettings.ssid,
                description: wifiSettings.description,
                state: wifiSettings.state,
                broadcast_ssid: wifiSettings.broadcast_ssid,
                isolate_clients: wifiSettings.isolate_clients,
                isolate_ap: wifiSettings.isolate_ap,
                security: wifiSettings.security,
                radius_server: wifiSettings.radius_server,
                radius_server_port: wifiSettings.radius_server_port,
                password: superSecretPassword
            };

            sinon.assert.calledWith(settingUpdateStub, selected._id, { $set: settingsModifier });
        });

        it('display accordion status for wifi interfaces', function () {
            // by default, test data has no errors.  Verify OK status displayed
            const wrapper = mount(<WifiInput {..._props} />);
            const status = wrapper.find('.js-accordion-status');
            expect(status.text()).to.equal('OK');

            // changed oper_status to down for admin_status up interface
            const wifi5gCopy = _.clone(_props.wifi5g);
            wifi5gCopy.state[0].oper_status = 'down';
            wrapper.setProps({ wifi5g: wifi5gCopy });
            expect(status.text()).to.equal('wifi5g1 is down');

            // verify multiple interfaces changes message
            const wifiCopy = _.clone(_props.wifi);
            wifiCopy.state[0].oper_status = 'down';
            wrapper.setProps({ wifi: wifiCopy });
            expect(status.text()).to.equal('Wifi interfaces are down');
        });
    });
});
