import { default as React, Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Urma from 'meteor/digi:urma-core';
import { Collections } from 'meteor/digi:urma-core';

const SubsManager = Urma.SubsManager;
const Settings = Collections.Settings;
const State = Collections.State;
const Files = Collections.Files;
const CliOutput = Collections.CliOutput;
const SettingsDescriptors = Collections.SettingsDescriptors;
const StateDescriptors = Collections.StateDescriptors;

Logger.setLevel('info');

export default class MainApp extends Component {
    getChildContext() {
        const deviceCtx = {
            env: 'device',
            deviceID: null,
            deviceType: 'TLR',
            SubsManager,
            Settings,
            State,
            Files,
            CliOutput,
            SettingsDescriptors,
            StateDescriptors
        };
        return {
            device: deviceCtx
        };
    }

    render() {
        return (
            <div>
                <Helmet
                    meta={[
                        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
                    ]}
                />
                {this.props.children}
            </div>
        )
    }
}

MainApp.childContextTypes = {
    device: PropTypes.object.isRequired
};
