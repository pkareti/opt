import React from 'react';
import {expect} from 'chai';
import {IntStateInfo} from './int-state.jsx';
import {shallow} from 'enzyme';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard Interface panel tests', function () {
    let deviceCtx = { device: { test: 'ctx' } };
    let wifi_state = [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up'
        },
        {
            _id: 2,
            _groupIndex: 1,
            admin_status: 'up',
            oper_status: 'up'
        },
        {
            _id: 3,
            _groupIndex: 2,
            admin_status: 'up',
            oper_status: 'down'
        },
        {
            _id: 4,
            _groupIndex: 3,
            admin_status: 'down',
            oper_status: 'down'
        }
    ];

    let cellular_state = [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up'
        },
        {
            _id: 2,
            _groupIndex: 1,
            admin_status: 'down',
            oper_status: 'down'
        }
    ];

    it('should render configured wifi components for interfaces panel', function () {
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="wifi"
            ready={true}
            wifi={wifi_state}/>);

        let wifis = wrapper.find('.js-wifi');
        expect(wifis).to.have.length(3);
        let index = 0;
        wifis.forEach(wifi => {
            let expectedLabel = 'Wifi ' + (wifi_state[index]._groupIndex + 1);
            expect(wifi.find('.js-label').text()).to.equal(expectedLabel);
            expect(wifi.find('.js-value').text()).to.equal(_.capitalize(wifi_state[index].oper_status));
            expect(wifi.find(StatusIcon)).to.have.length(1);
            ++index;
        });
    });

    it('should render wifi labels based on group name', function () {
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="wifi5g"
            ready={true}
            wifi5g={wifi_state}/>);

        // class names based on group
        let wifis = wrapper.find('.js-wifi5g');
        expect(wifis).to.have.length(3);
        let index = 0;
        wifis.forEach(wifi => {
            // Label based on group
            let expectedLabel = 'Wifi5g ' + (wifi_state[index]._groupIndex + 1);
            expect(wifi.find('.js-label').text()).to.equal(expectedLabel);
            expect(wifi.find('.js-value').text()).to.equal(_.capitalize(wifi_state[index].oper_status));
            expect(wifi.find(StatusIcon)).to.have.length(1);
            ++index;
        });
    });

    it('should render proper status icon', function () {
        let wifiData = [
            { _groupIndex: 0, admin_status: 'up', oper_status: 'up' },
            { _groupIndex: 1, admin_status: 'up', oper_status: 'down' }
        ];
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="wifi"
            ready={true}
            wifi={wifiData}/>);
        let statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon).to.have.length(2);
        expect(statusIcon.at(0).props().condition).to.equal(true);
        expect(statusIcon.at(1).props().condition).to.equal(false);

        // flip states
        wifiData[0].oper_status = 'down';
        wifiData[1].oper_status = 'up';
        wrapper.setProps({ wifi: wifiData });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon).to.have.length(2);
        expect(statusIcon.at(0).props().condition).to.equal(false);
        expect(statusIcon.at(1).props().condition).to.equal(true);
    });

    it('should render empty if not ready', function () {
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="wifi"
            ready={false}
            wifi={wifi_state}/>);
        expect(wrapper.find('.js-wifi')).to.have.length(0);
    });

    it('should render all cellular components for interfaces panel', function () {
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="cellular"
            ready={true}
            cellular={cellular_state}/>);

        let cells = wrapper.find('.js-cellular');
        expect(cells).to.have.length(1);
        let index = 0;
        cells.forEach(cell => {
            let expectedLabel = 'Cellular ' + (cellular_state[index]._groupIndex + 1);
            expect(cell.find('.js-label').text()).to.equal(expectedLabel);
            expect(cell.find('.js-value').text()).to.equal(_.capitalize(cellular_state[index].oper_status));
            expect(cell.find(StatusIcon)).to.have.length(1);
            ++index;
        });
    });

    it('should render proper status icon', function () {
        let cellData = [
            { _groupIndex: 0, admin_status: 'up', oper_status: 'up' },
            { _groupIndex: 1, admin_status: 'up', oper_status: 'down' }
        ];
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="cellular"
            ready={true}
            cellular={cellData}/>);
        let statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon).to.have.length(2);
        expect(statusIcon.at(0).props().condition).to.equal(true);
        expect(statusIcon.at(1).props().condition).to.equal(false);

        // flip states
        cellData[0].oper_status = 'down';
        cellData[1].oper_status = 'up';
        wrapper.setProps({ cell: cellData });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon).to.have.length(2);
        expect(statusIcon.at(0).props().condition).to.equal(false);
        expect(statusIcon.at(1).props().condition).to.equal(true);
    });

    it('should render empty if not ready', function () {
        const wrapper = shallow(<IntStateInfo context={deviceCtx}
            group="cellular"
            ready={false}
            cellular={cellular_state}/>);
        expect(wrapper.find('.js-cellular')).to.have.length(0);
    });

});