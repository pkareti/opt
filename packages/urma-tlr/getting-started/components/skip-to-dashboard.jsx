/* eslint-disable react/prop-types */

import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import { withRouter } from 'react-router';

class SkipToDashboardLink extends Component {
    constructor() {
        super();
        this.onSkip = this.onSkip.bind(this);
    }

    onSkip() {
        // Turn the wizard off.
        const system = this.data.system;
        const Settings = this.context.device.Settings;
        Settings.update(system._id, { $set: { wizard: 'off' } }, this.goToDashboard.bind(this));
    }

    getMeteorData() {
        const Settings = this.context.device.Settings;
        const SubsManager = this.context.device.SubsManager;

        let system = null;
        const search = { _groupName: 'system' };
        const sub = SubsManager.subscribe('settings', search);
        if (sub.ready()) {
            system = Settings.findOne(search);
        }

        return {
            system
        };
    }

    goToDashboard() {
        this.props.router.replace('/');
    }

    render() {
        return (
            <div className="skip-ahead-link">
                {this.data.system ?
                    <a href="javascript:void(0)" className="js-skip-to-dashboard" onClick={this.onSkip}>
                        SKIP TO DASHBOARD <i className="fa fa-caret-right" />
                    </a>
                    :
                    null
                }
            </div>
        );
    }
}

reactMixin(SkipToDashboardLink.prototype, ReactMeteorData);

SkipToDashboardLink.contextTypes = {
    device: PropTypes.object.isRequired
};

export default withRouter(SkipToDashboardLink);
