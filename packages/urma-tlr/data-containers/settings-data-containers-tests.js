import {expect} from 'chai';
import {getSettingsDataList} from './settings-data-containers';

describe('Settings Data Container Tests', function () {
    let sandbox, stubSettings, onData, props, data, deviceCtx;

    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        // Meteor collection stubs
        let stubSubscriptionStub = { ready: sandbox.stub().returns(true) };
        let stubSubsManager = { subscribe: sandbox.stub().returns(stubSubscriptionStub) };

        // Settings collection
        stubSettings = {
            findOne: sandbox.stub(),
            find: sandbox.stub()
        };

        deviceCtx = {
            device: {
                SubsManager: stubSubsManager,
                Settings: stubSettings
            }
        };

        onData = sinon.spy();
    });

    it('should return a settings data array', function () {
        let stubSettingsListCursor = {
            fetch: sinon.stub().returns([{ id: 1, interface: 'eth1' }, {
                id: 2,
                interface: 'cellular1'
            }])
        };
        stubSettings.find.returns(stubSettingsListCursor);
        props = {
            group: 'wan',
            context: deviceCtx
        };
        data = {
            wan: [
                {
                    id: 1,
                    interface: 'eth1'
                },
                {
                    id: 2,
                    interface: 'cellular1'
                }
            ],
            ready: true
        };
        settingsData = getSettingsDataList(props, onData);
        sinon.assert.calledWith(onData, null, data);
    });
});