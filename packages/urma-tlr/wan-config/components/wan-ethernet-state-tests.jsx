import React from 'react';
import { expect } from 'chai';
import WanEthernetState from './wan-ethernet-state.jsx';
import { shallow } from 'enzyme';
import { wan_data } from './wan-ethernet-tests-data.js';

describe('WAN Ethernet Config (State) Tests', function () {
    const wanState = wan_data.state;
    const stateFields = [
        { label: 'IP address:', value: wanState.ip_address },
        { label: 'Netmask:', value: wanState.mask },
        { label: 'Gateway:', value: wanState.gateway },
        { label: 'DNS servers:', value: `${wanState.dns1}, ${wanState.dns2}` },
        { label: 'Packets:', value: [wanState.rx_packets, wanState.tx_packets] },
        { label: 'Bytes:', value: [wanState.rx_bytes, wanState.tx_bytes] },
    ];

    it('should render all ethernet components for displaying state', function () {
        const wrapper = shallow(<WanEthernetState wanState={wanState}/>);
        const stateContainer = wrapper.find('.js-wan-eth-state');

        const header = stateContainer.find('.js-state-header');
        expect(header.text()).to.equal('Ethernet Status and Statistics');

        const labels = stateContainer.find('.js-label');
        const values = stateContainer.find('.js-value');

        labels.forEach((label, i) => {
            expect(label.text()).to.equal(stateFields[i].label);
        });

        values.forEach((value, i) => {
            if (value.find('.js-sub-value').length > 0) {
                value.find('.js-sub-value').forEach((subValue, j) => {
                    expect(subValue.text()).to.equal(stateFields[i].value[j]);
                });
            } else {
                expect(value.text()).to.equal(stateFields[i].value);
            }
        });
    });
});
