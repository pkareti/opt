import { default as React, Component, PropTypes } from 'react';

/**
 * Command prompt component, used by Terminal.
 * @constructorxxx
 *
 * Display an input for command with a blinking cursor.
 *
 * @prop {string} prompt - The prompt indicator.
 * @prop {string} input - The text to display
 */
export default class CommandPrompt extends Component {
    componentDidMount() {
        // Make the cursor blink.
        const cursor = this.cursor;
        this.blinkInterval = window.setInterval(() => {
            const currentBgColor = cursor.style.backgroundColor;
            cursor.style.backgroundColor = currentBgColor === 'rgb(0, 0, 0)' ? 'rgb(187, 187, 187)' : 'rgb(0, 0, 0)';
            cursor.style.color = currentBgColor === 'rgb(0, 0, 0)' ? '#aaa' : '#000';
        }, 500);
    }

    componentWillUnmount() {
        window.clearInterval(this.blinkInterval);
    }

    render() {
        return (
            <div className="cmd">
                <pre>
                    <span className="prompt">{this.props.prompt} </span>
                    <span className="js-command-input">{this.props.input}</span>
                    <span className="cursor" ref={(c) => { this.cursor = c; return this.cursor; }}>
                        {String.fromCharCode(160)}
                    </span>
                </pre>
            </div>
        );
    }
}

CommandPrompt.propTypes = {
    prompt: PropTypes.string,
    input: PropTypes.string
};

CommandPrompt.defaultProps = {
    prompt: '>',
    input: ''
};
