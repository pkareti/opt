
export function getSettingsDescriptors(props, onData) {
    const SettingsDescriptors = props.context.device.SettingsDescriptors;
    const SubsManager = props.context.device.SubsManager;
    const descriptorGroup = `${props.descriptor}_descriptor`;
    const search = {};
    search['@element'] = props.descriptor;
    const subscription = SubsManager.subscribe('settings_descriptors', search, {});

    if (subscription.ready()) {
        const data = {};
        data[descriptorGroup] = SettingsDescriptors.findOne(search);
        data.ready = true;
        onData(null, data);
    } else {
        onData(null, { ready: false });
    }
};

export function getMultipleSettingsDescriptors(props, onData) {
    const SettingsDescriptors = props.context.device.SettingsDescriptors;
    const SubsManager = props.context.device.SubsManager;
    const descArray = props.descriptors;
    const subscription = SubsManager.subscribe('settings_descriptors', { '@element': { $in: descArray } });

    function isReady(data) {
        const dataKeys = Object.keys(data);
        dataKeys.forEach((el, index) => {
            return !data[dataKeys[index]];
        });

        return true;
    }

    if (subscription.ready()) {
        const dataObj = {};
        descArray.forEach((el, index) => {
            const descriptorGroup = `${descArray[index]}_descriptor`;
            dataObj[descriptorGroup] = SettingsDescriptors.findOne({ '@element': descArray[index] });
        });

        dataObj.ready = isReady(dataObj);
        onData(null, dataObj);
    } else {
        onData(null, { ready: false });
    }
}
