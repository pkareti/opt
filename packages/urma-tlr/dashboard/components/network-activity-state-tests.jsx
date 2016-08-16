import React from 'react';
import {expect} from 'chai';
import {NetworkActivityStateInfo} from './network-activity-state.jsx';
import {shallow} from 'enzyme';

describe('Dashboard Network Activity panel tests', function () {
    let deviceCtx = { device: { test: 'ctx' } };
    let state_data = [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up',
            description: 'Local LAN',
            interfaces: 'eth2,eth3,eth4',
            rx_bytes: 71260694,
            tx_bytes: 934
        },
        {
            _id: 2,
            _groupIndex: 1,
            admin_status: 'up',
            oper_status: 'up',
            description: 'Guest Wifi',
            interfaces: 'wifi1',
            rx_bytes: 83443,
            tx_bytes: 16
        },
        {
            _id: 3,
            _groupIndex: 2,
            admin_status: 'down',
            oper_status: 'down',
            description: 'Unused',
            interfaces: '',
            rx_bytes: 0,
            tx_bytes: 0
        }
    ];

    it('should render all Network Activity components', function () {
        const wrapper = shallow(<NetworkActivityStateInfo context={deviceCtx}
            group="lan"
            title="LAN"
            ready={true}
            lan={state_data}/>);

        let na = wrapper.find('.js-network-activity-lan');
        let received = na.find('.js-rx');
        let sent = na.find('.js-tx');
        // received and sent are total for all rx_bytes and tx_bytes, respectively.
        expect(received.find('.js-value').text()).to.equal('71344.14 KB');
        expect(sent.find('.js-value').text()).to.equal('950 Bytes');
    });

    it('should set class names based on group name', function () {
        const wrapper = shallow(<NetworkActivityStateInfo context={deviceCtx}
            group="wan"
            title="xxx"
            ready={true}
            wan={state_data}/>);

        // class names based on group
        expect(wrapper.find('.js-network-activity-wan')).to.have.length(1);
    });

    it('should render title', function () {
        const wrapper = shallow(<NetworkActivityStateInfo context={deviceCtx}
            group="xxx"
            title="My LAN"
            ready={true}
            xxx={state_data}/>);

        // class names based on group
        let title = wrapper.find('.js-title');
        expect(title).to.have.length(1);
        expect(title.text()).to.equal('My LAN')
    });

    it('should render empty if not ready', function () {
        const wrapper = shallow(<NetworkActivityStateInfo context={deviceCtx}
            group="lan"
            title="LAN"
            ready={false}
            lan={state_data}/>);
        expect(wrapper.find('.js-network-activity-lan')).to.have.length(0);
    });

});