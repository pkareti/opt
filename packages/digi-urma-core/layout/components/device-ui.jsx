import React from 'react';
import reactMixin from 'react-mixin';
import Header from './header.jsx';
import MainContent from './main-content.jsx';
import { DeviceLoginService } from '../../security/device-login';

/**
 * Main component for the device UI. Provides the overall page layout with header, navigation menu, and page content
 * container.
 * @type {DeviceUI}
 */
export default class DeviceUI extends React.Component {
    constructor(props) {
        super(props);
    }

    getMeteorData() {
        return {
            user: Meteor.user()
        }
    }

    getChildContext() {
        if (this.context.device.env === 'drm') {
            return {
                basePath: '/devices/' + this.context.device.deviceID + '/' + this.props.routes.path + '/',
                devicePath: this.props.routes.path
            };
        } else {
            return {
                basePath: '/',
                devicePath: this.props.routes.path
            };
        }
    }

    checkAuth() {
        // If we are not logged in navigate back to home (root) page
        if (!this.data.user && this.props.location && this.props.location.pathname !== '/') {
            this.context.router.push(`/`);
        }
    }

    componentWillMount() {
        this.checkAuth();
    }

    componentDidUpdate(prevProps, prevState) {
        this.checkAuth();
    }

    render() {
        let outerClass = this.data.user ? '' : 'unauthorized';
        // When loaded from within DRM we don't want to show the logo or login controls. DRM
        // provides them in the outer application.
        let isDRM = (this.context.device && this.context.device.env === 'drm');
        let logo = isDRM ? null : this.props.logo;
        let loginService = isDRM ? null : DeviceLoginService;

        return (
            <div className={outerClass}>
                <Header title={this.props.title} logo={logo} logoText={this.props.logoText} loginService={loginService} routes={this.props.routes}/>
                <MainContent children={this.props.children}/>
            </div>
        );
    }
};


DeviceUI.propTypes = {
    location: React.PropTypes.object.isRequired,  // location object from react router context
    children: React.PropTypes.object.isRequired,   // route children
    title: React.PropTypes.string.isRequired,
    routes: React.PropTypes.object.isRequired,
    logo: React.PropTypes.string,
    logoText: React.PropTypes.string
};

//device.deviceID context passed down from the Device component (in the app)
DeviceUI.contextTypes = {
    router: React.PropTypes.object.isRequired,
    device: React.PropTypes.object.isRequired
};

//this context is used in the contextual link component (urma-core) and in Navigation component (urma-core)
DeviceUI.childContextTypes = {
    basePath: React.PropTypes.string.isRequired,
    devicePath: React.PropTypes.string.isRequired
};

reactMixin(DeviceUI.prototype, ReactMeteorData);