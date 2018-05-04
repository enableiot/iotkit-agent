/*
Copyright (c) 2017, Intel Corporation

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
var path = require('path');
global.logger = {
    info: function() {},
    error: function() {},
    debug: function() {}
};

global.testuserConfig = {};

global.testglobalConfig = {};

global.testdeviceConfig = {
    device_id: '',
    last_actuations_pull_time: ''
};

global.Testvalue = {
    last_actuations_pull_time: '',
    config: {
        default_connector: "rest+ws",
        data_directory: "./data/",
        thekey: "thevalue",
        null: ''
    },
    host_value: '',
    port_value: '',
    host_proxy: '',
    port_proxy: '',
    udp_port_value: 0,
    filedir1: '',
    filedir2: '',
    filedir3: ''
};

var ipmap = {
    lo: [
        {
            address: '127.0.0.1',
            family: 'IPv4',
            internal: true,
        },
        {
            address: '::1',
            family: 'IPv6',
            internal: true,
        }
    ],
    enp0: [
        {
            address: '11.22.33.44',
            family: 'IPv4',
            internal: false,
        },
        {
            address: 'aaaa:bbbb:cccc:dddd:0000:1111',
            family: 'IPv6',
            internal: false,
        }
    ]
}

global.fakeos = {
    networkInterfaces: function() {
        return ipmap;
    }
};

global.fakeCommon = {
    initializeDataDirectory: function() {},
    getDeviceConfig: function() {
        return testdeviceConfig;
    },
    readFileToJson: function(fullPath) {},
    writeToJson: function() {},
    getConfig: function() {
        return Testvalue.config;
    },
    saveToGlobalConfig: function(key, value) {
        testglobalConfig[key] = value;
    },
    saveToUserConfig: function(key, value) {
        testuserConfig[key] = value;
    },
    saveToDeviceConfig: function(key, value) {
        testdeviceConfig[key] = value;
    }
}

var filecontent = {
    aaa: 123,
    bbb: 456
};

global.fakefs = {
    exists: function(dir, cb) {},
    readdirSync: function(thispath) {
        var result = {
            length: thispath.path,
            forEach: function(cb) {
                cb("myfile");
            }
        }
        return result;
    },
    writeFileSync: function(thispath) {},
    readFileSync: function(thispath) {},
    rmdirSync: function(thispath) {},
    unlinkSync: function(thispath) {}
}

global.fakeFsError = {
    readFileSync: function(filename, options) {
        throw new Error("Cannot load from file");
    }
}

global.fakeUuid = {
    v4: function() {
        return "436e7e74-6771-4898-9057-26932f5eb7e1";
    }
}
