import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import Dashboard from './dashboard.jsx';
import {state_data} from './dashboard-tests-data.jsx';
import CloudState from './cloud-state.jsx';
import SystemState from './system-state.jsx';
import LanState from './lan-state.jsx';
import EthIntState from './eth-int-state.jsx';
import IntState from './int-state.jsx';
import NetworkActivityState from './network-activity-state.jsx';
import FirmwareUpToDate from './firmware-up-to-date.jsx';
import { render, shallow } from 'enzyme';
import _ from 'lodash';
import * as moment from 'moment';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard tests', function () {
    let deviceCtx = { device: { test: 'ctx' } };

    it('should render all dashboard components', function () {
        let wrapper = shallow(<Dashboard/>, { context: deviceCtx });

        // Remote Manager (cloud) panel
        let cloud = wrapper.find(CloudState);
        expect(cloud.prop('group')).to.equal('cloud');
        expect(cloud.prop('context')).to.eql(deviceCtx);
        // System panel
        let system = wrapper.find(SystemState);
        expect(system.prop('groups')).to.deep.equal(['system', 'firmware_files']);
        expect(system.prop('context')).to.eql(deviceCtx);
        // Interfaces panel
        let eth = wrapper.find(EthIntState);
        expect(eth.prop('group')).to.equal('eth');
        expect(eth.prop('context')).to.eql(deviceCtx);
        let wifiWrapper = wrapper.find(IntState);
        expect(wifiWrapper).to.have.length(3);
        let wifi = wifiWrapper.findWhere(n => n.prop('group') === 'wifi')
        expect(wifi.prop('group')).to.equal('wifi');
        expect(wifi.prop('context')).to.eql(deviceCtx);
        let wifi5g = wifiWrapper.findWhere(n => n.prop('group') === 'wifi5g')
        expect(wifi5g.prop('group')).to.equal('wifi5g');
        expect(wifi5g.prop('context')).to.eql(deviceCtx);
        // LAN panel
        let lan = wrapper.find(LanState);
        expect(lan.prop('group')).to.equal('lan');
        expect(lan.prop('context')).to.eql(deviceCtx);
        // Network Activity panel
        let netActivity = wrapper.find(NetworkActivityState);
        expect(netActivity).to.have.length(2);
        let naWan = netActivity.first();
        expect(naWan.prop('group')).to.equal('wan');
        expect(naWan.prop('title')).to.equal('WAN');
        expect(naWan.prop('context')).to.eql(deviceCtx);
        let naLan = netActivity.last();
        expect(naLan.prop('group')).to.equal('lan');
        expect(naLan.prop('title')).to.equal('LAN');
        expect(naLan.prop('context')).to.eql(deviceCtx);

        //TODO: WAN, VPN
    });

    it('should render dashboard header', function () {
        let wrapper = shallow(<Dashboard/>, { context: deviceCtx });
        expect(wrapper.find('.page-title').text()).to.equal('Dashboard');
    });

});