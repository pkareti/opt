import React from 'react';
import {Router, Link, browserHistory} from 'react-router';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import Urma from 'meteor/digi:urma-core';
import { UrmaTest } from 'meteor/digi:urma-core';
import { retainQueryParams } from './wizard-buttons.jsx';

let Wizard = Urma.Wizard;
let WizardButtons = UrmaTest.WizardButtons;
let WizardLogout = UrmaTest.WizardLogout;

describe('Wizard Tests', function () {
    let sandbox, root, parent, stubUser, wizard, wizardbuttons, buttonLinks, nextButton, transitionToNextStub;

    let stubSubscriptionStub = {ready: sinon.stub().returns(true)};
    let stubSubsManager = {subscribe: sinon.stub().returns(stubSubscriptionStub)};
    let stubState = {
        findOne: sinon.stub()
    };
    stubState.findOne.withArgs({_groupName: 'system'}).returns({_id: 1, model: 'LR54'});


    let deviceCtx = {
        env: 'device',
        deviceID: '123',
        SubsManager: stubSubsManager,
        Settings: {},
        State: stubState,
        Files: {}
    };

    class Parent extends React.Component {
        getChildContext() {
            return {
                device: deviceCtx
            };
        }

        render() {
            const currentLocation = {pathname: '/', query: {}}; // stub of props.location
            return (
                <Wizard location={currentLocation}/>
            )
        }
    }

    Parent.childContextTypes = {
        device: React.PropTypes.object.isRequired
    };

    let routes = {
        path: '/',
        public: true,
        component: Parent,
        indexRoute: {
            name: 'wizard',
            public: true,
            component: Wizard
        }
    };

    let onNextFalse = ()=> {
        return {
            transitionToNext: false
        }
    };

    let onNextTrue = ()=> {
        return {
            transitionToNext: true
        }
    };

    let onNext = {
        onNextFalse: onNextFalse,
        onNextTrue: onNextTrue
    };

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        stubUser = sandbox.stub(Meteor, "user", ()=> {
            return {username: 'user'}
        });

        root = TestUtils.renderIntoDocument(<Router routes={routes} history={browserHistory}/>);
        parent = TestUtils.findRenderedComponentWithType(root, Parent);
        wizard = TestUtils.findRenderedComponentWithType(parent, Wizard);
        wizardbuttons = TestUtils.findRenderedComponentWithType(root, WizardButtons);
        nextButton = TestUtils.findRenderedDOMComponentWithClass(wizardbuttons, 'next');
        transitionToNextStub = sandbox.stub(Wizard.prototype, 'transitionToNext', ()=> {
            return
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should only have next links', function () {
        wizard.buttonConfig(null, '/nextpage');
        buttonLinks = TestUtils.scryRenderedDOMComponentsWithTag(wizardbuttons, 'button');

        expect(buttonLinks.length).to.equal(1);
        expect(buttonLinks[0].textContent).to.equal('next');

    });
    it('should have back and next links', function () {
        wizard.buttonConfig('/prevpage', '/nextpage');
        buttonLinks = TestUtils.scryRenderedDOMComponentsWithTag(wizardbuttons, 'button');

        expect(buttonLinks.length).to.equal(2);
        expect(buttonLinks[0].textContent).to.equal('back');
        expect(buttonLinks[1].textContent).to.equal('next');
    });
    it('should have custom button text', function () {
        wizard.buttonConfig({pathname: '/prevpage', text: 'Previous'}, {pathname: '/', text: 'Dashboard'});
        buttonLinks = TestUtils.scryRenderedDOMComponentsWithTag(wizardbuttons, 'button');

        expect(buttonLinks.length).to.equal(2);
        expect(buttonLinks[0].textContent).to.equal('Previous');
        expect(buttonLinks[1].textContent).to.equal('Dashboard');
    });
    it('should disable next', function () {
        wizard.disableNext();
        let button = TestUtils.scryRenderedDOMComponentsWithTag(wizardbuttons, 'button');
        expect(button[1].getAttribute('disabled')).to.exist;

        wizard.enableNext();
        expect(button[1].getAttribute('disabled')).to.not.exist;
    });
    it('should call onNext function but not transitionToNext', function () {
        let onNextFalseSpy = sandbox.spy(onNext, 'onNextFalse');

        wizard.buttonConfig('/prevpage', '/nextpage', onNext.onNextFalse);

        TestUtils.Simulate.click(nextButton);

        sinon.assert.calledOnce(onNextFalseSpy);
        expect(transitionToNextStub.callCount).to.equal(0);
    });
    it('should call onNext function and TransitionToNext', function () {
        let onNextTrueSpy = sandbox.spy(onNext, 'onNextTrue');

        wizard.buttonConfig('/prevpage', '/nextpage', onNext.onNextTrue);

        TestUtils.Simulate.click(nextButton);

        sinon.assert.calledOnce(onNextTrueSpy);
        sinon.assert.calledOnce(transitionToNextStub);

    });
    it('should call TransitionToNext', function () {
        wizard.buttonConfig('/prevpage', '/nextpage');

        TestUtils.Simulate.click(nextButton);

        sinon.assert.calledOnce(transitionToNextStub);
    });
    it('should show log out button if user logged in ', function () {
        let wizardLogout = TestUtils.findRenderedComponentWithType(wizard, WizardLogout);
        let logoutBtn = TestUtils.findRenderedDOMComponentWithTag(wizardLogout, 'button');

        let loginService = wizardLogout.loginService();
        let stubLogout = sandbox.stub(loginService, 'logout');

        expect(logoutBtn.textContent).to.equal('Logout');

        TestUtils.Simulate.click(logoutBtn);

        sinon.assert.calledOnce(stubLogout);
    });

    it('"retainQueryParams" should add url query params if passed in buttonConfig', function () {
        const configPathObj = {
            pathname: '/nextpage',
            query: {example: 'abc'}
        };
        const configPathString = '/nextpage?example=xyz';
        const currentLocation = {pathname: '/', query: {}}; // stub of props.location

        const path1 = retainQueryParams(configPathObj, currentLocation);
        const path2 = retainQueryParams(configPathString, currentLocation);
        expect(path1.query.example).to.equal('abc');
        expect(path2.query.example).to.equal('xyz');
    });

    it('should retain exisiting query params (if exists) if no query in next path', function () {
        // stub of props.location
        const currentLocation = {
            pathname: '/currentpage',
            query: {example: 'im-still-here'}
        };

        const configPathString = '/noquerypath';
        const configPathObj = {pathname: '/noquerypath', query: {}};
        const path1 = retainQueryParams(configPathString, currentLocation);
        const path2 = retainQueryParams(configPathObj, currentLocation);
        expect(path1.query.example).to.equal('im-still-here');
        expect(path2.query.example).to.equal('im-still-here');
    });

    it('should overwrite existing query param, if same query name with new value passed to'
        + ' button config', function () {
        const currentLocation = {
            pathname: '/currentpage',
            query: {example: 'overwrite-me'}
        };
        const configPathString = '/noquerypath?example=new-query';
        const configPathObj = {pathname: '/noquerypath', query: {example: 'new-query'}};
        const path1 = retainQueryParams(configPathString, currentLocation);
        const path2 = retainQueryParams(configPathObj, currentLocation);
        expect(path1.query.example).to.equal('new-query');
        expect(path2.query.example).to.equal('new-query');
    });
});
