/**
 * Created by ammarch on 4/25/14.
 */

var key = require('./certs/agent-ids.json');

/* default configuration handled with dynamic environment */
var config = {
    "broker" : {
        "host": "dev-broker.us.enableiot.com",
        "port": 8883,
        "qos": 1,
        "retain": false,
        "secure": true,
        "key": "./certs/enableiot_agent.key",
        "crt": "./certs/enableiot_agent.crt",
        "retries": 30
    },

    "http_port_server": 9091,
    "mqtt_port_listen": 1884,
    "rest_port_listen": 9090,
    "udp_port_listen": 41234,
    "tcp_port_listen": 7070,
    "tcp_host_listen": "127.0.0.1",
    "activation_retries" : 10,
    "activation_code": key.activation_code,
    "device_id" : key.device_id,
    "token_file": "token.json",

    "device_loc" : [88.34, 64.22047, -20],
    "gateway_id": null,
    /*
        Default Connector allows ['mqtt', 'rest']
     */
    "default_connector": "mqtt",
    "connector": {
            "mqtt" : {
                "device": "devices/{deviceid}",
                "device_status": "devices/{deviceid}/activation_status",
                "device_activation": "devices/{deviceid}/activation",
                "device_metadata": "devices/{deviceid}/metadata",
                "metric_topic": "server/metric/{accountid}/{gatewayid}",
                "device_component_add": "devices/{deviceid}/components/add",
                "device_component_del": "devices/{deviceid}/components/delete"
                 },
            "rest" : {
                host: "<%= @prefix %>dashboard.us.enableiot.com",
                port: 443,
                protocol: "https",
                strictSSL: false,
                device :{
                    act : '/v1/api/devices/{deviceid}/activation',
                    update : '/v1/api/devices/{deviceid}',
                    components: '/v1/api/devices/{deviceid}/components'
                },
                submit: {
                    data: '/v1/api/data/{deviceid}'
                }
            }
        }
};

/* override for local development if NODE_ENV is defined to local */
if (process.env.NODE_ENV && (process.env.NODE_ENV.toLowerCase().indexOf("local") !== -1)) {
    config.broker.host = "127.0.0.1";
}
module.exports = config;
