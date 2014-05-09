/**
 * Created by ammarch on 5/8/14.
 */
"use strict";
module.exports.setup = function(req, res) {
    res.render('setup', {iotAgent: {"deviceid": "testing"}});
};