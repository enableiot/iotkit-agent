/*
 Copyright (c) 2014, Intel Corporation

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var assert = require('chai').assert,
    sinon = require('sinon'),
    rewire = require('rewire');


var fileToTest = "../lib/common.js";


var filename = "filename";
var objectFile = '{"object": "file"}';
var objectFileError = '{"object": "file"';
var path = "/path";
var filepath = "/path/file";
var data = {
    object: "file"
};

var fakeFs = {
    writeFileSync: function(filename, data) {
        return undefined;
    },
    existsSync: function(filepath) {
        if (filepath === "exists" ||
            filepath === "/file" ||
            filepath === "/file/exists" ||
            filepath === "/file/exists/device.json" ||
            filepath === "/file/exists/data/device.json") {
            return true;
        }
        return false;
    },
    readFileSync: function(filename) {
        return objectFile;
    }
}

var fakeFsError = {
    writeFileSync: function(filename, data) {
        return new Error("Cannot write");
    },
    existsSync: function(path) {
        return false;
    },
    readFileSync: function(filename) {
        return objectFileError;
    }
}

var logger = {
    log: function() {},
    info: function() {},
    error: function() {},
    debug: function() {}
};

var fakePath = {
    dirname: function(filepath) {
        return path;
    },
}

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    toTest.__set__("logger", logger);

    it('Shall try to write to JSON >', function(done) {
        toTest.__set__("fs", fakeFs);
        assert.isFalse(toTest.writeToJson(filename, data));
        done();
    });

    it('Shall return error while writing  >', function(done) {
        toTest.__set__("fs", fakeFsError);
        assert.isTrue(toTest.writeToJson(filename, data));
        done();
    });

    it('shall try to read file >', function(done) {
        toTest.__set__("fs", fakeFs);
        assert.deepEqual(toTest.readFileToJson("/file/exists", data), JSON.parse(objectFile), "read file does not match");
        done();
    });

    it('shall fail to read corrupt file >', function(done) {
        var localFakeFs = Object.assign({}, fakeFs);
        localFakeFs.readFileSync = fakeFsError.readFileSync;
        toTest.__set__("fs", localFakeFs);
        assert.equal(toTest.readFileToJson("/file/exists", data), objectFileError, "read files with unexpected error");
        done();
    });

    it('shall fail to read non-existing file >', function(done) {
        toTest.__set__("fs", fakeFs);
        assert.isNull(toTest.readFileToJson("/file/doesnotexists", data));
        done();
    });

    it('shall initialize file >', function(done) {
        var spy = sinon.spy();
        var localFakeFs = Object.assign({}, fakeFs);
        localFakeFs.writeFileSync = function(inFilename, inData) {
            spy();
            assert.deepEqual(JSON.parse(inData), data, "data to write is wrong");
            assert.equal(inFilename, "/file/doesnotexist", "path does not match");
        };
        toTest.__set__("fs", localFakeFs);
        assert.isUndefined(toTest.initializeFile("/file/doesnotexist", data));
        assert.isTrue(spy.calledOnce, "writeFileSync not called");
        done();
    });

    it('shall not initialize file >', function(done) {
        var spy = sinon.spy();
        var localFakeFs = Object.assign({}, fakeFs);
        localFakeFs.writeFileSync = function(inFilename, inData) {
            spy();
        };
        localFakeFs.existsSync = function(filepath) {
            return true;
        }
        toTest.__set__("fs", localFakeFs);
        assert.isUndefined(toTest.initializeFile(filepath, data));
        assert.isFalse(spy.called, "writeFileSync should not be called");
        done();
    });

    it('shall initialize logger >', function(done) {
        var localLogger = data;
        assert.isUndefined(toTest.init(localLogger));
        assert.deepEqual(localLogger, toTest.__get__("logger"));
        toTest.__set__("logger", logger);
        done();
    });

    it('shall check successfully for absolute path >', function(done) {
        assert.isTrue(toTest.isAbsolutePath("/home/test"), "Absolute Path not detected");
        assert.isTrue(toTest.isAbsolutePath("/home/test/."), "Absolute Path not detected");
        assert.isTrue(toTest.isAbsolutePath("/home/test/../user"), "Absolute Path not detected");
        done();
    });

    it('shall check unsuccessfully for absolute path >', function(done) {
        assert.isFalse(toTest.isAbsolutePath("home/test"), "Non-absolute Path not detected");
        assert.isFalse(toTest.isAbsolutePath("."), "Non-absolute Path not detected");
        assert.isFalse(toTest.isAbsolutePath(".."), "Non-absolute Path not detected");
        done();
    });

    it('shall get data directory file >', function(done) {
        config = {
            data_directory: "/data/directory"
        }
        toTest.__set__("config", config);
        assert.equal(toTest.getFileFromDataDirectory("filename"), "/data/directory/filename", "Data Director wrong");
        done();
    });

    it('shall get relative data directory file >', function(done) {
        config = {
            data_directory: "data/directory"
        }
        toTest.__set__("config", config);
        toTest.__set__("__dirname", "/path/to/application");
        assert.equal(toTest.getFileFromDataDirectory("filename"), "/path/to/data/directory/filename", "Data Director wrong");
        done();
    });

    it('shall get empty filename >', function(done) {
        toTest.__set__("config", undefined);
        toTest.__set__("__dirname", "/path/to/application");
        assert.equal(toTest.getFileFromDataDirectory("filename"), "", "filename not empty");
        done();
    });

    it('shall get device config name >', function(done) {
        config = {
            data_directory: "/file/exists"
        }
        toTest.__set__("config", config);
        assert.equal(toTest.getDeviceConfigName(), "/file/exists/device.json", "Device config is wrong");
        done();
    });

    it('shall get relative device config name >', function(done) {
        config = {
            data_directory: "./data"
        }
        toTest.__set__("config", config);
        toTest.__set__("__dirname", "/file/exists/not");
        toTest.__set__("fs", fakeFs);
        assert.equal(toTest.getDeviceConfigName(), "/file/exists/data/device.json", "Device config is wrong");
        done();
    });

    it('shall get device config >', function(done) {
        config = {
            data_directory: "/file/exists/"
        }
        toTest.__set__("config", config);
        toTest.__set__("fs", fakeFs);
        assert.deepEqual(toTest.getDeviceConfig(), JSON.parse(objectFile), "Wrong config file read");
        done();
    });

    it('shall read config >', function(done) {
        toTest.__set__("fs", fakeFs);
        assert.deepEqual(toTest.readConfig("/file/exists"), JSON.parse(objectFile), "Wrong config file read");
        done();
    });

    it('shall fail to read config >', function(done) {
        toTest.__set__("fs", fakeFs);
        assert.equal(toTest.readConfig("/file/not/exists"), null, "Unexpected config file");
        done();
    });

    it('shall write config >', function(done) {
        toTest.__set__("fs", fakeFs);
        assert.equal(toTest.writeConfig("/file/exists"), undefined, "Could not write file");
        done();
    });

    it('shall exit process with 1', function(done) {
        fakeProcess = {
            exit: function(input) {
                assert.equal(input, 1, 'process should exit with 1');
            }
        }
        toTest.__set__("process", fakeProcess);
        done();
    });

    it('cannot add to config file  >', function(done) {
        var spy = sinon.spy();
        var localFakeFs = Object.assign({}, fakeFs);
        localFakeFs.writeFileSync = function(inFilename, inData) {
            spy();
        };
        localFakeFs.existsSync = function(filepath) {
            return true;
        }
        localFakeFs.readFileSync = function(filename) {
            return {};
        }
        toTest.__set__("fs", localFakeFs);
        var wrapper = function() {
            toTest.saveToConfig("filename", "user.name", "username");
        }
        assert.isFalse(spy.called, "writeFileSync should not be called!");
        done();
    });

    it('shall save to device config  >', function(done) {
        var originalObject = '{ "object": "file", "user": { "id": "id"}}'
        var spy = sinon.spy();
        var localFakeFs = Object.assign({}, fakeFs);
        localFakeFs.writeFileSync = function(inFilename, inData) {
            spy();
            assert.equal(inFilename, "/file/exists/device.json");
        };
        localFakeFs.existsSync = function(filepath) {
            return true;
        }
        localFakeFs.readFileSync = function(filename) {
            return originalObject;
        }
        config = {
            data_directory: "/file/exists"
        }
        toTest.__set__("fs", localFakeFs);
        toTest.__set__("config", config);
        assert.equal(toTest.saveToDeviceConfig("user.name", "username"), undefined, "Could save to device config");
        assert.isTrue(spy.calledOnce, "writeFileSync not called!");
        done();
    });

});
