import {default as React, Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import Urma from 'meteor/digi:urma-core';
import CLI from './cli.jsx';

export default class System extends Component {
    render() {
        return (
            <div className='js-system'>
                <div className="page-header">
                    <div className="page-title">
                        Command Line Interface
                    </div>
                </div>
                <div className="page-container">
                    <CLI
                        context={this.context}
                        getData={
                            {
                                'system': {
                                    groupIndex: 0,
                                    collections: ['settings']
                                }
                            }
                        }/>
                </div>
            </div>
        )
    }
};

System.contextTypes = {
    device: PropTypes.object.isRequired
};
