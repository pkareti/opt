import {default as React, Component, PropTypes} from 'react';
import Urma from 'meteor/digi:urma-core';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {ConfirmDialog} from './confirmation-dialog.jsx';

let alerts = Urma.alerts;

export const Wrapper = InnerComponent => class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: {}
        };
    }

    updateState(state, value) {
        this.setState({
            [state]: value
        });
    }

    onUpdateComplete(err, result) {
        if (err) {
            let reason = err.reason || 'Failed to update settings: ' + err.error;
            alerts.error(reason, 'Update Failed');
        }
    }

    onDialogCancel() {
        this.setState({ showDialog: {} });
    }

    renderPassword(value){
        if (value === null || value === undefined || value === '') {
            return null;
        }else{
            return 'configured';
        }
    }

    renderDialog() {
        const type = this.state.showDialog.dialog;

        return (
            <ModalContainer>
                <ModalDialog>
                    <ConfirmDialog key={type + "_dialog"}
                        header={this.state.showDialog.header}
                        message={this.state.showDialog.message}
                        onDialogOk={this.state.showDialog.onDialogOk.bind(this)}
                        onDialogCancel={this.onDialogCancel.bind(this)}/>
                </ModalDialog>
            </ModalContainer>
        );
    }

    render() {
        return (<div>
            <InnerComponent updateState={this.updateState.bind(this)}
                onUpdateComplete={this.onUpdateComplete.bind(this)}
                renderPassword={this.renderPassword.bind(this)}
                {...this.state}
                {...this.props}/>
            {this.state.showDialog && this.state.showDialog.dialog && this.renderDialog()}
        </div>);
    }
};
