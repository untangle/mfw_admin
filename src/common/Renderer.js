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

    boolean: function (value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (value === true) {
            return '<i class="x-fa fa-check"></i>';
        }
        if (value === false) {
            return '<i class="x-fa fa-ban"></i>';
        }
    },

    bytesRenderer: function(bytes) {
        if (bytes === null || bytes === undefined) {
            return '';
        }

        var units = ['', 'K', 'M', 'G'];
        var units_itr = 0;
        while ((bytes >= 1000 || bytes <= -1000) && units_itr < 3) {
            bytes = bytes/1000;
            units_itr++;
        }
        bytes = (Math.round(bytes*100)/100).toFixed(2);
        return '<b>' + bytes + '</b> ' + units[units_itr];
    },

    bytesRendererSec: function(bytes) {
        return Renderer.bytesRenderer(bytes) + "/s";
    },

    shortenText: function (str) {
        if (str.length > 15) {
            str = str.substr(0, 5) + ' ... ' + str.substr(str.length - 5, str.length);
        }
        return str;
    },

    timeout_seconds: function (sec) {
        if (sec === null || sec === undefined) {
            return '';
        }
        sec = Number(sec);
        var h = Math.floor(sec / 3600);
        var m = Math.floor(sec % 3600 / 60);
        var s = Math.floor(sec % 3600 % 60);

        var hDisplay = h > 10 ? h : ('0' + h);
        var mDisplay = m > 10 ? m : ('0' + m);
        var sDisplay = s > 10 ? s : ('0' + s);
        return hDisplay + ':' + mDisplay + ':' + sDisplay;
    },

    country: function (value) {
        var c = Globals.countriesMap[value];
        if (c) {
            return c.text + ' [ ' + c.value + ' ] ';
        } else {
            return value;
        }
    }

});
