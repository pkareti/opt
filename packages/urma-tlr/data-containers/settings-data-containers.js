/**
 * Composer functions that wrap components in a container and provide data as props.
 */

/**
 * getSettingsDataList can be used to get data for all items of a given group name
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
export function getSettingsDataList(props, onData) {
    let Settings = props.context.device.Settings;
    let SubsManager = props.context.device.SubsManager;
    let groupName = props.group;
    let search = {};
    search['_groupName'] = groupName;
    let options = props.options || {};
    let subscription = SubsManager.subscribe('settings', search, options);

    if (subscription.ready()) {
        let data = {};
        data[groupName] = Settings.find(search, options).fetch();
        data['ready'] = data[groupName] && data[groupName].length > 0 ? true : false;
        onData(null, data);
    } else {
        onData(null, { ready: false });
    }
}