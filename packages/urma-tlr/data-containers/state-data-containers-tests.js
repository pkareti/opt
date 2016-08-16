import {expect} from 'chai';
import {getStateData,getMultipleStateData,getGroupData, getStateDataList} from './state-data-containers';

describe('State Data Container Tests', function () {
    let sandbox, stubState, stubSettings, onData, stateData, props, data, deviceCtx;

    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        // Meteor collection stubs
        let stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        let stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };

        // State collection
        stubState = {
            findOne: sandbox.stub(),
            find: sandbox.stub()
        };

        // Settings collection
        stubSettings = {
            findOne: sandbox.stub()
        };

        deviceCtx = {
            device: {
                SubsManager: stubSubsManager,
                State: stubState,
                Settings: stubSettings
            }
        };

        onData = sinon.spy();
    });
    it('should return state data', function () {
        stubState.findOne.returns({ cloudiness: 'cloudy' });
        props = {
            group: 'cloud',
            context: deviceCtx
        };
        data = {
            cloud: {
                cloudiness: 'cloudy'
            },
            ready: true
        };
        stateData = getStateData(props, onData);
        sinon.assert.calledWith(onData, null, data);

    });
    it('should return state data from multple groups', function () {
        stubState.findOne.onFirstCall().returns({ cloudiness: 'cloudy' });
        stubState.findOne.onSecondCall().returns({ raininess: 'not very' });
        props = {
            groups: ['cloud', 'rain'],
            context: deviceCtx
        };
        data = {
            cloud: {
                cloudiness: 'cloudy'
            },
            rain: {
                raininess: 'not very'
            },
            ready: true
        };

        stateData = getMultipleStateData(props, onData);
        sinon.assert.calledWith(onData, null, data);
    });
    it('should return state and settings data', function () {
        stubState.findOne.returns({ cloud_state: 'cloudy' });
        stubSettings.findOne.returns({ cloud_setting: 'so cloudy' });
        props = {
            group: 'cloud',
            context: deviceCtx
        };
        data = {
            cloud: {
                state: {
                    cloud_state: 'cloudy'
                },
                settings: {
                    cloud_setting: 'so cloudy'
                }
            },
            ready: true
        };
        stateData = getGroupData(props, onData);
        sinon.assert.calledWith(onData, null, data);
    });

    it('should return state and settings for different group names', function () {
        stubState.findOne.returns({ state_field: 'kittens' });
        stubSettings.findOne.returns({ settings_field: 'rainbows' });
        props = {
            stateSearch: { _groupName: 'eth' },
            settingsSearch: { _groupName: 'cellular' },
            context: deviceCtx
        };
        data = {
            [props.stateSearch._groupName]: {
                state: {
                    state_field: 'kittens'
                }
            },
            [props.settingsSearch._groupName]: {
                settings: {
                    settings_field: 'rainbows'
                }
            },
            ready: true
        };

        stateData = getGroupData(props, onData);
        sinon.assert.calledWith(onData, null, data);
    });

    it('should return a state data array', function () {
        let stubStateListCursor = { fetch: sinon.stub().returns([{ id: 1 }, { id: 2 }]) };
        stubState.find.returns(stubStateListCursor);
        props = {
            group: 'cloud',
            context: deviceCtx
        };
        data = {
            cloud: [
                {
                    id: 1
                },
                {
                    id: 2
                }
            ],
            ready: true
        };
        stateData = getStateDataList(props, onData);
        sinon.assert.calledWith(onData, null, data);
    });
});
