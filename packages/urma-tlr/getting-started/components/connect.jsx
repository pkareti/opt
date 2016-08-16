import { default as React, Component, PropTypes } from 'react';


const cellularRoute = {
    pathname: '/getting-started/cellular/0',
    query: { device: 'cellular' }
};

const ethernetRoute = {
    pathname: '/getting-started/ethernet-results',
    query: { device: 'ethernet' }
};

export default class Connect extends Component {
    constructor(props) {
        super(props);

        const ethernetQuery = this.props.location.query && this.props.location.query.device === 'ethernet';
        const connectType = ethernetQuery ? 'Ethernet' : 'Cellular';
        this.state = { connectType };
    }

    componentWillMount() {
        const nextRoute = this.state.connectType === 'Ethernet' ? ethernetRoute : cellularRoute;
        this.props.buttonConfig('/getting-started/change-password', nextRoute);
        this.props.enableNext();
    }

    onChange(event) {
        this.setState({ connectType: event.target.value });
        const back = '/getting-started/change-password';
        const next = (event.target.value === 'Ethernet') ? ethernetRoute : cellularRoute;
        this.props.buttonConfig(back, next);
        this.props.enableNext();
    }

    render() {
        return (
            <div className="gsw-container js-wz-select-connection">
                <div className="wizard-content-area-left">
                    <div className="wizard-images">
                        <img src="/images/LR_frontPanel.jpg" alt="Front Panel" />
                        <img src="/images/LR_backPanel.jpg" alt="Back Panel" />
                    </div>
                    <div className="wizard-content-text">
                        <p>Select the desired WAN connection type from the choices to the right.</p>
                        <p>Ensure that the appropriate hardware is connected, such as external antennae, Ethernet cables
                            or SIM cards.
                        </p>
                        <p>Refer to the quick start guide as needed to help with hardware connections.</p>
                    </div>
                </div>
                <div className="wizard-content-area-right">
                    <form>
                        <p>Select WAN connection type</p>
                        <div className="box">
                            <label><input type="radio" className="form-control" name="connectionType"
                                value="Cellular" checked={this.state.connectType === 'Cellular'}
                                onChange={this.onChange.bind(this)}
                            />Cellular</label>
                        </div>
                        <div className="box">
                            <label><input type="radio" className="form-control" name="connectionType"
                                value="Ethernet" checked={this.state.connectType === 'Ethernet'}
                                onChange={this.onChange.bind(this)}
                            />Ethernet</label>
                        </div>

                        <p>Click NEXT to continue</p>
                    </form>
                </div>
            </div>
        );
    }
}


Connect.propTypes = {
    location: PropTypes.object.isRequired,
    buttonConfig: PropTypes.func.isRequired,
    enableNext: PropTypes.func.isRequired,
};
