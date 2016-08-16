import React from 'react';
import {HOC} from 'formsy-react';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showError: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.invalidSubmission) {
            this.setState({showError: true});
        }
    }

    changeValue(event) {
        this.props.setValue(event.target.value);
    }

    blurValue() {
        //only display error message after initial blur and if field is not pristine
        if (!this.state.showError && !this.props.isPristine()) {
            this.setState({showError: true});
        }
    }

    keyDown(event) {
        const enter = '13';

        if (event.keyCode == enter) {
            this.props.setValue(event.currentTarget.value);
            this.setState({showError: true});
        }
    }

    render() {
        const errorMessage = this.props.getErrorMessage();
        let highlightInputError = !this.props.isValid() && this.state.showError;
        const classConst = `form-control ${this.props.className || ''}`;
        const inputProperties = {
            className: highlightInputError ? `${classConst} input-error` : classConst,
            name: this.props.name,
            value: this.props.getValue() == undefined ? '' : this.props.getValue(),
            onBlur: this.blurValue.bind(this),
            onChange: this.changeValue.bind(this),
            onKeyDown: this.keyDown.bind(this)
        };

        return (
            <div className={'js-input-' + this.props.name}>
                <label htmlFor={this.props.name}>{this.props.title}</label>
                {this.props.type === 'textarea' ?
                    <textarea {...inputProperties}/>
                    :
                    <input type={this.props.type || 'text'}
                        {...inputProperties}/>
                }
                {this.props.children}
                {this.state.showError ?
                    <p className='error'>{this.props.showRequired() ? "Required" : errorMessage}</p>
                    :
                    null
                }
            </div>
        );
    }
}
;

export default HOC(Input);

Input.propTypes = {
    invalidSubmission: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    validations: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ]).isRequired,
    validationError: React.PropTypes.string,
    validationErrors: React.PropTypes.object,
};
