import { default as React, Component, PropTypes } from 'react';
import WanEthernet from './wan-ethernet.jsx';
import WanCellular from './wan-cellular.jsx';
import { Wrapper } from './wrapper.jsx';
import { getCustomData } from '../../data-containers/custom-data-containers.js';
import { composeWithTracker } from 'react-komposer';

const wanSub = {
    wan: {
        collections: ['settings'],
        options: {
            sort: { _groupIndex: 1 }
        }
    }
};

export default class WAN extends Component {
    render() {
        return (
            <div className="js-wan">
                <WanConfig context={this.context} getData={wanSub} location={this.props.location}/>
            </div>
        );
    }
}

WAN.contextTypes = {
    device: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
};

// export for tests
export const renderWanStatus = (state) => {
    const operStatus = state.oper_status;
    let status = { type: 'error', text: 'Down' };
    if (operStatus === 'up') {
        status = { type: 'ok' };
    }
    return status;
};


export class WanAccordions extends Component {
    onConfirmDelete(wanId, e) {
        let Settings = this.props.context.device.Settings;
        /** Updating wan probing settings **/
        Settings.update(wanId, { $set: { 'interface': 'none' } }, this.props.onUpdateComplete.bind(this));
        this.props.updateState('showDialog', {});
    }

    goToInterface(changed, e) {
        const routeObj = { pathname: '/interfaces' };
        if (this.props.eth) {
            routeObj.query = { open: 'ethernet' };
        } else if (this.props.cellular) {
            routeObj.query = { open: 'cellular' };
        }


        if (changed) {
            let updateShowDialog = this.props.updateState;
            let showDialog = {
                dialog: 'interfaces',
                header: 'Confirmation',
                message: 'Your changes will be lost. Are you sure you want to navigate to Interfaces?',
                onDialogOk: function () {
                    updateShowDialog('showDialog', {});
                    this.props.context.router.push(routeObj);
                }
            };
            updateShowDialog('showDialog', showDialog);
        } else {
            this.props.context.router.push(routeObj);
        }
    }

    onDelete(groupIndex, wanId, e) {
        let showDialog = {
            dialog: 'delete',
            header: 'Delete Confirmation',
            message: `Are you sure you want delete WAN${groupIndex + 1}?`,
            onDialogOk: this.onConfirmDelete.bind(this, wanId)

        };
        this.props.updateState('showDialog', showDialog);
    }

    renderWan(wanSettings) {
        let wanInterface = wanSettings.interface;
        let InterfaceLen = wanInterface.length;
        let InterfaceType = wanInterface.slice(0, (InterfaceLen - 1));
        let InterfaceIndex = wanInterface.slice((InterfaceLen - 1), InterfaceLen);
        let wanGroupIndex = wanSettings._groupIndex + 1;
        let wanAccordion;
        switch (InterfaceType) {
            case 'eth':

                const wanEthData = {
                    eth: {
                        groupIndex: wanSettings._groupIndex,
                        collections: ['state']
                    },
                    wan: {
                        groupIndex: wanSettings._groupIndex,
                        collections: ['state']
                    }
                };
                wanAccordion = (<WanEthernet
                    key={wanSettings._id}
                    getData={wanEthData}
                    context={this.props.context}
                    location={this.props.location}
                    wanSettings={wanSettings}
                    updateState={this.props.updateState}
                    goToInterface={this.goToInterface}
                    onUpdateComplete={this.props.onUpdateComplete}
                    onDelete={this.onDelete.bind(this, wanSettings._groupIndex,wanSettings._id)}
                    renderWanStatus={renderWanStatus}
                />);
                break;
            case 'cellular':
                const wanCellularData = {
                    'cellular': {
                        groupIndex: parseInt(InterfaceIndex - 1),
                        collections: ['state','settings']
                    },
                    'wan': {
                        groupIndex: wanSettings._groupIndex,
                        collections: ['state']
                    }
                };
                wanAccordion = (<WanCellular
                    key={wanSettings._id}
                    getData={wanCellularData}
                    context={this.props.context}
                    location={this.props.location}
                    wanSettings={wanSettings}
                    updateState={this.props.updateState.bind(this)}
                    goToInterface={this.goToInterface}
                    onUpdateComplete={this.props.onUpdateComplete}
                    onDelete={this.onDelete.bind(this, wanSettings._groupIndex,wanSettings._id)}
                    renderPassword={this.props.renderPassword.bind(this)}
                    renderWanStatus={renderWanStatus}
                />);
                break;
        }

        return (
            <li key={wanSettings._id}>
                <div className="accordion-title">WAN {wanGroupIndex} </div>
                {wanAccordion}
            </li>
        );
    }


    render() {
        return (
            <div>
                <div className="page-header">
                    <div className="page-title">
                        Wide Area Networks (WAN)
                    </div>
                </div>
                <div className='page-container'>
                    <div className="inner-container">
                        {/* TODO : Uncomment after New Wan component is ready
                         <ul className="new-container">
                         <li><WanNew/></li>
                         </ul>*/}
                        <ul className="sub-container accordionUl">
                            {this.props.wan.settings ?
                                this.props.wan.settings.map(settings =>
                                    settings.interface !== 'none' ?
                                        this.renderWan(settings) :
                                        null
                                )
                                :
                                null
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export const WanWrapper = Wrapper(WanAccordions);

const WanConfig = composeWithTracker(getCustomData)(WanWrapper);

WanConfig.propTypes = {
    context: PropTypes.object.isRequired,
    getData: PropTypes.object,
    location: PropTypes.object,

    dataReady: PropTypes.bool,
    wan: PropTypes.object,
};