import {default as React, Component, PropTypes} from 'react';

export const WanCellularState = (props) => {
  return (
      <div className="accordion-column-wide">
        {  props.cellularState ?
            <div className="js-wan-cellular-state">
              <h5>Cellular Status and Statistics</h5>
              <div className="alignPadd">
                <div className="interfaceWrapper fullW">
                  <div className="row js-module">
                      <div className="panel-two-column js-label">Module:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.module}</div>
                      </div>
                  </div>
                  <div className="row js-firmware-version">
                      <div className="panel-two-column js-label">Firmware Version:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.firmware_version}</div>
                      </div>
                  </div>
                  <div className="row js-hardware-version">
                      <div className="panel-two-column js-label">Hardware Version:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.hardware_version}</div>
                      </div>
                  </div>
                  <div className="row js-imei">
                      <div className="panel-two-column js-label">IMEI:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.imei}</div>
                      </div>
                  </div>
                  <div className="row js-sim-status" style={{margin:'20px 0px'}}>
                      <div className="panel-two-column js-label">SIM Status:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.sim_status}</div>
                      </div>
                  </div>
                  <div className="row js-signal-strength">
                      <div className="panel-two-column js-label">Signal Strength:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.signal_strength}</div>
                      </div>
                  </div>
                  <div className="row js-signal-quality">
                      <div className="panel-two-column js-label">Signal Quality:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.signal_quality}</div>
                      </div>
                  </div>
                  <div className="row js-registration-status" style={{margin:'20px 0px'}}>
                      <div className="panel-two-column js-label">Registration Status:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.registration_status}</div>
                      </div>
                  </div>
                  <div className="row js-network-provider">
                      <div className="panel-two-column js-label">Network Provider:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.network_provider}</div>
                      </div>
                  </div>
                  <div className="row js-temperature">
                      <div className="panel-two-column js-label">Temperature:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.temperature}</div>
                      </div>
                  </div>
                  <div className="row js-connection-type">
                      <div className="panel-two-column js-label">Connection Type:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.connection_type}</div>
                      </div>
                  </div>
                  <div className="row js-radio-band">
                      <div className="panel-two-column js-label">Radio Band:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.radio_band}</div>
                      </div>
                  </div>
                  <div className="row js-channel">
                      <div className="panel-two-column js-label">Channel:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.channel}</div>
                      </div>
                  </div>
                  <div className="row js-apn-in-use" style={{margin:'20px 0px'}}>
                      <div className="panel-two-column js-label">APN in use:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.pdp_context}</div>
                      </div>
                  </div>
                  <div className="row js-ip-address">
                      <div className="panel-two-column js-label">IP Address:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.ip_address}</div>
                      </div>
                  </div>
                  <div className="row js-mask">
                      <div className="panel-two-column js-label">Mask:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.mask}</div>
                      </div>
                  </div>
                  <div className="row js-gateway">
                      <div className="panel-two-column js-label">Gateway:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.gateway}</div>
                      </div>
                  </div>
                  <div className="row js-dns-servers">
                      <div className="panel-two-column js-label">DNS Servers:</div>
                      <div className="panel-two-column">
                          <div className="fieldVal js-value">{props.cellularState.dns_servers}</div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <p>Loading...</p>
        }
      </div>
  )
};

WanCellularState.propTypes = {
  cellularState: PropTypes.object.isRequired
};