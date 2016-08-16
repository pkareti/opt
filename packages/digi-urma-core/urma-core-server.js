// Collections
import Settings from './collections/settings.js';
import State from './collections/state.js';
import Files from './collections/files.js';
import StateDescriptors from './collections/state-descriptors.js';
import SettingsDescriptors from './collections/settings-descriptors.js';
import DevicesLoaded from './collections/devices-loaded.js';
import CliOutput from './collections/cli-output.js';

/**
 * Core collections for URMA devices
 * @type {{Settings: Mongo.Collection, State: Mongo.Collection, Files: Mongo.Collection}}
 */
export const Collections = {
    Settings,
    State,
    Files,
    StateDescriptors,
    SettingsDescriptors,
    DevicesLoaded,
    CliOutput
};

// Re-export UrmaServer
export * from './collections/server/main.js';
