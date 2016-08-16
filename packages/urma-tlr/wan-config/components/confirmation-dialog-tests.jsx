import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {render, shallow, mount} from 'enzyme';
import * as moment from 'moment';
import {ConfirmDialog} from './confirmation-dialog.jsx';

describe('Confirmation Dialog tests', function () {
    it('should render all Confirmation Dialog components', function () {
        let fakeFunc = function () {
        };
        let wrapper = render(<ConfirmDialog onDialogCancel={fakeFunc}
            onDialogOk={fakeFunc}
            header='I am the header'
            message='I am the message'/>);
        let header = wrapper.find('h5');
        let message = wrapper.find('.confirmation-msg p');
        let okBtn = wrapper.find('#okBtn');
        let cancelBtn = wrapper.find('#cancelBtn');
        expect(okBtn).to.not.be.undefined;
        expect(cancelBtn).to.not.be.undefined;
        expect(header.text()).to.equal('I am the header');
        expect(message.text()).to.equal('I am the message');
    });

    it('should call ok and cancel functions on button click', sinon.test(function () {
        let spyOnCancel = this.spy();
        let spyOnOk = this.spy();
        let wrapper = mount(<ConfirmDialog onDialogCancel={spyOnCancel}
            onDialogOk={spyOnOk}
            header='I am the header'
            message='I am the message'/>);
        wrapper.find('#okBtn').simulate('click');
        sinon.assert.calledOnce(spyOnOk);
        wrapper.find('#cancelBtn').simulate('click');
        sinon.assert.calledOnce(spyOnCancel);
    }));
});

