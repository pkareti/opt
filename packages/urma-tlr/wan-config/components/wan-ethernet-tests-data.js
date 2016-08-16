export const wan_data = {
    state: {
        _groupIndex: '0',
        _groupName: 'wan',
        _groupPath: 'wan/0',
        _id: 'wanState_id',
        admin_status: 'up',
        oper_status: 'up',
        interface: 'eth1',
        ip_address: '10.20.1.22',
        dns1: '10.10.8.62',
        dns2: '8.8.8.8',
        gateway: '10.20.1.1',
        mask: '255.255.255.0',
        rx_bytes: '103382',
        rx_packets: '1199',
        tx_bytes: '2223889',
        tx_packets: '1683'
    },
    settings: {
        _id: 'wanSettings_id',
        _groupIndex: '0',
        _groupName: 'wan',
        _groupPath: 'wan/0',
        interface: 'eth1',
        dhcp: 'off',
        ip_address: '10.20.1.22',
        mask: '255.255.255.0',
        gateway: '10.20.1.1',
        dns1: '10.10.8.62',
        dns2: '8.8.8.8',
        probe_host: 'test',
        timeout: '180',
        probe_interval: '60',
        probe_timeout: '1',
        probe_size: '64',
        activate_after: '0',
        retry_after: '0'
    }
};

export const eth_data = {
    state: {
        _groupIndex: 0,
        description: '',
        admin_status: 'up',
        oper_status: 'up',
        uptime: '141',
        mac_address: '00:40:FF:0F:48:AC',
        link_status: 'Up',
        link_speed: '100',
        link_duplex: 'Full',
    },
    settings: {
        _groupIndex: 0,
        state: 'on',
        description: '',
        duplex: 'auto',
        speed: 'auto',
        mtu: '1500'
    }
};
