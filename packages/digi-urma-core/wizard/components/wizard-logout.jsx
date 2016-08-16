import React from 'react';
import Login from '../../security/login.js';

export default class WizardLogout extends Login {
    render() {
        return (
            <div className="wizard-buttons">
                <button className="logout" onClick={this.logout}>Logout</button>
            </div>
        )
    }
}