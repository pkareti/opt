import { composeWithTracker, composeAll } from 'react-komposer';
import WifiInput from './wifi-input.jsx';
import { getCustomData } from '../../data-containers/custom-data-containers.js';
import { getMultipleSettingsDescriptors } from '../../data-containers/settings-descriptor-container.js';



//const Wifi = composeWithTracker(getCustomData)(WifiInput);
const Wifi = composeAll(
    composeWithTracker(getCustomData),
    composeWithTracker(getMultipleSettingsDescriptors)
)(WifiInput);

export default Wifi;
