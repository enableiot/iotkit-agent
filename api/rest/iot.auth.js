/**
 * Created by ammarch on 5/16/14.
 */
var config = require('../../config');

var ConnectionOptions = require('./iot.connection.def.js');

var IoTKiT = {};
/**
 * Connection attributes to redirect to Intel Identity Main Page
 */
function GetTokenOption () {
    this.pathname = config.api.auth.token;
    ConnectionOptions.call(this);
    this.method = 'POST';
    this.body =  JSON.stringify({username: config.api.auth.usr,
                                 password: config.api.auth.pass});
    this.headers = {
        "Content-type" : "application/json"
    };
}
GetTokenOption.prototype = new ConnectionOptions();
GetTokenOption.prototype.constructor = GetTokenOption;
IoTKiT.GetTokenOption = GetTokenOption;
module.exports = IoTKiT;





