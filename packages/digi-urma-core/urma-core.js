import alerts from './layout/alerts.js';
import DeviceUI from './layout/components/device-ui.jsx';
import MainContent from './layout/components/main-content.jsx';
import Header from './layout/components/header.jsx';
import Navigation from './navigation/components/navigation.jsx';
import ContextualLink from './navigation/components/contextual-link.jsx';
import MenuItem from './navigation/components/menu-item.jsx';
import Authorized from './security/components/authorized.jsx';
import LoginButtons from './security/components/login-buttons.jsx';
// Helper Classes
import Login from './security/login.js';
import RouterHelper from './navigation/router-helper.js';
// Widgets
import ProgressBar from './widgets/components/progress-bar.jsx';
import Wizard from './wizard/components/wizard.jsx';
import WizardButtons from './wizard/components/wizard-buttons.jsx';
import CountdownTimer from './widgets/components/countdown-timer.jsx';
import WizardLogout from './wizard/components/wizard-logout.jsx';
import Accordion from './widgets/components/accordion.jsx';
import StatusIcon from './widgets/components/status-icon.jsx';

// Collections
import Settings from './collections/settings.js';
import State from './collections/state.js';
import Files from './collections/files.js';
import StateDescriptors from './collections/state-descriptors.js';
import SettingsDescriptors from './collections/settings-descriptors.js';
import CliOutput from './collections/cli-output.js';
import GroupSubsManager from './collections/client/group-subs-manager.js';
// SubsManager configuration settings
import subscriptionCacheConfig from './config.js';
// Simulators
import Simulators from './dev-utils/simulators.js';
// Forms and Form subcomponents
import Input from './forms/components/input.jsx';
import InputNoValidate from './forms/components/input-no-validate.jsx';
import ValidationRules from './forms/custom-validation-rules.js';
import Formsy from 'formsy-react';


/**
 * Core Urma object to be exported from the package. Holds references to any package scoped objects to be
 * exposed outside of the package.
 */
export default Urma = {
    alerts,
    DeviceUI,
    Authorized,
    RouterHelper,
    Login,
    LoginButtons,
    Navigation,
    Header,
    ContextualLink,
    ProgressBar,
    Wizard,
    CountdownTimer,
    StatusIcon,
    Accordion,
    Simulators,
    // Expose global meteorhacks subscription manager directly when URMA-418 is fixed
    SubsManager: new GroupSubsManager(new SubsManager(subscriptionCacheConfig)),
    // this is where device uis will store their route and device type info.
    DeviceUIStore: []
};

/**
 * Reusable form components and rules for the URMA framework
 */
export const UrmaForms = {
    Formsy,
    Input,
    ValidationRules,
    InputNoValidate
};

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
    CliOutput
};

/**
 * Internal objects that need to be exported for package unit testing. These are considered private and should not be
 * used by the application.
 * @type {{MenuItem: MenuItem}}
 */
export const UrmaTest = {
    MenuItem,
    MainContent,
    WizardButtons,
    WizardLogout
};
