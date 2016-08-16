import { UrmaServer, Collections } from 'meteor/digi:urma-core';

let log = new Logger('server/main');

Logger.setLevel('info');

const transportSettings = Assets.getText('transportSettings.xml');
const transportState = Assets.getText('transportState.xml');
const settingsDescriptors = Assets.getText('settingsDescriptors.xml');
const stateDescriptors = Assets.getText('stateDescriptors.xml');


Meteor.startup(function() {
    log.info('Starting Server ');

    const whitelist = ['username', 'password'];
    Meteor.users.allow({
        update: function (userId, doc, fields, modifier) {
            if(userId && doc._id === userId && _.difference(fields, whitelist).length === 0) {
                if(_.contains(fields, 'password')) {
                    Accounts.setPassword(userId, modifier.$set.password, {logout: false});
                }
                return true;
            }
        }
    });

    UrmaServer.startup();
    // Load some test settings
    Collections.Settings.remove({});
    const rciSettings = UrmaServer.parseRciXml(transportSettings);
    UrmaServer.loadRci(Collections.Settings, rciSettings.settings, {});
    // Load some test state
    Collections.State.remove({});
    const rciState = UrmaServer.parseRciXml(transportState);
    UrmaServer.loadRci(Collections.State, rciState.state, {});
    // Load some test files
    Collections.Files.remove({});
    UrmaServer.loadFiles(Collections.Files);
    // Load state descriptors
    Collections.StateDescriptors.remove({});
    const rciStateDescriptors = UrmaServer.parseRciXml(stateDescriptors);
    UrmaServer.loadDescriptors(Collections.StateDescriptors, rciStateDescriptors.state_descriptors, {});
    // Load settings descriptors
    Collections.SettingsDescriptors.remove({});
    const rciSettingsDescriptors = UrmaServer.parseRciXml(settingsDescriptors);
    UrmaServer.loadDescriptors(Collections.SettingsDescriptors, rciSettingsDescriptors.settings_descriptors);
    // Remove Cli Ouput
    Collections.CliOutput.remove({});
});
