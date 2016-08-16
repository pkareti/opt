import { default as React, Component, PropTypes } from 'react';
import _ from 'lodash';
import { Logger } from 'meteor/jag:pince';
import CommandPrompt from './prompt.jsx';

const log = new Logger('terminal');

// Some handy character codes
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Q = 'Q'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);
const CHAR_CODE_QUESTION = '?'.charCodeAt(0);
const CHAR_CODE_SPACE = ' '.charCodeAt(0);
const CHAR_CODE_UP_ARROW = 38;
const CHAR_CODE_DOWN_ARROW = 40;

// Special keys
const TAB = 9; // tab same as ctrl+I
const BSP = 8; // backspace same as ctrl+H
const ENTER = 13; // enter same as ctrl+M (carriage return) or ctrl+J (line feed)


/**
 * Terminal component
 * @constructorxxx
 *
 * Emulates a terminal shell with user-defined interpreter and history
 * support. Inspired by (jQueryTerminal)[http://terminal.jcubic.pl/].
 *
 * @prop {bool} history - Whether to keep a history for user to navigate.
 *  @default true
 * @prop {string} prompt - The prompt indicator.
 *  @default ">"
 * @prop {string|function} greetings - The first message to display in
 *  the terminal. If a string, displays it immediately. If a function,
 *  it is called with the component as the first argument, and the
 *  component will render if `terminal.echo` is called.
 *  @default "React.js Terminal"
 * @prop {function} interpreter - The interpreter to handle each entered
 *  command. It receives the command as first argument, and the terminal
 *  as second argument. Use `terminal.echo` or `terminal.error` to render
 *  the output of the command.
 *  @default function(command, term) { term.echo(command); }
 * @prop {number} outputLimit - The number of lines to display on the
 *  terminal. If -1, it will display all lines.
 *  @default -1
 */
export default class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            lines: [],
            cursorPos: 0,
            input: '',
            pendingCommand: ''
        };
        this.echo = this.echo.bind(this);
        this.error = this.error.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        log.debug('observing cursor: ', this.props.cursor);
    }

    //--------------------------------------------
    // React Lifecycle
    //--------------------------------------------
    componentWillMount() {
        const props = this.props;
        log.debug('componentDidMount props:', props);
        if (typeof props.greetings === 'function') {
            this.setState({ pendingCommand: 'greetings' });
            props.greetings(this);
        } else if (typeof props.greetings === 'string') {
            const lines = this.state.lines;
            lines.push(props.greetings);
            this.setState({ lines });
        }
    }

    componentDidMount() {
        // Initial focus
        if (this.terminalDOMNode) {
            this.terminalDOMNode.focus();
        }
    }

    componentDidUpdate() {
        // Scroll to the bottom.
        if (this.terminalDOMNode) {
            this.terminalDOMNode.scrollTop = this.terminalDOMNode.scrollHeight;
        }
    }

    //--------------------------------------------
    // API
    //--------------------------------------------
    echo(string) {
        log.debug('echo string:', string);

        let lines = [];
        const curLines = this.state.lines;
        let cursorPos = this.state.cursorPos;
        const input = this.state.input;
        let pendingCommand = this.state.pendingCommand || '';

        if (string) {
            // Break into individual lines on line feeds
            lines = string.split('\n');

            // Restore cursor position on last line if necessary.
            cursorPos = this.resumeAtCursorPosition(curLines, lines, cursorPos);

            // Process each line for special characters, etc.
            lines = _.map(lines, (line) => {
                log.trace('echo line:', encodeURI(line));

                let newLine = '';
                cursorPos = 0; // new line. reset cursor position.

                // Handle carriage returns
                const lineParts = line.split('\r');
                _.forEach(lineParts, (part) => {
                    // Carriage return, reset cursor position.
                    cursorPos = 0;
                    if (part.length > 0) {
                        if (part.length >= newLine.length) {
                            newLine = part;
                        } else {
                            newLine = part + newLine.substring(part.length);
                        }
                        cursorPos += part.length;
                    }
                });
                if (newLine.length === 0) {
                    // Need some content in the line to render it properly.
                    newLine = '\n';
                }
                if (this.isPrompt(newLine)) {
                    cursorPos = 0;
                }

                return newLine;
            });

            // Workaround for ping response that does not include newlines for formatting.
            this.handlePingResponse(lines);

            // Remove the echoed prompt because we display our own.
            if (this.isPrompt(lines[lines.length - 1])) {
                pendingCommand = ''; // Last line is the prompt. Command no longer pending.
                lines[lines.length - 1] = '';// Empty line won't display in terminal.
            }

            // Concatenate to the existing lines
            lines = curLines.concat(lines);

            // Trim the output lines if `outputLimit` is set.
            const outputLimit = this.props.outputLimit;
            if (outputLimit > 0 && lines.length > outputLimit) {
                // @TODO: Support '0' value to display lines that fit in one page.
                // lines = lines.slice(-1*outputLimit);
            }
        }

        this.setState({
            lines,
            input,
            cursorPos,
            pendingCommand // show command prompt unless waiting for more input
        });
    }

    error(error) {
        this.echo(error);
    }

    //--------------------------------------------
    // Logic
    //--------------------------------------------

    /**
     * Lines echoed to the terminal may not have been sent as full lines. If partial lines were sent
     * this function resumes echoing of lines at the current cursor position. This is done by appending
     * the next new line received to the last line received previously.
     * @param prevLines Previous lines received
     * @param newLines New lines received
     * @param cursorPos Current cursor position
     * @returns {number}the new cursor position
     */
    resumeAtCursorPosition(prevLines, newLines, cursorPos) {
        if (cursorPos >= 0) {
            if (prevLines.length > 0 && newLines.length > 0) {
                const lastLine = prevLines.pop();
                const nextLine = newLines[0];
                if (nextLine.length === 0) {
                    // If the next line is empty it means the input started with a new line.
                    // Just replace the next line with the previous line.
                    newLines.splice(0, 1, lastLine);
                } else {
                    // Append the next line to the last line, starting at the cursor position.
                    const concatLine = lastLine.substring(0, cursorPos) + nextLine;
                    newLines.splice(0, 1, concatLine);
                }
            }
        }
        return 0;
    }

    /**
     * Is a line of text the prompt line?
     * @param line
     * @returns {*}
     */
    isPrompt(line) {
        return this.props.prompt && line &&
            this.trimLineText(line).startsWith(this.props.prompt.trim());
    }

    /**
     * Ping workaround: if first line is the echoed ping response we need to
     * add carriage return and newline because the ping response doesn't, causing
     * the first response line to be concatenated to the prompt line.
     *
     * @param lines The newly echoed lines from the device.
     */
    handlePingResponse(lines) {
        const pendingCommand = this.state.pendingCommand;
        if (pendingCommand.toLowerCase().startsWith('ping')) {
            if (this.isPrompt(lines[0])) {
                const index = lines[0].indexOf(pendingCommand);
                if (index > 0) {
                    const breakIndex = index + pendingCommand.length;
                    const pingCommand = lines[0].substring(0, breakIndex);
                    const pingResponse = lines[0].substring(breakIndex);
                    // Replace the first line with just the ping command and add empty line and ping response.
                    lines.splice(0, 1, pingCommand, '\r\n', pingResponse);
                }
            }
        }
    }


    /**
     * Trim whitespace from start and end of echoed line of text. String.trim() does not treat
     * backspace characters as whitespace. This function does.
     *
     * @param line line of echoed text
     * @returns {string} the trimmed text
     */
    trimLineText(line) {
        // Trim backspaces, then trim all other whitespace.
        const trimLine = line.replace(/\x08/g, '');
        return trimLine.trim();
    }

    /**
     * Determine if a key down event is for a control key.
     * @param e the key down event
     * @param keyChar (optional) ascii letter of the control key you want to check (e.g "C" for ctrl+C). If not
     * specified this will just check if it is any valid control key (i.e. ctrl+A through ctrl+Z).
     * @returns {boolean}
     */
    isControlKey(e, keyChar) {
        let result = false;
        if (e.ctrlKey) {
            if (keyChar) {
                // all control keys come as uppercase letter
                result = (e.which === keyChar.toUpperCase().charCodeAt(0));
            } else {
                result = e.which >= CHAR_CODE_A && e.which <= CHAR_CODE_Z;
            }
        }
        return result;
    }

    handleKeyDown(e) {
        log.debug('keydown:', e.which);
        log.trace('keydown event:', e);

        const props = this.props;
        const state = this.state;
        const lines = state.lines;
        const history = state.history;
        let input = state.input;

        if (e.which === BSP || this.isControlKey(e, 'H')) { // Backspace or ctrl+H
            // Stop the browser from navigating back.
            e.preventDefault();
            // Remove the last character from input.
            input = input.slice(0, -1);
            this.setState({ input });
        } else if (e.which === TAB || this.isControlKey(e, 'I')) { // Tab or ctrl+I
            e.preventDefault();
            props.completion(this, input, (commands) => {
                this.echo(commands.join(', '));
            });
        } else if (e.which === CHAR_CODE_UP_ARROW) { // Up arrow key
            if (this.props.history) {
                e.preventDefault();

                const existingCommandIdx = _.lastIndexOf(history, input);
                if (existingCommandIdx === -1) {
                    // Is typing a command, since it is not in the history, so
                    // we retrieve the last command and display it.
                    input = history[history.length - 1];
                    this.setState({ history, input });
                } else {
                    // In the middle of moving up the history, so we just display
                    // the previous one, or the same input if at the begining.
                    input = history[existingCommandIdx - 1] || input;
                    this.setState({ input });
                }
            }
        } else if (e.which === CHAR_CODE_DOWN_ARROW) { // Down arrow key
            if (this.props.history) {
                const existingCommandIdx = _.lastIndexOf(history, input);
                if (existingCommandIdx !== -1) {
                    // Is not typing a command.
                    input = history[existingCommandIdx + 1] || '';
                    this.setState({ input });
                }
            }
        } else if (e.which === CHAR_CODE_SPACE && this.isMore(lines)) {
            // If space or 'q' pressed and we are sitting at the --More-- prompt send immediately.
            e.preventDefault();
            input += String.fromCharCode(e.which);
            this.sendInput(input, false);
        } else if (e.which === CHAR_CODE_Q && this.isMore(lines)) {
            // If space or 'q' pressed and we are sitting at the --More-- prompt send immediately.
            e.preventDefault();
            input += 'q';
            this.sendInput(input, false);
        } else if (this.isControlKey(e, 'Z')) {
            // ctrl+Z is essentially exit which would kill the CLI session. Ignore it.
            e.preventDefault();
        } else if (this.isControlKey(e, 'M')) {
            // The ctrl+M key line feed and is handled the same as Enter. The browser automatically sends key press
            // event for Enter. Ignore here and let the browser do its thing.
        } else if (this.isControlKey(e, 'J')) {
            // ctrl+J is carriage return. Similar to ctrl+M (line feed) it should be handled just like the enter key.
            // Unlike ctrl+M, ctrl+J is not handled by the browser.
            this.processEnter(input);
        } else if (this.isControlKey(e)) { // All other control keys
            // Send all other control keys immediately.
            e.preventDefault();
            const charCode = (e.which - CHAR_CODE_A) + 1;
            input = String.fromCharCode(charCode);
            this.sendInput(input, false);
        }
    }

    handleKeyPress(e) {
        log.debug('keypress:', e.which);
        log.trace('keypress event:', e);

        let input = this.state.input;

        switch (e.which) {
            case ENTER: // Enter
                this.processEnter(input);
                break;
            case CHAR_CODE_QUESTION: // ?
                e.preventDefault();
                input += String.fromCharCode(e.which);
                this.sendInput(input, true);
                break;
            default:
                input += String.fromCharCode(e.which);
                this.setState({ input });
                break;
        }
    }

    processEnter(input) {
        this.sendInput(input, true);
    }

    /**
     * Is last line sitting at --More--.
     * @returns {boolean|*}
     */
    isMore(lines) {
        return (!_.isEmpty(lines) && lines[lines.length - 1].startsWith('--More--'));
    }

    /**
     * Send the current input to the interpreter.
     * @param input the input text to send
     * @param isCommand Is the input a command to be sent?
     */
    sendInput(input, isCommand) {
        const state = this.state;
        const lines = state.lines;
        const history = state.history;
        const interpreter = this.props.interpreter;
        let cursorPos = state.cursorPos;

        log.debug('sendInput length:', input.length, 'input:', input);

        let inputText = input;
        let newInput = ''; // default will clear input after sending.
        if (isCommand) {
            // Add command to history
            if (!!inputText && this.props.history) {
                history.push(inputText.trim());
            }

            // Add prompt to output lines to simulate what happens in vt100 terminal.
            if (this.props.prompt && !this.isMore(lines)) {
                const promptText = `${this.props.prompt} `;
                lines.push(promptText);
                cursorPos = promptText.length;
            }

            // Make sure the command ends with a single newline character, but
            // don't send a newline with a help request.
            const lastChar = inputText.substr(inputText.length - 1);
            if (lastChar !== '\n' && lastChar !== '?') {
                inputText += '\n';
            } else if (lastChar === '?') {
                // Help request. Add the command (minus the ?) as the new input.
                newInput = inputText.substring(0, inputText.length - 1);
            }
        }

        // Don't send the exit command. It would kill our CLI session.
        if (inputText.trim().toLowerCase() === 'exit') {
            inputText = ''; // Clear the input so nothing is saved or sent
        }

        this.setState({
            history,
            lines,
            cursorPos,
            pendingCommand: inputText.trim(),
            input: newInput
        });

        // Delegate to the interpreter to handle the command.
        // The interpreter should call terminal.echo or terminal.error
        // so that the terminal is re-rendered.
        if (inputText) {
            interpreter(inputText, this);

            // After processing a help command the device will have the command already pre-entered.
            // We simulate the same thing with our prompt but need to clear the devices current state.
            // Send down a bunch of backspaces to clear out the pre-entered command.
            if (newInput.length > 0) {
                const backspaces = _.repeat(String.fromCharCode(BSP), newInput.length);
                interpreter(backspaces, this);
            }
        }
    }

    //--------------------------------------------
    // Render
    //--------------------------------------------
    renderLine(line, idx) {
        const numLines = this.state.lines.length;

        // Don't display empty lines (should at least have line feed to be displayed).
        // Also don't show --More-- line unless it is the last line of output. This can
        // happen when press Enter while waiting for more because we don't handle it like
        // a true vt100 terminal.
        if (!line || (idx < (numLines - 1) && line.startsWith('--More--'))) {
            return null;
        }

        return (
            <pre key={`line-${idx}`} className="terminal-output-line">
                {line}
            </pre>
        );
    }

    render() {
        const props = this.props;
        const state = this.state;
        log.debug('rendering terminal, props:', props, 'state:', state);

        return (
            <div
                className="terminal"
                onKeyPress={this.handleKeyPress}
                onKeyDown={this.handleKeyDown}
                tabIndex="0"
                ref={(node) => { this.terminalDOMNode = node; return this.terminalDOMNode; }}
            >
                <div className="terminal-output">
                    {state.lines.map(this.renderLine, this)}
                </div>
                {state.pendingCommand || this.isMore(state.lines) ?
                    false
                    :
                    <CommandPrompt
                        prompt={props.prompt}
                        history={state.history}
                        input={state.input}
                        style={{ width: '100%' }}
                    />
                }
            </div>
        );
    }
}

Terminal.propTypes = {
    history: PropTypes.bool,
    prompt: PropTypes.string,
    greetings: PropTypes.string,
    interpreter: PropTypes.func,
    completion: PropTypes.func,
    outputLimit: PropTypes.number,
    cursor: PropTypes.object
    // ready: PropTypes.bool
};

Terminal.defaultProps = function defaultProps() {
    const props = this.props;
    const interpreter = props.interpreter;
    // Store the list of commands if interpreter is an object.
    let commands = [];
    if (typeof interpreter === 'object') {
        commands = _.keys(interpreter);
    }

    return {
        history: true,
        prompt: '>', // string or function
        greetings: 'Terminal', // string or function,
        interpreter(command, term) {
            term.echo(command);
        }, // function or string or object
        completion(term, string, callback) {
            log.trace('command completion, term:', term);
            callback(_.filter(commands, (command) => (command.indexOf(string) === 0)));
        },
        outputLimit: -1 // number
        // ready: false
    };
};
