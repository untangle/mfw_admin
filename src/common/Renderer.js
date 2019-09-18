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
        return Map.protocols[value] ? (Map.protocols[value] + ' <span style="color: #999;">[ ' + value + ' ]</span> ') : value;
    },

    interface: function (value) {
        var name = Map.interfaces[value];
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

    interfaceIcon: function (value, record) {
        var icon = 'fa-signal';
        switch (record.get('type')) {
            case 'NIC': icon = 'fa-network-wired'; break;
            case 'WIFI': icon = 'fa-wifi'; break;
            case 'OPENVPN':
            case 'VLAN': icon = 'fa-project-diagram'; break;
            default:
        }
        return '<i class="x-fa ' + icon + '"></i>';
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

    familyRenderer: function(value) {
        return Map.families[value] ? (Map.families[value] + ' <span style="color: #999;">[ ' + value + ' ]</span> ') : value;
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
        return Map.countries[value] ? (Map.countries[value] + ' <span style="color: #999;">[ ' + value + ' ]</span> ') : value;
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
            valueRender = (Map.protocols[value] || ' - ') + ' <em style="color: #999; font-style: normal;">[' + value + ']';
        }

        if (type === 'LIMIT_RATE') {
            valueRender = '<strong>' + rec.get('value') + '</strong> <em style="color: #333; font-style: normal;">' + Map.rateUnits[rec.get('rate_unit')] +
                          ', ' + Map.groupSelectors[rec.get('group_selector')] + '</em>';
        }

        if (type === 'SOURCE_INTERFACE_ZONE' ||
            type === 'DESTINATION_INTERFACE_ZONE' ||
            type === 'CLIENT_INTERFACE_ZONE' ||
            type === 'SERVER_INTERFACE_ZONE') {
            // the multiselect combobox creates a collection object as value
            valueRender = [];
            Ext.Object.each(rec.get('value').split(','), function (key, val) {
                valueRender.push((Map.interfaces[val] || '???') + '<em style="color: #999; font-style: normal;">[' + val + ']</em>');
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
            opText = Map.ruleOps[op],
            value = rec.get('value'),
            valueRender = rec.get('value');

        if (type === 'IP_PROTOCOL') {
            // valueRender = [];
            // Ext.Array.each(rec.get('value').split(','), function (val) {
            //     valueRender.push((Map.protocols[val] || '???') + '<em style="color: #999; font-style: normal;">[' + val + ']</em>');
            // });
            // valueRender = valueRender.join(', ');
            valueRender = (Map.protocols[value] || ' - ') + ' <em style="color: #999; font-style: normal;">[' + value + ']';
        }

        if (type === 'LIMIT_RATE') {
            if (rec.get('rate_unit')) {
                valueRender = '<strong>' + rec.get('value') + '</strong> <em style="color: #333; font-style: normal;">' + Map.rateUnits[rec.get('rate_unit')];
            }
            valueRender += ', Group: ' + Map.groupSelectors[rec.get('group_selector')] + '</em>';
        }

        if (type === 'SOURCE_ADDRESS_TYPE' ||
            type === 'DESTINATION_ADDRESS_TYPE') {
                if (Map.addressTypes[value]) {
                    valueRender = Map.addressTypes[value] + ' <em style="color: #999; font-style: normal;">[' + value + ']</em>';
                }
        }

        if (type === 'CT_STATE') {
            if (Map.connStates[value]) {
                valueRender = Map.connStates[value] + ' <em style="color: #999; font-style: normal;">[' + value + ']</em>';
            }
        }

        if (type === 'SOURCE_INTERFACE_ZONE' ||
            type === 'DESTINATION_INTERFACE_ZONE' ||
            type === 'CLIENT_INTERFACE_ZONE' ||
            type === 'SERVER_INTERFACE_ZONE') {
            // the multiselect combobox creates a collection object as value
            valueRender = [];
            Ext.Object.each(rec.get('value').split(','), function (key, intfId) {
                valueRender.push((Map.interfaces[intfId] || '???') + '<em style="color: #999; font-style: normal;">[' + intfId + ']</em>');
            });
            valueRender = valueRender.join(', ');
        }

        if (type === 'SOURCE_INTERFACE_TYPE' ||
            type === 'DESTINATION_INTERFACE_TYPE' ||
            type === 'CLIENT_INTERFACE_TYPE' ||
            type === 'SERVER_INTERFACE_TYPE') {
            valueRender = Map.interfaceTypes[value] + ' <em style="color: #999; font-style: normal;">[' + value + ']</em>';
        }

        if (type.startsWith('CERT_ISSUER')) {
            typeText = 'Cert. Issuer ' + typeText;
        }

        if (type.startsWith('CERT_SUBJECT')) {
            typeText = 'Cert. Subject ' + typeText;
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
            valueRender, typeRenderer, strArr = [],
            sentence = 'IF packet ', type;

        conditions.each(function (cond) {
            type = cond.get('type');
            typeRenderer = Conditions.map[type].text;
            valueRender = cond.get('value');

            if (type === 'IP_PROTOCOL') {
                // valueRender = [];
                // Ext.Array.each(cond.get('value').split(','), function (val) {
                //     valueRender.push((Map.protocols[val] || '???') + ' <em style="color: #999; font-style: normal;">[' + val + ']</em>');
                // });
                // strArr.push('<span style="font-weight: bold; color: #333;">' +
                //              Map.ruleOps[cond.get('op')].toLowerCase() + ' ' +
                //              valueRender.join(' or ') + '</span>');
                strArr.push('<span style="font-weight: bold; color: #333;">' +
                             Conditions.map[type].text.toLowerCase() + ' ' +
                             Map.ruleOps[cond.get('op')].toLowerCase() + ' ' +
                             Map.protocols[cond.get('value')] + '</span>');
                return;
            }

            if (type === 'LIMIT_RATE') {
                valueRender = [];
                strArr.push('<span style="font-weight: bold; color: #333;">' +
                             Conditions.map[type].text.toLowerCase() + ' ' +
                             Map.ruleOps[cond.get('op')].toLowerCase() + ' ' +
                             cond.get('value') + ' ' +
                             Map.rateUnits[cond.get('rate_unit')].toLowerCase() + ' ' +
                             ' on ' + (Map.groupSelectors[cond.get('group_selector')] || 'Global') + '</span>');
                return;
            }

            if (type.includes('PORT')) {
                valueRender = (cond.get('value') + '').split(',').join(' or ');
                // strArr.push('<span style="font-weight: bold; color: #333;">' +
                //              Conditions.map[type].text.toLowerCase() + ' ' +
                //              Map.ruleOps[cond.get('op')].toLowerCase() + ' ' +
                //              (cond.get('value') + '').split(',').join(' or ') + '</span>');
                // return;
            }

            if (type === 'SOURCE_INTERFACE_NAME' ||
                type === 'DESTINATION_INTERFACE_NAME' ||
                type === 'CLIENT_HOSTNAME' ||
                type === 'CLIENT_USERNAME' ||
                type === 'SERVER_HOSTNAME' ||
                type === 'SERVER_USERNAME' ||
                type === 'LOCAL_HOSTNAME' ||
                type === 'LOCAL_USERNAME') {
                    valueRender = '"' + cond.get('value') + '"';
                // strArr.push('<span style="font-weight: bold; color: #333;">' +
                //              Conditions.map[type].text.toLowerCase() + ' ' +
                //              Map.ruleOps[cond.get('op')].toLowerCase() + ' ' +
                //              '"' + cond.get('value') + '"</span>');
                // return;
            }

            if (type === 'SOURCE_INTERFACE_ZONE' ||
                type === 'DESTINATION_INTERFACE_ZONE' ||
                type === 'CLIENT_INTERFACE_ZONE' ||
                type === 'SERVER_INTERFACE_ZONE') {
                // the multiselect combobox creates a collection object as value
                valueRender = [];
                Ext.Array.each(cond.get('value').split(','), function (val) {
                    valueRender.push(Map.interfaces[val] + ' <em style="color: #999; font-style: normal;">[' + val + ']</em>');
                });
                valueRender = valueRender.join(' or ');
            }

            if (type === 'SOURCE_INTERFACE_TYPE' ||
                type === 'DESTINATION_INTERFACE_TYPE' ||
                type === 'CLIENT_INTERFACE_TYPE' ||
                type === 'SERVER_INTERFACE_TYPE') {
                valueRender = Map.interfaceTypes[cond.get('value')] + ' <em style="color: #999; font-style: normal;">[' + cond.get('value') + ']</em>';
            }

            if (type.startsWith('CERT_ISSUER')) {
                typeRenderer = 'Cert. Issuer ' + typeRenderer;
            }

            if (type.startsWith('CERT_SUBJECT')) {
                typeRenderer = 'Cert. Subject ' + typeRenderer;
            }


            strArr.push('<span style="font-weight: bold; color: #333;">' +
                         typeRenderer.toLowerCase() + ' ' +
                         Map.ruleOps[cond.get('op')].toLowerCase() + ' ' +
                         valueRender + '</span>');
        });


        if (strArr.length > 0) {
            sentence += strArr.join(' and ')  + ', THEN ' + (action ? Renderer.ruleAction(null, action) : '<em>&lt; no action set &gt;</em>');

        } else {
            sentence = 'For any packet ' + (action ? Renderer.ruleAction(null, action) : '<em>&lt; no action set &gt;</em>');
        }

        return sentence;
    },

    ruleAction: function (value, action) {
        var type, actionStr = '&lt; no action set &gt;';

            if (action && action.get('type')) {
            type = action.get('type');
            switch (type) {
                case 'JUMP':            actionStr = 'Jump to'; break;
                case 'GOTO':            actionStr = 'Go to'; break;
                case 'ACCEPT':          actionStr = 'Accept'; break;
                case 'RETURN':          actionStr = 'Return'; break;
                case 'REJECT':          actionStr = 'Reject'; break;
                case 'DROP':            actionStr = 'Drop'; break;
                case 'DNAT':            actionStr = 'New Destination'; break;
                case 'SNAT':            actionStr = 'New Source'; break;
                case 'MASQUERADE':      actionStr = 'Masquerade'; break;
                case 'SET_PRIORITY':    actionStr = 'Priority'; break;
                case 'WAN_DESTINATION': actionStr = 'Wan Destination'; break;
                case 'WAN_POLICY':      actionStr = ''; break;
                default: break;
            }

            if (type === 'JUMP' || type === 'GOTO') {
                // when on Firewall summary do not create chain anchors
                if (location.hash === '#firewall' || location.hash === '#settings/firewall') {
                    actionStr += ' <span style="color: #333;">'  + action.get('chain') + '</span>';
                } else {
                    // set anchors to jump/go to specific chain
                    actionStr += ' <a href="' + location.hash.replace(/(?:.(?!\/))+$/, '/' + action.get('chain')) + '"><strong>' + action.get('chain') + '</strong></a>';
                }
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
                actionStr += Map.wanPolicies[action.get('policy')] + ' <span style="color: #999;">[ policy ' + action.get('policy') + ' ]</span> ';
            }
        }
        return '<span style="color: blue; font-weight: bold;">' + actionStr.toLowerCase() + '</span>';
    },


    wanPolicy: function (value) {
        // for -2 = Default
        if (value === -2) { return 'Default'; }
        return Map.wanPolicies[value] || value;
    },

    wanRule: function (value, record) {
        var chain, rule;

        // for -2 = None, -1 = Cache
        if (value === -2) { return 'None'; }
        if (value === -1) { return 'Cache'; }

        // find the proper chain
        chain = Ext.Array.findBy(Map.wanRules, function(chain) {
            return chain.name === record.get('wan_rule_chain');
        });

        if (!chain || !chain.rules) { return value; }

        rule = Ext.Array.findBy(chain.rules, function(rule) {
            return rule.ruleId === value;
        });

        if (!rule) { return value; }
        return rule.description;
    },

    ipv4: function (value, record) {
        var status = record.get('_status');

        if (record.get('configType') !== 'ADDRESSED') {
            return '-';
        }
        if (value === 'DHCP' || value === 'PPPOE') {
            if (status && status.ip4Addr) {
                return value + ', ' + status.ip4Addr.join(',');
            } else {
                return value;
            }
        }
        if (value === 'STATIC') {
            return 'STATIC, ' + record.get('v4StaticAddress') + '/' + record.get('v4StaticPrefix');
        }
        return '-';
    },

    ipv6: function (value, record) {
        if (record.get('configType') !== 'ADDRESSED') {
            return '-';
        }
        return value || '-';
    }

});
