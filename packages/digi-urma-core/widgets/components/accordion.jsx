import { default as React, Component, PropTypes } from 'react';
import Status from './status.jsx';

export default class Accordion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: this.shouldAccordionRenderOpen()
        };
        this.toggle = this.toggle.bind(this);
    }

    shouldAccordionRenderOpen() {
        let active = false;
        const query = this.props.location && this.props.location.query && this.props.location.query.open;
        if (query && query === this.props.name) {
            active = true;
        }
        return active;
    }

    toggle() {
        this.setState({
            active: !this.state.active
        });
    }

    renderButtons() {
        let buttonsArr = this.props.buttons;
        let buttons = [];
        for (var j = 0; j < buttonsArr.length; j++) {
            buttons.push(
                <span key={j}><button key={buttonsArr[j].buttonText}
                    className={buttonsArr[j].className}
                    onClick={buttonsArr[j].onclick}>
          {buttonsArr[j].buttonText}</button></span>);
        }

        return buttons;
    }

    render() {
        const accordionWrapper = this.state.active ? 'accordion-wrapper expander outlined' : 'accordion-wrapper expander outline';
        const accordionExpander = this.state.active ? 'expander-trigger' : 'expander-trigger expander-hidden';
        const message = this.props.message || {};

        // define default messages
        if (message.type && messageDefaults[message.type]) {
            if (!message.text) {
                message.text = messageDefaults[message.type].text;
            }
            message.class = messageDefaults[message.type].class;
        }

        return (
            <div>
                <div className={accordionWrapper}>
                    <div className="accordion-header">
                        <div className="title">
                            <a onClick={this.toggle} className={accordionExpander}>
                                <span>
                                    {this.props.icon ?
                                        <img className="accordionIcon" src={'/images/' + this.props.icon}/>
                                        :
                                        null
                                    }
                                </span>
                                <span>
                                    {this.props.connection}
                                    {this.props.status ?
                                        <Status status={this.props.status}/>
                                        :
                                        null
                                    }
                                </span>
                            </a>
                        </div>
                        <div className="buttons">
                            <span>
                                <div className="helpAccordion">
                                    <img src="/images/help.png"/>
                                </div>
                            </span>
                            { this.props.buttons && this.state.active ?
                                this.renderButtons()
                                :
                                null
                            }
                        </div>
                        {this.props.movebutton ?
                            <span className="drag-container">
                                <span className="dragWrapper">
                                    <img src="/images/up-arrow.png" className="moveIcon mvUp" title="Drag to reorder" onClick={this.props.onUp} data-id={this.props.id}/>
                                </span>
                                <span className="dragWrapper">
                                    <img src="/images/down-arrow.png" className="moveIcon mvDown" title="Drag to reorder" onClick={this.props.onDown} data-id={this.props.id}/>
                                </span>
                            </span>
                            :
                            null
                        }
                    </div>
                    {this.state.active ?
                        <div className="accordion-content">
                            <div className="accordion-message js-submit-message">
                                { message.text ?
                                    <p className={message.class}>{message.text}</p>
                                    :
                                    null
                                }
                            </div>

                            {this.props.children}
                        </div> :
                        null
                    }
                </div>
                <div className="helpAccordion">
                    <img src="/images/help.png" id={this.props.id}/><br/><span >Help</span>
                </div>
                <div className="helpAccordion-box">
                    <div className="help-title">WAN Connections</div>
                    <div className="help-content scrollstyle">WAN Connections details here ....</div>
                </div>
            </div>
        );
    }
}

export const messageDefaults = {
    error: {
        class: 'error form-submitted-error bold',
        text: 'Please correct highlighted errors.'
    },
    success: {
        class: 'status-green bold',
        text: 'Changes applied.'
    }
};

Accordion.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string,
    connection: PropTypes.string,
    icon: PropTypes.string,
    buttons: PropTypes.array,
    message: PropTypes.object,
    location: PropTypes.object,
    status: PropTypes.object
};
