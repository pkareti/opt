import React from 'react';
import {expect} from 'chai';
import Terminal from './terminal.jsx';
import {CLIComponent} from './cli.jsx';
import {shallow} from 'enzyme';

describe('CLI tests', function () {

    it('should render terminal with prompt when system settings data ready', function () {
        const wrapper = shallow(
            <CLIComponent
                dataReady={ true }
                system={ {settings: {prompt: 'howdy>'}} }/>
        );

        let terminal = wrapper.find(Terminal);
        expect(terminal.props().prompt).to.equal('howdy>');
    });

    it('should render terminal with empty prompt if no system settings prompt', function () {
        const wrapper = shallow(
            <CLIComponent
                dataReady={ true }
                system={ {settings: {description: 'whatever>'}} }/>
        );

        let terminal = wrapper.find(Terminal);
        expect(terminal.props().prompt).to.equal('');
    });

    it('should not render terminal if system settings data not ready', function () {
        const wrapper = shallow(<CLIComponent dataReady={ false }/>);

        let terminal = wrapper.find(Terminal);
        expect(terminal).to.have.length(0);
        expect(wrapper.find('.js-cli').text().toLowerCase()).to.have.string('loading');
    });
});