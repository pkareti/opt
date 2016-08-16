import {default as React, PropTypes } from 'react';

export const ConfirmDialog = React.createClass({
    render() {
        return (
            <div className="js-confirm-dialog dlgModal" style={{minWidth: '300px', maxWidth: '500px'}}>
                <div className="confirmation-msg">
                    <h5>{this.props.header}</h5>
                    <p>{this.props.message}</p>
                </div>

                <div style={{float: 'right'}}>
                    <button type='button' id="okBtn" className="btn-blue js-ok-btn" style={{margin: '10px'}}
                        onClick={this.props.onDialogOk.bind(this)}>
                        OK
                    </button>
                    <button type='button' id="cancelBtn" className="btn-gray js-cancel-btn" style={{margin: '10px'}}
                        onClick={this.props.onDialogCancel.bind(this)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
});

ConfirmDialog.propTypes = {
    onDialogCancel: PropTypes.func.isRequired,
    onDialogOk: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
};