import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CellularInfo from './cellular.jsx';
import CellularConfigure from './cellular-config.jsx';
import CellularDetails from './cellular-details.jsx';
import { cellularSettings, cellularState } from './cellular-tests-data.js';

const wanCellularSub = {
    cellular: {
        collections: ['settings', 'state'],
        options: {
            sort: { _groupIndex: 1 }
        }
    },
    wan: {
        collections: ['settings'],
        options: {
            sort: { _groupIndex: 1 }
        }
    }
};

const location = {};

let fakeFunc = function () {};

describe('Interface Cellular tests', function () {

    // Define some stubs for functionality used by components created under cellular.
    let sandbox, stubState, stubSetting, stubPush, stubOnsetWrapperState;
    let deviceCtx;
    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        stubOnsetWrapperState = sandbox.stub();
        stubPush = sandbox.stub();

        // Meteor collection stubs
        let stubSubscriptionStub = {ready: sandbox.stub().returns(true)};
        let stubSubsManager = {subscribe: sandbox.stub().returns(stubSubscriptionStub)};

        // State collection
        stubState = {
            findOne: sandbox.stub(),
            find: sandbox.stub()
        };
        // Settings collection
        stubSetting = {
            findOne: sandbox.stub(),
            find: sandbox.stub(),
            update: sandbox.stub()
        };

        const stubSettingsListCursor = {
            fetch: sinon.stub().returns(cellularSettings)
        };
        stubSetting.find.returns(stubSettingsListCursor);
        stubSetting.findOne.returns(cellularSettings[0]);

        const stubStateListCursor = {
            fetch: sinon.stub().returns(cellularState)
        };
        stubState.find.returns(stubStateListCursor);
        stubState.findOne.returns(cellularState[0]);

        deviceCtx = {
            device: {
                SubsManager: stubSubsManager,
                Settings: stubSetting,
                State: stubState
            },
            router: {
                push: stubPush
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    class CellularParent extends React.Component {
        render() {
            return (
                <CellularInfo
                    getData={wanCellularSub}
                    context={deviceCtx}
                    onUpdateComplete={fakeFunc}
                    setWrapperState={stubOnsetWrapperState}
                    location={location}
                    renderPassword={fakeFunc}/>
            )
        }
    }

    it('should render all Interface Cellular components only when expanded', function () {
        let wrapper = mount(<CellularParent/>);
        //toggle accordion
        wrapper.find('.expander-trigger').simulate('click');
        let buttons = wrapper.find('button');
        let CellularDetailsComp = wrapper.find(CellularDetails);
        let CellularConfigComp = wrapper.find(CellularConfigure);
        expect(buttons).to.not.be.undefined;
        expect(CellularDetailsComp).to.not.be.undefined;
        expect(CellularConfigComp).to.not.be.undefined;
    });

    it('should call update cellular settings with correct cellular form values after apply button is clicked', sinon.test(function () {
        let wrapper = mount(<CellularParent/>);
        let modifiedObj = {
            description: 'my description',
            apn: '1265.mcs',
            state: 'off',
            apn_password: 'P@ssw0rd',
            preferred_mode: '3g',
            connection_attempts: 12,
        };

        //toggle accordion
        wrapper.find('.expander-trigger').simulate('click');
        let radioButton = wrapper.find('.js-cellular-2 .js-selection .js-radio-2');
        radioButton.find('input').simulate('change', {target: {checked: true}});

        let editForm = wrapper.find('.js-cellular-edit .cellular-edit-form');
        let description = editForm.find('.js-input-description');
        let apn = editForm.find('.js-input-apn');
        let apnPassword = editForm.find('.js-input-apnPassword');
        let connectionAttempts = editForm.find('.js-input-connectionAttempts');
        let preferredMode = editForm.find('.js-input-preferredMode');

        description.find('textarea').simulate('change', {target: {value: 'my description'}});
        apn.find('input').simulate('change', {target: {value: '1265.mcs'}});
        apnPassword.find('input').simulate('change', {target: {value: 'P@ssw0rd'}});
        connectionAttempts.find('input').simulate('change', {target: {value: 12}});
        preferredMode.find('select').simulate('change', {target: {value: '3g'}});

        wrapper.find('.js-apply').simulate('click');
        sinon.assert.calledOnce(stubSetting.update);
        sinon.assert.calledWith(stubSetting.update, 2, {$set: modifiedObj});
    }));

    it('should reset cellular edit form values after cancel button is clicked', function () {
        let wrapper = mount(<CellularParent/>);
        wrapper.find('.expander-trigger').simulate('click');
        let editForm = wrapper.find('.js-cellular-edit .cellular-edit-form');
        let description = editForm.find('.js-input-description');
        let apn = editForm.find('.js-input-apn');
        description.find('textarea').simulate('change', {target: {value: 'my description'}});
        apn.find('input').simulate('change', {target: {value: '1265.mcs'}});

        wrapper.find('.js-cancel').simulate('click');
        expect(description.find('textarea').node.value).to.equal('cellular1');
        expect(apn.find('input').node.value).to.equal('vzwinternet');
    });

    it('should display error when a form with errors is submitted', sinon.test(function () {
        let wrapper = mount(<CellularParent/>);
        const errorMessage = 'Please correct highlighted errors.';

        //toggle accordion
        wrapper.find('.expander-trigger').simulate('click');
        let editForm = wrapper.find('.js-cellular-edit .cellular-edit-form');
        let connectionAttempts = editForm.find('.js-input-connectionAttempts');
        connectionAttempts.find('input').simulate('change', {target: {value: '550'}});
        wrapper.find('.js-apply').simulate('click');
        let message = wrapper.find('.js-submit-message');
        expect(message.text()).to.be.equal(errorMessage);
        sinon.assert.notCalled(stubSetting.update);

        // clear form and verify that error message clears
        wrapper.find('.js-cancel').simulate('click');
        message = wrapper.find('.js-submit-message');
        expect(message.text()).to.be.equal('');

        connectionAttempts.find('input').simulate('change', {target: {value: '12'}});
        wrapper.find('.js-apply').simulate('click');
        sinon.assert.calledThrice(stubSetting.update);
    }));

    it('display accordion status for "up" interfaces', function () {
        // by default, test data has no errors.  Verify OK status displayed
        const wrapper = mount(<CellularParent />);
        const status = wrapper.find('.js-accordion-status');
        expect(status.text()).to.equal('OK');
    });

    it('display accordion status for "down" interfaces', function () {
        // change oper_status to down
        const cellularStateCopy = _.clone(cellularState);
        cellularStateCopy[0].oper_status = 'down';
        const stubStateListCursor = {
            fetch: sinon.stub().returns(cellularStateCopy)
        };
        stubState.find.returns(stubStateListCursor);

        const wrapper = mount(<CellularParent />);
        const status = wrapper.find('.js-accordion-status');
        expect(status.text()).to.equal('Down');
    });
});
