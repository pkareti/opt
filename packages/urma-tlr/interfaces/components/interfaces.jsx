import { default as React, PropTypes } from 'react';
import Wifi from './wifi.jsx';
import Cellular from './cellular.jsx';
import { Wrapper } from '../../wan-config/components/wrapper.jsx';

const wifiSubOptions = {
    sort: { _groupIndex: 1 },
    // fields: { password: 0 }
};

const wifiSub = {
    wifi: {
        collections: ['settings', 'state'],
        options: wifiSubOptions
    },
    wifi5g: {
        collections: ['settings', 'state'],
        options: wifiSubOptions
    },
    lan: {
        collections: ['settings'],
        options: {
            sort: { _groupIndex: 1 },
            fields: { _groupIndex: 1, interfaces: 1, state: 1 }
        }
    },
    wifi_global: {
        groupIndex: 0,
        collections: ['settings'],
    }
};

const cellularSub = {
    cellular: {
        collections: ['settings', 'state'],
        options: {
            sort: { _groupIndex: 1 }
        }
    },
    wan: {
        collections: ['settings'],
        options: {
            sort: { _groupIndex: 1 }
        }
    }
};


export const InterfaceComponent = (props, context) => (
    <div className="js-interfaces">
        <div className="page-header">
            <div className="page-title">
                Interfaces
            </div>
        </div>
        <div className="page-container">
            <div className="inner-container">
                <ul className="sub-container">
                    <li>
                        <div className="js-wifi-title accordion-title">Wi-Fi</div>
                        <Wifi
                            getData={wifiSub}
                            descriptors={['wifi_global', 'wifi']}
                            location={props.location}
                            context={context}
                            onUpdateComplete={props.onUpdateComplete}
                            setWrapperState={props.updateState}
                        />
                        <div className="js-cellular-title accordion-title">Cellular</div>
                        <Cellular
                            getData={cellularSub}
                            context={context}
                            onUpdateComplete={props.onUpdateComplete}
                            setWrapperState={props.updateState.bind(this)}
                            renderPassword={props.renderPassword.bind(this)}
                            location={props.location}
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

InterfaceComponent.propTypes = {
    onUpdateComplete: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
};

InterfaceComponent.contextTypes = {
    device: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
};

export default Interfaces = Wrapper(InterfaceComponent);
