// State data for dashboard tests.

export const state_data = {
    system: {
        _id: 1,
        _groupIndex: 0,
        firmware_version: '1.2.3.4 3/18/2016 17:19:03',
        model: 'LR54',
        part_number: 'Not available',
        serial_number: 'LR000110',
        hardware_version: 'Not available',
        firmware_version: '0.2.0.2 03/28/16 17:19:03',
        bootloader_version: '201602051801',
        uptime: '7 Minutes, 32 Seconds',
        system_time: '19 October 2015, 22:27:35',
        cpu_usage: '30',
        temperature: 'Not available',
        description: 'My LR54',
        location: 'My place',
        contact: 'Me'
    },
    cloud: {
        _id: 1,
        _groupIndex: 0,
        status: 'connected',
        server: 'devtest.idigi.com',
        deviceid: '00000000-00000000-0040FFFF-FF0F44B0',
        uptime: '8949',
        rx_packets: '2500',
        tx_packets: '3000',
        rx_bytes: '10000',
        tx_bytes: '12000'
    },
    firmware_files: {
        _id: 1,
        _groupIndex: 0,
        available_images: {
            file: [
                { date: '3/04/2016 7:45PM', name: 'lr54-1.2.3.4.bin', size: 23456780, version: '1.2.3.4' },
                { date: '3/08/2016 4:33AM', name: 'lr54-1.2.3.5.bin', size: 23456890, version: '1.2.3.5' }
            ]
        }
    },
    lan: [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up',
            description: 'Local LAN',
            interfaces: 'eth2,eth3,eth4',
            rx_bytes: 71260694,
            tx_bytes: 13935096
        },
        {
            _id: 2,
            _groupIndex: 1,
            admin_status: 'up',
            oper_status: 'up',
            description: 'Guest Wifi',
            interfaces: 'wifi1',
            rx_bytes: 83443,
            tx_bytes: 34791
        },
        {
            _id: 3,
            _groupIndex: 2,
            admin_status: 'down',
            oper_status: 'down',
            description: 'Unused',
            interfaces: '',
            rx_bytes: 0,
            tx_bytes: 0
        }
    ],
    //TODO: WAN state
    wan: [],
    eth: [
        {
            _id: 1,
            _groupIndex: 0,
            admin_status: 'up',
            oper_status: 'up',
            uptime: '418',
        },
        {
            _id: 2,
            _groupIndex: 1,
            admin_status: 'up',
            oper_status: 'up',
            uptime: '1003',
        },
        {
            _id: 3,
            _groupIndex: 2,
            admin_status: 'down',
            oper_status: 'down',
            uptime: '0',
        }
    ],
    //TODO: what fields are available for wifi interfaces?
    wifi: [
        {
            _id: 1,
            _groupIndex: 0,
            oper_status: 'up'
        },
        {
            _id: 2,
            _groupIndex: 1,
            oper_status: 'up'
        },
        {
            _id: 3,
            _groupIndex: 2,
            oper_status: 'down'
        },
        {
            _id: 4,
            _groupIndex: 3,
            oper_status: 'down'
        }
    ],
    wifi5g: [
        {
            _id: 1,
            _groupIndex: 0,
            oper_status: 'up'
        },
        {
            _id: 2,
            _groupIndex: 1,
            oper_status: 'down'
        },
        {
            _id: 3,
            _groupIndex: 2,
            oper_status: 'up'
        },
        {
            _id: 4,
            _groupIndex: 3,
            oper_status: 'down'
        },
    ]

};
