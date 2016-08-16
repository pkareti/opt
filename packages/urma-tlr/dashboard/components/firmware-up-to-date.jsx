import {default as React, Component, PropTypes } from 'react';
import { getStateData, getStateDataList } from '../../data-containers/state-data-containers';
import { composeWithTracker } from 'react-komposer';
import FirmwareStatus from '../../firmware/firmware-status-helpers';
import Urma from 'meteor/digi:urma-core';

let StatusIcon = Urma.StatusIcon;
let findMostRecentVersion = FirmwareStatus.findMostRecentVersion;
let parseCurrentFWVersion = FirmwareStatus.parseCurrentFWVersion;


export const FirmwareUpToDate = (props) => {
    let isMostRecent;

    if (props.firmware_files) {
        let availableFWVers = props.firmware_files.available_images.file;
        let mostRecent = findMostRecentVersion(availableFWVers).version;
        let current = parseCurrentFWVersion(props.firmware_version).currentVersion;
        isMostRecent = current === mostRecent;
    }

    return (
        <div>
            <StatusIcon condition={isMostRecent === true}/>
        </div>
    );
};


FirmwareUpToDate.propTypes = {
    firmware_version: PropTypes.string.isRequired,
    firmware_files: PropTypes.object.isRequired
};

export default FirmwareUpToDate;