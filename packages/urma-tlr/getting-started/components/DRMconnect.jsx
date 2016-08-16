/* eslint-disable react/prop-types */

import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import Urma from 'meteor/digi:urma-core';
import SkipToDashboardLink from './skip-to-dashboard.jsx';
import ProvisionForm from './DRM-provision-form.jsx';

const alerts = Urma.alerts;

export default class DRMConnect extends Component {
    constructor(props) {
        super(props);
        this.enableNext = this.props.enableNext.bind(this);
        this.userNameHandler = this.userNameHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
    }

    componentWillMount() {
        this.userName = '';
        this.password = '';
        this.props.buttonConfig(
            '/getting-started/firmware-update',
            '/getting-started/about-dashboard',
            this.addDeviceToRemoteManger.bind(this));
        this.props.disableNext();
    }

    getMeteorData() {
        const State = this.context.device.State;
        const Settings = this.context.device.Settings;
        const SubsManager = this.context.device.SubsManager;

        let cloudIntState = {};
        let cloudIntSettings = {};
        let cloudDeviceId = '';
        let cloudServer = '';
        const search = { _groupName: 'cloud', _groupIndex: 0 };
        const stateSubscription = SubsManager.subscribe('state', search);
        const settingsSubscription = SubsManager.subscribe('settings', search);
        if (settingsSubscription.ready() && stateSubscription.ready()) {
            cloudIntState = State.findOne(search);
            cloudIntSettings = Settings.findOne(search);
            cloudServer = cloudIntSettings.server;
            cloudDeviceId = cloudIntState.deviceid;
        }
        return {
            cloudServer,
            cloudDeviceId,
            cloudIntSettings
        };
    }

    userNameHandler(event) {
        this.userName = event.target.value;
    }

    passwordHandler(event) {
        this.password = event.target.value;
    }

    addDeviceToRemoteManger() {
        const cloudServer = (this.data.cloudServer === '' ? 'my.devicecloud.com' : this.data.cloudServer);
        Meteor.call('provisionDevice',
            this.userName,
            this.password,
            this.data.cloudDeviceId,
            cloudServer,
            this.rmCallBackHandler.bind(this));
        return {
            transitionToNext: false
        };
    }

    rmCallBackHandler(error, result) {
        if (error) {
            this.showError(error.error, error.reason);
        } else if (result.error) {
            this.showError(result.error.error, result.error.reason);
        } else {
            /** Update cloud state to on if off**/
            const Settings = this.context.device.Settings;
            const cloudIntSettings = this.data.cloudIntSettings;
            const server = (cloudIntSettings.server === '' ? 'my.devicecloud.com' : cloudIntSettings.server);
            // Fix URMA-636: Always set cloud settings to force device to reconnect.
            Settings.update(cloudIntSettings._id, { $set: { state: 'on', server } });
            alerts.success('This device has been added to your Remote Manager account.', 'Provision Success');
            this.props.transitionToNext();
        }
    }

    showError(error, reason) {
        const errCode = error || '500';
        const errReason = reason || 'Unable to read the device list.';
        const errorMessage = `${errCode} - ${errReason}`;
        alerts.error(errorMessage, 'Provision Failed');
    }

    render() {
        return (
            <div className="gsw-container js-wz-DRM-connect">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                    </div>
                    <div className="wizard-content-text">
                        <p>Digi Remote Manager provides centralized and automated management of your Digi devices.</p>
                        <p>Enter the username and Password for an existing Digi Remote Manager account.</p>
                        <a href="http://www.digi.com/products/cloud/digi-remote-manager" target="_blank" rel="noopener noreferrer">http://www.digi.com/products/cloud/digi-remote-manager</a>
                    </div>

                </div>
                <div className="wizard-content-area-right">
                    {(Object.keys(this.data.cloudIntSettings)).length === 0 ?
                        <p>Loading...</p>
                        :
                        <ProvisionForm
                            enableNext={this.enableNext}
                            userNameHandler={this.userNameHandler}
                            passwordHandler={this.passwordHandler}
                        />
                    }
                    <SkipToDashboardLink />
                </div>
            </div>
        );
    }
}

reactMixin(DRMConnect.prototype, ReactMeteorData);

DRMConnect.contextTypes = {
    device: PropTypes.object.isRequired
};

