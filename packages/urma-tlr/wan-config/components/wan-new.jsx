import { default as React, Component, PropTypes } from 'react';
import Urma from 'meteor/digi:urma-core';

let Accordion = Urma.Accordion;

export default class WanNew extends Component {
    constructor() {
        super();
    }

    render() {
        const buttons = [
            {
                buttonText: 'Apply',
                onclick: 'abc()',
                className: 'btn-blue'
            },
            {
                buttonText: 'Cancel',
                onclick: 'abc()',
                className: 'btn-gray'
            }
        ];

        return (
            <Accordion title="New WAN Connection" hidebutton="Delete" key="new1" data-id="new1" buttons={buttons}>
                WAN/ETH1
                Interface : eth1 DHCP : client IP Address : 50.244.223.29 Mask : 255.255.255.252 DNS1 : 8.8.8.8 DNS2 :
                8.8.4.4 NAT : On Gateway : 50.244.223.30 MTU : 1500 Speed : Auto Duplex : Auto
                Probing
                Probe Host:
                xxx.xxx.xxx.xxx
                Probe Interval:
                secondsProbe Size:
                bytesProbe Timeout
            </Accordion>

        );
    }
}

