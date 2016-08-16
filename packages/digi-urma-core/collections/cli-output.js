/**
 *  Collection of CliOutput. One entry per message.
 *  Each entry has the follow fields plus the normal _id
 *    cliId
 *    cmdId
 *    typestamp
 *    status
 *    inputControl
 *    msgText
 */
const CliOutput = new Mongo.Collection('cli_output');

export default CliOutput;
