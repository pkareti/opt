import React from 'react';

const WanEthernetInterface = (props) => {
    const state = props.state;

    return (
        <div className="js-wan-eth-interface alignPadd">
            <div className="interfaceWrapper fullW">
                <div className="row interface">
                    <div className="panel-two-column">Interface:</div>
                    <div className="panel-two-column">
                        <div className="fieldVal">
                            <a onClick={props.goToInterface} className="interface-link js-interface-link">
                                ethernet{state._groupIndex + 1}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="panel-two-column js-label">State:</div>
                    <div className="panel-two-column">
                        <div className="fieldVal js-value">{state.oper_status}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="panel-two-column js-label">Description:</div>
                    <div className="panel-two-column">
                        <div className="fieldVal js-value">{state.description}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="panel-two-column js-label">Speed:</div>
                    <div className="panel-two-column">
                        <span className="js-value fieldVal">{state.link_speed}</span>
                        <div className="fieldVal">MBPS</div>
                    </div>
                </div>
                <div className="row">
                    <div className="panel-two-column js-label">Duplex:</div>
                    <div className="panel-two-column">
                        <div className="fieldVal js-value">{state.link_duplex}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

WanEthernetInterface.propTypes = {
    state: React.PropTypes.object.isRequired,
    goToInterface: React.PropTypes.func.isRequired
};

export default WanEthernetInterface;