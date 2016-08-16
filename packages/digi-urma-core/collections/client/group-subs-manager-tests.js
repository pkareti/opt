import GroupSubsManager from './group-subs-manager.js';
import {expect} from 'chai';

describe('GroupSubsManager', () => {
    let subsMgr;
    let subscription = {ready: true};

    beforeEach(function () {
        subsMgr = {
            subscribe: sinon.stub().returns(subscription),
            reset: sinon.spy(),
            clear: sinon.spy(),
            ready: sinon.spy()
        };
    });

    it('subscribe should handle undefined, null, and empty search and options parameters', function () {
        let wrapper = new GroupSubsManager(subsMgr);
        wrapper.subscribe('settings');
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings');
        subsMgr.subscribe.reset();
        wrapper.subscribe('settings', null);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', null);
        subsMgr.subscribe.reset();
        wrapper.subscribe('settings', {});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', {});
        subsMgr.subscribe.reset();
        wrapper.subscribe('settings', {}, null);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', {}, null);
        subsMgr.subscribe.reset();
        wrapper.subscribe('settings', null, null);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', null, null);
        subsMgr.subscribe.reset();
        wrapper.subscribe('settings', null, {});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', null, {});
    });

    it('subscribe should remove all but _groupName from search criteria', function () {
        let wrapper = new GroupSubsManager(subsMgr);
        wrapper.subscribe('settings', {_groupName: 'goober'});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', {_groupName: 'goober'}, {});
        subsMgr.subscribe.reset();
        wrapper.subscribe('state', {_groupIndex: 1, _groupName: 'goober', a: 'b'});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'state', {_groupName: 'goober'}, {});
    });

    it('subscribe should always send only refreshInterval option for _groupName search', function () {
        let wrapper = new GroupSubsManager(subsMgr);
        wrapper.subscribe('state', {_groupName: 'goober', a: 'b'}, null);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'state', {_groupName: 'goober'}, {});
        subsMgr.subscribe.reset();
        wrapper.subscribe('state', {_groupName: 'goober', a: 'b'}, {fields: {a: 1, b: 1}});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'state', {_groupName: 'goober'}, {});
        subsMgr.subscribe.reset();
        wrapper.subscribe('state', {_groupName: 'goober', a: 'b'}, {fields: {a: 1, b: 1}, refreshInterval: 42, x: 'y'});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'state', {_groupName: 'goober'}, {refreshInterval: 42});
        subsMgr.subscribe.reset();
        // If no group name then should just pass all options
        wrapper.subscribe('state', {}, {sort: {_groupIndex: 1}, fields: {a: 1, b: 1}});
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'state', {}, {sort: {_groupIndex: 1}, fields: {a: 1, b: 1}});
    });

    it('subscribe should restrict search and options only on settings and state collections', function () {
        let wrapper = new GroupSubsManager(subsMgr);
        let search = {_groupIndex: 1, _groupName: 'goober'};
        let options = {fields: {a: 1, b: 1}};
        wrapper.subscribe('files', search, options);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'files', search, options);
    });

    it('subscribe passes through other arguments', sinon.test(function () {
        let wrapper = new GroupSubsManager(subsMgr);
        let cb = function () {
        };
        let search = {_groupName: 'goober', x: 'y'}
        let expectedSearch = {_groupName: 'goober'};
        let options = {sort: {a: 1}, fields: {b: 1, c: 1}};
        let expectedOptions = {};
        wrapper.subscribe('settings', search, options, 'yo', cb);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', expectedSearch, expectedOptions, 'yo', cb);
    }));

    it('subscribe on each group from _groupName $in search', sinon.test(function () {
        let wrapper = new GroupSubsManager(subsMgr);
        let search = {_groupName: {$in: ['goober', 'gomer', 'barney']}};
        let options = {sort: {_groupIndex: 1}};
        let cb = function () {
        };
        wrapper.subscribe('settings', search, options, 'yo', cb);
        sinon.assert.callCount(subsMgr.subscribe, 3);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', {_groupName: 'goober'}, {}, 'yo', cb);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', {_groupName: 'gomer'}, {}, 'yo', cb);
        sinon.assert.calledWithExactly(subsMgr.subscribe, 'settings', {_groupName: 'barney'}, {}, 'yo', cb);
    }));

    it('subscribe returns the subscription from SubsManager', sinon.test(function () {
        let wrapper = new GroupSubsManager(subsMgr);
        var sub = wrapper.subscribe('state', {_groupName: 'eth', _groupIndex: 0});
        sinon.assert.calledOnce(subsMgr.subscribe);
        expect(sub).to.equal(subscription);
    }));

    it('reset calls directly through to SubsManager reset', sinon.test(function () {
        let wrapper = new GroupSubsManager(subsMgr);
        wrapper.reset();
        sinon.assert.calledOnce(subsMgr.reset);
    }));

    it('clear calls directly through to SubsManager clear', sinon.test(function () {
        let wrapper = new GroupSubsManager(subsMgr);
        wrapper.clear();
        sinon.assert.calledOnce(subsMgr.clear);
    }));

    it('ready calls directly through to SubsManager ready', sinon.test(function () {
        let wrapper = new GroupSubsManager(subsMgr);
        wrapper.ready();
        sinon.assert.calledOnce(subsMgr.ready);
    }));

});
