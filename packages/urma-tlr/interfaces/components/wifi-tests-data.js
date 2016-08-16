export const wifi_data = {
    wifi: {
        settings: [
            {
                _groupIndex: 0,
                _groupName: "wifi",
                _groupPath: "wifi/0",
                _id: "nMRF3wZpQpCRAnEED",
                broadcast_ssid: "on",
                description: "Test",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "wpa2_personal",
                ssid: "LR54-2.4G-%s",
                state: "on",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
            {
                _groupIndex: 1,
                _groupName: "wifi",
                _groupPath: "wifi/1",
                _id: "nMRF3wZpQpCRAn12G",
                broadcast_ssid: "on",
                description: "description!",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "none",
                ssid: "LR54-2.4G-Public-%s",
                state: "off",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
            {
                _groupIndex: 2,
                _groupName: "wifi",
                _groupPath: "wifi/2",
                _id: "nMRF3wZpQpCRA3Exz",
                broadcast_ssid: "on",
                description: "",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "wpa2_personal",
                ssid: "LR54-2.4G-%s",
                state: "off",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
            {
                _groupIndex: 3,
                _groupName: "wifi",
                _groupPath: "wifi/2",
                _id: "yKG4GWSu49L9YW8Eu",
                broadcast_ssid: "on",
                description: "",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "wpa2_personal",
                ssid: "",
                state: "off",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            }
        ],
        state: [
            {
                _groupIndex: 0,
                admin_status: 'up',
                oper_status: 'up'
            },
            {
                _groupIndex: 1,
                admin_status: 'down',
                oper_status: 'down'
            },
            {
                _groupIndex: 2,
                admin_status: 'down',
                oper_status: 'down'
            },
            {
                _groupIndex: 3,
                admin_status: 'down',
                oper_status: 'down'
            },
        ]
    },
    wifi5g: {
        settings: [
            {
                _groupIndex: 0,
                _groupName: "wifi5g",
                _groupPath: "wifi5g/0",
                _id: "CfFs8uiziwo93xo5K",
                broadcast_ssid: "on",
                description: "",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "wpa2_personal",
                ssid: "LR54-5G-%s",
                state: "on",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
            {
                _groupIndex: 1,
                _groupName: "wifi5g",
                _groupPath: "wifi5g/1",
                _id: "CfFs8uiziwo93xo5X",
                broadcast_ssid: "on",
                description: "TEST",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "none",
                ssid: "LR54-5G-Public-%s",
                state: "OFF",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
            {
                _groupIndex: 2,
                _groupName: "wifi5g",
                _groupPath: "wifi5g/2",
                _id: "CfFs8uiziwo93xo5Y",
                broadcast_ssid: "on",
                description: "",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "wpa2_personal",
                ssid: "LR54-5G-%s",
                state: "off",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
            {
                _groupIndex: 3,
                _groupName: "wifi5g",
                _groupPath: "wifi5g/3",
                _id: "CfFs8uiziwo93xo5Z",
                broadcast_ssid: "on",
                description: "",
                isolate_ap: "on",
                isolate_clients: "on",
                security: "wpa2_personal",
                ssid: "LR54-5G-%s",
                state: "off",
                radius_server: '0.0.0.0',
                radius_server_port: '1812'
            },
        ],
        state: [
            {
                _groupIndex: 0,
                admin_status: 'up',
                oper_status: 'up'
            },
            {
                _groupIndex: 1,
                admin_status: 'down',
                oper_status: 'down'
            },
            {
                _groupIndex: 2,
                admin_status: 'down',
                oper_status: 'down'
            },
            {
                _groupIndex: 3,
                admin_status: 'down',
                oper_status: 'down'
            },
        ]
    },
    lan: {
        settings: [
            {
                _groupIndex: 0,
                _id: "HnZXvc8Mp6twHmQuo",
                interfaces: "eth2,eth3,eth4,wifi1,wifi5g1",
                state: "on"
            },
            {
                _groupIndex: 1,
                _id: "DrZcoGmBZGokS5Hxm",
                interfaces: "wifi2,wifi5g2",
                state: "off"
            },
            {
                _groupIndex: 2,
                _id: "vFTyZPoecvGg9RMZt",
                interfaces: "",
                state: "off"
            },
        ]
    },
    wifi_global: {
        settings: {
            wifi_channel: 'auto',
            wifi5g_channel: 36
        }
    }
};
