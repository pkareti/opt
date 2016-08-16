import {default as React, Component, PropTypes } from 'react';
import _ from 'lodash';
import * as moment from 'moment';
import { getStateData, getStateDataList } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

export const CloudStateInfo = (props) => {
    let uptime = '';
    let DRM_Path = "remotemanager.digi.com";
    if (props.ready && props.cloud && props.cloud['uptime']) {
        uptime = moment.duration(props.cloud['uptime'], 'seconds').humanize();
        if (props.cloud.server) {
            DRM_Path = `https://${props.cloud.server}`;
        }
    }

    return (
        <div className="fullW digi-remote-manager">
            { props.ready ?
                <div className="js-cloud">
                    <div className="row">
                        <div className="fullW">
                            <div className="row js-status">
                                <div className="panel-two-column js-label">Status</div>
                                <div className="panel-two-column">
                                    <div className="icon-td">
                                        <StatusIcon condition={props.cloud['status'] == 'connected'}/>
                                    </div>
                                    <div className="fieldVal js-value">{_.capitalize(props.cloud['status'])}</div>
                                </div>
                            </div>
                            <div className="row js-uptime">
                                <div className="panel-two-column js-label">Up Time</div>
                                <div className="panel-two-column">
                                    <div className="icon-td"></div>
                                    <div className="fieldVal js-value">{uptime}</div>
                                </div>
                            </div>
                            <div className="row js-device-id">
                                <div className="panel-two-column js-label">Device Id</div>
                                <div className="panel-two-column">
                                    <div className="icon-td"></div>
                                    <div className="fieldVal js-value">{props.cloud['deviceid']}</div>
                                </div>
                            </div>
                            <div className="row js-packets">
                                <div className="panel-two-column js-label">Packets</div>
                                <div className="panel-two-column js-value">
                                    <div className="icon-td"></div>
                                    <div className="row">
                                        <div className="js-rx-value fullW">
                                            <div className="fieldVal">Received: {props.cloud['rx_packets']}</div>
                                        </div>
                                        <div className="js-tx-value fullW">
                                            <div className="fieldVal">Sent: {props.cloud['tx_packets']}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row js-bytes">
                                <div className="panel-two-column js-label">Bytes</div>
                                <div className="panel-two-column js-value">
                                    <div className="icon-td"></div>
                                    <div className="row">
                                        <div className="fullW">
                                            <div className="fieldVal js-rx-value">Received: {props.cloud['rx_bytes']}</div>
                                        </div>
                                        <div className="fullW">
                                            <div className="fieldVal js-tx-value">Sent: {props.cloud['tx_bytes']}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="dashboard-panel-link hide">
                        <a href={DRM_Path}>Go To Remote Manager</a>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
};

let CloudState = composeWithTracker(getStateData)(CloudStateInfo);

CloudState.propTypes = {
    context: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    options: PropTypes.object
};

export default CloudState;
