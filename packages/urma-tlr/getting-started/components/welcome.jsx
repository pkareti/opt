/* eslint-disable react/prop-types */

import React from 'react';

// buttonConfig passed down from wizard. Takes three arguments--route for back button,
// route for the next button, function to be called when next button is clicked.

export default class Welcome extends React.Component {

    componentWillMount() {
        this.props.buttonConfig(null, { pathname: '/getting-started/login', text: 'Start Device Setup' });
        this.props.enableNext();
    }

    render() {
        return (
            <div className="gsw-container js-wz-welcome">
                <h1>Welcome to the Getting Started Wizard</h1>
                <div className="wizard-content-area-left">
                    <p>Getting Started Wizard will assist you with :</p>
                    <ol className="default">
                        <li>Connecting your device to a Wide Area Network</li>
                        <li>Updating the device's firmware</li>
                        <li>Registering the device with Digi Remote Manager</li>
                    </ol>
                    <p>Locate the Quick Start Guide, included in the package and referenced below.</p>
                    <p>Click on START DEVICE SETUP, on the lower-right.</p>
                    <div className="margin-top">
                        <div className="wizard-link">
                            <a className="js-quick-start-guide" href="http://www.digi.com/resources/documentation/digidocs/pdfs/90001460-88.pdf" target="_blank" rel="noopener noreferrer"><img border="0" alt="quick start guide" src="/images/quick_start_guide.png" width="50" height="50" />
                                <p>Quick Start Guide</p>
                            </a>
                        </div>
                        <div className="wizard-link">
                            <a className="js-user-manual" href="http://www.digi.com/resources/documentation/digidocs/90001461/default.htm" target="_blank" rel="noopener noreferrer"><img border="0" alt="online user manual" src="/images/online_user_manual.png" width="50" height="50" />
                                <p>Online User Manual</p>
                            </a>
                        </div>
                    </div>

                </div>
                <div className="wizard-content-area-right">
                    <img src="/images/LR54-AW401_Ant_5x5.jpg" alt="LR54" />
                </div>
            </div>
        );
    }
}

