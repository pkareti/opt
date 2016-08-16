import { default as React, Component, PropTypes } from 'react';
import _ from 'lodash';


export const rows = [
    { label: 'Network', value: 'network' },
    { label: 'SSID', value: 'ssid' },
    { label: 'Description', value: 'description' },
    { label: 'State', value: 'state' },
    { label: 'Broadcast SSID', value: 'broadcast_ssid' },
    { label: 'Security', value: 'security' },
];

export default class WifiDetails extends Component {
    handleChange(props) {
        const selectedInterface = this; // this -> bound to change handler
        if (props.changed) {
            const showDialog = {
                dialog: 'change',
                header: 'Change Interface',
                message: 'You will lose any changes not saved.'
                         + ' Are you sure you want to change interfaces?',
                onDialogOk() {
                    props.setParentState({ selectedInterface });
                    props.setWrapperState('showDialog', {});
                }
            };
            props.setWrapperState('showDialog', showDialog);
        } else {
            props.setParentState({ selectedInterface });
        }
    }

    goToLan(path) {
        const self = this;
        if (self.props.changed) {
            const showDialog = {
                dialog: 'lan',
                header: 'Confirmation',
                message: 'Your changes will be lost. Are you sure you want to navigate to Lan-Networks?',
                onDialogOk() {
                    self.props.setWrapperState('showDialog', {});
                    self.props.context.router.push(path);
                }
            };
            self.props.setWrapperState('showDialog', showDialog);
        } else {
            self.props.context.router.push(path);
        }
    }

    getNetwork(interfaceName) {
        const lans = this.props.lan.settings;
        let network = 'available';
        let href = null;
        lans.forEach(lan => {
            const lanInterfaces = (lan.interfaces && lan.interfaces.split(',')) || [];
            if (_.includes(lanInterfaces, interfaceName)) {
                network = `LAN ${lan._groupIndex + 1} (${lan.state})`;
                href = `/local-networks?open=lan${lan._groupIndex + 1}`;
            }
        });

        return { network, href };
    }

    interfaceHasError(wifiState) {
        if (wifiState.admin_status === 'up') {
            return wifiState.oper_status !== 'up';
        }

        return false;
    }

    render() {
        const self = this;
        const props = this.props;
        const group = props.wifi ? 'wifi' : 'wifi5g';
        const wifiItems = props[group].settings; // wait for ready at parent
        const type = props.wifi ? '2.4' : '5';

        return (
            <div className={'wifi-details js-wifi-details js-' + group}>
                <ul className="table-container">
                {wifiItems.map(function (item, index) {
                    const wifiIndex = item._groupIndex + 1;
                    const wifiId = group + wifiIndex;

                    // network check:
                    const networkObj = self.getNetwork(wifiId);
                    item.network = networkObj.network;
                    item.href = networkObj.href;

                    const selectedInterfaceName = `${props.selectedInterface._groupName}${props.selectedInterface._groupIndex + 1}`;
                    const isChecked = selectedInterfaceName === wifiId;
                    const hasError = self.interfaceHasError(props[group].state[index]);

                    return (
                        <li key={index} className={'js-' + wifiId}>
                            <label htmlFor={wifiId}>
                                <input name={wifiId} id={wifiId} type="radio"
                                  onChange={self.handleChange.bind(item, props)} checked={isChecked}
                                />
                                <span className="interface-header js-wifi-header">
                                    Wi-Fi {type}GHz {wifiIndex} ({wifiId})
                                    {hasError ? <span className="js-interface-error status danger" /> : null}
                                </span>
                            </label>

                            <div className="table-responsive">
                                <table>
                                    <tbody>
                                        {rows.map(function (row, j) {
                                            return (
                                                <tr key={j}>
                                                    <td className="js-label">{row.label}: </td>
                                                    <td className="js-value">
                                                        <strong>
                                                        {
                                                            row.value === 'network' && item.href ?
                                                            <a className={'js-lan-path'} onClick={self.goToLan.bind(self, item.href)}>
                                                                {item[row.value]}
                                                            </a> :
                                                            <span className={`js-value-${row.value}`}>{item[row.value]}</span>
                                                        }
                                                        </strong>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </li>
                    );
                })}
                </ul>
            </div>
        );
    }
}


WifiDetails.propTypes = {
    context: PropTypes.object.isRequired,
    wifi: PropTypes.object, // wifi or wifi5g are required
    wifi5g: PropTypes.object,
    lan: PropTypes.object.isRequired,
    changed: PropTypes.bool.isRequired,
    setWrapperState: PropTypes.func.isRequired,
    setParentState: PropTypes.func.isRequired,
    selectedInterface: PropTypes.object.isRequired,
};
