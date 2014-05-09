'use strict';
var VERSION = '/v1/ui';
var admin = require('../handler/admin');

module.exports = {
   register:  function (app) {
        app.get('/setup', admin.setup);
   }
};