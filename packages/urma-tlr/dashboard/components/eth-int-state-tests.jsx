import React from 'react';
import {expect} from 'chai';
import {EthIntStateInfo} from './eth-int-state.jsx';
import {shallow} from 'enzyme';
import * as moment from 'moment';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard Eth interface panel tests', function () {
    let wrapper;
    let deviceCtx = { device: { test: 'ctx' } };
    let eth_state = [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up'
        },
        {
            _id: 2,
            _groupIndex: 2,
            admin_status: 'up',
            oper_status: 'up'
        },
        {
            _id: 3,
            _groupIndex: 3,
            admin_status: 'up',
            oper_status: 'down'
        },
        {
            _id: 4,
            _groupIndex: 4,
            admin_status: 'down',
            oper_status: 'down'
        }
    ];

    beforeEach(()=> {
        wrapper = shallow(<EthIntStateInfo context={deviceCtx}
            group="eth"
            ready={true}
            eth={eth_state}/>);

        let eths = wrapper.find('.js-eth');
        expect(eths).to.have.length(3);
        expect(eths.find(StatusIcon)).to.have.length(3);

        let status = eths.find('.js-value');
        expect(status.first().text()).to.equal(_.capitalize(eth_state[0].oper_status));
        expect(status.at(1).text()).to.equal(_.capitalize(eth_state[1].oper_status));
        expect(status.at(2).text()).to.equal(_.capitalize(eth_state[2].oper_status));
    });

    it('should render proper status icon', function () {
        let eths = wrapper.find('.js-eth');
        let statusIcons = eths.find(StatusIcon);
        expect(statusIcons.first().props().condition).to.equal(true);
        expect(statusIcons.at(1).props().condition).to.equal(true);
        expect(statusIcons.at(2).props().condition).to.equal(false);

        eth_state[0].oper_status = 'down';
        wrapper.setProps({ eth: eth_state });
        eths = wrapper.find('.js-eth');
        statusIcons = eths.find(StatusIcon);
        expect(statusIcons.first().props().condition).to.equal(false);
    });

    it('should render empty if not ready', function () {
        wrapper.setProps({ ready: false });
        expect(wrapper.find('.js-eth')).to.have.length(0);
    });

});
