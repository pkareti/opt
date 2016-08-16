import React from 'react';
import MenuItem from './menu-item.jsx';
import RouterHelper from '../router-helper.js';
import Authorized from '../../security/components/authorized.jsx';

const collapse = {
    on: "collapse navBarCollapse in",
    off: "collapse navBarCollapse"
}
const active = {
    on: "hamburger active",
    off: "hamburger"
}

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boxId: "popOverBox",
            collapse: false,
            active: false
        }
        this.hamburger = this.hamburger.bind(this);
    }

    buildMenu() {
        let routerhelper = new RouterHelper();
        routerhelper.setSecurityEnabled(true);
        routerhelper.configureRoutes(this.props.routes, this.context.basePath);
        let mainMenuItems = routerhelper.createMenu();

        return mainMenuItems;
    }

    renderMenuItems() {
        return this.buildMenu().map(menuItem =>
            <MenuItem
                key={menuItem.name}
                level={1}
                menuItem={menuItem}/>
        );
    }


    hamburger(){
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active
        });
    }
    
    render () {
        var pathName = this.props.pathname;
        const collapseClass = this.state.collapse ? collapse.on : collapse.off;
        const activeClass = this.state.active ? active.on : active.off;

        return (
            <div className="nav-menu">
                <Authorized>
                    <div className="navBar">
                        <div className={activeClass}>
                            <a href="javascript:void(0);" onClick={this.hamburger} type="button">
                                <i className="icon-hamburger"></i>
                            </a>
                        </div>
                        <div className={collapseClass} id="collapsibleNav">
                            <ul className="nav-menu-list">
                                {this.renderMenuItems()}
                            </ul>
                        </div>
                    </div>
                </Authorized>
            </div>
        )
    }
}

Navigation.propTypes = {
    routes: React.PropTypes.object.isRequired
};

Navigation.contextTypes = {
    basePath: React.PropTypes.string.isRequired
};