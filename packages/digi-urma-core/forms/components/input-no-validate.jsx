import React from 'react';
import {HOC} from 'formsy-react';

/**
 * FormNoValidate can be used to create a formsy-react form element
 * with no validation
 * @props
 * Required prop:
 * name: name of desired from element
 * type: type of the element,
 * options: if type is select , options are required
 * Optional prop:
 * title: if you want add a label for form element
 * className: if you want className a label for form element
 * Returns html for no validation form element
 */

const InputNoValidate = (props) => {
    const inputProperties = {
        name: props.name,
        className: `form-control ${props.className}`,
        formNoValidate: true,
        onChange: (e) => props.setValue(e.target.value),
    };

    return (
        <div className={`js-input-${props.name}`}>
            {props.title ?
                <label htmlFor={props.name}>{props.title}</label> :
                null
            }
            {(props.type !== 'select' && props.type !== 'radio') ?
                <input
                    type={props.type || 'text'}
                    value={props.getValue() || ''}
                    {...inputProperties} />
                :
                {
                    select: (
                        <select
                            value={props.getValue() || ''}
                            {...inputProperties}
                        >
                            { props.options.map((option, i) => {
                                let value = option.value || option['@value'];
                                let title = option.title || option['@desc'];
                                return (<option key={value + i} value={value}>{title}</option>);
                            })}
                        </select>
                    ),
                    radio: (
                        <div>
                            { props.options.map((option, i) => {
                                let value = option.value || option['@value'] || '';
                                let title = option.title || option['@desc'];

                                return (
                                    <label htmlFor="radio-no-validate" key={i}>
                                        <input
                                            id="radio-no-validate"
                                            type="radio"
                                            value={value}
                                            checked={value === props.getValue() || ''}
                                            {...inputProperties}
                                        />
                                        {title}
                                    </label>
                                );
                            })}
                        </div>
                    )
                }[props.type]
            }
        </div>
    );
};

export default HOC(InputNoValidate);

InputNoValidate.propTypes = {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    className: React.PropTypes.string,
    options: React.PropTypes.array
};
