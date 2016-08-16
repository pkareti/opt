import React from 'react';

/**
 * Main container for page content. Main route components get rendered in here.
 * @type {MainContentContainer}
 */
export default class MainContent extends React.Component {
    render() {
        return (
            <div className='device-main-container main-container'>
                { this.props.children }
            </div>
        )
    }
};

MainContent.propTypes = {
    children: React.PropTypes.object
};
