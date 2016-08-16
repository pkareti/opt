import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {mount} from 'enzyme';
import * as moment from 'moment';
import Urma from 'meteor/digi:urma-core';
import {WanWrapper} from './wan.jsx';
import WanCellular from './wan-cellular.jsx';
import WanEthernet from './wan-ethernet.jsx'

describe('Wan config tests', function () {

    let settings_data = [
        {
            _id: 1,
            _groupIndex: 0,
            activate_after: 0,
            dhcp: 'on',
            interface: 'eth1',
            ip_address: '',
            mask: '255.255.255.0',
            nat: 'on',
            probe_host: '',
            probe_interval: 60,
            probe_size: 64,
            probe_timeout: 1,
            timeout: 180,
            try_after: 0
        },
        {
            _id: 2,
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
            try_after: 0
        }
    ];

    // Define some stubs for functionality used by components.
    let sandbox, stubState, stubSetting, stubOnChange, stubPush;
    let deviceCtx;
    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        stubPush = sandbox.stub();

        // Meteor collection stubs
        let stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        let stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };

        // State collection
        stubState = {
            find: sandbox.stub(),
            findOne: sandbox.stub()
        };
        // Settings collection
        stubSetting = {
            find: sandbox.stub(),
            update: sandbox.stub(),
            findOne: sandbox.stub()
        };

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

    it('should render all Wan Cellular components', function () {
        let wrapper = mount(<WanWrapper wan={settings_data} context={deviceCtx}/>);
        let wanCellular = wrapper.find(WanCellular);
        let wanEthernet = wrapper.find(WanEthernet);
        expect(wanCellular).to.not.be.undefined;
        expect(wanEthernet).to.not.be.undefined;
    });
});
