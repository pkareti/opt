import { default as React, Component, PropTypes } from 'react';

export default class ProvisionForm extends Component {
    constructor(props) {
        super(props);
        this.userNameHandler = this.props.userNameHandler.bind(this);
        this.passwordHandler = this.props.passwordHandler.bind(this);
    }

    componentWillMount() {
        this.props.enableNext();
    }

    render() {
        return (
            <form id="provisionForm">
                <div>
                    <div className="box">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text" className="form-control"
                            id="username"
                            onChange={this.userNameHandler}
                            placeholder="username"
                        />
                    </div>
                    <div className="box">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            onChange={this.passwordHandler}
                            placeholder="password"
                        />
                    </div>
                    <p>Click NEXT to login.</p>
                </div>
            </form>
        );
    }
}

ProvisionForm.propTypes = {
    enableNext: PropTypes.func.isRequired,
    userNameHandler: PropTypes.func.isRequired,
    passwordHandler: PropTypes.func.isRequired
};
