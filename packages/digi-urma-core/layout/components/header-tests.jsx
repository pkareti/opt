import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import Urma from 'meteor/digi:urma-core';
import {UrmaTest} from 'meteor/digi:urma-core';

let Header = Urma.Header;
let LoginButtons = Urma.LoginButtons;
let Navigation = Urma.Navigation;

describe('Header Component Tests', function () {
    let fakeLoginService = {
        login: ()=> {
        }, logout: ()=> {
        }
    };

    let routes = {
        path: '/',
        component: 'Wrapper',
        public: true
    };

    it('should render all header components', sinon.test(function () {
        class Wrapper extends React.Component {
            getChildContext() {
                return {
                    basePath: '/devices/123/TLR/',
                    devicePath: 'TLR'
                };
            }

            render() {
                return (
                    <Header title="My Title" logo="/images/logo.png" logoText="Digi Device" loginService={fakeLoginService} routes={routes}/>

                )
            }
        }

        Wrapper.childContextTypes = {
            basePath: React.PropTypes.string.isRequired,
            devicePath: React.PropTypes.string.isRequired
        };

        let root = TestUtils.renderIntoDocument(<Wrapper/>);
        let header = TestUtils.findRenderedComponentWithType(root, Header);
        let h2 = TestUtils.findRenderedDOMComponentWithTag(header, 'h2');
        let img = TestUtils.findRenderedDOMComponentWithTag(header, 'img');
        let loginButtons = TestUtils.findRenderedComponentWithType(header, LoginButtons);
        let navigation = TestUtils.findRenderedComponentWithType(header, Navigation);
        expect(h2.textContent).to.equal('Digi Device | My Title');
        expect(img.getAttribute('src')).to.equal('/images/logo.png');
        expect(loginButtons).to.exist;
        expect(loginButtons.props.loginService).to.equal(fakeLoginService);
        expect(navigation).to.exist;
        expect(navigation.props).to.have.all.keys(['routes']);

    }));

    it('should render without logo image', sinon.test(function () {
        class Wrapper extends React.Component {
            getChildContext() {
                return {
                    basePath: '/devices/123/TLR/',
                    devicePath: 'TLR'
                };
            }

            render() {
                return (
                    <Header title="My App" logoText="Digi Device" loginService={fakeLoginService} routes={routes}/>
                )
            }
        }

        Wrapper.childContextTypes = {
            basePath: React.PropTypes.string.isRequired,
            devicePath: React.PropTypes.string.isRequired
        };

        let root = TestUtils.renderIntoDocument(<Wrapper/>);
        let header = TestUtils.findRenderedComponentWithType(root, Header);
        let h2 = TestUtils.findRenderedDOMComponentWithTag(header, 'h2');
        let imgs = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
        let loginButtons = TestUtils.findRenderedComponentWithType(header, LoginButtons);
        expect(h2.textContent).to.equal('Digi Device | My App');
        expect(imgs.length).to.equal(0);
        expect(loginButtons).to.exist;
    }));

    it('should not render login buttons when no login service provided', sinon.test(function () {
        class Wrapper extends React.Component {
            getChildContext() {
                return {
                    basePath: '/devices/123/TLR/',
                    devicePath: 'TLR'
                };
            }

            render() {
                return (
                    <Header title="My App" logoText="Digi Device" routes={routes}/>
                )
            }
        }

        Wrapper.childContextTypes = {
            basePath: React.PropTypes.string.isRequired,
            devicePath: React.PropTypes.string.isRequired
        };

        let root = TestUtils.renderIntoDocument(<Wrapper/>);
        let header = TestUtils.findRenderedComponentWithType(root, Header);
        let h2 = TestUtils.findRenderedDOMComponentWithTag(header, 'h2');
        let imgs = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
        let loginButtons = TestUtils.scryRenderedComponentsWithType(header, LoginButtons);

        expect(h2.textContent).to.equal('Digi Device | My App');
        expect(imgs.length).to.equal(0);
        expect(loginButtons.length).to.equal(0);
    }));
});
