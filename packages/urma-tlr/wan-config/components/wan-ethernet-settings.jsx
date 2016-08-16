import { default as React, Component, PropTypes } from 'react';
import { UrmaForms } from 'meteor/digi:urma-core';
import Validations from '../../forms/validations.js';

const IpAddressInput = UrmaForms.IpAddressInput;
const Form = UrmaForms.Formsy.Form;
const Input = UrmaForms.Input;
const InputNoValidate = UrmaForms.InputNoValidate;

export default class WanEthernetSettings extends Component {
    constructor(props) {
        super(props);

        const settings = props.wanSettings || {};
        this.state = {
            hidden: settings.dhcp === "on",
            ethWanSettings: {}
        };
    }

    componentDidMount() {
        // initialize this.state.ethWanSettings from form values
        const settings = this.refs.form.getModel();
        settings.valid = this.isFormValid();
        settings.changed = false;
        this.setState({ ethWanSettings: settings });

        this.props.setEthSettings(settings);
    }

    resetForm(values) {
        this.refs.form.reset(values);
    }

    // change event fires before setValid & setInvalid.
    // isChanged looks at form initial values from render (pristine), not previously set values
    markSettingsChanged(currentValues, isChanged) {
        const currentSettings = this.state.ethWanSettings;

        // verify form values are different from previously set state settings (not pristine values)
        let updateState = false;
        Object.keys(currentValues).forEach(function (key) {
           if (currentValues[key] !== currentSettings[key]) {
               updateState = true;
           }
        });

        if (updateState) {
            const settings = currentValues;
            settings.changed = true;

            const isValid = this.isFormValid();
            settings.valid = isValid;

            this.setState({
                ethWanSettings: settings,
                hidden: settings.dhcp === "on",
            });
            this.props.setEthSettings(settings);
        }
    }

    isFormValid() {
        let valid = true;

        // don't need to validate if dhcp is on since that's the only field rendered
        //  -> on change fires before fields hidden
        const dhcp = this.refs.form.inputs[0].getValue();
        if (dhcp !== 'on') {
            // check if inputs are valid... need to fetch latest with getValue because
            // formsy validation may not have run
            this.refs.form.inputs.forEach(input => {
                if (!input.isValidValue(input.getValue())) {
                    valid = false;
                }
            });
        }
        return valid;
    }


    render() {
        const invalidSubmission = this.props.submitted && !this.state.ethWanSettings.valid;
        // if IP has not previously been set, set default manual ip
        const defaultIp = !this.props.wanSettings.ip_address && this.props.wanSettings.dhcp === 'off'
        ? '0.0.0.0' : this.props.wanSettings.ip_address;

        const dhcpOptions = [
            { title: 'Manually', value: 'off' },
            { title: 'DHCP', value: 'on' }
        ];

        const tableRows = [
            { label: 'IPv4:', name: 'ip_address', value: defaultIp, required: true },
            { label: 'Netmask:', name: 'mask', value: this.props.wanSettings.mask, required: true },
            { label: 'Gateway:', name: 'gateway', value: this.props.wanSettings.gateway, required: true },
            { label: 'DNS1:', name: 'dns1', value: this.props.wanSettings.dns1, required: false },
            { label: 'DNS2:', name: 'dns2', value: this.props.wanSettings.dns2, required: false }
        ];


        return (
            <div className="alignPadd">
                <Form ref='form' className="js-wan-eth-settings"
                    onChange={this.markSettingsChanged.bind(this)}>
                    <div className="fullW">
                        <div className="row">
                            <div className="panel-two-column js-wan-eth-label">Configure Using:</div>
                            <div className="panel-two-column">
                                <div className="fieldVal fullW">
                                    <InputNoValidate
                                            name="dhcp"
                                            className="js-wan-eth-input"
                                            type="select"
                                            options={dhcpOptions}
                                            value={this.props.wanSettings.dhcp}/>
                                </div>
                            </div>
                        </div>
                        {tableRows.map((row, i) => {
                            if (!this.state.hidden) {
                                return (
                                    <div className="row" key={row.name+i}>
                                        <div className="panel-two-column  js-wan-eth-label">{row.label}</div>
                                        <div className="panel-two-column">
                                            <div className="fieldVal fullW">
                                                <Input
                                                name={row.name}
                                                className="js-wan-eth-input"
                                                type="text"
                                                invalidSubmission={invalidSubmission}
                                                validations={Validations.ipv4.validations}
                                                validationErrors={Validations.ipv4.errors}
                                                value={row.value}
                                                required={row.required ? true : false}/>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </Form>
            </div>
        );
    }
}

WanEthernetSettings.propTypes = {
    wanSettings: PropTypes.object.isRequired,
    setEthSettings: PropTypes.func.isRequired,
    submitted: PropTypes.bool.isRequired
};
