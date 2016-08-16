import {default as React, Component, PropTypes } from 'react';
import _ from 'lodash';
import { getMultipleStateData } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';
import FirmwareUpToDate from './firmware-up-to-date.jsx';
import FirmwareStatus from '../../firmware/firmware-status-helpers';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;

let parseCurrentFWVersion = FirmwareStatus.parseCurrentFWVersion;

export const SystemStateInfo = (props) => {
    return (
        <div>
            {props.ready && props.system ?
                <div className="row js-dashboard-system">
                    <div>
                        <div className="panel-two-column system-state">
                            <div className="row">
                                <div className="fullW">
                                    <div className="row js-uptime">
                                        <div className="panel-two-column js-label">Up Time</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal js-value">{props.system['uptime']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-fw-version">
                                        <div className="panel-two-column js-label">Firmware Version</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td">
                                                { props.firmware_files ?
                                                    <FirmwareUpToDate firmware_version={props.system['firmware_version']}
                                                        firmware_files={props.firmware_files}/>
                                                    :
                                                    null
                                                }
                                            </div>
                                            <div className="fieldVal js-value">{parseCurrentFWVersion(props.system['firmware_version']).currentVersion}</div>
                                        </div>
                                    </div>
                                    <div className="row js-sys-time">
                                        <div className="panel-two-column js-label">System Time</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal  js-value">{props.system['system_time']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-cpu">
                                        <div className="panel-two-column js-label">CPU Utilization</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal  js-value">{props.system['cpu_usage']}%</div>
                                        </div>
                                    </div>
                                    <div className="row js-temperature">
                                        <div className="panel-two-column js-label">Temperature</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal  js-value">{props.system['temperature']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-description">
                                        <div className="panel-two-column js-label">Description</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal  js-value">{props.system['description']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-contact">
                                        <div className="panel-two-column js-label">Contact</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal  js-value">{props.system['contact']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-location">
                                        <div className="panel-two-column js-label">Location</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal  js-value">{props.system['location']}</div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className="panel-two-column system-state">
                            <div className="row">
                                <div className="fullW">
                                    <div className="row js-model">
                                        <div className="panel-two-column js-label">Model</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal js-value">{props.system['model']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-part-num">
                                        <div className="panel-two-column js-label">Part Number</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal js-value">{props.system['part_number']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-serial-num">
                                        <div className="panel-two-column js-label">Serial Number</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal js-value">{props.system['serial_number']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-hw-version">
                                        <div className="panel-two-column js-label">Hardware Version</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal js-value">{props.system['hardware_version']}</div>
                                        </div>
                                    </div>
                                    <div className="row js-boot-version">
                                        <div className="panel-two-column js-label">Boot Version</div>
                                        <div className="panel-two-column">
                                            <div className="icon-td"></div>
                                            <div className="fieldVal js-value">{props.system['bootloader_version']}</div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-panel-link hide">
                        <a href="/getting-started">Return To Getting Started Wizard</a>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
};

let SystemState = composeWithTracker(getMultipleStateData)(SystemStateInfo);

SystemState.propTypes = {
    context: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    options: PropTypes.object
};

export default SystemState;
