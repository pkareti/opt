import React from 'react';
import {expect} from 'chai';
import {LanStateInfo} from './lan-state.jsx';
import {shallow} from 'enzyme';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard LAN panel tests', function () {
    let deviceCtx = { device: { test: 'ctx' } };
    let lan_state = [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up',
            description: 'Local LAN',
            interfaces: 'eth2,eth3,eth4',
            rx_bytes: 71260694,
            tx_bytes: 13935096
        },
        {
            _id: 2,
            _groupIndex: 1,
            admin_status: 'up',
            oper_status: 'up',
            description: 'Guest Wifi',
            interfaces: 'wifi1',
            rx_bytes: 83443,
            tx_bytes: 34791
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

    it('should render all LAN panel components', function () {
        const wrapper = shallow(<LanStateInfo context={deviceCtx}
            group="lan"
            ready={true}
            lan={lan_state}/>);

        // LAN only renders if an interface is assigned to it. Find those first.
        let lansInUse = lan_state.filter(lan => (lan.interfaces || false));
        let lans = wrapper.find('.js-lan');
        expect(lans).to.have.length(lansInUse.length);
        let index = 0;
        lans.forEach(lan => {
            expect(lan.find('.js-name').text()).to.equal('LAN ' + (lan_state[index]._groupIndex + 1));
            let expectedDescription = lan_state[index].description || '(' + lan_state[index].interfaces + ')';
            expect(lan.find('.js-label').text()).to.equal(expectedDescription);
            expect(lan.find('.js-value').text()).to.equal(_.capitalize(lan_state[index].oper_status));
            expect(lan.find(StatusIcon)).to.have.length(1);
            ++index;
        });
    });

    it('should render proper status icon', function () {
        let lanData = [
            { _groupIndex: 0, interfaces: 'eth1', oper_status: 'up' },
            { _groupIndex: 1, interfaces: 'eth2', oper_status: 'down' }
        ];
        const wrapper = shallow(<LanStateInfo context={deviceCtx}
            group="lan"
            ready={true}
            lan={lanData}/>);
        let statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon).to.have.length(2);
        expect(statusIcon.at(0).props().condition).to.equal(true);
        expect(statusIcon.at(1).props().condition).to.equal(false);

        // flip states
        lanData[0].oper_status = 'down';
        lanData[1].oper_status = 'up';
        wrapper.setProps({ lan: lanData });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon).to.have.length(2);
        expect(statusIcon.at(0).props().condition).to.equal(false);
        expect(statusIcon.at(1).props().condition).to.equal(true);
    });

    it('should render empty if not ready', function () {
        const wrapper = shallow(<LanStateInfo context={{device: deviceCtx}}
            group="lan"
            ready={false}
            lan={lan_state}/>);
        expect(wrapper.find('.js-lan')).to.have.length(0);
    });

    it('should show message if no lans configured', sinon.test(function () {
        let lanData = [
            { _groupIndex: 0, oper_status: 'up' },
            { _groupIndex: 1, oper_status: 'down' }
        ];
        const wrapper = shallow(<LanStateInfo context={deviceCtx}
            group="lan"
            ready={true}
            lan={lanData}/>);
        let noLans = wrapper.find('.js-no-lan');
        expect(noLans.text()).to.equal('No LAN interfaces are currently configured.');
    }));
});