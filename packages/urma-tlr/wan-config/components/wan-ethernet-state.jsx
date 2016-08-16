import { default as React, Component, PropTypes } from 'react';
import { getStateData } from '../../data-containers/state-data-containers.js';
import { composeWithTracker } from 'react-komposer';


const WanEthernetState = (props) => {
    return (
        <div className="js-wan-eth-state accordion-column-wide">
            <div className="content-cap">
                <h4 className="js-state-header">Ethernet Status and Statistics</h4>
            </div>
            <div className="alignPadd">
                <div className="fullW">
                    <div className="row">
                        <div className="panel-two-column js-label">IP address:</div>
                        <div className="panel-two-column">
                            <div className="fieldVal js-value js-ipaddr">{props.wanState.ip_address}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="panel-two-column js-label">Netmask:</div>
                        <div className="panel-two-column">
                            <div className="fieldVal js-value js-netmask">{props.wanState.mask}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="panel-two-column js-label">Gateway:</div>
                        <div className="panel-two-column">
                            <div className="fieldVal js-value js-gateway">{props.wanState.gateway}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="panel-two-column js-label">DNS servers:</div>
                        <div className="panel-two-column">
                            <div className="fieldVal js-value js-dns">
                                {props.wanState.dns1}
                                {props.wanState.dns1 && props.wanState.dns2 ? ', ' : null}
                                {props.wanState.dns2}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fullW">
                    <div className="row">
                        <div className="panel-two-column"></div>
                        <div className="panel-two-column">
                            <div className="panel-two-column bold">Received</div>
                            <div className="panel-two-column bold">Sent</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="panel-two-column js-label">Packets:</div>
                        <div className="panel-two-column js-value">
                            <div className="panel-two-column">
                                <div className="fieldVal js-sub-value">{props.wanState.rx_packets}</div>
                            </div>
                            <div className="panel-two-column">
                                <div className="fieldVal js-sub-value">{props.wanState.tx_packets}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="panel-two-column js-label">Bytes:</div>
                        <div className="panel-two-column js-value">
                            <div className="panel-two-column">
                                <div className="fieldVal js-sub-value">{props.wanState.rx_bytes}</div>
                            </div>
                            <div className="panel-two-column">
                                <div className="fieldVal js-sub-value">{props.wanState.tx_bytes}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WanEthernetState;

WanEthernetState.propTypes = {
    wanState: React.PropTypes.object.isRequired,
};
