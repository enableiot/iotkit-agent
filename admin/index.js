/**
 * Created by ammarch on 5/21/14.
 */
/**
 * Created by ammarch on 5/21/14.
 */
var auth = require('./activation'),
    device = require('./device');
/*var metric = require('./metric');*/
var command = process.argv[2];
var arg = process.argv.slice(3);

switch (command) {
    case 'savecode':
        auth.save.apply(null, arg);
        break;
    case 'activate':
        auth.activate.apply(null, arg);
        break;
    case 'resettoken':
        auth.reset.apply(this, arg);
        break;
    case 'device-id':
        device.show.apply(this, arg);
        break;
    case 'setDeviceId':
        device.save.apply(null, arg);
        break;
    case 'resetDeviceId':
        device.reset.apply(this, arg);
        break;
    case 'addMetric':
        break;
    default:
        console.log ("Command : ", command , " not supported ");
}
