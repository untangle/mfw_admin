Ext.define('Mfw.Renderer', {
    alternateClassName: 'Renderer',
    singleton: true,

    hex: function (value) {
        if (value === null || value === undefined) {
            return '';
        }
        return '0x' + (("00000000" + value.toString(16)).substr(-8));
    },

    timeStamp: function (value) {
        // FIXME this uses the browser timezone, not the server timezone
        var date = new Date(value),
            day = Ext.Date.format(date, 'd.m.Y'),
            hour = Ext.Date.format(date, 'h:i:s a');

        return '<span style="color: #999;">' + day + '</span> &nbsp;' + hour;
    },

    ipProtocol: function (value) {
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
        if (value == 0) {
            return 'unset' + ' <span style="color: #999;">[ ' + value + ' ]</span>';
        } else if (value == 255) {
            return 'local' + ' <span style="color: #999;">[ ' + 255 + ' ]</span>';
        } else {
            return value;
        }
    },

    interfaceType: function (value) {
        var type = '';
        switch (value) {
            case 1: type = 'WAN'; break;
            case 2: type = 'LAN'; break;
            case 3: type = 'Unused'; break;
            default: type = 'Unset';
        }
        return type + ' <span style="color: #999;">[ ' + value + ' ]</span>';
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

        var units = ['B', 'KB', 'MB', 'GB', 'TB'];
        var units_itr = 0;
        while ((bytes >= 1000 || bytes <= -1000) && units_itr < 3) {
            bytes = bytes/1000;
            units_itr++;
        }
        if (units_itr != 0) {
            bytes = (Math.round(bytes*100)/100).toFixed(1);
        }
        return '<b>' + bytes + '</b> ' + units[units_itr];
    },

    bytesSecRenderer: function(bytes) {
        if (bytes === null || bytes === undefined) {
            return '';
        }

        var units = ['B/s', 'kB/s', 'MB/s', 'GB/s'];
        var units_itr = 0;
        while ((bytes >= 1000 || bytes <= -1000) && units_itr < 3) {
            bytes = bytes/1000;
            units_itr++;
        }
        if (units_itr != 0) {
            bytes = (Math.round(bytes*100)/100).toFixed(1);
        }
        return '<b>' + bytes + '</b> ' + units[units_itr];
    },

    packetsRenderer: function(packets) {
        if (packets === null || packets === undefined) {
            return '';
        }

        var units = ['', 'K', 'M', 'B'];
        var units_itr = 0;
        while ((packets >= 1000 || packets <= -1000) && units_itr < 3) {
            packets = packets/1000;
            units_itr++;
        }
        if (units_itr != 0) {
            packets = (Math.round(packets*100)/100).toFixed(1);
        }
        return '<b>' + packets + '</b> ' + units[units_itr];
    },

    packetsSecRenderer: function(packets) {
        if (packets === null || packets === undefined) {
            return '';
        }

        var units = ['/s', 'K/s', 'M/s', 'B/s'];
        var units_itr = 0;
        while ((packets >= 1000 || packets <= -1000) && units_itr < 3) {
            packets = packets/1000;
            units_itr++;
        }
        if (units_itr != 0) {
            packets = (Math.round(packets*100)/100).toFixed(1);
        }
        return '<b>' + packets + '</b> ' + units[units_itr];
    },

    tcpStateRenderer: function(tcp_state) {
        if (tcp_state === null || tcp_state === undefined) {
            return '';
        }

        switch(tcp_state) {
        case 0:
            return '';
        case 1:
            return 'SYN_SENT';
        case 2:
            return 'SYN_RECV';
        case 3:
            return 'ESTABLISHED';
        case 4:
            return 'FIN_WAIT';
        case 5:
            return 'CLOSE_WAIT';
        case 6:
            return 'LAST_ACK';
        case 7:
            return 'TIME_WAIT';
        case 8:
            return 'CLOSE';
        case 9:
            return 'SYN_SENT2';
        default:
            return tcp_state;
        }
    },
    
    familyRenderer: function(family) {
        if (family == 2) {
            return "IPv4";
        } else if (family == 10) {
            return "IPv6";
        } else {
            return family;
        }
    },
    
    shortenText: function (str) {
        if (str.length > 15) {
            str = str.substr(0, 5) + ' ... ' + str.substr(str.length - 5, str.length);
        }
        return str;
    },

    timeRangeSeconds: function (sec) {
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

    timeRangeMilliseconds: function (msec) {
        if (msec === null || msec === undefined) {
            return '';
        }
        msec = Number(msec);
        var sec = msec/1000;
        var millis = (msec%1000)+"";
        while (millis.length < 3) millis = "0" + millis;

        return Renderer.timeRangeSeconds(sec) + "." + millis;
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
