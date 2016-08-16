import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { WanCellularState } from './wan-cellular-state.jsx';

const cellularIntState = {
    _id: 1,
    sim_status: 'Using SIM1',
    signal_strength: 'Poor',
    signal_quality: 'Excellent',
    ip_address: '10.52.18.176',
    _groupIndex: 1,
    description: '',
    module: 'Sierra Wireless, Incorporated MC7354',
    firmware_version: 'SWI9X15C_05.05.16.03',
    hardware_version: '1',
    imei: '359225050399534',
    registration_status: 'Not registered',
    network_provider: '',
    temperature: '30',
    connection_type: '2G',
    radio_band: '',
    channel: '0',
    pdp_context: '',
    mask: '0.0.0.0',
    gateway: '0.0.0.0',
    dns_servers: '0.0.0.0',
    rx_packets: '0',
    tx_packets: '0',
    rx_bytes: '0',
    tx_bytes: '0'
};

const rows = [
    { label: 'Module:', value: 'module', className: 'js-module' },
    { label: 'Firmware Version:', value: 'firmware_version', className: 'js-firmware-version' },
    { label: 'Hardware Version:', value: 'hardware_version', className: 'js-hardware-version' },
    { label: 'IMEI:', value: 'imei', className: 'js-imei' },
    { label: 'SIM Status:', value: 'sim_status', className: 'js-sim-status' },
    { label: 'Signal Strength:', value: 'signal_strength', className: 'js-signal-strength' },
    { label: 'Signal Quality:', value: 'signal_quality', className: 'js-signal-quality' },
    { label: 'Registration Status:', value: 'registration_status', className: 'js-registration-status' },
    { label: 'Network Provider:', value: 'network_provider', className: 'js-network-provider' },
    { label: 'Temperature:', value: 'temperature', className: 'js-temperature' },
    { label: 'Connection Type:', value: 'connection_type', className: 'js-connection-type' },
    { label: 'Radio Band:', value: 'radio_band', className: 'js-radio-band' },
    { label: 'Channel:', value: 'channel', className: 'js-channel' },
    { label: 'APN in use:', value: 'pdp_context', className: 'js-apn-in-use' },
    { label: 'IP Address:', value: 'ip_address', className: 'js-ip-address' },
    { label: 'Mask:', value: 'mask', className: 'js-mask' },
    { label: 'Gateway:', value: 'gateway', className: 'js-gateway' },
    { label: 'DNS Servers:', value: 'dns_servers', className: 'js-dns-servers' }
];

describe('WAN Cellular state (WAN Config) tests', function () {
    it('should render Wan cellular state header', function () {
        const wrapper = shallow(<WanCellularState cellularState={cellularIntState} />);
        expect(wrapper.find('h5').text()).to.equal('Cellular Status and Statistics');
    });

    it('verify all the state is being rendered correctly', function () {
        const wrapper = shallow(<WanCellularState cellularState={cellularIntState} />);
        rows.forEach((row) => {
            expect(wrapper.find('.' + row.className + ' .js-label').text()).to.equal(row.label);
            expect(wrapper.find('.' + row.className + ' .js-value').text()).to.equal(cellularIntState[row.value]);
        });
    });
});


