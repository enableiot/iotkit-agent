/**
 * Created by ammarch on 6/5/14.
 */

function UdpTable (server, port) {
    this.server = server;
    this.port = port;
    this.data = {};
}

UdpTable.prototype.add = function (id, record) {
    var me = this;
    me.data[id] = record;
};
UdpTable.prototype.del =  function (id) {
    var me = this;
    delete me.data[id];
};

UdpTable.prototype.getRinfo = function (id) {
    var me = this;
    return me.data[id];
};
var table = null;

module.exports.singleton = function (server, port) {
    if (table === null) {
        table = new UdpTable(server, port);
    }
    return table;
};
