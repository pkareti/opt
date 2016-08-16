import {default as React, Component, PropTypes } from 'react';
import _ from 'lodash';
import { getStateData, getStateDataList } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

export const ethIntStateOptions = {
    sort: { _groupIndex: 1 },
    fields: { _groupIndex: 1, admin_status: 1, oper_status: 1 }
};

export const EthIntStateInfo = (props) => {
    let EthIntName = function (eth) {
        if (eth._groupIndex === 0) {
            return 'WAN/Eth 1';
        } else {
            let ethNumber = +eth._groupIndex + +1;
            return 'Eth ' + ethNumber;
        }
    };

    const getClass = (eth) => {
        return `js-eth row js-eth-${eth._groupIndex + 1}`;
    };

    return (
        <div className="js-dashboard-eth">
            { props.ready && props.eth ?
                <div className="row">
                    <div className="fullW">
                        {props.eth.filter(eth => eth.admin_status === 'up').map(eth =>
                            <div className={getClass(eth) + " row"} key={eth._id}>
                                <div className="panel-two-column wordbreak">
                                    <h6 className="boxSub">
                                        <span className={'network-icon ' + props.group}></span>
                                        <div className="fieldVal  js-label">{EthIntName(eth)}</div>
                                    </h6>
                                </div>
                                <div className="panel-two-column">
                                    <div className="icon-td"><StatusIcon condition={eth.oper_status == 'up'}/></div>
                                    <div className="fieldVal js-value">{_.capitalize(eth.oper_status)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                :
                null
            }
        </div>
    )
};

let EthIntState = composeWithTracker(getStateDataList)(EthIntStateInfo);

EthIntState.propTypes = {
    context: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    options: PropTypes.object,
    index: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

export default EthIntState;
