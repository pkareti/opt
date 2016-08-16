import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Accordion from './accordion.jsx';
import { messageDefaults } from './accordion.jsx';
import { shallow, mount } from 'enzyme';
import { supportedStatuses } from './status.jsx';


describe('Accordion Tests', function () {

    it('should open and close when linked on arrow', sinon.test(function () {

        let accordion = TestUtils.renderIntoDocument(<Accordion title="my title">I AM THE CONTENT</Accordion>);
        let arrowLink = TestUtils.findRenderedDOMComponentWithClass(accordion, 'expander-trigger');

        let divs = TestUtils.scryRenderedDOMComponentsWithTag(accordion, 'div');
        let content = divs.find((div)=> {
            return div.className == 'accordion-content';
        });
        expect(content).to.be.undefined;

        TestUtils.Simulate.click(arrowLink);

        divs = TestUtils.scryRenderedDOMComponentsWithTag(accordion, 'div');
        content = divs.find((div)=> {
            return div.className == 'accordion-content';
        });
        expect(content).to.not.be.undefined;

    }));

    it('should have icon in title when passed in prop', sinon.test(function () {
        let accordion = TestUtils.renderIntoDocument(<Accordion title="I have image" icon="ethernet.png"/>);
        let img = TestUtils.scryRenderedDOMComponentsWithTag(accordion, 'img');
        expect(img).not.to.be.undefined;
    }));

    it('should have all buttons when buttons are passed in props and are shown only when expanded', sinon.test(function () {
        const fakeFunc = () => {
        };
        let buttonsArr = [
            {
                buttonText: 'Apply',
                onclick: fakeFunc,
                className: 'btn-blue'
            },
            {
                buttonText: 'Cancel',
                onclick: fakeFunc,
                className: 'btn-gray'
            },
        ];
        let accordion = TestUtils.renderIntoDocument(<Accordion title="I have Buttons" buttons={buttonsArr}/>);
        let arrowLink = TestUtils.findRenderedDOMComponentWithClass(accordion, 'expander-trigger');
        expect(arrowLink.textContent).to.equal('I have Buttons');
        TestUtils.Simulate.click(arrowLink);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(accordion, 'button');
        expect(buttons).not.to.be.undefined;
        expect(buttons.length).to.equal(2);
        expect(buttons[0].className).to.equal('btn-blue');
        expect(buttons[1].className).to.equal('btn-gray');
    }));

    it('should have the state active if a query is present in the url', sinon.test(function () {
        const location = {
            query: {open: 'wan1'}
        };

        let accordion = shallow(<Accordion name='wan1' title="my title" location={location}>CONTENT</Accordion>);
        expect(accordion.state().active).to.eql(true);

        location.query.open = 'wan2';
        accordion.setProps({location});  // prop change won't change initial state
        expect(accordion.state().active).to.eql(true);

        accordion.unmount();
        accordion = shallow(<Accordion name='wan1' title="my title" location={location}>CONTENT</Accordion>);
        expect(accordion.state().active).to.eql(false);
    }));

    it('should show messages when provided a message type', function () {
        const message = {type: 'success'};
        const accordion = shallow(<Accordion name='wan1' title="message test" message={message}>CONTENT</Accordion>);

        // open modal for unit test
        accordion.setState({active: true});

        expect(accordion.find('.js-submit-message').text()).to.equal(messageDefaults.success.text);
        expect(accordion.find('.js-submit-message').find('p').hasClass(messageDefaults.success.class)).to.equal(true);
        const component = accordion.instance();

        accordion.setProps({message: {type: 'error'}});
        expect(accordion.find('.js-submit-message').text()).to.equal(messageDefaults.error.text);
        expect(accordion.find('.js-submit-message').find('p').hasClass(messageDefaults.error.class)).to.equal(true);

        const customText = 'I\'m a custom error';
        accordion.setProps({message: {type: 'error', text: customText}});
        expect(accordion.find('.js-submit-message').text()).to.equal(customText);
        expect(accordion.find('.js-submit-message').find('p').hasClass(messageDefaults.error.class)).to.equal(true);

        const customClass = 'custom-class';
        accordion.setProps({message: {class: customClass, text: customText}});
        expect(accordion.find('.js-submit-message').text()).to.equal(customText);
        expect(accordion.find('.js-submit-message').find('p').hasClass(customClass)).to.equal(true);
    });

    it('should still render if invalid message provided', function () {
        const message = {wrongProperty: 'This isn\'t where a message belongs!'};
        const accordion = shallow(<Accordion name='wan1' title="message test" message={message}>CONTENT</Accordion>);

        // open modal for unit test
        accordion.setState({active: true});

        // message won't be displayed and accordion still renders
        expect(accordion.find('.accordion-content').length).to.equal(1);
        expect(accordion.find('.js-submit-message').find('p').length).to.equal(0);
    });

    it('should display status icon and messages if "status" prop passed', function () {
        // test display of default error message
        const status = { type: 'error' };
        const accordion = mount(<Accordion name="wan1" title="message test" status={status}>CONTENT</Accordion>);
        expect(accordion.find('.js-accordion-status').text()).to.equal(supportedStatuses[status.type].text);

        // test display of error message with custom text
        accordion.setProps({ status: { type: 'error', text: 'custom error text' } });
        expect(accordion.find('.js-accordion-status').text()).to.equal('custom error text');

        // if no type provided,
        accordion.setProps({ status: { text: 'some text', icon: 'status-custom' } });
        expect(accordion.find('.js-accordion-status').text()).to.equal('some text');
        expect(accordion.find('.js-accordion-status').find('span').hasClass('status-custom')).to.equal(true);

        // test passing invalid type (should return null)
        accordion.setProps({ status: { type: 'invalid' } });
        expect(accordion.find('.js-accordion-status').length).to.equal(0); // not text passed (default empty)

        // test passing no type and omit text  (should return null)
        accordion.setProps({ status: { icon: 'status-custom' } });
        expect(accordion.find('.js-accordion-status').length).to.equal(0);

        // test passing no type and omit text  (should return null)
        accordion.setProps({ status: { text: 'forgot to include icon' } });
        expect(accordion.find('.js-accordion-status').length).to.equal(0); // not text passed (default empty)
    });
});
