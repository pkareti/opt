import {default as React, Component, PropTypes} from 'react';

export const rows = [
    {label: 'APN', value: 'apn',className: 'apn'},
    {label: 'Username', value: 'apn_username',className: 'apn-username'},
    {label: 'Password', value: 'apn_password',className: 'apn-password'},
    {label: 'SIM PIN', value: 'sim_pin',className: 'sim-pin'},
    {label: 'Preferred Mode', value: 'preferred_mode',className: 'preferred-mode'},
    {label: 'Connection Attempts', value: 'connection_attempts',className: 'connection-attempts'},
    {label: 'State', value: 'state',className: 'state'},
];

export default class CellularDetails extends Component {

    handleChange(selectedInterface,props) {
        if (props.changed) {
            const showDialog = {
                dialog: 'change',
                header: 'Change Interface',
                message: 'You will lose any changes not saved.'
                + ' Are you sure you want to change interfaces?',
                onDialogOk: function() {
                    props.setParentState({
                        selectedInterface: selectedInterface,
                        changed: false,
                    });
                    props.setWrapperState('showDialog', {});
                }
            };
            props.setWrapperState('showDialog', showDialog);
        } else {
            props.setParentState({ selectedInterface })
        }
    }
    
    renderWanInfo(cellularIndex) {
        let wanInterface = 'cellular' + cellularIndex;
        let wanIndex = 'available';
        let wanSettings = this.props.wanSettings;
        for (var i = 0; i < wanSettings.length; i++) {
            if (wanSettings[i].interface == wanInterface) {
                wanIndex = (wanSettings[i]._groupIndex + 1);
                break;
            }
        }

        if (wanIndex === 'available') {
            return (<strong>{wanIndex}</strong>);
        } else {
            const wanName = 'wan' + wanIndex;
            const wanDisplay = 'WAN' + wanIndex;
            return (
                <a onClick={this.props.goToWan.bind(this,wanName)} className="js-wan-link">
                    <strong>{wanDisplay}</strong>
                </a>
            );
        }
    }

    render() {
        const self = this;
        const props = this.props;
        return (
            <div className="cellular-details js-interface-cellular-settings">
                {
                    props.cellularSettings && props.wanSettings ?
                        <ul className="table-container">
                            {props.cellularSettings.map(function (settings) {
                                const isChecked = props.selectedInterface === 'cellular' + (settings._groupIndex + 1);
                                return (
                                    <li key={settings._groupIndex}
                                        className={'js-cellular-' + (settings._groupIndex +1)}>
                                        <div className="js-selection">
                                            <input type="radio"
                                                   ref={'cellular'+(settings._groupIndex +1)}
                                                   className={'js-radio-'+(settings._groupIndex +1)}
                                                   name="cellularSelection"
                                                   value={'cellular'+(settings._groupIndex +1)}
                                                   checked={isChecked}
                                                   onChange={self.handleChange.bind(this,'cellular'+(settings._groupIndex +1),props)}/>
                                            <label className="js-label"
                                                   key={'cellular'+(settings._groupIndex +1)}>
                                                Cellular {settings._groupIndex + 1}
                                            </label>
                                        </div>
                                        <div className="table-responsive">
                                            <table>
                                                <tbody>
                                                <tr className="js-wan">
                                                    <td className="js-label">WAN:</td>
                                                    <td className="js-value">
                                                        {self.renderWanInfo(settings._groupIndex + 1)}
                                                    </td>
                                                </tr>
                                                {rows.map(function (row, i) {
                                                    return (
                                                        <tr key={i}
                                                            className={'js-'+row.className}>
                                                            <td className="js-label">{row.label}:</td>
                                                            <td className="js-value">
                                                                <strong>
                                                                    {row.value != 'apn_password' ?
                                                                        settings[row.value]
                                                                        :
                                                                        props.renderPassword(settings[row.value])
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
                    :
                        null
                }
            </div>
        );
    }
}

CellularDetails.propTypes = {
    setParentState: PropTypes.func.isRequired,
    cellularSettings: PropTypes.array.isRequired,
    wanSettings: PropTypes.array.isRequired,
    goToWan: PropTypes.func.isRequired,
    changed: PropTypes.bool.isRequired,
    selectedInterface: PropTypes.string.isRequired,
    renderPassword: PropTypes.func.isRequired
};
