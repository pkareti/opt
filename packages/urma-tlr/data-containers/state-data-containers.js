/**
 * Composer functions that wrap components in a container and provide data as props.
 */

/**
 * getStateData can be used to get data for a single group
 * @props
 * Two props are required:
 * context
 * group: name of desired data group
 * Optional prop:
 * index: if you want one item of a given group, provide the items index
 *
 * Returns object with two fields:
 * ready: true or false, can be used to determine whether data has been returned
 * $groupName: will be whatever was passed in as 'group' prop and will hold
 * object containing state data once it is ready.
 */

export function getStateData(props, onData) {
    let State = props.context.device.State;
    let SubsManager = props.context.device.SubsManager;
    let groupName = props.group;
    let groupIndex = parseInt(props.index);
    let search = {};
    search['_groupName'] = groupName;
    search['_groupIndex'] = groupIndex || 0;

    let options = props.options || {};
    let subscription = SubsManager.subscribe('state', search, options);

    if (subscription.ready()) {
        let data = {};
        data[groupName] = State.findOne(search, options);
        data['ready'] = data[groupName] ? true : false;
        onData(null, data);
    } else {
        onData(null, { ready: false });
    }
}

/**
 * getMultipleStateData can be used to get data for a single group
 * @props
 * Two props are required:
 * context
 * groups: array containing the group names of the state groups to be fetched
 *
 * Returns object with two or more fields:
 * ready: true or false, can be used to determine whether data has been returned
 * $groupName: A key will be added for each group name passed in through the groups prop.
 */
export function getMultipleStateData(props, onData) {
    let State = props.context.device.State;
    let SubsManager = props.context.device.SubsManager;
    let groupArray = props.groups;
    let subscription = SubsManager.subscribe('state', { _groupName: { $in: groupArray } });

    if (subscription.ready()) {
        let data = {};
        groupArray.forEach(function (el, index) {
            data[groupArray[index]] = State.findOne({ _groupName: groupArray[index] });
        });

        let isReady = function (data) {
            let dataKeys = Object.keys(data);
            dataKeys.forEach(function (el, index) {
                return !data[dataKeys[index]];
            });

            return true;
        };

        data.ready = isReady(data);
        onData(null, data);
    } else {
        onData(null, { ready: false });
    }
}

/**
 * getGroupData can be used to get state AND settings data for a single group
 * @props
 * See getStateData
 *
 * Returns object with two fields:
 * ready: true or false, can be used to determine whether data has been returned
 * $groupName: based on passed 'group' prop and will have keys $state and $settings
 * containing the respective collection information for the passed group & index (if passed)
 */

export function getGroupData(props, onData) {
    const device = props.context.device;
    const State = device.State;
    const Settings = device.Settings;
    const SubsManager = device.SubsManager;
    const groupName = props.group;
    const groupIndex = parseInt(props.index);
    let search = {};
    search['_groupName'] = groupName;
    search['_groupIndex'] = groupIndex || 0;
    let searchSettings = props.settingsSearch || search;
    let searchState = props.stateSearch || search;
    let stateGroupName = searchState._groupName;
    let settingsGroupName = searchSettings._groupName;

    let options = props.options || {};
    let optionsSettings = props.settingsOptions || options;
    let optionsState = props.stateOptions || options;
    let stateSub = SubsManager.subscribe('state', searchState, optionsState);
    let settingsSub = SubsManager.subscribe('settings', searchSettings, optionsSettings);

    if (stateSub.ready() && settingsSub.ready()) {
        let data = {};
        if (stateGroupName != settingsGroupName) {
            data = {
                [stateGroupName]: {
                    state: State.findOne(searchState, optionsState)
                },
                [settingsGroupName]: {
                    settings: Settings.findOne(searchSettings, optionsSettings)
                }
            }
        }
        else {
            data[stateGroupName] = {
                state: State.findOne(searchState, optionsState),
                settings: Settings.findOne(searchSettings, optionsSettings)
            };
        }
        data.ready = !!(data[stateGroupName].state && data[settingsGroupName].settings);
        onData(null, data);
    } else {
        onData(null, { ready: false });
    }
}

/**
 * getStateDataList can be used to get data for all items of a given group name
 * @props
 * Two props are required:
 * context
 * group: name of desired data group
 *
 * Returns object with two fields:
 * ready: true or false, can be used to determine whether data has been returned
 * $groupName: will be whatever was passed in as 'group' prop and will hold
 * array containing state data once it is ready.
 */

export function getStateDataList(props, onData) {
    let State = props.context.device.State;
    let SubsManager = props.context.device.SubsManager;
    let groupName = props.group;
    let search = {};
    search['_groupName'] = groupName;
    let options = props.options || {};
    let subscription = SubsManager.subscribe('state', search, options);

    if (subscription.ready()) {
        let data = {};
        data[groupName] = State.find(search, options).fetch();
        data['ready'] = data[groupName] && data[groupName].length > 0 ? true : false;
        onData(null, data);
    } else {
        onData(null, { ready: false });
    }
}
