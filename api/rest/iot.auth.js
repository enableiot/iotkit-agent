/**
 * Created by ammarch on 5/16/14.
 */
var config = require('../../config');

var ConnectionOptions = require('./iot.connection.def.js');
var apiconf = config.connector.rest;

var IoTKiT = {};
/**
 * Connection attributes to redirect to Intel Identity Main Page
 */
function GetTokenOption () {
    this.pathname = apiconf.auth.token;
    this.token = null;
    ConnectionOptions.call(this);
    this.method = 'POST';
    this.body =  JSON.stringify({username: apiconf.auth.usr,
                                 password: apiconf.auth.pass});
}
GetTokenOption.prototype = new ConnectionOptions();
GetTokenOption.prototype.constructor = GetTokenOption;
IoTKiT.GetTokenOption = GetTokenOption;
module.exports = IoTKiT;





