/**
 * Created by ammarch on 5/8/14.
 */
"use strict";
var path = require('path');
var common = require('../../lib/common');
var filename = path.join(__dirname, '../../certs/agent-ids.json');
var utils = require('../../lib/utils').init();

module.exports.setup = function(req, res) {
    utils.getDeviceId(function (id) {
        var data = common.readFileToJson(filename);
        data.device_id = id;
        res.render('setup', {iotAgent: data});
    });
};


module.exports.setdata = function(req, res) {

    var data = {
        act_code: req.body.actcode,
        api_key:  req.body.apikey,
        device_id: req.body.deviceid
    };
    common.writeToJson(filename, data);
    res.send(200);
};