import React from 'react';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';
import CellularConfigure from './cellular-config.jsx';
import {cellularSettings} from './cellular-tests-data.js';
import Validations from '../cellular-validations.js';

let fakeFunc = function () {};

const CellularForm = [
    {label: 'Description', className: '.js-input-description'},
    {label: 'State', className: '.js-input-state'},
    {label: 'APN', className: '.js-input-apn'},
    {label: 'APN Password', className: '.js-input-apnPassword'},
    {label: 'SIM PIN', className: '.js-input-simPin'},
    {label: 'Preferred Mode', className: '.js-input-preferredMode'},
    {label: 'Connection Attempts', className: '.js-input-connectionAttempts'},
];

describe('Interface Cellular Config Tests', function () {

    it('should render all cellular config components', function () {
        let wrapper = shallow(<CellularConfigure cellularSettings={cellularSettings[0]}
                                                 submitted={false}
                                                 valid={true}
                                                 selectedInterface='cellular1'
                                                 setParentState={fakeFunc}/>);
        let editForm = wrapper.find('.js-cellular-edit .cellular-edit-form');
        let labels = wrapper.find('.js-cellular-edit .cellular-edit-form .js-label');
        labels.forEach((label, i) => {
            expect(label.text()).to.equal(CellularForm[i].label);
            expect(editForm.find(CellularForm[i].className)).to.not.be.undefined;
        });
        expect(wrapper.find('h4').text()).to.equal('Edit Selected');
    });

    it('should validate all cellular edit form fields on blur', function () {
        let wrapper = mount(<CellularConfigure cellularSettings={cellularSettings[0]}
                                               submitted={true}
                                               valid={false}
                                               selectedInterface='cellular1'
                                               setParentState={fakeFunc}/>);
        let editForm = wrapper.find('.js-cellular-edit .cellular-edit-form');
        let description = editForm.find('.js-input-description');
        let apn = editForm.find('.js-input-apn');
        let apnPassword = editForm.find('.js-input-apnPassword');
        let simPin = editForm.find('.js-input-simPin');
        let connectionAttempts = editForm.find('.js-input-connectionAttempts');

        description.find('textarea').simulate('change', {target: {value: '1234567890123456789012345678901234567890123456789012345678901234'}});
        apn.find('input').simulate('change', {target: {value: '1234567890123456789012345678901234567890123456789012345678901234'}});
        apnPassword.find('input').simulate('change', {target: {value: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789001234567890'}});
        simPin.find('input').simulate('change', {target: {value: '12345'}});
        connectionAttempts.find('input').simulate('change', {target: {value: '2'}});

        expect(simPin.find('.error').text()).to.equal(Validations.simPin.errors);
        expect(description.find('.error').text()).to.equal(Validations.description.errors);
        expect(apn.find('.error').text()).to.equal(Validations.apn.errors);
        expect(apnPassword.find('.error').text()).to.equal(Validations.apnPassword.errors);
        expect(connectionAttempts.find('.error').text()).to.equal(Validations.connectionAttempts.errors);

        description.find('textarea').simulate('change', {target: {value: 'cellular 1 desc'}});
        apn.find('input').simulate('change', {target: {value: '1265_mcs'}});
        apnPassword.find('input').simulate('change', {target: {value: 'p@ssword'}});
        simPin.find('input').simulate('change', {target: {value: ''}});
        connectionAttempts.find('input').simulate('change', {target: {value: '20'}});

        expect(simPin.find('.error').text()).to.equal('');
        expect(description.find('.error').text()).to.equal('');
        expect(apn.find('.error').text()).to.equal('');
        expect(apnPassword.find('.error').text()).to.equal('');
        expect(connectionAttempts.find('.error').text()).to.equal('');
    });

});
