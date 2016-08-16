import React from 'react';
import {Router, Link, browserHistory} from 'react-router';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import Urma from 'meteor/digi:urma-core';
import {UrmaTest} from 'meteor/digi:urma-core';

let Navigation = Urma.Navigation;
let RouterHelper = new Urma.RouterHelper();

describe('Navigation Tests', function () {
    let root, nav;
    let deviceCtx = {
        env: 'device',
        deviceID: '123',
        SubsManager: null,
        Settings: {},
        State: {},
        Files: {}
    };

    class Wrapper extends React.Component {
        getChildContext() {
            return {
                basePath: '/',
                devicePath: 'TLR',
                device: deviceCtx
            };
        }

        render() {
            return (
                <Navigation routes={routes}/>

            )
        }
    }
    Wrapper.childContextTypes = {
        basePath: React.PropTypes.string.isRequired,
        devicePath: React.PropTypes.string.isRequired,
        device: React.PropTypes.object.isRequired
    };

    let routes = {
        path: '/',
        component: Wrapper,
        public: true,
        indexRoute: {
            name: 'home',
            public: true,
            nav: {
                menuLabel: 'Home',
                order: 0
            }
        },
        childRoutes: [
            {
                name: 'security',
                path: '/security',
                public: true,
                nav: {
                    menuLabel: 'Security',
                    order: 0
                }
            }
        ]
    };

    beforeEach(function () {
        RouterHelper.configureRoutes(routes, '/');
    });

    afterEach(function () {
        RouterHelper._mainMenuItems = [];
    });

    it('should contain navigation element', sinon.test(function () {
        let stubUser = this.stub(Meteor, "user", ()=> {
            return {username: 'user'}
        });
        let root = TestUtils.renderIntoDocument(<Router routes={routes} history={browserHistory}/>);
        let nav = TestUtils.findRenderedComponentWithType(root, Navigation);
        let menuEl = TestUtils.findRenderedDOMComponentWithClass(nav, 'nav-menu');
        expect(menuEl).to.not.be.undefined;
    }));

    it('should render menu items if routes configured', sinon.test(function () {
        let stubUser = this.stub(Meteor, "user", ()=> {
            return {username: 'user'}
        });
        let root = TestUtils.renderIntoDocument(<Router routes={routes} history={browserHistory}/>);
        let nav = TestUtils.findRenderedComponentWithType(root, Navigation);
        let menuItemsAsReactEls = nav.renderMenuItems();
        expect(menuItemsAsReactEls.length).to.equal(2);
    }));

    it('should hide menu items when not logged in', sinon.test(function () {
        let stubUser = this.stub(Meteor, "user", ()=> {
            return null
        });
        let root = TestUtils.renderIntoDocument(<Router routes={routes} history={browserHistory}/>);
        let nav = TestUtils.findRenderedComponentWithType(root, Navigation);
        sinon.assert.calledOnce(stubUser);

        // when not Logged In no menu items should be shown.
        let ul = TestUtils.scryRenderedDOMComponentsWithTag(nav, 'ul');
        expect(ul.length).to.equal(0);
    }));

    it('should render menu items when logged in', sinon.test(function () {
        let stubUser = this.stub(Meteor, "user", ()=> {
            return {username: 'user'}
        });
        let root = TestUtils.renderIntoDocument(<Router routes={routes} history={browserHistory}/>);
        let nav = TestUtils.findRenderedComponentWithType(root, Navigation);
        let menuItems = TestUtils.findRenderedDOMComponentWithClass(nav, 'nav-menu-list');
        sinon.assert.calledOnce(stubUser);
        expect(menuItems).to.not.be.undefined;
    }));
});
