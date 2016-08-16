import { default as React, PropTypes } from 'react';
import { Logger } from 'meteor/jag:pince';

const log = new Logger('widget_status');

export const supportedStatuses = {
    ok: {
        icon: 'status ok',
        text: 'OK'
    },
    error: {
        icon: 'status danger',
        text: 'ERROR'
    }
 };

const Status = (props) => {
    const status = props.status;

    // if type is provided, make sure it is a supported status type
    let typeObj;
    if (status.type) {
        typeObj = supportedStatuses[status.type];
        if (!typeObj) {
            log.info('Status type is not supported.');
            return null;
        }
    }

    // if no type passed, verify icon and text were specified
    if (!status.type && (!status.icon || !status.text)) {
        log.info('Status icon and text were not provided.  Did you mean to provide a status type?');
        return null;
    }

    // default to icon/text fields in status prop, if provided
    const iconClass = status.icon || typeObj.icon;
    const text = status.text || typeObj.text;

    return (
        <div className="js-accordion-status">
            <span className={iconClass} />
            {text}
        </div>
    );
};


// Requires icon and text, unless type a supported status type is provided
Status.propTypes = {
    status: PropTypes.shape({
      type: React.PropTypes.string,
      icon: React.PropTypes.string,
      text: React.PropTypes.string
    }),
};

export default Status;
