/* eslint-disable react/prop-types, no-script-url */

import { default as React, Component } from 'react';
import { withRouter } from 'react-router';
import { FirmwareManager } from '../../firmware/firmware-manager';
import FirmwareUpdateManual from '../../firmware/components/firmware-update-manual.jsx';

// TODO: remove the Update Firmware button and submit update on click of Next button.
// TODO: auto-update firmware

export class FWUpdate extends Component {
    constructor() {
        super();
        this.onFirmwareUpdateComplete = this.onFirmwareUpdateComplete.bind(this);
        this.onSkip = this.onSkip.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    componentWillMount() {
        this.firmwareManager = new FirmwareManager();
        // If coming from Remote Manager, 'goBack' goes to RM when using history
        const query = this.props.location.query;
        const back = query && query.device === 'ethernet' ?
            '/getting-started/ethernet-results' : '/getting-started/cellular/0';
        this.props.buttonConfig(
            back,
            '/getting-started/remote-manager-connect',
            this.startFirmwareUpdate.bind(this));
        this.props.disableNext();
    }

    componentWillUnmount() {
        this.firmwareManager.removeAllListeners();
        this.firmwareManager = null;
    }

    onReady(isReady) {
        if (isReady) {
            this.props.enableNext();
        } else {
            this.props.disableNext();
        }
    }

    onFirmwareUpdateComplete(successful) {
        if (successful) {
            this.props.transitionToNext();
        }
    }

    onSkip() {
        this.props.transitionToNext();
    }

    startFirmwareUpdate(e) {
        this.firmwareManager.startUpdate(e);
        return {
            transitionToNext: false
        };
    }

    render() {
        return (
            <div className="gsw-container js-wz-firmware-update">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                    </div>
                    <div className="wizard-content-text">
                        <p>Using the device's WAN connection, download and install the latest firmware version.</p>
                        <p>You many also install a firmware version from a locally saved file.</p>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    <FirmwareUpdateManual
                        firmwareManager={this.firmwareManager}
                        onReady={this.onReady}
                        onComplete={this.onFirmwareUpdateComplete}
                    />
                    <div className="skip-ahead-link">
                        <br />
                        <span className="float-right">Click NEXT to update</span>
                        <br />
                        <a
                            href="javascript:void(0)"
                            id="skipToRM"
                            onClick={this.onSkip}
                            className="float-right"
                        >
                            SKIP THIS STEP <i className="fa fa-caret-right" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(FWUpdate);
