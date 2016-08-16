import { expect } from 'chai';
import { getCustomData } from './custom-data-containers.js';


describe('Custom Data Container Tests', function () {

    let sandbox, stubState, stubSettings, onData, deviceCtx;

    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        // Meteor collection stubs
        const stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        const stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };

        // State collection
        stubState = {
            findOne: sandbox.stub(),
            find: sandbox.stub(),
        };

        // Settings collection
        stubSettings = {
            findOne: sandbox.stub(),
            find:sandbox.stub(),
        };

        deviceCtx = {
            SubsManager: stubSubsManager,
            State: stubState,
            Settings: stubSettings
        };

        onData = sinon.spy();
    });

    it('should return data for any groups passed', function () {
        stubState.findOne.returns({ stateField: 'stateFieldValue' });
        stubSettings.findOne.returns({ settingsField: 'settingsFieldValue' });

        const props = {
            context: {
                device: deviceCtx,
            },
            getData: {
                eth: {
                    groupIndex: 0,
                    collections: ['state', 'settings']
                },
                wan: {
                    groupIndex: 0,
                    collections: ['settings']
                }
            }
        };

        const expectedData = {
            ready: true,
            dataReady: true,
            eth: {
                settings: {
                    _ready: true,
                    _dataReady: true,
                    settingsField: 'settingsFieldValue'
                },
                state: {
                    _ready: true,
                    _dataReady: true,
                    stateField: 'stateFieldValue'
                },
            },
            wan: {
                settings: {
                    _ready: true,
                    _dataReady: true,
                    settingsField: 'settingsFieldValue'
                },
            }
        };

        const data = getCustomData(props, onData);
        sinon.assert.calledWith(onData, null, expectedData);
    });

    it('should handle invalid collections', function () {
        const props = {
            context: {
                device: deviceCtx,
            },
            getData: {
                eth: {
                    groupIndex: 0,
                    collections: ['unsupported_collection', 'settings']
                },
                wan: {
                    groupIndex: 0,
                    collections: ['settings']
                }
            }
        };

        const expectedData = {
            ready: false,
            dataReady: false
        };

        const data = getCustomData(props, onData);
        sinon.assert.calledWith(onData, null, expectedData);
    });

    it('should return all data for any groups passed if no group index is passed', function () {

        const stubSettingsListCursor = {
            fetch: sinon.stub().returns([
                { id: 1, settingsField: 'settingsFieldValue1' },
                { id: 2, settingsField: 'settingsFieldValue2' }
            ])
        };
        const stubStateListCursor = {
            fetch: sinon.stub().returns([
                { id: 1, stateField: 'stateFieldValue1' },
                { id: 2, stateField: 'stateFieldValue2' }
            ])
        };
        stubState.findOne.returns({ stateField: 'stateFieldValue' });
        stubSettings.findOne.returns({ settingsField: 'settingsFieldValue' });
        stubSettings.find.returns(stubSettingsListCursor);
        stubState.find.returns(stubStateListCursor);

        const props = {
            context: {
                device: deviceCtx,
            },
            getData: {
                eth: {
                    groupIndex: 0,
                    collections: ['state', 'settings']
                },
                wan: {
                    collections: ['state', 'settings']
                },
                cellular: {
                    groupIndex: 0,
                    collections: ['settings']
                }
            }
        };

        const expectedData = {
            ready: true,
            dataReady: true,
            eth: {
                settings: {
                    _ready: true,
                    _dataReady: true,
                    settingsField: 'settingsFieldValue'
                },
                state: {
                    _ready: true,
                    _dataReady: true,
                    stateField: 'stateFieldValue'
                },
            },
            wan: {
                settings: [
                    { id: 1, settingsField: 'settingsFieldValue1' },
                    { id: 2, settingsField: 'settingsFieldValue2' }
                ],
                state: [
                    { id: 1, stateField: 'stateFieldValue1' },
                    { id: 2, stateField: 'stateFieldValue2' }
                ],
            },
            cellular: {
                settings: {
                    _ready: true,
                    _dataReady: true,
                    settingsField: 'settingsFieldValue'
                },
            }
        };

        expectedData.wan.settings._ready = true;
        expectedData.wan.settings._dataReady = true;
        expectedData.wan.state._ready = true;
        expectedData.wan.state._dataReady = true;

        const data = getCustomData(props, onData);
        sinon.assert.calledWith(onData, null, expectedData);
    });
});
