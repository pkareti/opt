import {Collections} from 'meteor/digi:urma-core';
import ccSimulator from './cellular-simulator.js';

let log = new Logger('server/collection-hooks');

const Settings = Collections.Settings;
const State = Collections.State;

Settings.after.update(function (userId, doc, fieldNames, modifier, options) {
    if(doc._groupName === "cellular"){
        log.debug('After updating cellular settings');
        ccSimulator.simulateCellularConnection();
    }

    if (doc._groupName === "wan") {
        log.debug('After updating ethernet settings');

        const modifier = {};
        if (doc.dhcp === 'on') {
            modifier.$set = {
                dhcp: 'on',
                ip_address: '192.168.1.104',
                mask: '255.255.255.0',
                gateway: '192.168.1.1',
                dns1: '8.8.4.4',
                dns2: '8.8.8.8',
            };
        } else if (doc.dhcp === 'off') {
            modifier.$set = {
                dhcp: 'off',
                ip_address: doc.ip_address,
                mask: doc.mask,
                gateway: doc.gateway,
                dns1: doc.dns1,
                dns2: doc.dns2,
            };
        }
        State.update({ _groupName: "wan", _groupIndex: doc._groupIndex}, modifier);
    }
}, {fetchPrevious: false});
