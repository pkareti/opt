/* eslint-disable no-unused-expressions, prefer-arrow-callback, func-names */

import React from 'react';
import { default as ReactDOM } from 'react-dom';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Terminal from './terminal.jsx';
import CommandPrompt from './prompt.jsx';

describe('Terminal tests', function () {
    let sandbox;
    let wrapper;
    let terminal;
    let terminalNode;
    let preventDefaultStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        wrapper = shallow(<Terminal history interpreter={sinon.spy()} prompt="yo:" />);
        sandbox.stub(ReactDOM, 'findDOMNode').returns({
            scrollHeight: sandbox.stub(),
            focus: sandbox.stub()
        });
        terminal = wrapper.instance();
        terminalNode = wrapper.find('.terminal');
        preventDefaultStub = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should break up messages and add lines to state.lines', function () {
        terminal.echo('line one\n---- line two ---\nline three');
        const lines = terminal.state.lines;

        expect(lines[0]).to.equal('line one');
        expect(lines[1]).to.equal('---- line two ---');
        expect(lines[2]).to.equal('line three');
    });
    it('should render lines', function () {
        wrapper = mount(<Terminal />);
        terminal = wrapper.instance();
        terminal.echo('line one\n---- line two ---\nline three');
        const renderedLines = wrapper.find('.terminal-output-line');

        expect(renderedLines.first().text()).to.equal('line one');
        expect(renderedLines.at(1).text()).to.equal('---- line two ---');
        expect(renderedLines.at(2).text()).to.equal('line three');
    });
    it('should handle carriage returns', function () {
        wrapper = mount(<Terminal />);
        terminal = wrapper.instance();
        terminal.echo('line one\n---- line two ---\r***\nline three');
        const renderedLines = wrapper.find('.terminal-output-line');

        expect(renderedLines.first().text()).to.equal('line one');
        expect(renderedLines.at(1).text()).to.equal('***- line two ---');
        expect(renderedLines.at(2).text()).to.equal('line three');
    });
    it('should track cursor position for broken line input', function () {
        wrapper = mount(<Terminal />);
        terminal = wrapper.instance();
        terminal.echo('line one\n---- line');
        terminal.echo(' two ---\r***\nline ');
        terminal.echo('three');
        const renderedLines = wrapper.find('.terminal-output-line');

        expect(renderedLines.first().text()).to.equal('line one');
        expect(renderedLines.at(1).text()).to.equal('***- line two ---');
        expect(renderedLines.at(2).text()).to.equal('line three');
    });
    it('should render command prompt', function () {
        wrapper = mount(<Terminal />);
        const commandPrompt = wrapper.find(CommandPrompt);
        expect(commandPrompt).to.be.defined;
    });
    it('should disable command prompt while waiting for prompt to be echoed', function () {
        wrapper = mount(<Terminal prompt="#>" />);
        terminal = wrapper.instance();
        expect(!!terminal.state.pendingCommand).to.be.false;
        terminal.setState({ pendingCommand: 'help' });
        terminal.echo('\nline 1');
        expect(!!terminal.state.pendingCommand).to.be.true;
        terminal.echo('\nline 2\nline 3');
        expect(!!terminal.state.pendingCommand).to.be.true;
        terminal.echo('\n#>');
        expect(!!terminal.state.pendingCommand).to.be.false;
    });

    it('should not display extra --More-- prompts', function () {
        wrapper = mount(<Terminal prompt="#>" />);
        terminal = wrapper.instance();
        terminal.echo('line 1\nline 2\n--More--\nline 3\n--More--');
        const renderedLines = wrapper.find('.terminal-output-line');

        expect(renderedLines.length).to.equal(4);
        expect(renderedLines.first().text()).to.equal('line 1');
        expect(renderedLines.at(1).text()).to.equal('line 2');
        expect(renderedLines.at(2).text()).to.equal('line 3');
        expect(renderedLines.at(3).text()).to.equal('--More--');
    });
    it('should not display last echoed prompt string', function () {
        wrapper = mount(<Terminal prompt="#>" />);
        terminal = wrapper.instance();
        terminal.echo('line one\n#> \nline 3\n#> ');
        const renderedLines = wrapper.find('.terminal-output-line');

        expect(renderedLines.length).to.equal(3);
        expect(renderedLines.first().text()).to.equal('line one');
        expect(renderedLines.at(1).text()).to.equal('#> ');
        expect(renderedLines.at(2).text()).to.equal('line 3');
    });
    it('should handle ping command response (workaround)', function () {
        wrapper = mount(<Terminal prompt="#>" interpreter={sinon.spy()} />);
        terminal = wrapper.instance();

        terminal.sendInput('ping 1.2.3.4', true);
        terminal.echo('ping 1.2.3.4EXTRA PING LINES\nPING LINE 2');
        const renderedLines = wrapper.find('.terminal-output-line');

        expect(renderedLines.length).to.equal(4);
        expect(renderedLines.first().text()).to.equal('#> ping 1.2.3.4');
        expect(renderedLines.at(1).text()).to.equal('\r\n');
        expect(renderedLines.at(2).text()).to.equal('EXTRA PING LINES');
        expect(renderedLines.at(3).text()).to.equal('PING LINE 2');
    });
    it('should handle backspace', function () {
        wrapper = mount(<Terminal />);
        terminal = wrapper.instance();
        const commandPrompt = wrapper.find(CommandPrompt);
        const command = commandPrompt.find('.js-command-input');

        terminal.setState({ input: 'testing' });
        wrapper.find('.terminal').simulate('keydown', { which: 8 });
        const input = terminal.state.input;

        expect(input).to.equal('testin');
        expect(command.text()).to.equal('testin');
    });
    it('should handle arrow up', function () {
        wrapper = mount(<Terminal history />);
        terminal = wrapper.instance();
        terminalNode = wrapper.find('.terminal');
        const commandPrompt = wrapper.find(CommandPrompt);
        const command = commandPrompt.find('.js-command-input');

        terminal.setState({ history: ['first', 'second'] });
        terminalNode.simulate('keydown', { which: 38 });
        let input = terminal.state.input;

        expect(input).to.equal('second');
        expect(command.text()).to.equal('second');

        terminalNode.simulate('keydown', { which: 38 });
        input = terminal.state.input;

        expect(input).to.equal('first');
        expect(command.text()).to.equal('first');
    });
    it('should handle arrow down', function () {
        wrapper = mount(<Terminal history />);
        terminal = wrapper.instance();
        terminalNode = wrapper.find('.terminal');
        const commandPrompt = wrapper.find(CommandPrompt);
        const command = commandPrompt.find('.js-command-input');

        terminal.setState({ history: ['first', 'second'] });
        terminalNode.simulate('keydown', { which: 38 });
        let input = terminal.state.input;

        expect(input).to.equal('second');
        expect(command.text()).to.equal('second');

        terminalNode.simulate('keydown', { which: 38 });
        input = terminal.state.input;

        expect(input).to.equal('first');
        expect(command.text()).to.equal('first');

        terminalNode.simulate('keydown', { which: 40 });
        input = terminal.state.input;

        expect(input).to.equal('second');
        expect(command.text()).to.equal('second');

        terminalNode.simulate('keydown', { which: 40 });
        input = terminal.state.input;

        expect(input).to.equal('');
        expect(command.text()).to.equal('');
    });
    it('should handle space or q', function () {
        const sendInputSpy = sinon.spy(terminal, 'sendInput');
        terminal.setState({ lines: ['--More--'] });
        terminalNode.simulate('keydown', {
            preventDefault: preventDefaultStub,
            which: 32 // space
        });

        sinon.assert.calledWith(sendInputSpy, ' ', false);
        expect(terminal.state.history.length).to.equal(0);
        expect(terminal.state.pendingCommand).to.equal('');

        terminalNode.simulate('keydown', {
            preventDefault: preventDefaultStub,
            which: 81 // Q
        });

        sinon.assert.calledWith(sendInputSpy, 'q', false);
        expect(terminal.state.history.length).to.equal(0);
        expect(terminal.state.pendingCommand).to.equal('q');
    });
    it('should ignore exit and CTRL+Z', function () {
        const sendInputSpy = sinon.spy(terminal, 'sendInput');
        const interpreterSpy = terminal.props.interpreter; // interpreter already set up with a spy.

        wrapper.find('.terminal').simulate('keydown', {
            preventDefault: preventDefaultStub,
            which: 'Z'.charCodeAt(0)
        });

        sinon.assert.notCalled(sendInputSpy);
        expect(terminal.state.pendingCommand).to.equal('');

        terminal.setState({ input: 'Exit' });
        wrapper.find('.terminal').simulate('keypress', { which: 13 });

        sinon.assert.calledWith(sendInputSpy, 'Exit', true);
        expect(terminal.state.input).to.equal('');
        expect(terminal.state.pendingCommand).to.equal('');
        sinon.assert.notCalled(interpreterSpy);
    });
    it('should handle CTRL+J', sinon.test(function () {
        const sendInputSpy = sinon.spy(terminal, 'sendInput');
        terminal.setState({ input: 'input' });
        terminalNode.simulate('keydown', {
            preventDefault: preventDefaultStub,
            ctrlKey: true,
            which: 74
        });

        sinon.assert.calledWith(sendInputSpy, 'input', true);
        expect(terminal.state.pendingCommand).to.equal('input');
    }));
    it('should only add line break after command if none exists', sinon.test(function () {
        const interpreterSpy = terminal.props.interpreter; // interpreter already set up with a spy.

        terminal.setState({ input: 'input\n\n' });
        terminalNode.simulate('keypress', { which: 13 }); // Enter
        terminal.setState({ input: 'input2' });
        terminalNode.simulate('keypress', { which: 13 }); // Enter
        terminalNode.simulate('keydown', { preventDefault: preventDefaultStub, which: 38 }); // Up arrow
        terminalNode.simulate('keydown', { preventDefault: preventDefaultStub, which: 38 }); // Up arrow
        terminalNode.simulate('keypress', { which: 13 }); // Enter

        sinon.assert.calledWith(interpreterSpy, 'input\n', terminal);
        sinon.assert.calledWith(interpreterSpy, 'input2\n', terminal);
        sinon.assert.calledWith(interpreterSpy, 'input\n', terminal);
        // Should add commands to history without linebreaks.
        expect(terminal.state.history).to.deep.equal(['input', 'input2', 'input']);
    }));
    it('should handle CTRL+M', sinon.test(function () {
        const sendInputSpy = sinon.spy(terminal, 'sendInput');
        terminalNode.simulate('keydown', {
            preventDefault: preventDefaultStub,
            which: 'M'.charCodeAt(0)
        });

        sinon.assert.notCalled(sendInputSpy);
        expect(terminal.state.pendingCommand).to.equal('');
    }));
    it('should handle top level help', sinon.test(function () {
        const interpreterSpy = terminal.props.interpreter; // interpreter already set up with a spy.
        terminal.setState({ input: '' });
        terminalNode.simulate('keypress', {
            preventDefault: preventDefaultStub,
            which: '?'.charCodeAt(0)
        });

        sinon.assert.calledWithExactly(interpreterSpy, '?', terminal);
        expect(terminal.state.pendingCommand).to.equal('?');
        expect(terminal.state.input).to.equal('');
    }));
    it('should handle command help', sinon.test(function () {
        const interpreterSpy = terminal.props.interpreter; // interpreter already set up with a spy.
        terminal.setState({ input: 'show wifi ' });
        terminalNode.simulate('keypress', {
            preventDefault: preventDefaultStub,
            which: '?'.charCodeAt(0)
        });

        // Should send help command followed by backspaces to clear device's pre-entered command.
        sinon.assert.calledWith(interpreterSpy, 'show wifi ?', terminal);
        sinon.assert.calledWith(interpreterSpy, '\b\b\b\b\b\b\b\b\b\b', terminal); //
        expect(terminal.state.pendingCommand).to.equal('show wifi ?');
        expect(terminal.state.input).to.equal('show wifi '); // input pre-primed with command
    }));
});
