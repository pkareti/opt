import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { render, shallow, mount } from 'enzyme';
import * as moment from 'moment';
import Urma from 'meteor/digi:urma-core';
import { renderWanStatus } from './wan.jsx';
import WanCellularComp from './wan-cellular.jsx';
import Probing from './probing.jsx';
import { WanCellularState } from './wan-cellular-state.jsx';
import { WanCellularSettings } from './wan-cellular-settings.jsx';

let wan = {
    settings: {
        _id: 1,
        _groupIndex: 1,
        activate_after: 0,
        dhcp: 'on',
        interface: 'cellular1',
        ip_address: '',
        mask: '255.255.255.0',
        nat: 'on',
        probe_host: '',
        probe_interval: 60,
        probe_size: 64,
        probe_timeout: 1,
        timeout: 180,
        retry_after: 180
    },
    state: {
        admin_status: 'up',
        oper_status: 'up',
        interface: 'cellular1',
        ip_address: '10.20.1.22',
        dns1: '10.10.8.62',
        dns2: '8.8.8.8',
        gateway: '10.20.1.1',
        mask: '255.255.255.0',
        rx_bytes: 633666,
        rx_packets: 6029,
        tx_bytes: 4894179,
        tx_packets: 4661,
        probe_host: '',
        probe_resp_seconds: 0
    }
};

const fakeFunc = function () {};

const wanCellularData = {
    cellular: {
        groupIndex: 0,
        collections: ['state', 'settings']
    },
    wan: {
        groupIndex: 1,
        collections: ['state']
    }
};

describe('WAN Cellular Interface tests', function () {

    // Define some stubs for functionality used by components created under cellular.
    let sandbox, stubState, stubSetting, stubPush, stubOnInterfaceLink, stubOnDelete;
    let deviceCtx;
    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        stubOnDelete = sandbox.stub();
        stubOnInterfaceLink = sandbox.stub();
        stubPush = sandbox.stub();

        // Meteor collection stubs
        const stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        const stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };

        // State collection
        stubState = {
            findOne: sandbox.stub()
        };
        // Settings collection
        stubSetting = {
            findOne: sandbox.stub(),
            update: sandbox.stub()
        };
        stubState.findOne.withArgs({ _groupIndex: 0, _groupName: 'cellular' }, {}).returns({
            _id: 1,
            sim_status: 'Using SIM1',
            signal_strength: "Poor",
            signal_quality: 'Excellent',
            'ip_address': '10.52.18.176',
            _groupIndex: 1
        });

        stubState.findOne.withArgs({ _groupIndex: 1, _groupName: 'wan' }, {}).returns(wan.state);

        stubSetting.findOne.returns({ _id: "1", state: 'ON', apn: "xyz", _groupIndex: 1 });

        deviceCtx = {
            device: {
                SubsManager: stubSubsManager,
                Settings: stubSetting,
                State: stubState
            },
            router: {
                push: stubPush
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    class WanCellularParent extends React.Component {
        render() {
            return (
                <WanCellularComp
                    group="cellular"
                    context={deviceCtx}
                    wanSettings={wan.settings}
                    updateState={fakeFunc}
                    renderPassword={fakeFunc}
                    renderWanStatus={renderWanStatus}
                    goToInterface={stubOnInterfaceLink}
                    onDelete={stubOnDelete}
                    getData={wanCellularData}
                />
            );
        }
    }

    it('should render all Wan Cellular components only when expanded', function () {
        let wrapper = mount(<WanCellularParent/>);
        //toggle accordion
        wrapper.find('.expander-trigger').simulate('click');
        let buttons = wrapper.find('button');
        let probing = wrapper.find(Probing);
        let wanCellularState = wrapper.find(WanCellularState);
        let wanCellularSettings = wrapper.find(WanCellularSettings);
        expect(buttons).to.not.be.undefined;
        expect(probing).to.not.be.undefined;
        expect(wanCellularState).to.not.be.undefined;
        expect(wanCellularSettings).to.not.be.undefined;
    });

    it('should display correct "up" status in accordion', function () {
        const parent = mount(<WanCellularParent />);
        const wrapper = parent.find('WanCellularComp');
        const status = wrapper.find('.js-accordion-status');
        expect(status.text()).to.equal('OK');
    });

    it('should display correct "down" status in accordion', function () {
        const wanDataCopy = _.cloneDeep(wan);
        wanDataCopy.state.oper_status = 'down';
        stubState.findOne.withArgs({ _groupIndex: 1, _groupName: 'wan' }, {}).returns(wanDataCopy.state);

        const parent = mount(<WanCellularParent />);
        const wrapper = parent.find('WanCellularComp');
        const status = wrapper.find('.js-accordion-status');
        expect(status.text()).to.equal('Down');
    });

    it('should call update wan settings with correct probing values after apply button is clicked', sinon.test(function () {
        let wrapper = mount(<WanCellularParent/>);
        let modifiedObj = {
            probe_host: 'google.com',
            probe_interval: 180,
            probe_size: 64,
            probe_timeout: 1,
            activate_after: 0,
            retry_after: 180,
            timeout: 180
        };

        //toggle accordion
        wrapper.find('.expander-trigger').simulate('click');
        let probing = wrapper.find(Probing);
        let probingForm = probing.find('.probe-settings-form');
        let probeInterval = probingForm.find('.js-input-probeInterval').find('input');
        probeInterval.simulate('change', {target: {value: 180}});
        let probeHost = probingForm.find('.js-input-probeHost').find('input');
        probeHost.simulate('change', {target: {value: 'google.com'}});
        wrapper.find('.js-btn-apply').simulate('click');
        sinon.assert.calledOnce(stubSetting.update);
        sinon.assert.calledWith(stubSetting.update, wan.settings._id, { $set: modifiedObj });
    }));

    it('should reset wan probing values after cancel button is clicked', function () {
        let wrapper = mount(<WanCellularParent/>);
        wrapper.find('.expander-trigger').simulate('click');
        let probing = wrapper.find(Probing);
        let probingForm = probing.find('.probe-settings-form');
        let probeInterval = probingForm.find('.js-input-probeInterval').find('input');
        probeInterval.simulate('change', {target: {value: '0'}});
        wrapper.find('.js-btn-cancel').simulate('click');
        probing = wrapper.find(Probing);
        probingForm = probing.find('.probe-settings-form');
        probeInterval = probingForm.find('.js-input-probeInterval').find('input');
        expect(probeInterval.node.value).to.equal('60')
    });

    it('should call OnDelete to update showDialog state on parent after delete button is clicked', sinon.test(function () {
        let wrapper = mount(<WanCellularParent/>);
        //open wan cellular accordion
        wrapper.find('.expander-trigger').simulate('click');
        //click on delete button
        wrapper.find('.js-btn-delete').simulate('click');
        sinon.assert.calledOnce(stubOnDelete);
    }));

    it('should call goToInterface to update showDialog state on parent after interface link is clicked', sinon.test(function () {
        let wrapper = mount(<WanCellularParent/>);
        //open wan cellular accordion
        wrapper.find('.expander-trigger').simulate('click');
        let probing = wrapper.find(Probing);
        let probingForm = probing.find('.probe-settings-form');
        let probeInterval = probingForm.find('.js-input-probeInterval').find('input');
        probeInterval.simulate('change', {target: {value: '0'}});
        //click on interface link
        wrapper.find('.interface-link').simulate('click');
        sinon.assert.calledOnce(stubOnInterfaceLink);
        sinon.assert.calledWith(stubOnInterfaceLink, true);
    }));

    it('should display error if submitting form with errors', function () {
        const errorMessage = 'Please correct highlighted errors.';
        let wrapper = mount(<WanCellularParent/>);
        wrapper.find('.expander-trigger').simulate('click');

        let probingForm = wrapper.find('.js-wan-probing');
        let probeInterval = probingForm.find('.js-input-probeInterval').find('input');
        probeInterval.simulate('change', {target: {value: '3700'}});
        wrapper.find('.js-btn-apply').simulate('click');
        let message = wrapper.find('.js-submit-message');
        expect(message.text()).to.be.equal(errorMessage);
        sinon.assert.notCalled(stubSetting.update);

        // clear form and verify that error message clears
        wrapper.find('.js-btn-cancel').simulate('click');
        message = wrapper.find('.js-submit-message');
        expect(message.text()).to.be.equal('');
    });
});
