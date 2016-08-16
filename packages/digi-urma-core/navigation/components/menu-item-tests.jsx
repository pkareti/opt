import React from 'react';
import {Router, Link, browserHistory} from 'react-router';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import Urma from 'meteor/digi:urma-core';
import {UrmaTest} from 'meteor/digi:urma-core';

let MenuItem = UrmaTest.MenuItem;

describe('Menu Item Tests', function () {

    it('should contain all the menu items ', function () {
        let fakeMenuObj = {
            nav: {
                menuLabel: 'ITEM 3',
                image: 'vpn',
                value: 2,
                link: '/',
                order: 0
            }
        }
        class Wrapper extends React.Component {
            getChildContext() {
                return {
                    basePath: '/devices/123/TLR/',
                    devicePath: 'TLR'
                };
            }

            render() {
                return (
                    <MenuItem key="wan" level={1} menuItem={fakeMenuObj}/>
                )
            }
        }

        Wrapper.childContextTypes = {
            basePath: React.PropTypes.string.isRequired,
            devicePath: React.PropTypes.string.isRequired
        };

        let root = TestUtils.renderIntoDocument(<Wrapper/>);
        let header = TestUtils.findRenderedComponentWithType(root, MenuItem);
        let menuImage = TestUtils.findRenderedDOMComponentWithClass(header, 'iconWrap');
        let menuLabel = TestUtils.findRenderedDOMComponentWithClass(header, 'iconLabel');
        let menuBadge = TestUtils.findRenderedDOMComponentWithClass(header, 'badge');

        expect(menuImage).to.not.be.undefined;
        expect(menuLabel).to.not.be.undefined;
        expect(menuBadge).to.not.be.undefined;
    });

    it('should not display alerts if no value is specified for menu item', function () {
        let fakeMenuObj = {
            nav: {
                menuLabel: 'ITEM 3',
                image: 'vpn',
                link: '/',
                order: 0
            }
        }
        class Wrapper extends React.Component {
            getChildContext() {
                return {
                    basePath: '/devices/123/TLR/',
                    devicePath: 'TLR'
                };
            }

            render() {
                return (
                    <MenuItem key="wan" level={1} menuItem={fakeMenuObj}/>
                )
            }
        }

        Wrapper.childContextTypes = {
            basePath: React.PropTypes.string.isRequired,
            devicePath: React.PropTypes.string.isRequired
        };

        let root = TestUtils.renderIntoDocument(<Wrapper/>);
        let header = TestUtils.findRenderedComponentWithType(root, MenuItem);
        let menuImage = TestUtils.findRenderedDOMComponentWithClass(header, 'iconWrap');
        let menuLabel = TestUtils.findRenderedDOMComponentWithClass(header, 'iconLabel');
        let spans = TestUtils.scryRenderedDOMComponentsWithTag(header, 'span');
        let menuBadge = spans.find((span)=> {
            return span.className == "badge"
        });
        expect(menuImage).to.not.be.undefined;
        expect(menuLabel).to.not.be.undefined;
        expect(menuBadge).to.be.undefined;
    });

});
