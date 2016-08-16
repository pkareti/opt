import React from 'react';
import {expect} from 'chai';
import {CloudStateInfo} from './cloud-state.jsx';
import {shallow} from 'enzyme';
import * as moment from 'moment';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard Cloud panel tests', function () {
    let deviceCtx = { device: { test: 'ctx' } };
    let cloud_state = {
        _id: 1,
        _groupIndex: 0,
        status: 'connected',
        server: 'devtest.idigi.com',
        deviceid: '00000000-00000000-0040FFFF-FF0F44B0',
        uptime: '8949',
        rx_packets: '2500',
        tx_packets: '3000',
        rx_bytes: '10000',
        tx_bytes: '12000'
    };

    it('should render all remote manager panel components', function () {
        const wrapper = shallow(<CloudStateInfo context={deviceCtx}
            group="cloud"
            ready={true}
            cloud={cloud_state}/>);

        let status = wrapper.find('.js-status');
        expect(status.find(StatusIcon)).to.have.length(1);
        expect(status.find('.js-value').text()).to.equal(_.capitalize(cloud_state.status));

        let uptime = wrapper.find('.js-uptime');
        let expectedUptime = moment.duration(cloud_state.uptime, 'seconds').humanize();
        expect(uptime.find('.js-value').text()).to.equal(expectedUptime);

        let devId = wrapper.find('.js-device-id');
        expect(devId.find('.js-value').text()).to.equal(cloud_state.deviceid);

        let packets = wrapper.find('.js-packets');
        expect(packets.find('.js-rx-value').text()).to.equal('Received: ' + cloud_state.rx_packets);
        expect(packets.find('.js-tx-value').text()).to.equal('Sent: ' + cloud_state.tx_packets);

        let bytes = wrapper.find('.js-bytes');
        expect(bytes.find('.js-rx-value').text()).to.equal('Received: ' + cloud_state.rx_bytes);
        expect(bytes.find('.js-tx-value').text()).to.equal('Sent: ' + cloud_state.tx_bytes);
    });

    it('should render proper status icon', function () {
        let cloudData = { status: 'connected' };
        const wrapper = shallow(<CloudStateInfo context={deviceCtx}
            group="cloud"
            ready={true}
            cloud={cloudData}/>);
        let status = wrapper.find('.js-status');
        let statusIcon = status.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(true);

        cloudData.status = 'disconnected';
        wrapper.setProps({ cloud: cloudData });
        status = wrapper.find('.js-status');
        statusIcon = status.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(false);
    });

    it('should render empty if not ready', function () {
        const wrapper = shallow(<CloudStateInfo context={deviceCtx}
            group="lan"
            ready={false}
            cloud={cloud_state}/>);
        expect(wrapper.find('.js-lan')).to.have.length(0);
    });

});