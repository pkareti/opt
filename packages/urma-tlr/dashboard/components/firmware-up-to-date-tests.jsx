import React from 'react';
import {expect} from 'chai';
import FirmwareUpToDate from './firmware-up-to-date.jsx';
import {shallow} from 'enzyme';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

describe('Dashboard Firmware Up To Date tests', function () {
    let firmware_files = {
        _id: 1,
        _groupIndex: 0,
        available_images: {
            file: [
                { date: '3/04/2016 7:45PM', name: 'lr54-1.2.3.4.bin', size: 23456780, version: '1.2.3.4' },
                { date: '3/08/2016 4:33AM', name: 'lr54-1.2.3.5.bin', size: 23456890, version: '1.2.3.5' }
            ]
        }
    };

    it('should render all components', function () {
        const wrapper = shallow(<FirmwareUpToDate firmware_files={firmware_files}
            firmware_version="1.2.3.4"/>);
        expect(wrapper.find(StatusIcon)).to.have.length(1);
    });

    it('should render proper status icon', function () {
        const wrapper = shallow(<FirmwareUpToDate firmware_files={firmware_files}
            firmware_version="1.2.3.5"/>);
        let statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(true);
        // Set to older
        wrapper.setProps({ firmware_version: '1.2.3.4' });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(false);
        // Set to newer
        wrapper.setProps({ firmware_version: '1.2.3.6' });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(false); // currently only checks equality. is this correct?
        // Set to invalid
        wrapper.setProps({ firmware_version: 'w.x.y.z' });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(false);
        // Set to empty
        wrapper.setProps({ firmware_version: '' });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(false);
        // Set back to current
        wrapper.setProps({ firmware_version: '1.2.3.5' });
        statusIcon = wrapper.find(StatusIcon);
        expect(statusIcon.props().condition).to.equal(true);
    });
});