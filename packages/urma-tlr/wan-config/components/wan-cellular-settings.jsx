import {default as React, Component, PropTypes} from 'react';

export const WanCellularSettings = (props) => {
    return (
        <div className="accordion-column-wide">
            {props.cellularSettings ?
                <div className="js-wan-cellular-settings">
                    <h5>
                        Cellular {props.cellularSettings._groupIndex + 1}
                    </h5>
                    <div className="alignPadd">
                        <div className="interfaceWrapper fullW">
                            <div className="row interface js-interface ">
                                <div className="panel-two-column js-label">Interface:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">
                                        <a onClick={props.goToInterface.bind(this)} className="interface-link">
                                            cellular{props.cellularSettings._groupIndex + 1}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="row js-apn">
                                <div className="panel-two-column js-label">APN:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.cellularSettings.apn}</div>
                                </div>
                            </div>
                            <div className="row js-username">
                                <div className="panel-two-column js-label">Username:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.cellularSettings.apn_username}</div>
                                </div>
                            </div>
                            <div className="row js-password">
                                <div className="panel-two-column js-label">Password:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.renderPassword(props.cellularSettings.apn_password)}</div>
                                </div>
                            </div>
                            <div className="row js-sim-pin">
                                <div className="panel-two-column js-label">SIM PIN:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.cellularSettings.sim_pin}</div>
                                </div>
                            </div>
                            <div className="row js-preferred-mode">
                                <div className="panel-two-column js-label">Preferred Mode:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.cellularSettings.preferred_mode}</div>
                                </div>
                            </div>
                            <div className="row js-connection-attempts">
                                <div className="panel-two-column js-label">Connection Attempts:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.cellularSettings.connection_attempts}</div>
                                </div>
                            </div>
                            <div className="row js-state">
                                <div className="panel-two-column js-label">State:</div>
                                <div className="panel-two-column">
                                    <div className="fieldVal js-value">{props.cellularSettings.state}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <p>Loading...</p>
            }
        </div>
    );
};

WanCellularSettings.propTypes = {
    cellularSettings: PropTypes.object.isRequired,
    goToInterface: PropTypes.func.isRequired,
    renderPassword: PropTypes.func.isRequired
};
