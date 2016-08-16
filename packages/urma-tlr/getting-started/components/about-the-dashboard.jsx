/* eslint-disable react/prop-types */

import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import Urma from 'meteor/digi:urma-core';

export default class AboutDashboard extends Component {
    getMeteorData() {
        const Settings = this.context.device.Settings;
        const SubsManager = this.context.device.SubsManager;
        const search = { _groupName: 'system' };
        const subSysSettings = SubsManager.subscribe('settings', search);
        let system = {};
        // If we got here we can call the wizard complete.
        if (subSysSettings.ready()) {
            system = Settings.findOne(search);
            if (system && system.wizard && system.wizard == 'on') {
                Settings.update(system._id, { $set: { 'wizard': 'off' } });
            }
        }
        return {
            system
        };
    }

    componentWillMount() {
        this.props.buttonConfig('/getting-started/remote-manager-connect', { pathname: '/', text: 'Dashboard' });
        this.props.enableNext();
    }

    render() {
        return (
            <div className="js-wz-about-the-dashboard">
                <div className="wizard-content-area-left">
                    <p>The dashboard provides the complete user interface for managing your Digi device.</p>
                    <p>The same experience may be accessed locally, from the device via a web browser and
                        local network connection, or remotely using Digi Remote Manager.
                    </p>
                    <p>Review the Online User Manual for a walk through of what's next or just click DASHBOARD to get
                        started!
                    </p>
                    <div className="wizard-links margin-top">
                        <a href="http://www.digi.com/resources/documentation/digidocs/90001461/default.htm"
                            target="_blank"
                        ><img border="0" alt="online user manual" src="/images/online_user_manual.png"
                            width="50" height="50"
                        />Online User Manual</a>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    <img className="about-the-dashboard-image" src="/images/dashboard.png" alt="Dashboard" />
                </div>
            </div>
        );
    }
}

reactMixin(AboutDashboard.prototype, ReactMeteorData);

AboutDashboard.contextTypes = {
    device: PropTypes.object.isRequired
};
