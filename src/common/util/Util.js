Ext.define('Mfw.util.Util', {
    alternateClassName: 'Util',
    singleton: true,

    api: window.location.origin + '/api',
    // api: 'http://192.168.101.233/api',


    /**
     * Called recursively to transform/sanitize data sent back to server
     * by removing/cleaning up extra fields generated by the UI
     */
    sanitize: function (data) {
        Ext.Object.each(data, function (key, value) {
            if (Ext.String.startsWith(key, '_') || key === 'id') {
                delete data[key];
            }

            // remove null or empty string keys
            if (value === '' || value === null) {
                delete data[key];
            }

            if (Ext.isArray(value)) {
                Ext.Array.each(value, function (v) {
                    Util.sanitize(v);
                })
            }
            if (Ext.isObject(value)) {
                Util.sanitize(value);
            }
        });
        // console.log(data);
        return data;
    },

    ops: {
        eq: { value: '==', text: 'Equals'.t(), sign: ' [ = ]' },
        ne: { value: '!=', text: 'Not Equals'.t(), sign: ' [ &ne; ]' },
        gt: { value: '>', text: 'Greater Than'.t(), sign: ' [ &gt; ]' },
        lt: { value: '<', text: 'Less Than'.t(), sign: ' [ &lt; ]' },
        ge: { value: '>=', text: 'Greater Than or Equal'.t(), sign:' [ &ge; ]' },
        le: { value: '<=', text: 'Less Than or Equal'.t(), sign: ' [ &le; ]' }
    },

    conditions: [{
        type:'IP_PROTOCOL',
        name: 'IP Protocol'.t(),
        operators: ['eq', 'ne'],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            value: 'TCP', // a default value
            options: Globals.protocols
        }
    }, {
        type:'CLIENT_ADDRESS',
        name: 'Client Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SERVER_ADDRESS',
        name: 'Server Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'CLIENT_PORT',
        name: 'Client Port'.t(),
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'SERVER_PORT',
        name: 'Server Port'.t(),
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'CLIENT_INTERFACE_ZONE',
        name: 'Client Interface Zone'.t(),
        operators: ['eq', 'ne']
    }, {
        type:'SERVER_INTERFACE_ZONE',
        name: 'Server Interface Zone'.t(),
        operators: ['eq', 'ne']
    }, {
        type:'SOURCE_ADDRESS',
        name: 'Source Address'.t()
    }, {
        type:'DESTINATION_ADDRESS',
        name: 'Destination Address'.t()
    }, {
        type:'SOURCE_PORT',
        name: 'Source Port'.t()
    }, {
        type:'DESTINATION_PORT',
        name: 'Destination Port'.t()
    }, {
        type:'SOURCE_INTERFACE_ZONE',
        name: 'Source Interface Zone'.t(),
        operators: ['eq', 'ne']
    }, {
        type:'DESTINATION_INTERFACE_ZONE',
        name: 'Destination Interface Zone'.t(),
        operators: ['eq', 'ne']
    }, {
        type:'SOURCE_INTERFACE_NAME',
        name: 'Source Interface Name'.t(),
        operators: ['eq', 'ne']
    }, {
        type:'DESTINATION_INTERFACE_NAME',
        name: 'Destination Interface Name'.t(),
        operators: ['eq', 'ne']
    }, {
        type: 'CT_STATE',
        name: 'Connection State',
        operators: ['eq', 'ne'],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            // queryMode: 'local',
            // displayField: 'name',
            // valueField: 'name',
            value: 'TCP', // a default value
            options: [
                { text: 'Established', value: 'established' },
                { text: 'Related', value: 'related' },
                { text: 'Invalid', value: 'invalid' }
            ]
        }
    }],

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
