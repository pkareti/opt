export const cellularSettings = [
    {
        _id: 1,
        _groupIndex: 0,
        apn: "vzwinternet",
        apn_password: "dfdf",
        apn_username: "abc",
        connection_attempts: "20",
        description: "cellular1",
        preferred_mode: "auto",
        state: "on",
        sim_pin: "237"
    },
    {
        _id: 2,
        _groupIndex: 1,
        apn: "att",
        apn_password: "testPassword",
        apn_username: "abc",
        connection_attempts: "40",
        description: "cellular2",
        preferred_mode: "4g",
        state: "off",
        sim_pin: "2367"
    }
];

export const cellularState = [
    {
        _id: 'a',
        _groupIndex: 0,
        _groupName: 'cellular',
        admin_status: 'up',
        oper_status: 'up'
    }
];

export const wanSettings = [
    {
        _id: 1,
        _groupIndex: 2,
        activate_after: 0,
        dhcp: 'on',
        interface: 'cellular1',
        ip_address: '',
        mask: '255.255.255.0',
        nat: 'on',
        probe_host: '',
        probe_interval: 60,
        probe_size: 64,
        probe_timeout: 1,
        timeout: 180,
        try_after: 0
    },
    {
        _id: 2,
        _groupIndex: 3,
        activate_after: 0,
        dhcp: 'on',
        interface: 'cellular2',
        ip_address: '',
        mask: '255.255.255.0',
        nat: 'on',
        probe_host: '',
        probe_interval: 60,
        probe_size: 64,
        probe_timeout: 1,
        timeout: 180,
        try_after: 0
    }
];
