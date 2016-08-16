import reactMixin from 'react-mixin';
import React from 'react';
import Login from '../../security/login.js';

/**
 * React component containing a form with login and logout buttons.
 * @type {LoginButtons}
 */


export default class LoginButtons extends Login {

    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
    }

    getMeteorData() {
        return {
            user: Meteor.user()
        };
    }

    onChange(stateField, e) {
        let state = {};
        state[stateField] = e.target.value;
        this.setState(state);
    }

    renderLogin() {
        return (
            <form className="login-buttons" onSubmit={this.login}>
                <div>
                    <div className="box">
                        <input type="text" name="username" className="form-control" value={this.state.username}
                            placeholder="username" onChange={this.onChange.bind(this, 'username')}/>
                    </div>
                    <div className="box">
                        <input type="password" name="password" className="form-control" value={this.state.password}
                            placeholder="password" onChange={this.onChange.bind(this, 'password')}/>
                    </div>
                    <div className="box">
                        <button type="submit" className="button-login">Login</button>
                    </div>
                </div>
            </form>
        )
    }

    renderLogout() {
        return (
            <div className="userDetails">
                <form className="login-buttons">
                    <div className="box">
                        <button type="button" className="button-logout" onClick={this.logout}>Logout</button>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div className="login">
                { this.data.user ? this.renderLogout() : this.renderLogin() }
            </div>
        )
    }
};

LoginButtons.propTypes = {
    loginService: React.PropTypes.object
};

reactMixin(LoginButtons.prototype, ReactMeteorData);