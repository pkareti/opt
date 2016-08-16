import LoginButtons from '../../security/components/login-buttons.jsx';
import React from 'react';
import Navigation from '../../navigation/components/navigation.jsx';

/**
 * Main header for the device UI. Includes the banner with logo and title as well as the login buttons.
 * @type {Header}
 */
export default class Header extends React.Component {
    render() {

        return (
            <div className='header-wrapper'>
                <header>
                    <h2>
                        <div className="logo-wraper">
                            <a href="/">
                                {(this.props.logo) ?
                                    <img src={this.props.logo} alt={''}/>
                                    :
                                    null
                                }
                                <span className="dName">
                                    <span className="logo-text">{this.props.logoText}</span>
                                    <span className="pipe"> | </span>
                                    {this.props.title}
                                </span>
                            </a>
                        </div>
                    </h2>
                        <Navigation routes={this.props.routes}/>
                        {this.props.loginService ?
                            <LoginButtons loginService={this.props.loginService}/>
                            :
                            null
                        }
                </header>
            </div>
        )
    }
};

Header.propTypes = {
    title: React.PropTypes.string.isRequired,
    logo: React.PropTypes.string,
    logoText: React.PropTypes.string,
    loginService: React.PropTypes.object,
    routes: React.PropTypes.object.isRequired
};