import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {UrmaTest} from 'meteor/digi:urma-core';

let MainContent = UrmaTest.MainContent;

describe('Main Content Component Tests', function () {
    class Child extends React.Component {
        render() {
            return <div>child</div>
        }
    }

    it('should render components with open state', sinon.test(function () {
        var children = React.createElement(Child); // just one child
        let root = TestUtils.renderIntoDocument(<MainContent children={children}/>);

        let main = TestUtils.findRenderedDOMComponentWithClass(root, 'main-container');
        let child = TestUtils.findRenderedComponentWithType(root, Child);

        expect(main).to.exist;
        expect(child).to.exist;
    }));
});
