import React from 'react';
import { Link } from 'react-router';
import url from 'url';

export default class WizardButtons extends React.Component {
    handleClickBack() {
        const back = retainQueryParams(this.props.back, this.props.location);
        this.context.router.push(back);
    }

    handleClickNext(e) {
        let onNext = this.props.onNext;
        let transitionToNext = this.props.transitionToNext;

        if (typeof onNext === 'function') {
            let onNextResult = this.props.onNext(e);

            if (onNextResult.transitionToNext || typeof onNextResult.transitionToNext === 'undefined') {
                transitionToNext();
            }
        } else if (typeof onNext !== 'function') {
            transitionToNext();
        } else {
            return false;
        }
    }

    buttonText(direction) {
        if (this.props[direction].text) {
            return this.props[direction].text;
        } else {
            return direction;
        }
    }

    render() {
        return (
            <div className="wizard-buttons-wrapper">
                <div className="wizard-buttons">
                    {this.props.back ?
                        <button className="btn-gray back" onClick={this.handleClickBack.bind(this)}>
                            <i className="fa fa-caret-left"></i>
                            {this.buttonText('back')}
                        </button> :
                        null
                    }
                    <button disabled={!this.props.nextEnabled} className="next" onClick={this.handleClickNext.bind(this)}>
                        {this.buttonText('next')}
                        <i className="fa fa-caret-right"></i>
                    </button>
                </div>
            </div>

        )
    }
}

WizardButtons.contextTypes = {
    router: React.PropTypes.object.isRequired
};

WizardButtons.propTypes = {
    location: React.PropTypes.object.isRequired,
    nextEnabled: React.PropTypes.bool.isRequired,
    transitionToNext: React.PropTypes.func.isRequired,
    back: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.string
    ]),
    next: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.string
    ]).isRequired,
    onNext: React.PropTypes.func
}

export const retainQueryParams = (nextPath, location) => {
    let pathObj = nextPath;

    // parse for queries in provided path (in case string format provided)
    if (typeof nextPath === 'string') {
        pathObj = url.parse(nextPath, true);
    }

    if (!pathObj.query) {
        pathObj.query = {};
    }
    // check to see if queries exist, if so add them if not already in path
    if (pathObj.pathname !== '/') {
        const queries = location.query;
        _.each(queries, (val, key) => {
            // key -> query name
            if (!pathObj.query[key]) {
                pathObj.query[key] = val;
            }
        });
    }

    return pathObj;
};
