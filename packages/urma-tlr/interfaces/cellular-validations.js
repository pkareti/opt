const descriptionValidations = {
  maxLengthCustom: 63
};
const descriptionValidationErrs = 'The cellular interface description cannot be more than 63 characters';
const apnValidations = {
  maxLengthCustom: 63
};
const apnValidationErrs = 'The Access Point Name (APN) for the cellular interface cannot be more than 63 characters';
const apnPasswordValidations = {
  maxLengthCustom: 128
};
const apnPasswordValidationErrs = 'The APN password cannot be more than 128 characters';
const connectionAttemptsValidations = {
  isNumeric: true,
  minValue: 10,
  maxValue: 500
};
const connectionAttemptsValidationErrs = 'The number of attempts to establish a cellular connection must be between 10 and 500';

const simPinValidations = {
  maxLengthCustom: 4
};
const simPinValidationErrs = 'Sim Pin cannot be more than 4 characters';


export default Validations = {
  description: {
    validations: descriptionValidations,
    errors: descriptionValidationErrs
  },
  apn: {
    validations: apnValidations,
    errors: apnValidationErrs
  },
  apnPassword: {
    validations: apnPasswordValidations,
    errors: apnPasswordValidationErrs
  },
  connectionAttempts: {
    validations: connectionAttemptsValidations,
    errors: connectionAttemptsValidationErrs
  },
  simPin: {
    validations: simPinValidations,
    errors: simPinValidationErrs
  }
};