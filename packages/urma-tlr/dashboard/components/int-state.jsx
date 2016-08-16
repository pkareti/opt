import {default as React, Component, PropTypes } from 'react';
import _ from 'lodash';
import { getStateData, getStateDataList } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

export const IntStateOptions = {
    sort: { _groupIndex: 1 },
    fields: { _groupIndex: 1, admin_status: 1, oper_status: 1, uptime: 1 }
};

export const IntStateInfo = (props) => {
    let intGroup = props.group;
    const getClass = (int) => {
        return ('row js-' + intGroup + ' js-' + intGroup + '-' + (int._groupIndex + 1));
    };
    return (
        <div className={"js-dashboard-" + intGroup}>
            {props.ready ?
                <div className="row">
                    <div className="fullW">
                        {props[intGroup].filter(int => int.admin_status === 'up').map(int =>
                            <div className={getClass(int) + " row"} key={int._id}>
                                <div className="panel-two-column wordbreak">
                                    <h6 className="boxSub">
                                        <span className={'network-icon ' + props.group}></span>
                                        <div className="fieldVal  js-label">{_.capitalize(intGroup) + ' ' + (+int._groupIndex + +1)}</div>
                                    </h6>
                                </div>
                                <div className="panel-two-column">
                                    <div className="icon-td"><StatusIcon condition={int.oper_status == 'up'}/></div>
                                    <div className="fieldVal  js-value">{_.capitalize(int.oper_status)}</div>
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

let IntState = composeWithTracker(getStateDataList)(IntStateInfo);

IntState.propTypes = {
    context: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    options: PropTypes.object,
    index: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

export default IntState;
