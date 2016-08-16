import React from 'react';
import {expect} from 'chai';
import {SystemStateInfo} from './system-state.jsx';
import FirmwareUpToDate from './firmware-up-to-date.jsx';
import {shallow} from 'enzyme';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard System panel tests', function () {
    let deviceCtx = { device: { test: 'ctx' } };
    let system_state = {
        _id: 1,
        _groupIndex: 0,
        firmware_version: '1.2.3.4 3/18/2016 17:19:03',
        model: 'LR54',
        part_number: 'Not available',
        serial_number: 'LR000110',
        hardware_version: 'Not available',
        firmware_version: '0.2.0.2 03/28/16 17:19:03',
        bootloader_version: '201602051801',
        uptime: '7 Minutes, 32 Seconds',
        system_time: '19 October 2015, 22:27:35',
        cpu_usage: '30',
        temperature: 'Not available',
        description: 'My LR54',
        location: 'My place',
        contact: 'Me'
    };

    let firmware_files_state = {
        id: 1,
        _groupIndex: 0,
        available_images: {
            file: [
                { date: '3/04/2016 7:45PM', name: 'lr54-1.2.3.4.bin', size: 23456780, version: '1.2.3.4' },
                { date: '3/08/2016 4:33AM', name: 'lr54-1.2.3.5.bin', size: 23456890, version: '1.2.3.5' }
            ]
        }
    };

    it('should render all system panel components', function () {
        const wrapper = shallow(<SystemStateInfo context={deviceCtx}
            groups={['system', 'firmware_files']}
            ready={true}
            system={system_state}
            firmware_files={firmware_files_state}/>);

        let uptime = wrapper.find('.js-uptime');
        expect(uptime.find('.js-value').text()).to.equal(system_state.uptime);

        let sysTime = wrapper.find('.js-sys-time');
        expect(sysTime.find('.js-value').text()).to.equal(system_state.system_time);

        let cpu = wrapper.find('.js-cpu');
        expect(cpu.find('.js-value').text()).to.equal(system_state.cpu_usage + '%');

        let temp = wrapper.find('.js-temperature');
        expect(temp.find('.js-value').text()).to.equal(system_state.temperature);

        let descr = wrapper.find('.js-description');
        expect(descr.find('.js-value').text()).to.equal(system_state.description);

        let contact = wrapper.find('.js-contact');
        expect(contact.find('.js-value').text()).to.equal(system_state.contact);

        let loc = wrapper.find('.js-location');
        expect(loc.find('.js-value').text()).to.equal(system_state.location);

        let model = wrapper.find('.js-model');
        expect(model.find('.js-value').text()).to.equal(system_state.model);

        let partNum = wrapper.find('.js-part-num');
        expect(partNum.find('.js-value').text()).to.equal(system_state.part_number);

        let serialNum = wrapper.find('.js-serial-num');
        expect(serialNum.find('.js-value').text()).to.equal(system_state.serial_number);

        let hwVersion = wrapper.find('.js-hw-version');
        expect(hwVersion.find('.js-value').text()).to.equal(system_state.hardware_version);

        let fwVersion = wrapper.find('.js-fw-version');
        let expectedFwVersion = system_state.firmware_version.split(' ')[0];
        expect(fwVersion.find('.js-value').text()).to.equal(expectedFwVersion);
        let fwUpToDate = wrapper.find(FirmwareUpToDate);
        expect(fwUpToDate.props().firmware_version).to.equal(system_state.firmware_version);
        expect(fwUpToDate.props().firmware_files).to.equal(firmware_files_state);

        let bootVersion = wrapper.find('.js-boot-version');
        expect(bootVersion.find('.js-value').text()).to.equal(system_state.bootloader_version);
    });

    it('should render empty if not ready', function () {
        const wrapper = shallow(<SystemStateInfo context={deviceCtx}
            groups={['system', 'firmware_files']}
            ready={false}
            system={system_state}
            firmware_files={firmware_files_state}/>);
        expect(wrapper.find('.js-lan')).to.have.length(0);
    });

});