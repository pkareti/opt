import {default as React, Component, PropTypes} from 'react';
import reactMixin from 'react-mixin';
import Urma from 'meteor/digi:urma-core';
import routes from '../routes.jsx';
import {withRouter} from 'react-router';
let DeviceUI = Urma.DeviceUI;
let log = new Logger('main-layout');

export default class MainLayout extends Component {

    getMeteorData() {
        let Settings = this.context.device.Settings;
        let State = this.context.device.State;
        let SubsManager = this.context.device.SubsManager;

        let title = '';
        let wizard = null;
        let search = { _groupName: 'system' };
        let subSysState = SubsManager.subscribe('state', search);
        if (subSysState.ready()) {
            let system = State.findOne(search);
            if (system) {
                title = system.model || '';
            }
        }
        // The wizard is only available when running locally from the device (i.e. not in remote manager).
        if (this.context.device.env == 'device') {
            let subSysSettings = SubsManager.subscribe('settings', search);
            if (subSysSettings.ready()) {
                let system = Settings.findOne(search)
                if (system) {
                    // If no wizard field available this is old firmware and we want
                    // to force the wizard on.
                    wizard = system.wizard || 'on'
                    log.debug('wizard:', wizard);
                }
            }
        } else {
            wizard = 'off'
        }

        return {
            user: Meteor.user(),
            title: title,
            wizard: wizard
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.data.wizard == 'on' &&
            this.props.location && this.props.location.pathname == '/') {
            this.props.router.replace('/getting-started');
            log.debug('  -> redirecting to /getting-started');
        }
    }

    render() {
        // Don't render anything until we determine if the wizard is enabled or not.
        // Avoids flash of dashboard before wizard gets rendered.
        if (this.data.wizard) {
            return (
                <DeviceUI title={this.data.title}
                    logo='/images/logo.png'
                    logoText={'DIGI TRANSPORT' + String.fromCharCode(174)}
                    routes={routes}
                    location={this.props.location}
                    children={this.props.children}
                />
            );
        } else {
            return (null);
        }
    }
}

reactMixin(MainLayout.prototype, ReactMeteorData);

MainLayout.contextTypes = {
    device: PropTypes.object.isRequired
};

export default withRouter(MainLayout)
