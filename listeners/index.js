/**
 * Created by ammarch on 4/28/14.
 */
"use strict";

module.exports = {
    MQTT: require('./mqtt'),
    REST: require('./rest'),
    TCP: require('./tcp'),
    UDP: require('./udp')
};