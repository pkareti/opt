/**
 * "getCustomData" can be used to get various collection results for any provided group.
 * Currently only supports Settings & State... add new desired collections to subMap
 *
 * Returns object with two fields:
 * ready: true or false, can be used to determine whether data has been returned
 * $dataObject: see example below
 */

// ------------- REQUIRED PROPS -----------
// 1) device
// 2) getData (see below)
// * To do:  Add option for returning lists (.find instead of .findOne)
//
// getData: {
//     [groupName1]: {                          // ex: 'eth, cellular'
//         groupIndex: 0,                       // if omitted fetches all the collection data
//         collections: ['state', 'settings'],  // Takes array of collections (provide SubsManager syntax)
//         options: { }                         // (optional) pass additional find options
//     },
//     [groupName2]: {
//         groupIndex: 0,
//         collections: ['settings']
//     }
// }

// ------------- OUTPUT -------------------
// data = {
//     ready: true,                 // flag to represent if all subs ready
//     dataReady: true,             // flag for if data was found for all reqests
//     [groupName1]: {
//         [collection1]:  { ... },
//         [collection2]: { ... },  // etc
//     },
//     [groupName2]: {
//         [collection1]:  {
//             _ready: true,         // each collection has a ready flag
//             _dataReady: true,     // boolean if data was returned for this collection
//             ...
//         },
//         [collection2]:  { ... }, // etc
//     }
// };

// ex) data = {
//     wan: {
//         state: {...}
//     }
// }


// Supported subs:
const subMap = {
    settings: 'Settings',
    state: 'State',
};


export function getCustomData(props, onData) {
    const device = props.context.device;
    const SubsManager = device.SubsManager;
    const subRequest = props.getData;
    // Track subs
    const subs = [];

    // verify collection passed is supported
    const collectionsValid = verifyValidCollections(subRequest);
    if (!collectionsValid) {
        onData(null, { ready: false, dataReady: false });
    } else {
        // for each passed group name, find collections requested
        Object.keys(subRequest).forEach(groupName => {
           // do something with subRequest[groupName]
           const options = subRequest[groupName].options || {};
           const query =  { _groupName: groupName };
           if (subRequest[groupName].hasOwnProperty('groupIndex')) {
               query._groupIndex = subRequest[groupName].groupIndex;
           }
           const collections = subRequest[groupName].collections;
           collections.forEach(collection => {
               const sub = SubsManager.subscribe(collection, query, options)
               subs.push(sub);
           });
        });

        const data = {};
        Object.keys(subRequest).forEach((groupName, i) => {
            data[groupName] = {};
            const options = subRequest[groupName].options || {};
            const query = { _groupName: groupName };
            if (subRequest[groupName].hasOwnProperty('groupIndex')) {
                query._groupIndex = subRequest[groupName].groupIndex;
            }
            const collections = subRequest[groupName].collections;
            collections.forEach(collectionName => {
                const collection = device[subMap[collectionName]];
                const findOneQuery = query._groupIndex || query._groupIndex === 0;
                const searchResults = findOneQuery ? collection.findOne(query, options) : collection.find(query, options).fetch();
                const dataReady = findOneQuery ? !!searchResults : searchResults.length > 0;

                data[groupName][collectionName] = searchResults || {};
                data[groupName][collectionName]._ready = subs[i].ready();
                data[groupName][collectionName]._dataReady = dataReady;
            });
        });

        data.ready = allSubsReady(subs);
        data.dataReady = isDataRetrieved(data);
        onData(null, data);
    }
};


const allSubsReady = (subs) => {
    let subsReady = true;
    subs.forEach(sub => {
        if (!sub.ready()) {
            subsReady = false;
        }
    });

    return subsReady;
};

const isDataRetrieved = (data) => {
    let dataRetrieved = true;
    Object.keys(data).forEach(groupName => {
        const groupData = data[groupName];
        Object.keys(groupData).forEach(collection => {
            if (!groupData[collection]._dataReady) {
                dataRetrieved = false;
            }
        });
    });
    return dataRetrieved;
};


const verifyValidCollections = (subRequest) => {
    let validCollections = true;
    Object.keys(subRequest).forEach(groupName => {
        const collections = subRequest[groupName].collections;
        collections.forEach(collectionName => {
            const collectionCheck = subMap[collectionName];
            if (!collectionCheck) {
                validCollections = false;
            }
        });
    });
    return validCollections;
};
