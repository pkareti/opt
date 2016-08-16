import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import SkipToDashboardLink from './skip-to-dashboard.jsx';

export default class EthernetResults extends Component {
    componentWillMount() {
        this.props.buttonConfig('/getting-started/connect', '/getting-started/firmware-update');
        this.props.enableNext();
    }

    getMeteorData() {
        const State = this.context.device.State;
        const SubsManager = this.context.device.SubsManager;
        let ethIntState = null;

        const ethSearch = { _groupName: 'eth', _groupIndex: 0 };
        const wanSearch = { _groupName: 'wan', interface: 'eth1' };
        const ethSub = SubsManager.subscribe('state', ethSearch);
        const wanSub = SubsManager.subscribe('state', wanSearch);

        if (ethSub.ready()) {
            ethIntState = State.findOne(ethSearch);
        }

        if (wanSub.ready()) {
            wanEthState = State.findOne(wanSearch);
        }

        return {
            ethIntState,
            wanEthState
        };
    }

    renderEthernetResults() {
        return (
            <div>
                <h6>Ethernet Connection Results</h6>
                <div className="ethernet-results js-ethernet-results">
                    <p>
                        <label htmlFor="mac_address">MAC: </label>
                        <span id="mac_address" className="bold">{this.data.ethIntState.mac_address}</span>
                    </p>
                    <p>
                        <label htmlFor="ip_address">IPv4: </label>
                        <span id="ip_address" className="bold">{this.data.wanEthState.ip_address}</span>
                    </p>
                    <p>
                        <label htmlFor="mask">Subnet: </label>
                        <span id="mask" className="bold">{this.data.wanEthState.mask}</span>
                    </p>
                    <p>
                        <label htmlFor="dns1">DNS: </label>
                        <span id="dns1" className="bold">{this.data.wanEthState.dns1}</span>
                    </p>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="gsw-container js-wz-ethernet-results">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                        <img src="/images/LR_backPanel.jpg" alt="Back Panel" />
                    </div>
                    <div className="wizard-content-text">
                        <p>The device has connected to the Ethernet (IP) WAN.</p>
                        <p>Note the output to the right for details on connection progress.</p>
                        <p>The Getting Started Wizard only supports connections with a DHCP server on the WAN/LAN 1 port.</p>
                        <p>Use the Dashboard to manually set static IP parameters for the WAN port.</p>
                        <p>Click on BACK to retry, as needed.</p>
                    </div>
                </div>

                <div className="wizard-content-area-right">
                    { this.data.ethIntState ? this.renderEthernetResults() : <p>Loading...</p> }

                    <SkipToDashboardLink />
                </div>
            </div>
        );
    }
}

reactMixin(EthernetResults.prototype, ReactMeteorData);

EthernetResults.contextTypes = {
    device: React.PropTypes.object.isRequired
};

EthernetResults.propTypes = {
    buttonConfig: PropTypes.func.isRequired,
    enableNext: PropTypes.func.isRequired,
};
