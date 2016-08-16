import {default as React, Component, PropTypes} from 'react';
import reactMixin from 'react-mixin';
import { Logger } from 'meteor/jag:pince';
import { getCustomData } from '../../data-containers/custom-data-containers.js';
import { composeWithTracker } from 'react-komposer';
import Terminal from './terminal.jsx';
import {Collections} from 'meteor/digi:urma-core';
import he from 'he';

const log = new Logger('cli');

// Note, because the CliOutput collection is streaming and could generate a lot of output we don't follow the normal komposer
// subscription model. This is because that model reactively changes settings on the component evertime the data source updates
// and the normal thing to do would be to regenerate the output based on the new collection state. React offers the concept of item
// keys to help it determine what has changed between old and new output. But, we can save it the trouble by just observing
// directly on the cursor for adds and simply insert those new lines into the terminal component.

export class CLIComponent extends Component {
    constructor(props) {
        super(props);
        // this.subsManager = props.context.device.SubsManager;
        // this.cliOutput = props.context.device.CliOutput;
        this.startComputation = this.startComputation.bind(this);
        this.stopComputation = this.stopComputation.bind(this);
        this.computation = null;
        //this.handleCharacterConversion = this.handleCharacterConversion.bind(this);
    }

    // Note: I'm using this trick to setup the tracker due to a bug in meteor https://github.com/meteor/react-packages/issues/99
    componentDidMount() {
        setTimeout(this.startComputation, 0);
    }

    componentWillUnmount() {
        setTimeout(this.stopComputation, 0);
    }

    startComputation() {
        var self = this;
        this.computation = Tracker.autorun(function () {
            let search = {};
            self.subscription = Meteor.subscribe('cli_output', search);
            let CliOutput = Collections.CliOutput;
            self.cursor = CliOutput.find(search);
            log.debug('CLI observing cursor: ', self.cursor);
            self.cursor.observe({
                added: function (message) {
                    if (self.term) {
                        // decode the added message and send it to the terminal
                        var msg = he.decode(window.atob(message.msg));
                        log.debug('CLI observed added msg: ', msg, 'value of term:', self.term);
                        self.term.echo(msg);
                    }
                },
                changed: function (message, oldMessage) {
                    //log.debug('CLI observed changed msg: ', message);
                },
                removed: function (oldMessage) {
                    //log.debug('CLI observed removed msg: ', oldMessage);
                }
            });
        });
    }

    stopComputation() {
        if (!!this.computation) {
            this.computation.stop();
            // The computation automatically stops the subscription and cursor. Just clean up our references.
            this.computation = null;
            this.subscription = null;
            this.cursor = null;
        }
    }

    renderTerminal() {
        let prompt = this.props.system.settings.prompt || '';
        return (
            <Terminal
                ref={(term) => {this.term = term;}}
                history
                prompt={prompt}
                greetings=""
                interpreter={function(command, term) {
                            log.debug('Execute command: ', command);
                            var encodedCommand = window.btoa(command);
                            log.trace('Encoded command:', encodedCommand);
                             Meteor.call('cliSendText', encodedCommand, function(error, result) {
                                log.debug('reply: ', error, result);
                            });
                        }}
                outputLimit={-1}
                // subscription={this.subscription}
                // // cursor={this.cursor}
                // cursor={clicursor}
            />
        );
    }

    render() {
        log.debug('current props:', this.props);
        return (
            <div className="js-cli">
                { this.props.dataReady ?
                    this.renderTerminal()
                    :
                    'Loading...'
                }
            </div>
        );
    }
}

export default CLI = composeWithTracker(getCustomData)(CLIComponent);
