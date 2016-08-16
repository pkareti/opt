import { default as React, Component, PropTypes } from 'react';
import { UrmaForms } from 'meteor/digi:urma-core';
import CustomValidations from '../../forms/custom-validation-rules.js';
import Validations from '../probing-validations.js';

let Form = UrmaForms.Formsy.Form;
let Input = UrmaForms.Input;
let InputNoValidate = UrmaForms.InputNoValidate;

export default class Probing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            valid: true
        };
        this.setInputVals = this.setInputVals.bind(this);
    }

    componentWillMount() {
        let initialWanSettings = {};
        initialWanSettings.probeHost = this.props.initialWanSettings ? this.props.initialWanSettings.probe_host : null;
        initialWanSettings.probeSize = this.props.initialWanSettings ? this.props.initialWanSettings.probe_size : null;
        initialWanSettings.probeTimeout = this.props.initialWanSettings ? this.props.initialWanSettings.probe_timeout : null;
        initialWanSettings.activateAfter = this.props.initialWanSettings ? this.props.initialWanSettings.activate_after : null;
        initialWanSettings.retryAfter = this.props.initialWanSettings ? this.props.initialWanSettings.retry_after : null;
        initialWanSettings.probeInterval = this.props.initialWanSettings ? this.props.initialWanSettings.probe_interval : null;
        initialWanSettings.timeout = this.props.initialWanSettings ? this.props.initialWanSettings.timeout : null;
        initialWanSettings.retryAfterUnit = 1;
        initialWanSettings.activateAfterUnit = 1;
        initialWanSettings.changed = false;
        this.initialWanSettings = initialWanSettings;
        this.props.onChange('wanProbingSettings', this.initialWanSettings);
    }

    setInputVals(currentValues) {
        currentValues.changed = true;
        this.props.onChange('wanProbingSettings', currentValues);
    }

    setValid() {
        this.setState({ valid: true });
        this.props.onChange('valid', true);
    }

    setInvalid() {
        this.setState({ valid: false });
        this.props.onChange('valid', false);
    }

    isInValidSubmission() {
        return this.props.submitted && !this.state.valid;
    }

    render() {
        return (
            <div className="accordion-column-wide js-wan-probing">
                <h5>Probing</h5>
                <div className="alignPadd">
                  <Form ref="form" className="probe-settings-form" onValid={this.setValid.bind(this)}
                        onInvalid={this.setInvalid.bind(this)} onChange={this.setInputVals}>
                      <div className="fullW">
                          <div className="row js-probe-host">
                              <div className="panel-two-column js-label">Probe Host:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="probeHost"
                                         type="text"
                                         className="input-full"
                                         value={this.initialWanSettings.probeHost}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.probeHost.validations}
                                         validationError={Validations.probeHost.errors}/>
                              </div>
                          </div>
                          <div className="row js-probe-interval">
                              <div className="panel-two-column js-label">Probe Interval:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="probeInterval"
                                         type="text"
                                         value={this.initialWanSettings.probeInterval}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.probeInterval.validations}
                                         validationError={Validations.probeInterval.errors}>
                                      <span>seconds</span>
                                  </Input>
                              </div>
                          </div>
                          <div className="row js-probe-size">
                              <div className="panel-two-column js-label">Probe Size:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="probeSize"
                                         type="text"
                                         value={this.initialWanSettings.probeSize}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.probeSize.validations}
                                         validationError={Validations.probeSize.errors}>
                                      <span>bytes</span>
                                  </Input>
                              </div>
                          </div>
                          <div className="row js-probe-timeout">
                              <div className="panel-two-column js-label">Probe Timeout:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="probeTimeout"
                                         type="text"
                                         value={this.initialWanSettings.probeTimeout}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.probeTimeout.validations}
                                         validationError={Validations.probeTimeout.errors}>
                                      <span>seconds</span>
                                  </Input>
                              </div>
                          </div>
                          <div className="row js-activate-after">
                              <div className="panel-two-column js-label">Activate After:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="activateAfter"
                                         type="text"
                                         value={this.initialWanSettings.activateAfter}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.activateAfter.validations}
                                         validationError={Validations.activateAfter.errors}>
                                      <InputNoValidate name="activateAfterUnit"
                                                       className="activate-after-unit"
                                                       type="select"
                                                       value={this.initialWanSettings.activateAfterUnit}
                                                       options={[{ value:3600, title: "hours" },
                                                                 { value:60, title: "minutes" },
                                                                 { value:1, title: "seconds" }]}/>
                                  </Input>
                              </div>
                          </div>
                          <div className="row js-retry-after">
                              <div className="panel-two-column js-label">Retry After:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="retryAfter"
                                         type="text"
                                         value={this.initialWanSettings.retryAfter}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.retryAfter.validations}
                                         validationError={Validations.retryAfter.errors}>
                                      <InputNoValidate name="retryAfterUnit"
                                                       className="retry-after-unit"
                                                       type="select"
                                                       value={this.initialWanSettings.retryAfterUnit}
                                                       options={[{ value:3600, title: "hours" },
                                                                 { value:60, title: "minutes" },
                                                                 { value:1, title: "seconds" }]}/>
                                  </Input>
                              </div>
                          </div>
                          <div className="row js-timeout">
                              <div className="panel-two-column js-label">Time Out:</div>
                              <div className="panel-two-column js-value">
                                  <Input name="timeout"
                                         type="text"
                                         value={this.initialWanSettings.timeout}
                                         invalidSubmission={this.isInValidSubmission()}
                                         validations={Validations.timeout.validations}
                                         validationError={Validations.timeout.errors}>
                                      <span>seconds</span>
                                  </Input>
                              </div>
                          </div>
                      </div>
                  </Form>
                </div>
            </div>
        );
    }
}

Probing.propTypes = {
    onChange: PropTypes.func.isRequired,
    initialWanSettings: PropTypes.object.isRequired,
    submitted: PropTypes.bool.isRequired
};
