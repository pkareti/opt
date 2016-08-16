import Validations from '../forms/validations.js';
import _ from 'lodash';


const wifiValidations = {
    ssid: {
        validations: {
            maxLength: 32
        },
        errors: 'SSID cannot be more than 32 characters in length'
    },
    password: {
        validations: {
            minLength: 8,
            maxLength: 64
        },
        errors: 'Password for the Wi-Fi interface must be 8 to 64 characters in length'
    },
    description: {
        validations: {
            maxLength: 255
        },
        errors: 'Description cannot be more than 255 characters in length'
    },
    radius_server: Validations.ipv4,
    radius_server_port: {
        validations: {
            minValue: 1,
            maxValue: 65535,
        },
        errors: 'Port number must be between 1 and 65535'
    }
};

export default wifiValidations;
