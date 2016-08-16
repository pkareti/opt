import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {render, shallow, mount} from 'enzyme';
import * as moment from 'moment';
import Urma from 'meteor/digi:urma-core';
import Probing from './probing.jsx';
import Validations from '../probing-validations.js';

let fakeFunc = function () {
};
describe('Probing tests', function () {

    let WanIntialSettings = {
        activate_after: 0,
        dhcp: 'on',
        interface: 'eth1',
        ip_address: '',
        mask: '255.255.255.0',
        nat: 'on',
        probe_host: '',
        probe_interval: 60,
        probe_size: 64,
        probe_timeout: 1,
        timeout: 180,
        try_after: 0
    };

    it('should render all Probing components', function () {
        let wrapper = render(<Probing onChange={fakeFunc}
            initialWanSettings={WanIntialSettings}
            submitted={true}/>);
        let probingForm = wrapper.find('.probe-settings-form');
        let probeHost = probingForm.find('.js-input-probeHost');
        let probeInterval = probingForm.find('.js-input-probeInterval');
        let probeSize = probingForm.find('.js-input-probeSize');
        let probeTimeout = probingForm.find('.js-input-probeTimeout');
        let activateAfter = probingForm.find('.js-input-activateAfter');
        let activateAfterUnit = probingForm.find('.js-input-activateAfterUnit');
        let tryAfter = probingForm.find('.js-input-tryAfter');
        let tryAfterUnit = probingForm.find('.js-input-tryAfterUnit');
        let timeout = probingForm.find('.js-input-timeout');
        expect(wrapper.find('h5').text()).to.equal('Probing');
        expect(probeHost).to.not.be.undefined;
        expect(probeInterval).to.not.be.undefined;
        expect(probeSize).to.not.be.undefined;
        expect(probeTimeout).to.not.be.undefined;
        expect(activateAfter).to.not.be.undefined;
        expect(activateAfterUnit).to.not.be.undefined;
        expect(tryAfter).to.not.be.undefined;
        expect(tryAfterUnit).to.not.be.undefined;
        expect(timeout).to.not.be.undefined;
    });

    it('should validate all probing form fields on blur', function () {
        let wrapper = mount(<Probing onChange={fakeFunc}
            initialWanSettings={WanIntialSettings}
            submitted={true}/>);
        let probingForm = wrapper.find('.probe-settings-form');
        let probeHost = probingForm.find('.js-input-probeHost');
        let probeInterval = probingForm.find('.js-input-probeInterval');
        let probeSize = probingForm.find('.js-input-probeSize');
        let probeTimeout = probingForm.find('.js-input-probeTimeout');
        let activateAfter = probingForm.find('.js-input-activateAfter');
        let activateAfterUnit = probingForm.find('.js-input-activateAfterUnit');
        let retryAfter = probingForm.find('.js-input-retryAfter');
        let retryAfterUnit = probingForm.find('.js-input-retryAfterUnit');
        let timeout = probingForm.find('.js-input-timeout');

        probeHost.find('input').simulate('change', { target: { value: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567' } });
        probeInterval.find('input').simulate('change', { target: { value: '0' } });
        probeSize.find('input').simulate('change', { target: { value: 'Probe Size' } });
        probeTimeout.find('input').simulate('change', { target: { value: 'Timeout' } });
        activateAfter.find('input').simulate('change', { target: { value: '2' } });
        activateAfterUnit.find('select').simulate('change', { target: { value: '3600' } });
        retryAfter.find('input').simulate('change', { target: { value: '2' } });
        retryAfterUnit.find('select').simulate('change', { target: { value: '3600' } });
        timeout.find('input').simulate('change', { target: { value: 'My new value' } });

        let probeHostError = probeHost.find('.error');
        let probeIntervalError = probeInterval.find('.error');
        let probeSizeError = probeSize.find('.error');
        let probeTimeoutError = probeTimeout.find('.error');
        let activateAfterError = activateAfter.find('.error');
        let retryAfterError = retryAfter.find('.error');
        let timeoutError = timeout.find('.error');
        expect(probeHostError.text()).to.equal(Validations.probeHost.errors);
        expect(probeIntervalError.text()).to.equal(Validations.probeInterval.errors);
        expect(probeSizeError.text()).to.equal(Validations.probeSize.errors);
        expect(probeTimeoutError.text()).to.equal(Validations.probeTimeout.errors);
        expect(activateAfterError.text()).to.equal(Validations.activateAfter.errors);
        expect(retryAfterError.text()).to.equal(Validations.retryAfter.errors);
        expect(timeoutError.text()).to.equal(Validations.timeout.errors);
    });
});
