import {default as React, Component, PropTypes } from 'react';

let _parseCurrentFWVersion = function (currentFw) {
    let currentFwArray = currentFw.split(' ');
    return {
        currentVersion: currentFwArray[0],
        lastUpdateDay: currentFwArray[1] || null,
        lastUpdateTime: currentFwArray[2] || null
    };
}

let _findMostRecentVersion = function (fwFiles) {
    let newestVersion = fwFiles[0];

    if (fwFiles.length === 1) {
        return newestVersion;
    } else {
        for (var fwIndex = 0; fwIndex < fwFiles.length; fwIndex++) {
            let version = fwFiles[fwIndex];

            let newestVersionArray = newestVersion.version.split('.');
            let versionArray = version.version.split('.');

            (function () {
                for (var strIndex = 0; strIndex < newestVersionArray.length; strIndex++) {
                    let newestVersionInt = parseInt(newestVersionArray[strIndex]) || 0;
                    let versionInt = parseInt(versionArray[strIndex]) || 0;

                    if (versionInt > newestVersionInt) {
                        newestVersion = version;
                        return;
                    } else if (versionInt < newestVersionInt) {
                        return;
                    }
                }
            })();

        }
        return newestVersion;
    }
}

export default FirmwareStatus = {
    parseCurrentFWVersion: _parseCurrentFWVersion,
    findMostRecentVersion: _findMostRecentVersion
};