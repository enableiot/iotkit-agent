/**
 * Created by ammarch on 5/21/14.
 */
/**
 * Created by ammarch on 5/21/14.
 */
var auth = require('./activation'),
    device = require('./device'),
    components = require('./components');
/*var metric = require('./metric');*/
var command = process.argv[2];
var arg = process.argv.slice(3);


switch (command) {
    case 'save-code':
        auth.saveCode.apply(null, arg);
        break;
    case 'reset-code':
        auth.restCode.apply(null, arg);
        break;
    case 'activate':
        auth.activate.apply(null, arg);
        break;
    case 'reset-token':
        auth.resetToken.apply(this, arg);
        break;
    case 'device-id':
        device.device.apply(this, arg);
        break;
    case 'reset-device-id':
        device.reset.apply(this, arg);
        break;
    case 'add-metric':
        break;
    case 'reset-components':
        components.reset.apply(this, arg);
        break;
    default:
        console.log ("Command : ", command , " not supported ");
}
