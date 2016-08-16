import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Interfaces from './interfaces.jsx';
import Cellular from './cellular.jsx';
import Wifi from './wifi.jsx'

describe('Interface tests', function () {
    
    // Define some stubs for functionality used by components.
    let sandbox, stubState, stubSetting, stubPush;
    let deviceCtx;
    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        stubPush = sandbox.stub();

        // Meteor collection stubs
        let stubSubscriptionStub = {ready: sandbox.stub().returns(true)};
        let stubSubsManager = {subscribe: sandbox.stub().returns(stubSubscriptionStub)};
        let stubSettingsListCursor = {
            fetch: sinon.stub()
        };
        
        // State collection
        stubState = {
            find: sandbox.stub(),
            findOne: sandbox.stub()
        };
        // Settings collection
        stubSetting = {
            find: sandbox.stub(),
            update: sandbox.stub(),
            findOne: sandbox.stub()
        };
       
        stubSetting.find.returns(stubSettingsListCursor);

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

    afterEach(()=> {
        sandbox.restore();
    });

    class InterfaceParent extends React.Component {
        getChildContext() {
            return deviceCtx;
        }

        render(){
            return (
                <Interfaces/>
            )
        }
    }

    InterfaceParent.childContextTypes = {
        device: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired,
    };

    it('should render all Wan Cellular components', function () {
        let wrapper = shallow(<InterfaceParent/>);
        let CellularComp = wrapper.find(Cellular);
        let WifiComp = wrapper.find(Wifi);
        expect(CellularComp).to.not.be.undefined;
        expect(WifiComp).to.not.be.undefined;
    });
});
