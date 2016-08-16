import {default as React, Component, PropTypes } from 'react';
import Urma from 'meteor/digi:urma-core';

export function getCliOutputData(props, onData) {
    let CliOutput = props.context.device.CliOutput;
    let SubsManager = props.context.device.SubsManager;
    let search = {};
    let subscription = SubsManager.subscribe('cli_messages', search);

    onData(null, { subscription: subscription });

    // if (subscription.ready()) {
    //     const data = {};
    //     data['ready'] = true;
    //     // let cursor = CliOutput.find(search);
    //     // cursor.observe({
    //     //   added: function(message) {
    //     //
    //     //   }
    //     // })
    //     // data['messages'] = CliOutput.find(search).fetch();
    //     data['cursor'] = CliOutput.find(search);
    //     onData(null, data);
    // } else {
    //     onData(null, {ready: false});
    // }
}
