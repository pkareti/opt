import React from 'react';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { default as WifiDetails, rows as labelRows } from './wifi-details.jsx';
import { wifi_data, loadTestData } from './wifi-tests-data.js';

describe('Interface WiFi - Details Tests', function () {
    let data;
    before(function() {
        // data = loadTestData();
        // runs before all tests in this block
    });

    const fakeFunc = () => {};

    const _props = {
        lan: wifi_data.lan,
        selectedInterface: wifi_data.wifi.settings[0],
        setParentState: fakeFunc,
        setWrapperState: fakeFunc,
        changed: false,
        context: {}
    };

    it('should render all defined rows for displaying state for wifi', function () {
        const wrapper = shallow(<WifiDetails wifi={wifi_data.wifi} {..._props}/>);
        const detailsContainer = wrapper.find('.js-wifi-details');
        const renderedHeaders = detailsContainer.find('.js-wifi-header').map(node => node.text());
        const renderedLabels = detailsContainer.find('.js-label').map(node => node.text());
        const renderedValues = detailsContainer.find('.js-value').map(node => node.text());

        const wifiSettings = wifi_data.wifi.settings;

        let labelIndex = 0;
        let wifiType = '2.4';
        wifiSettings.forEach((wifi, i) => {
            const wifiIndex = wifi._groupIndex + 1;
            const interfaceName = wifi._groupName + wifiIndex;
            const header = "Wi-Fi "+wifiType+"GHz "+wifiIndex+" ("+interfaceName+")";
            expect(renderedHeaders[i]).to.equal(header);

            labelRows.forEach((labelRow, j) => {
                expect(renderedLabels[labelIndex]).to.equal(labelRow.label + ': ');
                expect(renderedValues[labelIndex]).to.equal(wifi[labelRow.value]);
                labelIndex ++;
            });
        });
    });

    it('should render all defined rows for displaying state for wifi5g', function () {
        const wrapper = shallow(<WifiDetails wifi5g={wifi_data.wifi5g} {..._props}/>);
        const detailsContainer = wrapper.find('.js-wifi-details');
        const renderedHeaders = detailsContainer.find('.js-wifi-header').map(node => node.text());
        const renderedLabels = detailsContainer.find('.js-label').map(node => node.text());
        const renderedValues = detailsContainer.find('.js-value').map(node => node.text());

        const wifiSettings = wifi_data.wifi5g.settings;

        let labelIndex = 0;
        let wifiType = '5';
        wifiSettings.forEach((wifi, i) => {
            const wifiIndex = wifi._groupIndex + 1;
            const interfaceName = wifi._groupName + wifiIndex;
            const header = "Wi-Fi "+wifiType+"GHz "+wifiIndex+" ("+interfaceName+")";
            expect(renderedHeaders[i]).to.equal(header);

            labelRows.forEach((labelRow, j) => {
                expect(renderedLabels[labelIndex]).to.equal(labelRow.label + ': ');
                expect(renderedValues[labelIndex]).to.equal(wifi[labelRow.value]);
                labelIndex ++;
            });
        });
    });


    it('it should change selected interfaces display or display dialog when clicking radio buttons', function () {
        const setParentState = sinon.stub();
        const setWrapperState = sinon.stub();
        _props.setParentState = setParentState;
        _props.setWrapperState = setWrapperState;

        const wrapper = shallow(<WifiDetails wifi={wifi_data.wifi} {..._props}/>);

        // if no form changes, props.setParentState called to change interface
        wrapper.find('input[name="wifi2"]').simulate('change', { target: { checked: true } });
        sinon.assert.calledOnce(setParentState);
        sinon.assert.notCalled(setWrapperState);

        // if form changes, props.setWrapperState called to trigger dialog
        wrapper.setProps({ changed: true });
        wrapper.find('input[name="wifi1"]').simulate('change', { target: { checked: true } });
        sinon.assert.calledOnce(setWrapperState);
        sinon.assert.calledOnce(setParentState); // verify wasn't called again
    });

    // lan link tested in functional test
});
