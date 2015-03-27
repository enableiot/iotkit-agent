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
"use strict";
var Table = require('cli-table');
function ComponentTable (data) {
    if (data) {
        this.table = new Table({head: ['id : t', 'kind', 'measure']});
        var i,
            l = data.length;
        for (i = 0 ; i < l ; ++i) {
            var o = data[i];
            this.table.push([o.id, o.type, o.dimension]);
        }
    }
}
ComponentTable.prototype.toString = function () {
    return this.table.toString();
};

module.exports.Table = ComponentTable;


function ComponentList (data) {
    this.table = new Table({head: ['id : t', 'Name', 'cID']});
    var i,
        l = data.length;
    for (i = 0 ; i < l ; ++i) {
        var o = data[i];
        this.table.push([o.type, o.name, o.cid]);
    }
}
ComponentList.prototype.toString = function () {
    return this.table.toString();
};

module.exports.Register = ComponentList;
