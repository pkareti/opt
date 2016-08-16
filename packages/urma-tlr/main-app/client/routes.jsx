import MainLayout from './components/main-layout.jsx';
import Dashboard from '../../dashboard/components/dashboard.jsx';
import Urma from 'meteor/digi:urma-core';
import MainNavigation from './components/main-navigation-menu.jsx';
import WAN from '../../wan-config/components/wan.jsx';
import System from '../../system/components/system.jsx';
import managementRoutes from '../../management/client/index.jsx';
import fileSysRoutes from '../../file-system/client/index.jsx';
import firmwareRoutes from '../../firmware/index.jsx';
import Interfaces from '../../interfaces/components/interfaces.jsx';

const routes = {
    path: '/',
    component: MainLayout,
    public: true,
    indexRoute: {
        name: 'dashboard',
        component: Dashboard,
        public: true
    },
    childRoutes: [
        {
            name: 'dashboard',
            path: 'dashboard',
            component: Dashboard,
            public: true,
            nav: {
                menuLabel: 'Dashboard',
                image: 'dashboard-device',
                value: 0,
                link: '/',
                order: 0
            }
        },
        {
            name: 'wan',
            path: 'wan',
            component: WAN,
            nav: {
                menuLabel: 'WAN',
                image: 'wan',
                value: 0,
                link: '/wan',
                order: 1
            }
        },
        {
            name: 'interfaces',
            path: 'interfaces',
            component: Interfaces,
            nav: {
                menuLabel: 'Interfaces',
                image: 'interfaces',
                value: 0,
                link: '/interfaces',
                order: 2
            },
            indexRedirect: {
                to: '/interfaces'
            }
        },
        {
            name: 'local-networks',
            path: 'local-networks',
            component: MainNavigation.LocalNetworks,
            nav: {
                menuLabel: 'Local Networks',
                image: 'local-networks',
                value: 0,
                link: '/local-networks',
                order: 3
            }
        },
        {
            name: 'vpn',
            path: 'vpn',
            component: MainNavigation.VPN,
            nav: {
                menuLabel: 'VPN',
                image: 'vpn',
                link: '/vpn',
                order: 4
            }
        },
        {
            name: 'system',
            path: 'system',
            component: System,
            nav: {
                menuLabel: 'System',
                image: 'system',
                value: 0,
                link: '/system',
                order: 5
            }
        },
        {
            path: 'getting-started',
            indexRedirect: {
                to: '/getting-started'
            },
            children: []
        }
    ]
};

export default routes;
