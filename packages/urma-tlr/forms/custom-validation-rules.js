import Formsy from 'formsy-react';

const minValueField = Formsy.addValidationRule('minValueField', (values, value, minField) => {
    return ((value * values[minField.field]) >= minField.minvalue);
});

const maxValueField = Formsy.addValidationRule('maxValueField', (values, value, maxField) => {
    return ((value * values[maxField.field]) <= maxField.maxvalue);
});

const hasValidIpCharacters = Formsy.addValidationRule('hasValidIpCharacters', (values, value, maxField) => {
    if (value === null || value === undefined) {
        return true;
    }
    return !(/[^0-9.]/.test(value));
});

export default ValidationRules = {
    hasValidIpCharacters,
    minValueField: minValueField,
    maxValueField: maxValueField
};
