/* eslint-disable react/prop-types */

/**
 * Default country is based on user location if location cannot  be determined it defaults to United States
 *
 * User location is determined making use of jstz npm package (detects timezone) ,
 * 3stack:country-codes-tz meteor package (detects country code from timezone),
 * and List of countries from (ISO 3166-2) in ../../cellular/country-list.js file
 *
 * */

import { default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import CellularConfig from '../../cellular/components/cellular-config.jsx';
import CelluarRetryDialog from '../../cellular/components/cellular-retry-dialog.jsx';
import CellularSimStatus from '../../cellular/components/cellular-sim-status.jsx';
import { cellular_countries } from '../../cellular/cellular-constants.js';
import { country_list } from '../../cellular/country-list.js';
import jstz from 'jstz';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import Urma from 'meteor/digi:urma-core';

const alerts = Urma.alerts;

export default class Cellular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingRetryDialog: false,
            cellularAPN: '',
            isProviderVerizon: false,
            cellularUsername: '',
            cellularPassword: ''
        };
    }

    getMeteorData() {
        const Settings = this.context.device.Settings;
        const State = this.context.device.State;
        const SubsManager = this.context.device.SubsManager;

        let cellularIntSettings = { _id: '' };
        let cellularIntState = null;
        const search = { _groupName: 'cellular' };
        const searchSettings = { _groupName: 'cellular', _groupIndex: parseInt(this.props.params._groupIndex) };
        const settingsSubscription = SubsManager.subscribe('settings', search);
        const stateSubscription = SubsManager.subscribe('state', search);

        if (settingsSubscription.ready() && stateSubscription.ready()) {
            cellularIntSettings = Settings.findOne(searchSettings);
            cellularIntState = State.findOne(search);
        }

        return {
            cellularIntSettings,
            cellularIntState
        };
    }

    componentWillMount() {
        this.props.buttonConfig(
            '/getting-started/connect',
            '/getting-started/cellular-results',
            this.onVerify.bind(this));
        this.props.enableNext();
    }

    onCellularConfigChanged(configName, configVal) {
        if (configName == 'resetAdvanced') {
            this.setState({
                cellularUsername: '',
                cellularPassword: ''
            });
            /** username and password Not supported for Verizon **/
        } else if (configName == 'isProviderVerizon' && configVal) {
            this.setState({
                isProviderVerizon: configVal,
                cellularUsername: '',
                cellularPassword: ''
            });
        }
        else {
            this.setState({
                [configName]: configVal
            });
        }
    }

    onVerify(e) {
        /** TODO Need to add validation **/
        /** only updating APN may need to update other fields in future **/
        const cellularAPN = this.state.cellularAPN;
        const cellularUsername = this.state.cellularUsername;
        const cellularPassword = this.state.cellularPassword;
        const isProviderVerizon = this.state.isProviderVerizon;
        const cellularSettings = this.data.cellularIntSettings;
        const updateDeviceSettings = this.updateDeviceSettings.bind(this);
        /** If carrier is verizon and apn is not blank, then device is in a weird state. Reset device profile  **/
        if (isProviderVerizon && cellularSettings['apn'] != '') {
            /** Set cellular apn to verizon default and update cellular state = on **/
            updateDeviceSettings(cellularSettings._id, 'vzwinternet');
            /** add 10s delay before setting new apn **/
            setTimeout(function () {
                updateDeviceSettings(cellularSettings._id, cellularAPN, '', '');
            }, 10000);
        } else {
            updateDeviceSettings(cellularSettings._id, cellularAPN, cellularUsername, cellularPassword);
        }

        this.setState({ isShowingRetryDialog: true });
        return {
            transitionToNext: false
        };
    }

    updateDeviceSettings(cellularId, cellularAPN, cellularUsername, cellularPassword) {
        const Settings = this.context.device.Settings;
        /** Setting cellular state off before updating apn **/
        Settings.update(cellularId,
            { $set: { 'state': 'off' } },
            this.onUpdateComplete.bind(this));
        /** update optional cellular config username and password only if not empty  **/
        if (cellularUsername !== '' || cellularPassword !== '') {
            Settings.update(cellularId,
                { $set: { 'apn_username': cellularUsername, 'apn_password': cellularPassword } },
                this.onUpdateComplete.bind(this));
        }
        /** Set cellular apn value and update cellular state = on **/
        Settings.update(cellularId,
            { $set: { 'apn': cellularAPN, 'state': 'on' } },
            this.onUpdateComplete.bind(this));
    }

    onUpdateComplete(err, result) {
        if (err) {
            this.setState({ isShowingRetryDialog: false });
            const reason = err.reason || 'Failed to update settings: ' + err.error;
            alerts.error(reason, 'Update Failed');
        }
    }

    handleCloseProgressDialog(e) {
        this.setState({ isShowingRetryDialog: false });
    }

    getBrowserCountry() {
        /* Detect Browser Country, else we default to the "United States". */
        let country = 'United States';
        const tz = jstz.determine().name();
        const countryCode = CountryCodesTz.countryCodeFromTz(tz);
        const countryArr = country_list.filter(
            function (country_list) {
                return country_list.Code == countryCode;
            }
        );
        if (countryArr[0] != undefined) {
            country = countryArr[0].Name;
        }
        return country;
    }

    renderRetryDialog() {
        return (
            <ModalContainer>
                <ModalDialog>
                    <CelluarRetryDialog onSuccess={this.props.transitionToNext.bind(this)}
                        onClose={this.handleCloseProgressDialog.bind(this)}
                        cellularAPN={this.state.cellularAPN}
                        deviceSettings={this.context.device.Settings}
                        cellularSettingsId={this.data.cellularIntSettings['_id']}
                        cellularIntState={this.data.cellularIntState}
                        onUpdateComplete={this.onUpdateComplete.bind(this)}
                    />
                </ModalDialog>
            </ModalContainer>
        );
    }

    renderCellularConfig() {
        let country = this.getBrowserCountry();
        return (
            <CellularConfig onVerify={this.props.transitionToNext.bind(this)}
                countryConfigData={cellular_countries}
                defaultCountry={country}
                callBackParent={this.onCellularConfigChanged.bind(this)}
            />

        );
    }

    render() {
        return (
            <div className="gsw-container js-wz-cellular">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        {/* <img src="/images/LR54_frontPanel.png" alt="Front Panel"/>*/}
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                        {this.data.cellularIntState ?
                            <CellularSimStatus cellularIntState={this.data.cellularIntState} />
                            :
                            <p>Loading...</p>
                        }
                    </div>
                    <div className="wizard-content-text">
                        <p>Specify any required cellular parameters to connect.</p>
                        <p>Note that some parameters may be optional, such as APN username and password or the SIM
                            PIN.
                        </p>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    {this.renderCellularConfig()}
                    <div>
                        <br />
                        <span className="float-right">Click NEXT to verify.</span>
                    </div>
                    {
                        this.data.cellularIntState && this.state.isShowingRetryDialog && this.renderRetryDialog()
                    }
                </div>
            </div>
        );
    }
}

reactMixin(Cellular.prototype, ReactMeteorData);

Cellular.contextTypes = {
    device: PropTypes.object.isRequired
};
