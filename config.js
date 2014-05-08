/**
 * Created by ammarch on 4/25/14.
 */

/* default configuration handled with dynamic environment */
var config = {
    "broker" : {
        "host": "ci-broker.us.enableiot.com",
        "port": 1883,
        "qos": 1,
        "retain": true,
        "secure": false,
        "key": "./certs/client.key",
        "crt": "./certs/client.crt",
        "retries": 30
    },

    "mqtt_port_listen": 1884,
    "rest_port_listen": 9090,
    "udp_port_listen": 41234,
    "tcp_port_listen": 7070,
    "tcp_host_listen": "127.0.0.1",

    "activation_code": "jtGZHWJP",
    "api_key": "jEvlAF7zuJ",
    "token_file": "token.json",
    "device_loc" : [88.34, 64.22047, -20],

    "gateway_id": null,
    "activation_retries" : 10,

    "device": "devices/{deviceid}",
    "device_status": "devices/{deviceid}/activation_status",
    "device_activation": "devices/{deviceid}/activation",
    "device_metadata": "devices/{deviceid}/metadata",
    "metric_topic": "server/metric/{accountid}/{gatewayid}",
    "device_components_add" :  "devices/{deviceid}/components/add",
    "device_component_del": "devices/{deviceid}/components/delete"
};

/* override for local development if NODE_ENV is defined to local */
if (process.env.NODE_ENV && (process.env.NODE_ENV.toLowerCase().indexOf("local") !== -1)) {
    config.broker.host = "127.0.0.1";
}
module.exports = config;