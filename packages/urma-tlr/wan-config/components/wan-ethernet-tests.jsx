import React from 'react';
import _ from 'lodash';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { WanEthernetInput } from './wan-ethernet.jsx';
import { renderWanStatus } from './wan.jsx';
import { eth_data, wan_data } from './wan-ethernet-tests-data.js';

describe('WAN Ethernet Config Test', function () {
    const context = {
        device: {
            Settings: {}
        }
    };

    // data container input:
    const getData = {};

    const wanSettings = wan_data.settings;
    const wanData = {
        state: wan_data.state
    };
    const ethData = {
        state: eth_data.state
    };

    const updateStateFake = () => {
    };
    const onUpdateComplete = sinon.stub();
    const goToInterfaceStub = sinon.stub();
    const onDeleteStub = sinon.stub();

    it('should display correct components if data is ready / not ready', function () {
        const wrapper = shallow(
            <WanEthernetInput
                dataReady={false} getData={getData} eth={ethData}
                context={context} wanSettings={wanSettings} wan={wanData}
                updateState={updateStateFake} onUpdateComplete={onUpdateComplete}
                goToInterface={goToInterfaceStub} onDelete={onDeleteStub}
                renderWanStatus={renderWanStatus}
            />
        );
        expect(wrapper.find('.js-wan-eth-content')).to.have.length(0);
        expect(wrapper.find('.js-loading-message').text()).to.equal('Loading...');

        wrapper.setProps({ dataReady: true });
        expect(wrapper.find('.js-wan-eth-content')).to.have.length(1);
        expect(wrapper.find('.js-loading-message')).to.have.length(0);
    });

    it('should display correct status in accordion', function () {
        const wrapper = mount(
            <WanEthernetInput
                dataReady getData={getData} eth={ethData}
                context={context} wanSettings={wanSettings} wan={wanData}
                updateState={updateStateFake} onUpdateComplete={onUpdateComplete}
                goToInterface={goToInterfaceStub} onDelete={onDeleteStub}
                renderWanStatus={renderWanStatus}
            />
        );

        const status = wrapper.find('.js-accordion-status');
        expect(status.text()).to.equal('OK');

        // changed oper_status to down for admin_status up interface
        const wanDataCopy = _.cloneDeep(wanData);
        wanDataCopy.state.oper_status = 'down';
        wrapper.setProps({ wan: wanDataCopy });
        expect(status.text()).to.equal('Down');
    });

    describe('button functions', function () {
        it('should reset input fields if cancel button is pressed', function () {
            const wrapper = mount(
                <WanEthernetInput
                    dataReady
                    getData={getData}
                    eth={ethData}
                    context={context}
                    wanSettings={wanSettings}
                    wan={wanData}
                    updateState={updateStateFake}
                    onUpdateComplete={onUpdateComplete}
                    goToInterface={goToInterfaceStub}
                    onDelete={onDeleteStub}
                    renderWanStatus={renderWanStatus}
                />
            );

            // verify both probe settings and eth settings forms are reset when updated
            wrapper.find('.expander-trigger').simulate('click');
            const ipInput = wrapper.find('input[name="ip_address"]');
            const probeHost = wrapper.find('input[name="probeHost"]');

            const initalIpValue = ipInput.props().value;
            const initalProbeHostValue = probeHost.props().value;
            ipInput.simulate('change', { target: { value: '192.168.1.109' } });
            probeHost.simulate('change', { target: { value: 'www.fakeProbeHost.com' } });
            expect(ipInput.props().value).to.equal('192.168.1.109');
            // probe nodes lost in rerender and must be found from wrapper again
            expect(wrapper.find('input[name="probeHost"]').props().value).to.equal('www.fakeProbeHost.com');

            wrapper.find('.js-cancel').simulate('click');
            expect(ipInput.props().value).to.equal(initalIpValue);
            expect(wrapper.find('input[name="probeHost"]').props().value).to.equal(initalProbeHostValue);
        });

        it('should trigger update after pressing apply only if valid changes made', function () {
            let settingUpdateStub = sinon.stub();
            let updateStateStub = sinon.stub();
            context.device.Settings.update = settingUpdateStub;

            const wrapper = mount(
                <WanEthernetInput
                    dataReady={true} getData={getData} eth={ethData}
                    context={context} wanSettings={wanSettings} wan={wanData}
                    updateState={updateStateStub} onUpdateComplete={onUpdateComplete}
                    goToInterface={goToInterfaceStub} onDelete={onDeleteStub}
                    renderWanStatus={renderWanStatus}/>
            );

            wrapper.find('.expander-trigger').simulate('click');

            // should not run with no field changes
            const applyButton = wrapper.find('.js-apply');
            applyButton.simulate('click');
            sinon.assert.notCalled(settingUpdateStub);
            expect(wrapper.state().wanEthSettings.changed).to.equal(false);

            // Test update of eth wan settings (ip_address, gateway, and dhcp config trigger modal dialog)
            const newDns = '8.8.4.1';
            wrapper.find('input[name="dns1"]').simulate('change', { target: { value: newDns } });
            applyButton.simulate('click');
            const wanEthSettings = wrapper.state().wanEthSettings
            let settingsModifier = {
                dhcp: wanEthSettings.dhcp,
                ip_address: wanEthSettings.ip_address,
                mask: wanEthSettings.mask,
                gateway: wanEthSettings.gateway,
                dns1: wanEthSettings.dns1,
                dns2: wanEthSettings.dns2,
            };

            sinon.assert.calledWith(settingUpdateStub, wanSettings._id, { $set: settingsModifier });
            wrapper.instance().updateCompleted();
            expect(wrapper.state().wanEthSettings.changed).to.equal(false);
            expect(wrapper.state().submitted).to.equal(true);
            expect(wrapper.state().applied).to.equal(true);
            settingUpdateStub.reset();

            // Test update probe settings
            const newProbeHost = 'new probe host';
            wrapper.find('input[name="probeHost"]').simulate('change', { target: { value: newProbeHost } });
            applyButton.simulate('click');
            settingsModifier = {
                probe_host: newProbeHost,
                probe_interval: wanSettings.probe_interval,
                probe_size: wanSettings.probe_size,
                probe_timeout: wanSettings.probe_timeout,
                activate_after: wanSettings.activate_after,
                retry_after: wanSettings.retry_after,
                timeout: wanSettings.timeout
            };
            sinon.assert.calledWith(settingUpdateStub, wanSettings._id, { $set: settingsModifier });
            wrapper.instance().updateCompleted();
            expect(wrapper.state().wanProbingSettings.changed).to.equal(false);

            const message = wrapper.find('.js-submit-message');
            expect(message.text()).to.be.equal('Changes applied.');
        });

        it('should display error if submitting form with errors and not update settings', function () {
            const settingUpdateStub = sinon.stub();
            context.device.Settings.update = settingUpdateStub;
            const errorMessage = 'Please correct highlighted errors.';

            const wrapper = mount(
                <WanEthernetInput
                    dataReady={true} getData={getData} eth={ethData}
                    context={context} wanSettings={wanSettings} wan={wanData}
                    updateState={updateStateFake} onUpdateComplete={onUpdateComplete}
                    goToInterface={goToInterfaceStub} onDelete={onDeleteStub}
                    renderWanStatus={renderWanStatus}/>
            );

            wrapper.find('.expander-trigger').simulate('click');

            // should not run with WAN eth settings error
            wrapper.find('input[name="ip_address"]').simulate('change', { target: { value: 'invalid IP' } });
            expect(wrapper.state().wanEthSettings.valid).to.equal(false);
            wrapper.find('.js-apply').simulate('click');
            sinon.assert.notCalled(settingUpdateStub);
            let message = wrapper.find('.js-submit-message');
            expect(message.text()).to.equal(errorMessage);

            // clean settings form
            wrapper.find('.js-cancel').simulate('click');
            message = wrapper.find('.js-submit-message');
            expect(message.text()).to.equal("");

            // should not run with WAN eth probing error
            wrapper.find('input[name="probeInterval"]').simulate('change', { target: { value: 'invalid' } });
            expect(wrapper.state().wanProbingSettings.valid).to.equal(false);
            wrapper.find('.js-apply').simulate('click');
            sinon.assert.notCalled(settingUpdateStub);
            message = wrapper.find('.js-submit-message');
            expect(message.text()).to.be.equal(errorMessage);
        });

        it('should update the state to render the confirmation dialog', function () {
            const updateStateStub = sinon.stub();
            const wrapper = mount(
                <WanEthernetInput
                    dataReady={true} getData={getData} eth={ethData}
                    context={context} wanSettings={wanSettings} wan={wanData}
                    updateState={updateStateStub} onUpdateComplete={onUpdateComplete}
                    goToInterface={goToInterfaceStub} onDelete={onDeleteStub}
                    renderWanStatus={renderWanStatus}/>
            );
            wrapper.find('.expander-trigger').simulate('click');

            // if delete pressed
            wrapper.find('.js-delete').simulate('click');
            sinon.assert.calledOnce(onDeleteStub);

            // if interfaces link pressed after making form change
            wrapper.find('input[name="dns1"]').simulate('change', { target: { value: '8.8.4.1' } });
            wrapper.find('.js-interface-link').simulate('click');
            sinon.assert.calledOnce(goToInterfaceStub);

            // test trigger of apply dialog (dhcp mounted as 'off') -> test: dhcp, ip_address, and gateway
            wrapper.find('select[name="dhcp"]').simulate('change', { target: { value: 'on' } });
            const applyButton = wrapper.find('.js-apply');
            applyButton.simulate('click');
            sinon.assert.calledWith(updateStateStub, 'showDialog', sinon.match({ dialog: "apply" }));

            wrapper.find('.js-cancel').simulate('click'); // reset form

            wrapper.find('input[name="ip_address"]').simulate('change', { target: { value: '192.168.1.110' } });
            applyButton.simulate('click');
            sinon.assert.calledTwice(updateStateStub);
            sinon.assert.calledWith(updateStateStub, 'showDialog', sinon.match({ dialog: "apply" }));

            wrapper.find('.js-cancel').simulate('click'); // reset form
            wrapper.find('input[name="gateway"]').simulate('change', { target: { value: '192.168.1.110' } });
            applyButton.simulate('click');
            sinon.assert.calledThrice(updateStateStub);
            sinon.assert.calledWith(updateStateStub, 'showDialog', sinon.match({ dialog: "apply" }));
        });
    });
});
