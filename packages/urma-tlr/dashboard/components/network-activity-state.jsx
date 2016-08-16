import {default as React, Component, PropTypes } from 'react';
import { getStateData, getStateDataList } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';

export const networkActivityStateOptions = {
    sort: { _groupIndex: 1 },
    fields: { _groupIndex: 1, rx_bytes: 1, tx_bytes: 1 }
};


export const NetworkActivityStateInfo = (props) => {
    let networkGroupName = props.group;
    let networkGroup = props[networkGroupName];

    let totalBytes = function (items, val) {
        let total = 0;
        for (var i = 0; i < items.length; i++) {
            total = +total + +items[i][val];
        }
        return total;
    };

    let formatTotalBytes = function (bytes) {
        if (bytes == 0) return '0';
        if (bytes > 1000) {
            let kb = bytes / 1000;
            return kb.toFixed(2) + ' KB';
        } else {
            return bytes + ' Bytes';
        }
    };

    return (
        <div className="fullW">
            {props.ready ?
                <div className={'box js-network-activity-' + networkGroupName}>
                    <div className="row">
                        <div className="fullW">
                            <h5 className="js-title">{props.title}</h5>
                            <div className="row js-rx">
                                <div className="panel-two-column js-label">Received</div>
                                <div className="panel-two-column js-value">{formatTotalBytes(totalBytes(networkGroup, 'rx_bytes'))}</div>
                            </div>
                            <div className="row js-tx">
                                <div className="panel-two-column js-label">Sent</div>
                                <div className="panel-two-column js-value">{formatTotalBytes(totalBytes(networkGroup, 'tx_bytes'))}</div>
                            </div>
                        </div> 
                    </div>
                </div>  
                :
                null
            }
        </div>
    )
};

let NetworkActivityState = composeWithTracker(getStateDataList)(NetworkActivityStateInfo);

NetworkActivityState.propTypes = {
    context: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    options: PropTypes.object,
    title: PropTypes.string.isRequired
};

export default NetworkActivityState;