/* eslint-disable react/prop-types */

import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import CellularSimStatus from '../../cellular/components/cellular-sim-status.jsx';

export default class CellularResults extends Component {
    componentWillMount() {
        this.props.buttonConfig('/getting-started/cellular/0', '/getting-started/firmware-update');
        this.props.enableNext();
    }

    getMeteorData() {
        const State = this.context.device.State;
        const SubsManager = this.context.device.SubsManager;
        let cellularIntState = null;

        const search = { _groupName: 'cellular' };
        const stateSubscription = SubsManager.subscribe('state', search);
        if (stateSubscription.ready()) {
            cellularIntState = State.findOne(search);
        }

        return {
            cellularIntState
        };
    }

    renderCellularResults() {
        return (
            <div>
                <h6>Cellular Connection Results</h6>
                <div className="cellularResults">
                    <p>
                        <label htmlFor="description">Description: </label><span id="description" className="bold">{this.data.cellularIntState.description}</span>
                    </p>
                    <p>
                        <label htmlFor="module">Module: </label><span id="module" className="bold">{this.data.cellularIntState.module}</span>
                    </p>
                    <p>
                        <label htmlFor="firmware_version">Firmware Version: </label><span id="firmware_version" className="bold">{this.data.cellularIntState.firmware_version}</span>
                    </p>
                    <p>
                        <label htmlFor="hardware_version">Hardware Version: </label><span id="hardware_version" className="bold">{this.data.cellularIntState.hardware_version}</span>
                    </p>
                    <p>
                        <label htmlFor="imei">IMEI: </label><span id="imei" className="bold">{this.data.cellularIntState.imei}</span>
                    </p>
                    <p>
                        <label htmlFor="registration_status">Registration Status: </label><span id="registration_status" className="bold">{this.data.cellularIntState.registration_status}</span>
                    </p>
                    <p>
                        <label htmlFor="network_provider">Network Provider: </label><span id="network_provider" className="bold">{this.data.cellularIntState.network_provider}</span>
                    </p>
                    <p>
                        <label htmlFor="temperature">Temperature: </label><span id="temperature" className="bold">{this.data.cellularIntState.temperature}</span>
                    </p>
                    <p>
                        <label htmlFor="connection_type">Connection Type: </label><span id="connection_type" className="bold">{this.data.cellularIntState.connection_type}</span>
                    </p>
                    <p>
                        <label htmlFor="radio_band">Radio Band: </label><span id="radio_band" className="bold">{this.data.cellularIntState.radio_band}</span>
                    </p>
                    <p>
                        <label htmlFor="channel">Channel: </label><span id="channel" className="bold">{this.data.cellularIntState.channel}</span>
                    </p>
                    <p>
                        <label htmlFor="pdp_context">PDP Context: </label><span id="pdp_context" className="bold">{this.data.cellularIntState.pdp_context}</span>
                    </p>
                    <p>
                        <label htmlFor="ip_address">IP Address: </label><span id="ip_address" className="bold">{this.data.cellularIntState.ip_address}</span>
                    </p>
                    <p>
                        <label htmlFor="mask">Mask: </label><span id="mask" className="bold">{this.data.cellularIntState.mask}</span>
                    </p>
                    <p>
                        <label htmlFor="gateway">Gateway: </label><span id="gateway" className="bold">{this.data.cellularIntState.gateway}</span>
                    </p>
                    <p>
                        <label htmlFor="dns_servers">DNS Servers: </label><span id="dns_servers" className="bold">{this.data.cellularIntState.dns_servers}</span>
                    </p>
                    <p>
                        <label htmlFor="rx_packets">RX Packets: </label><span id="rx_packets" className="bold">{this.data.cellularIntState.rx_packets}</span>
                    </p>
                    <p>
                        <label htmlFor="tx_packets">TX Packets: </label><span id="tx_packets" className="bold">{this.data.cellularIntState.tx_packets}</span>
                    </p>
                    <p>
                        <label htmlFor="rx_bytes">RX Bytes: </label><span id="rx_bytes" className="bold">{this.data.cellularIntState.rx_bytes}</span>
                    </p>
                    <p>
                        <label htmlFor="tx_bytes">TX Bytes: </label><span id="tx_bytes" className="bold">{this.data.cellularIntState.tx_bytes}</span>
                    </p>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="js-wz-cellular-results">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR54_frontPanel.png" alt="Front Panel" />
                        {this.data.cellularIntState ?
                            <CellularSimStatus cellularIntState={this.data.cellularIntState} />
                            :
                            <p>Loading...</p>
                        }
                    </div>
                    <div className="wizard-content-text">
                        <p>The device has connected to the cellular WAN.</p>
                        <p>Note the output to the right for details on cellular WAN connection.</p>
                        <p>Click on BACK to change any cellular connection parameters and to retry the WAN connection.</p>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    {this.data.cellularIntState ?
                        this.renderCellularResults()
                        :
                        <p>Loading...</p>
                    }
                </div>
            </div>
        );
    }

}

reactMixin(CellularResults.prototype, ReactMeteorData);

CellularResults.contextTypes = {
    device: PropTypes.object.isRequired
};
