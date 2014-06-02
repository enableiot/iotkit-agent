"use strict";
/**
 * 
 * @param options object that contains attributes of the connection
 * @param callback function to be called at the end of the request
 * @param useHttp if true, it sends a HTTP request, If not, it uses a 
 * HTTPS request
 */
var XML = require('xml2js').parseString;
var request = require('request');

function processResponse(res, body, callback) {
    var data = null;
    if (res.statusCode === 200 || res.statusCode === 201) {
        if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') > -1) {
            try {
                data = JSON.parse(body);
            } catch (e) {
                data = null;
            }
        } else {
            XML(body, function (err, result) {
                callback(result);
            });
            return;
        }
    } else if (res.statusCode === 204) {
        data = {
                status: "Done"
             };
    }
    return  callback(data);
}

module.exports.httpRequest = function createRequest (options, callback) {
    request(options, function (error, response, body) {
        if (!error) {
            processResponse(response, body, function (data) {
                callback(null, data);
            });
        } else {

            callback(error);
        }
    });
};