const probeHostValidations = {
    maxLength: 256
};
const probeHostValidationErrs = 'Probe Host is IPv4 or fully qualified domain name (FQDN) and cannot be more than 256 characters in length';
const timeoutValidations = {
    isNumeric: true,
    minValue: 10,
    maxValue: 3600
};
const timeoutValidationErrs = 'Timeout must have a minimum value of 10 seconds and maximum of 3600 seconds';
const probeTimeoutValidations = {
    isNumeric: true,
    minValue: 1,
    maxValue: 60
};
const probeTimeoutValidationErrs = 'Probe Timeout must have a minimum value of 1 second and maximum of 60 seconds';
const probeIntervalValidations = {
    isNumeric: true,
    minValue: 1,
    maxValue: 3600
};
const probeIntervalValidationErrs = 'Probe Interval must have a minimum value of 1 seconds and maximum of 3600 seconds';
const probeSizeValidations = {
    isNumeric: true,
    minValue: 64,
    maxValue: 1500
};
const probeSizeValidationErrs = 'Probe Size must have minimum of 64 and maximum of 1500';
const activateAfterValidations = {
    isNumeric: true,
    minValueField: {
        'minvalue': 0,
        'field': 'activateAfterUnit'
    },
    maxValueField: {
        'maxvalue': 3600,
        'field': 'activateAfterUnit'
    }
};
const activateAfterValidationErrs = 'Activate After must have a minimum value of 0 seconds and maximum of 3600 seconds';
const retryAfterValidations = {
    isNumeric: true,
    minValueField: {
        'minvalue': 0,
        'field': 'retryAfterUnit'
    },
    maxValueField: {
        'maxvalue': 3600,
        'field': 'retryAfterUnit'
    }
};
const retryAfterValidationErrs = 'Retry After must have a minimum value of 0 seconds and maximum of 3600 seconds';

export default Validations = {
    probeHost: {
        validations: probeHostValidations,
        errors: probeHostValidationErrs
    },
    timeout: {
        validations: timeoutValidations,
        errors: timeoutValidationErrs
    },
    retryAfter: {
        validations: retryAfterValidations,
        errors: retryAfterValidationErrs
    },
    activateAfter: {
        validations: activateAfterValidations,
        errors: activateAfterValidationErrs
    },
    probeSize: {
        validations: probeSizeValidations,
        errors: probeSizeValidationErrs
    },
    probeInterval: {
        validations: probeIntervalValidations,
        errors: probeIntervalValidationErrs
    },
    probeTimeout: {
        validations: probeTimeoutValidations,
        errors: probeTimeoutValidationErrs
    }
};