Ext.define('Mfw.Renderer', {
    alternateClassName: 'Renderer',
    singleton: true,

    time_stamp: function (value) {
        var date = new Date(value),
            day = Ext.Date.format(date, 'd.m.Y'),
            hour = Ext.Date.format(date, 'h:i:s a');

        return '<span style="color: #999;">' + day + '</span> &nbsp;' + hour;
    },

    ip_protocol: function (value) {
        var protocol = Globals.protocolsMap[value];
        if (protocol) {
            return protocol.text + ' <span style="color: #999;">[ ' + protocol.value + ' ]</span>';
        }
        return value;
    },

    interface: function (value) {
        var name = Globals.interfacesMap[value];
        if (name) {
            return name + ' <span style="color: #999;">[ ' + value + ' ]</span>';
        }
        return value;
    },

    bytesRenderer: function(bytes) {
        var units = ['', 'K', 'M', 'G'];
        var units_itr = 0;
        while ((bytes >= 1000 || bytes <= -1000) && units_itr < 3) {
            bytes = bytes/1000;
            units_itr++;
        }
        bytes = Math.round(bytes*100)/100;
        return '<b>' + bytes + '</b> ' + units[units_itr];
    },

    shortenText: function (str) {
        if (str.length > 15) {
            str = str.substr(0, 5) + ' ... ' + str.substr(str.length - 5, str.length);
        }
        return str;
    }

});
