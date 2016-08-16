import React from 'react';
import ContextualLink from './contextual-link.jsx';

export default class MenuItem extends React.Component {
    constructor(props) {
        super(props);
    }

    getImagesrc() {
        let location = window.location.pathname;
        let menulink = "/" + this.props.menuItem.url;
        let imgsrc;
        if (location.startsWith(menulink)) {
            imgsrc = "/images/" + this.props.menuItem.nav.image + "-on.png";
        } else {
            imgsrc = "/images/" + this.props.menuItem.nav.image + ".png";
        }
        return imgsrc;
    }

    render() {
        return (
            <li className="iconBox">
                <ContextualLink to={this.props.menuItem.url} activeClassName="focused">
                    <div className="iconWrap">
                        {this.props.menuItem.nav.image ?
                            <img src={this.getImagesrc()} title={this.props.menuItem.nav.menuLabel}/> :
                            null
                        }
                    </div>
                    <div className="iconLabel">
                        {this.props.menuItem.nav.menuLabel}
                    </div>

                </ContextualLink>
                {this.props.menuItem.nav.value ?
                    <span className="badge">{this.props.menuItem.nav.value}</span> :
                    null
                }
            </li>
        )
    }
}

MenuItem.propTypes = {
    menuItem: React.PropTypes.object.isRequired
};