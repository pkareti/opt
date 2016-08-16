import {default as React, Component, PropTypes } from 'react';

/**
 * StatusIcon
 * @props
 * One prop is required:
 * condition: if true 'ok' icon will be displayed
 */

let StatusIcon = (props) => {
    if (props.condition) {
        return <span className="status ok"></span>;
    } else {
        return <span className="status danger"></span>;
    }
};

StatusIcon.propTypes = {
    condition: PropTypes.bool.isRequired
};

export default StatusIcon;