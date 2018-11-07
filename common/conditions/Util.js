Ext.define('Mfw.common.conditions.Util', {
    alternateClassName: 'ConditionsUtil',
    singleton: true,

    fields: [
        { text: 'Username'.t(),    value: 'username' },
        { text: 'Protocol'.t(),    value: 'protocol' },
        { text: 'Hostname'.t(),    value: 'hostname' },
        { text: 'Client'.t(),      value: 'c_client_addr' },
        { text: 'Server'.t(),      value: 's_server_addr' },
        { text: 'Server Port'.t(), value: 's_server_port' },
    ],

    operators: [
        { text: 'equals [=]'.t(),            value: '=' },
        { text: 'not equals [!=]'.t(),       value: '!=' },
        { text: 'greater than [>]'.t(),      value: '>' },
        { text: 'less than [<]'.t(),         value: '<' },
        { text: 'greater or equal [>=]'.t(), value: '>=' },
        { text: 'less or equal [<=]'.t(),    value: '<='},
        { text: 'like'.t(),                  value: 'like' },
        { text: 'not like'.t(),              value: 'not like' },
        { text: 'is'.t(),                    value: 'is' },
        { text: 'is not'.t(),                value: 'is not' },
        { text: 'in'.t(),                    value: 'in' },
        { text: 'not in'.t(),                value: 'not in' }
    ],

    protocols: [
        { name: 'HOPOPT' },
        { name: 'ICMP' },
        { name: 'IGMP' },
        { name: 'GGP' },
        { name: 'IP-in-IP' },
        { name: 'ST' },
        { name: 'TCP' },
        { name: 'CBT' },
        { name: 'EGP' },
        { name: 'IGP' },
        { name: 'BBN-RCC-MON' },
        { name: 'NVP-II' },
        { name: 'PUP' },
        { name: 'ARGUS' },
        { name: 'EMCON' },
        { name: 'XNET' },
        { name: 'CHAOS' },
        { name: 'UDP' },
        { name: 'MUX' },
        { name: 'DCN-MEAS' },
        { name: 'HMP' },
        { name: 'PRM' },
        { name: 'XNS-IDP' },
        { name: 'TRUNK-1' },
        { name: 'TRUNK-2' },
        { name: 'LEAF-1' },
        { name: 'LEAF-2' },
        { name: 'RDP' },
        { name: 'IRTP' },
        { name: 'ISO-TP4' },
        { name: 'NETBLT' },
        { name: 'MFE-NSP' },
        { name: 'MERIT-INP' },
        { name: 'DCCP' },
        { name: '3PC' },
        { name: 'IDPR' },
        { name: 'XTP' },
        { name: 'DDP' },
        { name: 'IDPR-CMTP' },
        { name: 'TP++' },
        { name: 'IL' },
        { name: 'IPv6' },
        { name: 'SDRP' },
        { name: 'IPv6-Route' },
        { name: 'IPv6-Frag' },
        { name: 'IDRP' },
        { name: 'RSVP' },
        { name: 'GRE' },
        { name: 'MHRP' },
        { name: 'BNA' },
        { name: 'ESP' },
        { name: 'AH' },
        { name: 'I-NLSP' },
        { name: 'SWIPE' },
        { name: 'NARP' },
        { name: 'MOBILE' },
        { name: 'TLSP' },
        { name: 'SKIP' },
        { name: 'IPv6-ICMP' },
        { name: 'IPv6-NoNxt' },
        { name: 'IPv6-Opts' },
        { name: 'CFTP' },
        { name: 'SAT-EXPAK' },
        { name: 'KRYPTOLAN' },
        { name: 'RVD' },
        { name: 'IPPC' },
        { name: 'SAT-MON' },
        { name: 'VISA' },
        { name: 'IPCU' },
        { name: 'CPNX' },
        { name: 'CPHB' },
        { name: 'WSN' },
        { name: 'PVP' },
        { name: 'BR-SAT-MON' },
        { name: 'SUN-ND' },
        { name: 'WB-MON' },
        { name: 'WB-EXPAK' },
        { name: 'ISO-IP' },
        { name: 'VMTP' },
        { name: 'SECURE-VMTP' },
        { name: 'VINES' },
        { name: 'TTP' },
        { name: 'NSFNET-IGP' },
        { name: 'DGP' },
        { name: 'TCF' },
        { name: 'EIGRP' },
        { name: 'OSPF' },
        { name: 'Sprite-RPC' },
        { name: 'LARP' },
        { name: 'MTP' },
        { name: 'AX.25' },
        { name: 'IPIP' },
        { name: 'MICP' },
        { name: 'SCC-SP' },
        { name: 'ETHERIP' },
        { name: 'ENCAP' },
        { name: 'GMTP' },
        { name: 'IFMP' },
        { name: 'PNNI' },
        { name: 'PIM' },
        { name: 'ARIS' },
        { name: 'SCPS' },
        { name: 'QNX' },
        { name: 'A/N' },
        { name: 'IPComp' },
        { name: 'SNP' },
        { name: 'Compaq-Peer' },
        { name: 'IPX-in-IP' },
        { name: 'VRRP' },
        { name: 'PGM' },
        { name: 'L2TP' },
        { name: 'DDX' },
        { name: 'IATP' },
        { name: 'STP' },
        { name: 'SRP' },
        { name: 'UTI' },
        { name: 'SMP' },
        { name: 'SM' },
        { name: 'PTP' },
        { name: 'IS-IS' },
        { name: 'FIRE' },
        { name: 'CRTP' },
        { name: 'CRUDP' },
        { name: 'SSCOPMCE' },
        { name: 'IPLT' },
        { name: 'SPS' },
        { name: 'PIPE' },
        { name: 'SCTP' },
        { name: 'FC' },
        { name: 'RSVP-E2E-IGNORE' },
        { name: 'Mobility' },
        { name: 'UDPLite' },
        { name: 'MPLS-in-IP' },
        { name: 'manet' },
        { name: 'HIP' },
        { name: 'Shim6' },
        { name: 'WESP' },
        { name: 'ROHC' }
    ],

    // adds timezone computation to ensure dates showing in UI are showing actual server date
    serverToClientDate: function (serverDate) {
        if (!serverDate) { return null; }
        return Ext.Date.add(serverDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    },

    // extracts the timezone computation from UI dates before requesting new data from server
    clientToServerDate: function (clientDate) {
        if (!clientDate) { return null; }
        return Ext.Date.subtract(clientDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    },


    /**
     * Converts a query with condition parameters into an array of conditions used to query backend
     * an encoded URL condition parameter can look like ...username:%3D:test:1...
     * and ':' separator helps spliting the condition into column:operator:value:autoFormatValue
     * or it could be just since=timestamp, until=timestamp which are time range conditions
     */
    paramsToModel: function (view, params) {
        var decodedParam,
            decodedParamParts,
            conditions = {
                fields: [],
                since: 1,
            }, key, val;

        if (view === 'reports') {
            conditions.predefinedSince = 1
        }


        Ext.Array.each(params.split('&'), function (paramCond) {

            decodedParam = decodeURIComponent(paramCond);

            if (decodedParam.indexOf(':') > 0) {
                decodedParamParts = decodedParam.split(':');
                conditions.fields.push({
                    column: decodedParamParts[0],
                    operator: decodedParamParts[1],
                    value: decodedParamParts[2],
                    autoFormatValue: parseInt(decodedParamParts[3], 10) === 1 ? true : false,
                });
            } else {
                // if it's normal parameter like since, until
                decodedParamParts = decodedParam.split('=');
                key = decodedParamParts[0];
                val = decodedParamParts[1];

                if (key === 'since') {
                    var since, predefSince = val, sinceDate = new Date(parseInt(val, 10));

                    if (view === 'dashboard') {
                        conditions.since = val;
                        return;
                    }

                    switch (val) {
                        case '1h': since = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1); break;
                        case '6h': since = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6); break;
                        case 'today': since = Ext.Date.clearTime(Util.serverToClientDate(new Date())); break;
                        case 'yesterday': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1); break;
                        case 'thisweek': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()); break;
                        case 'lastweek': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7); break;
                        case 'month': since = Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())); break;
                        default:
                            if (sinceDate.getTime() > 0 && Ext.Date.diff(sinceDate, new Date(), Ext.Date.YEAR) < 1) {
                                since = sinceDate;
                                predefSince = sinceDate.getTime();
                            } else {
                                since = Ext.Date.clearTime(Util.serverToClientDate(new Date()));
                                predefSince = 'today';
                            }
                            break;

                    }
                    conditions.predefinedSince = predefSince;
                    conditions.since = since.getTime();

                }

                if (key === 'until') {
                    // remove until in case of predefined since
                    if (Ext.Array.contains(['1h', '6h', 'today', 'yesterday', 'thisweek', 'lastweek', 'month'], conditions.predefinedSince)) {
                        conditions.until = null;
                    } else {
                        var until, untilDate = new Date(parseInt(val, 10));
                        if (untilDate.getTime() > 0) {
                            until = untilDate.getTime();
                        } else {
                            until = null;
                        }
                        conditions.until = until;
                    }
                }
            }
        });
        return conditions;
    },

    modelToParams: function (view, conditions) {
        var params = '';

        if (view === 'dashboard') {
            params += 'since=' + (conditions.since || 1);
        }

        if (view === 'reports') {
            if (conditions.predefinedSince) {
                params += 'since=' + conditions.predefinedSince;
            } else {
                params += 'since=' + (conditions.since || 1);
            }

            if (conditions.until) {
                params += '&until=' + conditions.until;
            }
        }

        Ext.Array.each(conditions.fields, function(field) {
            params += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
        });

        return params;
    },

    // compareConditions: function (conditions, newConditions) {
    //     var equals = true;
    //     Ext.Object.each(newConditions, function (key, val) {
    //         if (key !== 'fields') {
    //             if (!conditions[key] || conditions[key] !== val) {
    //                 console.log('here');
    //                 equals = false;
    //             }
    //         } else {
    //             Ext.Array.each(val, function (field, idx) {
    //                 Util.compareConditions(field, conditions.fields[idx]);

    //                 // Ext.Object.each(field, function (key, val) {
    //                 //     console.log(conditions['fields']);
    //                 //     if (!conditions['fields'][idx][key] || conditions['fields'][idx][key] !== val) {
    //                 //         console.log('here2');
    //                 //         equals = false;
    //                 //     }
    //                 // })
    //             })
    //         }
    //     });
    //     return equals;
    // },


    generateTimeSeries: function () {
        var seriesNumber = Ext.Number.randomInt(3, 5),
            start = Ext.Date.clearTime(Util.serverToClientDate(new Date())),
            time = start,
            series = [],
            end = new Date();

        for (var i = 0; i < seriesNumber; i++) {
            series[i] = { name: 'Series ' + i, data: [] }
        }

        while (Ext.Date.between(time, start, end)) {
            time = Ext.Date.add(time, Ext.Date.MINUTE, 10);
            Ext.Array.each(series, function (serie) {
                serie.data.push([time.getTime(), Ext.Number.randomInt(0, 100)])
            })
        }
        return series;
    },

    generatePieData: function () {
        var pienum = Ext.Number.randomInt(0, 25), data = [], arr = [], i;



        for (i = 0; i <= pienum; i++) {
            arr.push({
                name: 'Slice ' + i,
                y: Ext.Number.randomInt(1, 100)
            });
        }

        Ext.Array.sort(arr, function (a, b) {
            if (a.y > b.y) { return -1 }
            if (a.y < b.y) { return 1 }
            return 0;
        });

        Ext.Array.each(arr, function (v) {
            data.push(v);
            // data.push({ y: v });
        });

        console.log(data);

        return {
            name: 'some name',
            data: data
        };
    },

    generateData: function (record) {
        if (record.get('type') === 'STATIC_SERIES' || record.get('type') === 'DYNAMIC_SERIES') {
            return Util.generateTimeSeries(record);
        }
        if (record.get('type') === 'CATEGORIES') {
            return Util.generatePieData(record);
        }
        return;
    }

});


Ext.util.Format.dateFormatter = function (value, format) {
    if (!value) {
        return '';
    }

    if (!Ext.isDate(value)) {
        value = new Date(value);
    }
    return Ext.Date.dateFormat(value, format || 'Y-m-d H:i A');
};
