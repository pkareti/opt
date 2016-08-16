const userValidations = {
    maxLength: 128
};
const userValidationErrs = {
    maxLength: 'Username cannot be more than 128 characters in length.'
};
const passwordValidations = {
    minLength: 8,
    hasAtLeastOneCharAndOneLetter: true
};
const passwordValidationErrs = {
    minLength: 'Password must be at least 8 characters in length.',
    hasAtLeastOneCharAndOneLetter: 'Password must contain at least one letter and one special character !@#$%^&*()_+.'
};

const ipv4Validations = {
    hasValidIpCharacters: true,
    matchRegexp: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};
const ipv4Errs = {
    hasValidIpCharacters: 'Must use integers separated by "."',
    matchRegexp: 'Invalid IP address',
};


export default Validations = {
    username: {
        validations: userValidations,
        errors: userValidationErrs
    },
    password: {
        validations: passwordValidations,
        errors: passwordValidationErrs
    },
    ipv4: {
        validations: ipv4Validations,
        errors: ipv4Errs
    },
};
