import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { WanCellularSettings } from './wan-cellular-settings.jsx';

const cellularIntSettings = {
    _id: 1,
    _groupIndex: 0,
    apn: 'vzwinternet',
    apn_password: 'abc',
    apn_username: 'abc',
    connection_attempts: '20',
    description: '',
    preferred_mode: 'auto',
    state: 'on',
    sim_pin: '236787'
};

const rows = [
    { label: 'APN:', value: 'apn', className: 'js-apn' },
    { label: 'Username:', value: 'apn_username', className: 'js-username' },
    { label: 'Password:', value: 'apn_password', className: 'js-password' },
    { label: 'SIM PIN:', value: 'sim_pin', className: 'js-sim-pin' },
    { label: 'Preferred Mode:', value: 'preferred_mode', className: 'js-preferred-mode' },
    { label: 'Connection Attempts:', value: 'connection_attempts', className: 'js-connection-attempts' },
    { label: 'State:', value: 'state', className: 'js-state' }
];

describe('WAN Cellular settings (WAN Config) tests', function () {

    it('should render Wan cellular setting components and call function when interface link clicked', sinon.test(function () {
        const spyInterfaceLink = this.spy();
        const spyOnrenderPassword = this.spy();

        class WanCellularSettingsParent extends React.Component {
            render() {
                return (
                    <WanCellularSettings
                        cellularSettings={cellularIntSettings}
                        goToInterface={spyInterfaceLink}
                        renderPassword={spyOnrenderPassword} />
                )
            }
        }
        const root = TestUtils.renderIntoDocument(<WanCellularSettingsParent/>);
        const header = TestUtils.findRenderedDOMComponentWithTag(root, 'h5');
        const interfaceLink = TestUtils.findRenderedDOMComponentWithClass(root, 'interface-link');
        expect(header.textContent).to.equal('Cellular 1');
        expect(interfaceLink.textContent).to.equal('cellular1');
        TestUtils.Simulate.click(interfaceLink);
        sinon.assert.calledOnce(spyInterfaceLink);
        sinon.assert.calledOnce(spyOnrenderPassword);
    }));

    it('verify all the settings is being rendered correctly', function () {
        let fakeFunc = function () {
        };
        const wrapper = shallow(<WanCellularSettings cellularSettings={cellularIntSettings}
            goToInterface={fakeFunc}
            renderPassword={fakeFunc} />);

        rows.forEach((row) => {
            expect(wrapper.find('.' + row.className + ' .js-label').text()).to.equal(row.label);
            if (row.value != 'apn_password') {
                expect(wrapper.find('.' + row.className + ' .js-value').text()).to.equal(cellularIntSettings[row.value]);
            }
        });
    });

});


