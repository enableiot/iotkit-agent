/**
 * Created by ammarch on 6/3/14.
 */
"use strict";
"use strict";
var httpClient = require('../../lib/httpClient');
var AdminDef = require('./admin.def');
/**
 * It passes to a callback the access token
 */
module.exports.health = function(callback) {
    var health = new AdminDef.HealthOption();
    return httpClient.httpRequest(health, callback);
};
