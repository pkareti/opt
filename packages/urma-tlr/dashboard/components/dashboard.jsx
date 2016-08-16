import {default as React, Component, PropTypes } from 'react';
import Urma from 'meteor/digi:urma-core';
import CloudState from './cloud-state.jsx';
import SystemState from './system-state.jsx';
import EthIntState from './eth-int-state.jsx';
import {ethIntStateOptions} from './eth-int-state.jsx';
import IntState from './int-state.jsx';
import {IntStateOptions} from './int-state.jsx';
import LanState from './lan-state.jsx';
import NetworkActivityState from './network-activity-state.jsx';
import {networkActivityStateOptions} from './network-activity-state.jsx';

let Link = Urma.ContextualLink;
let Authorized = Urma.Authorized;

export default class Dashboard extends Component {
    render() {
        return (
            <div className="js-dashboard">
                <div className="page-header">
                    <div className="page-title">
                        Dashboard
                    </div>
                </div>
                <div className='page-container'>
                    <div className="inner-container dashboard-container">
                        <div className='home-container'>
                            <section className="monitors second">
                                <div className="row">
                                    <div className="dashboard-row1">
                                        <div className="panel dashboard-col">
                                            <div className='home-page-content-header'>
                                                <div className="dash-title">
                                                    <h2>Network Activity</h2>
                                                </div>
                                                <div className='panel-content'>
                                                    <NetworkActivityState context={this.context} group={'wan'} title={'WAN'}
                                                                          options={networkActivityStateOptions}/>
                                                    <NetworkActivityState context={this.context} group={'lan'} title={'LAN'}
                                                                          options={networkActivityStateOptions}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel dashboard-col">
                                            <div className='home-page-content-header'>
                                                <div className="dash-title">
                                                    <h2>Digi Remote Manager</h2>
                                                </div>
                                                <div className='panel-content'>
                                                    <CloudState context={this.context} group={'cloud'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel dashboard-col-wide omega">
                                            <div className='home-page-content-header'>
                                                <div className="dash-title">
                                                    <h2>Device</h2>
                                                </div>
                                                <div className='panel-content'>
                                                    <SystemState context={this.context} groups={['system', 'firmware_files']}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="dashboard-row2">
                                        <div className="panel dashboard-col">
                                            <div className='home-page-content-header'>
                                                <div className="dash-title">
                                                    <h2>LAN</h2>
                                                </div>
                                                <div className='panel-content'>
                                                    <LanState context={this.context} group={'lan'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel dashboard-col">
                                            <div className='home-page-content-header'>
                                                <div className="dash-title">
                                                    <h2>Interface</h2>
                                                </div>
                                                <div className='panel-content'>
                                                    <EthIntState context={this.context} group={'eth'} options={ethIntStateOptions}/>
                                                    <IntState context={this.context} group={'cellular'} options={IntStateOptions}/>
                                                    <IntState context={this.context} group={'wifi'} options={IntStateOptions}/>
                                                    <IntState context={this.context} group={'wifi5g'} options={IntStateOptions}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.contextTypes = {
    device: PropTypes.object.isRequired
};

