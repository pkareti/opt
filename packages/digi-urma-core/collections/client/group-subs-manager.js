import _ from 'lodash';

/**
 * This class wraps a SubsManager object (meteorhacks:subs-manager) and restricts the search criteria for the
 * subscription to just groups (i.e. _groupName). It removes any other search criteria or options from the subscription
 * that might cause overlapping subscriptions.
 *
 * This search criteria filtering is currently only applied to 'state' and 'settings' collections.
 *
 * This is a temporary workaround for an issue in our URMA python server related to managing subscriptions. See jiras
 * URMA-418 and URMA-628 for details.
 */
export default class GroupSubsManager {

    constructor(subsManager) {
        this._subsManager = subsManager;
    }

    // subscribe params: name, [arg1, arg2, ...], [callbacks]
    // More specifically, for our device data collections (Settings, State, etc.)
    // the params are: name, [searchCriteria], [options], ... [callbacks]
    subscribe() {
        if (arguments[0] === 'settings' || arguments[0] === 'state') {
            let args = _.toArray(arguments); // get copy of arguments that we can modify
            this._modifyArgs(args);
            return this._groupSubscribe(args);
        }
        // Just pass through if not settings or state collection.
        return this._subsManager.subscribe.apply(this._subsManager, arguments);
    }

    reset() {
        // Just pass through
        return this._subsManager.reset.apply(this._subsManager, arguments);
    }

    clear() {
        // Just pass through
        return this._subsManager.clear.apply(this._subsManager, arguments);
    }

    ready() {
        // Just pass through
        return this._subsManager.ready.apply(this._subsManager, arguments);
    }


    // args[1]: searchCriteria
    // args[2]: options
    _modifyArgs(args) {
        // We only modify the args for group subscriptions (which should be the only types we have for settings/state).
        if (args.length >= 2 && args[1] && args[1]._groupName) {
            // Replace args[1] with only the _groupName search criteria.
            args[1] = _.pick(args[1], '_groupName');

            // For now we are excluding all options from the subscription except the refreshInterval.
            // This is required because meteorhacks:subs-manager calls EJSON.stringify on all the args and uses the
            // resulting string value as the key for its subscription cache.
            // Need to retain refreshInterval to fix URMA-666.
            if (args.length < 3) {
                args.push({});
            } else {
                args[2] = _.pick(args[2], 'refreshInterval');
            }
        }
    }

    _groupSubscribe(args) {
        // args[1] is searchCriteria
        let search = (args.length >= 2 && args[1] ? args[1] : {});
        let sub = null;
        // If the _groupName search is using $in then we need to subscribe to each individual group.
        if (search._groupName && typeof(search._groupName) === 'object' && search._groupName.$in) {
            let groupNames = search._groupName.$in;
            _.each(groupNames, (groupName) => {
                args[1] = {_groupName: groupName};
                // It turns out that meteorhacks:subs-manager subscribe returns a different subscription object than
                // Meteor.subscribe. The subscription only has a ready function, and that function is actually checking
                // all subscriptions in its cache (reactively). So we can safely just return the last subscription
                // object/handle we get.
                sub = this._subsManager.subscribe.apply(this._subsManager, args);
            });
        } else {
            sub = this._subsManager.subscribe.apply(this._subsManager, args);
        }
        return sub;
    }
}
