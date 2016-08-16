import React from 'react';
import {expect} from 'chai';
import { mount, shallow} from 'enzyme';
import { default as CellularDetails, rows as labelRows } from './cellular-details.jsx';
import {cellularSettings, wanSettings} from './cellular-tests-data.js';

let fakeFunc = function () {};

describe('Interface Cellular Details Tests', function () {

    it('should render all cellular components for displaying interface data', function () {
        let wrapper = shallow(<CellularDetails cellularSettings={cellularSettings}
                                               wanSettings={wanSettings}
                                               goToWan={fakeFunc}
                                               setParentState={fakeFunc}
                                               setWrapperState={fakeFunc}
                                               changed={true}
                                               selectedInterface='cellular1'
                                               renderPassword={fakeFunc}/>);
        
        cellularSettings.forEach((setting, i) => {
            let cellularContainer = wrapper.find('.js-interface-cellular-settings .js-cellular-' + (i + 1)).render();
            let wanLabel = cellularContainer.find(' .js-wan .js-label').text();
            let wanValue = cellularContainer.find(' .js-wan-link').text();
            let radioButtonLabel = cellularContainer.find(' .js-selection .js-label').text();
            expect(wanLabel).to.equal('WAN:');
            expect(wanValue).to.equal('WAN'+(wanSettings[i]._groupIndex + 1));
            expect(radioButtonLabel).to.equal('Cellular ' + (i + 1));
            
            labelRows.forEach((labelRow, j) => {
                let fieldContainer = cellularContainer.find('.js-' + labelRow.className);
                let labelRowValue = cellularSettings[i][labelRow.value];
                
                /*if(labelRow.value == 'apn_password'){
                    labelRowValue = cellularSettings[i][labelRow.value] != null ? 'configured': null;
                }*/
                expect(fieldContainer.find('.js-label').text()).to.equal([labelRow.label]+':');
                if(labelRow.value != 'apn_password') {
                    expect(fieldContainer.find('.js-value').text()).to.equal(labelRowValue);
                }
            });
        });
    });

    it('should call function when wan link when clicked', sinon.test(function () {
        let spyWanLink = this.spy();
        let spyOnSetParentState = this.spy();
        let spyOnrenderPassword = this.spy();
        let wrapper = mount(<CellularDetails cellularSettings={cellularSettings}
                                             wanSettings={wanSettings}
                                             goToWan={spyWanLink}
                                             setParentState={spyOnSetParentState}
                                             setWrapperState={fakeFunc}
                                             changed={false}
                                             selectedInterface='cellular1'
                                             renderPassword={spyOnrenderPassword}/>);
        let wanLink = wrapper.find('.js-cellular-1 .js-wan .js-wan-link');
        let radioButton = wrapper.find('.js-cellular-2 .js-selection .js-radio-2');
        radioButton.find('input').simulate('change', {target: {checked: true}});
        sinon.assert.calledOnce(spyOnSetParentState);
        wanLink.simulate('click');
        sinon.assert.calledOnce(spyWanLink);
        sinon.assert.calledTwice(spyOnrenderPassword);
    }));
});
