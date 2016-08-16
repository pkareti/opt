import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import ComingSoon from './coming-soon.jsx';

class LocalNetworks extends Component {
    getMeteorData() {
        const State = this.context.device.State;
        const SubsManager = this.context.device.SubsManager;

        let system = {};
        const search = { _groupName: 'system' };
        const subscription = SubsManager.subscribe('state', search);
        if (subscription.ready()) {
            system = State.findOne(search);
        }

        return {
           system
        };
    }

    render() {
        return (
            <div className="home-container js-local-networks">
                <div className="home-panel panel-full-width">
                    <h4>Local Networks</h4>
                    <ComingSoon />
                </div>
            </div>
        );
    }
}

reactMixin(LocalNetworks.prototype, ReactMeteorData);

LocalNetworks.contextTypes = {
    device: PropTypes.object.isRequired
};

class VPN extends Component {
    getMeteorData() {
        const State = this.context.device.State;
        const SubsManager = this.context.device.SubsManager;

        let system = {};
        const search = { _groupName: 'system' };
        const subscription = SubsManager.subscribe('state', search);
        if (subscription.ready()) {
            system = State.findOne(search);
        }

        return {
            system
        };
    }

    render() {
        return (
            <div className="home-container">
                <div className="home-panel panel-full-width">
                    <h4>VPN</h4>
                    <ComingSoon />
                </div>
            </div>
        );
    }
}

reactMixin(VPN.prototype, ReactMeteorData);

VPN.contextTypes = {
    device: PropTypes.object.isRequired
};

export default MainNavigation = {
    LocalNetworks,
    VPN
};
