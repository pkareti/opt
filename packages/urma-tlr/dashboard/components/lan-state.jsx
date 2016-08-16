import {default as React, Component, PropTypes } from 'react';
import _ from 'lodash';
import { getStateData, getStateDataList } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

export const lanStateOptions = {
    sort: { _groupIndex: 1 },
    fields: { _groupIndex: 1, admin_status: 1, oper_status: 1, description: 1, interfaces: 1 }
};

export const LanStateInfo = (props) => {
    let lanName = function (lan) {
        let lanNumber = +lan._groupIndex + +1;
        return 'LAN ' + lanNumber;
    };

    let lanDescription = function (lan) {
        return lan.description || '(' + lan.interfaces + ')';
    };

    let lanInUse = function (lan) {
        return (lan.interfaces || false);
    };

    let anyLanInUse = function (lans) {
        let anyLanInUse = false;
        lans.forEach(function (el) {
            if (el.interfaces) {
                anyLanInUse = true;
            }
        });

        return anyLanInUse;
    };


    return (
        <div className="js-dashboard-lan">
            { props.ready ?
                <div>
                    {props.lan.filter(lanInUse).map(lan =>
                        <div className="row js-lan" key={lan._id}>
                            <div className="fullW">
                                <div className="row">
                                    <div className="panel-two-column wordbreak">
                                        <span className={'network-icon ' + props.group}></span>
                                        <div className="fieldVal js-name">{lanName(lan)}</div>
                                        <div className="fullW">
                                            <span className="network-icon autoheight"></span>
                                            <div className="fieldVal js-label">{lanDescription(lan)}</div>
                                        </div>
                                    </div>
                                    <div className="panel-two-column">
                                        <div className="icon-td"><StatusIcon condition={lan.oper_status == 'up'} /></div>
                                        <div className="fieldVal js-value">{_.capitalize(lan.oper_status)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                :
                null
            }
            { props.ready && !anyLanInUse(props.lan) ?
                <div className="js-no-lan">
                    <p>No LAN interfaces are currently configured.</p>
                </div>
                :
                null
            }
        </div>
    )
};

LanStateInfo.propTypes = {
    context: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    options: PropTypes.object,
    index: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

let LanState = composeWithTracker(getStateDataList)(LanStateInfo);

export default LanState;
