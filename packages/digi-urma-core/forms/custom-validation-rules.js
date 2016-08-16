import Formsy from 'formsy-react';

const isExisty = function (value) {
    return value !== null && value !== undefined;
};

const isEmpty = function (value) {
    return value === '';
};

const hasAtLeastOneCharAndOneLetter = Formsy.addValidationRule('hasAtLeastOneCharAndOneLetter', (values, value)=> {
    let matchValue = function (valString) {
        if (valString) {
            return valString.match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+])/);
        } else {
            return true;
        }
    };

    return matchValue(value);
});

const equalsFieldOrEmpty = Formsy.addValidationRule('equalsFieldOrEmpty', (values, value, field)=> {
    if ((value == values[field]) || (typeof value === 'undefined' && values[field] === '') || (typeof values[field] === 'undefined' && values === '')) {
        return true;
    } else {
        return false;
    }
});

const minValue = Formsy.addValidationRule('minValue', (values, value, minvalue) => {
    if (typeof value === 'string') {
        value = value.trim();
    }
    // use require if field must be set
    return isEmpty(value) || value >= minvalue;
});

const maxValue = Formsy.addValidationRule('maxValue', (values, value, maxvalue) => {
    if (typeof value === 'string') {
        value = value.trim();
    }
    // use require if field must be set
    return isEmpty(value) || value <= maxvalue;
});

/** maxLengthCustom is used to validate maximum length of field.
 * Formsy has a maxLength validation but it does not work well
 * for numbers
 */
const maxLengthCustom = Formsy.addValidationRule('maxLengthCustom', (values, value, length) => {
    if(isExisty(value)){
        value = value.toString();
    }
    return !isExisty(value) || value.length <= length;
});

/** minLengthCustom is used to validate minimum length of field.
 * Formsy has a minLength validation but it does not work well
 * for numbers
 */
const minLengthCustom = Formsy.addValidationRule('minLengthCustom', (values, value, length) => {
    if(isExisty(value)){
        value = value.toString();
    }
    return !isExisty(value) || isEmpty(value) || value.length >= length;
});

export default ValidationRules = {
    equalsFieldOrEmpty,
    hasAtLeastOneCharAndOneLetter,
    minValue,
    maxValue,
    maxLengthCustom,
    minLengthCustom
};
