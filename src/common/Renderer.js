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
        var m = moment(value).tz(Mfw.app.tz.displayName);
        return '<span style="color: #999;">' + m.format('DD.MM.YY') + '</span> &nbsp;' + m.format('hh:mm:ss A');
    },

    time: function (value) {
        var m = moment(value).tz(Mfw.app.tz.displayName);
        return '<span style="color: #999;">' + m.format('hh:mm:ss A') + '</span>';
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
            case 3: type = 'unused'; break;
            default: type = 'unset';
        }
        return type + ' <span style="color: #999;">[ ' + value + ' ]</span>';
    },

    boolean: function (value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (value === true || value === 'true' || value === 1) {
            return 'YES';
        }
        if (value === false || value === 'false' || value === 0) {
            return 'NO';
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
        while (millis.length < 3) { millis = "0" + millis; }

        return Renderer.timeRangeSeconds(sec) + "." + millis;
    },

    country: function (value) {
        var c = Globals.countriesMap[value];
        if (c) {
            return c.text + ' [ ' + c.value + ' ] ';
        } else {
            return value;
        }
    },

    uptime: function (value) {
        var numyears = Math.floor(value / 31536000),
            numdays = Math.floor((value % 31536000) / 86400),
            numhours = Math.floor(((value % 31536000) % 86400) / 3600),
            numminutes = Math.floor((((value % 31536000) % 86400) % 3600) / 60),
            uptime = '';

        if (numyears > 0) {
            uptime += numyears + 'y ';
        }
        if (numdays > 0) {
            uptime += numdays + 'd ';
        }
        if (numhours > 0) {
            uptime += numhours + 'h ';
        }
        if (numminutes > 0) {
            uptime += numminutes + 'm';
        }
        return uptime;
    },

    round: function(value) {
        if (!value) {
            return 0;
        }
        return '<b>' + value.toFixed(2) + '</b>';
    },

    /**
     * Condition value renderer based on type
     * @param {any} value
     */
    conditionValue: function (val, rec) {
        var type = rec.get('type'),
            value = rec.get('value'),
            valueRender = rec.get('value');

        if (type === 'IP_PROTOCOL') {
            if (Globals.protocolsMap[value]) {
                valueRender = Globals.protocolsMap[value].text + ' <em style="color: #999; font-style: normal;">[' + value + ']</em>';
            }
        }

        if (type === 'LIMIT_RATE') {
            valueRender = '<strong>' + rec.get('value') + '</strong> <em style="color: #333; font-style: normal;">' + Util.limitRateUnitsMap[rec.get('rate_unit')].text +
                          ', ' + Util.groupSelectorsMap[rec.get('group_selector')].text + '</em>';
        }

        if (type === 'SOURCE_INTERFACE_ZONE' ||
            type === 'DESTINATION_INTERFACE_ZONE' ||
            type === 'CLIENT_INTERFACE_ZONE' ||
            type === 'SERVER_INTERFACE_ZONE') {
            // the multiselect combobox creates a collection object as value
            valueRender = [];
            Ext.Object.each(rec.get('value'), function (key, intfId) {
                if (Globals.interfacesMap[intfId]) {
                    valueRender.push(Globals.interfacesMap[intfId] + ' <em style="color: #999; font-style: normal;">[ ' + intfId + ' ]</em>');
                } else {
                    // intfId not found
                    valueRender.push('??? <em style="color: #999; font-style: normal;">[ ' + intfId + ' ]</em>');
                }
            });
            valueRender = valueRender.join(' ');
        }
        return valueRender;
    },

    /**
     * Condition value renderer based on type
     */
    conditionText: function (val, rec) {
        var type = rec.get('type'),
            typeText = Conditions.map[type].text,
            op = rec.get('op'),
            opText = Util.operatorsMap[op].text,
            value = rec.get('value'),
            valueRender = rec.get('value');

        if (type === 'IP_PROTOCOL') {
            valueRender = [];
            Ext.Array.each(rec.get('value'), function (val) {
                if (Globals.protocolsMap[val]) {
                    valueRender.push(Globals.protocolsMap[val].text + '<em style="color: #999; font-style: normal;">[' + val + ']</em>');
                } else {
                    valueRender.push('???<em style="color: #999; font-style: normal;">[' + val + ']</em>');
                }
            });
            valueRender = valueRender.join(', ');
        }

        if (type === 'LIMIT_RATE') {
            if (rec.get('rate_unit')) {
                valueRender = '<strong>' + rec.get('value') + '</strong> <em style="color: #333; font-style: normal;">' + Util.limitRateUnitsMap[rec.get('rate_unit')].text;
            }
            valueRender += ', Group: ' + Util.groupSelectorsMap[rec.get('group_selector')].text + '</em>';
        }

        if (type === 'SOURCE_ADDRESS_TYPE' ||
            type === 'DESTINATION_ADDRESS_TYPE') {
                if (Util.addressTypesMap[value]) {
                    valueRender = Util.addressTypesMap[value].text + ' <em style="color: #999; font-style: normal;">[' + value + ']</em>';
                }
        }

        if (type === 'CT_STATE') {
                if (Util.connectionStatesMap[value]) {
                    valueRender = Util.connectionStatesMap[value].text + ' <em style="color: #999; font-style: normal;">[' + value + ']</em>';
                }
        }

        if (type === 'SOURCE_INTERFACE_ZONE' ||
            type === 'DESTINATION_INTERFACE_ZONE' ||
            type === 'CLIENT_INTERFACE_ZONE' ||
            type === 'SERVER_INTERFACE_ZONE') {
            // the multiselect combobox creates a collection object as value
            valueRender = [];
            Ext.Object.each(rec.get('value'), function (key, intfId) {
                if (Globals.interfacesMap[intfId]) {
                    valueRender.push(Globals.interfacesMap[intfId] + '<em style="color: #999; font-style: normal;">[' + intfId + ']</em>');
                } else {
                    // intfId not found
                    valueRender.push('???<em style="color: #999; font-style: normal;">[' + intfId + ']</em>');
                }
            });
            valueRender = valueRender.join(', ');
        }
        var str = '<div style="font-family: monospace;"><span style="font-weight: bold;">' + typeText + '</span> &middot;<span style="color: blue;">' + opText + '</span>&middot; ' + valueRender;

        if (val) {
            str += '<br/><span style="color: #999; font-size: 10px;">' + type + ' ' + op + ' ' + value + '</span>';
            if (type === 'LIMIT_RATE') {
                str += ' <span style="color: #999; font-size: 10px;">' + rec.get('rate_unit') + ', ' + rec.get('group_selector') + '</span>';
            }
        }

        str += '</div>';

        return str;
    },


    /**
     * Renderer for Rules Conditions
     */
    conditionsList: function (value, record) {
        var conditions = record.conditions(), arr = [];
        if (conditions.count() === 0) {
            return '<em>No conditions</em>';
        }

        conditions.each(function (condition) {
            arr.push(Renderer.conditionText(null, condition));
        });

        return arr.join(' ');
    },

    conditionsSentence: function (value, record) {
        var conditions = record.conditions(),
            action = record.getAction(),
            valueRender, strArr = [],
            sentence = 'If packet ', type;

        conditions.each(function (cond) {
            type = cond.get('type');

            if (type === 'IP_PROTOCOL') {
                valueRender = [];
                Ext.Array.each(cond.get('value'), function (val) {
                    if (Globals.protocolsMap[val]) {
                        valueRender.push(Globals.protocolsMap[val].text);
                    } else {
                        valueRender.push(val);
                    }
                });
                strArr.push('<span style="font-weight: bold; color: #333;">' +
                             Util.operatorsMap[cond.get('op')].text.toLowerCase() + ' ' +
                             valueRender.join(' or ') + '</span>');
                return;
            }

            if (type === 'LIMIT_RATE') {
                valueRender = [];
                strArr.push('<span style="font-weight: bold; color: #333;">' +
                             Conditions.map[type].text.toLowerCase() + ' ' +
                             Util.operatorsMap[cond.get('op')].text.toLowerCase() + ' ' +
                             cond.get('value') + ' ' +
                             Util.limitRateUnitsMap[cond.get('rate_unit')].text.toLowerCase() + ' ' +
                             ' on ' + Util.groupSelectorsMap[cond.get('group_selector')].text + '</span>');
                return;
            }

            if (type.includes('PORT')) {
                strArr.push('<span style="font-weight: bold; color: #333;">' +
                             Conditions.map[type].text.toLowerCase() + ' ' +
                             Util.operatorsMap[cond.get('op')].text.toLowerCase() + ' ' +
                             (cond.get('value') + '').split(',').join(' or ') + '</span>');
                return;
            }

            if (type === 'SOURCE_INTERFACE_NAME' ||
                type === 'DESTINATION_INTERFACE_NAME' ||
                type === 'CLIENT_HOSTNAME' ||
                type === 'CLIENT_USERNAME' ||
                type === 'SERVER_HOSTNAME' ||
                type === 'SERVER_USERNAME' ||
                type === 'LOCAL_HOSTNAME' ||
                type === 'LOCAL_USERNAME') {
                strArr.push('<span style="font-weight: bold; color: #333;">' +
                             Conditions.map[type].text.toLowerCase() + ' ' +
                             Util.operatorsMap[cond.get('op')].text.toLowerCase() + ' ' +
                             '"' + cond.get('value') + '"</span>');
                return;
            }

            strArr.push('<span style="font-weight: bold; color: #333;">' +
                         Conditions.map[type].text.toLowerCase() + ' ' +
                         Util.operatorsMap[cond.get('op')].text.toLowerCase() + ' ' +
                         cond.get('value') + '</span>');
        });


        if (strArr.length > 0) {
            sentence += strArr.join(' and ')  + ', then ' + (action ? Renderer.ruleAction(null, action) : '<no action set>');

        } else {
            sentence = 'For any packet ' + (action ? Renderer.ruleAction(null, action) : '<em>&lt; no action set &gt;</em>');
        }

        return sentence;
    },

    ruleAction: function (value, action) {
        var type, actionStr = '&lt; no action set &gt;'.t();

            if (action && action.get('type')) {
            type = action.get('type');
            switch (type) {
                case 'JUMP':            actionStr = 'Jump to'.t(); break;
                case 'GOTO':            actionStr = 'Go to'.t(); break;
                case 'ACCEPT':          actionStr = 'Accept'.t(); break;
                case 'RETURN':          actionStr = 'Return'.t(); break;
                case 'REJECT':          actionStr = 'Reject'.t(); break;
                case 'DROP':            actionStr = 'Drop'.t(); break;
                case 'DNAT':            actionStr = 'New Destination'.t(); break;
                case 'SNAT':            actionStr = 'New Source'.t(); break;
                case 'MASQUERADE':      actionStr = 'Masquerade'.t(); break;
                case 'SET_PRIORITY':    actionStr = 'Priority'.t(); break;
                case 'WAN_DESTINATION': actionStr = 'Wan Destination'.t(); break;
                case 'WAN_POLICY':      actionStr = ''; break;
                default: break;
            }
            if (type === 'JUMP' || type === 'GOTO') {
                // anchors generated by replacing in hash the current chain with the new one
                actionStr += ' <a href="' + location.hash.replace(/(?:.(?!\/))+$/, '/' + action.get('chain')) + '"><strong>' + action.get('chain') + '</strong></a>';
            }
            if (type === 'SNAT') {
                actionStr += ' ' + action.get('snat_address');
            }
            if (type === 'DNAT') {
                actionStr += ' ' + action.get('dnat_address');
            }
            if (type === 'SET_PRIORITY') {
                actionStr += ' ' + action.get('priority');
            }
            if (type === 'WAN_POLICY') {
                actionStr += Util.policiesMap[action.get('policy')].text + ' <span style="color: #999;">[ policy ' + action.get('policy') + ' ]</span> ';
            }
        }
        return '<span style="color: blue; font-weight: bold;">' + actionStr.toLowerCase() + '</span>';
    }
});
