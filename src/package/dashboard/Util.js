Ext.define('Mfw.dashboard.Util', {
    alternateClassName: 'DashboardUtil',
    singleton: true,

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
                });
            }
            if (Ext.isObject(value)) {
                Util.sanitize(value);
            }
        });
        return data;
    },

    routeToQuery: function (route) {
        var query = 'dashboard?';
        if (route.since) {
            query += 'since=' + route.since;
        }
        Ext.Array.each(route.conditions, function(condition) {
            query += '&' + condition.column + '=' + condition.operator.toLowerCase() + ':' + condition.value;
        });
        return query;
    },

    queryToRoute: function (query) {
        var route = {
            since: null,
            conditions: []
        };

        if (!query) { return; }

        var queryObj = Ext.Object.fromQueryString(query);

        Ext.Object.each(queryObj, function (key, val) {
            if (key === 'since') {
                route.since = parseInt(val, 10);
                return;
            }
            /**
             * if same column in multiple conditions
             */
            if (Ext.isArray(val)) {
                Ext.Array.each(val, function (v) {
                    route.conditions.push({
                        column: key,
                        operator: v.split(':')[0].toUpperCase(),
                        value: v.split(':')[1]
                    });
                });
            } else {
                route.conditions.push({
                    column: key,
                    operator: val.split(':')[0].toUpperCase(),
                    value: val.split(':')[1]
                });
            }
        });
        return route;
    },


    // conditionsToQuery: function (conditions) {
    //     var query = '';
    //     query += 'since=' + (conditions.since || 1);

    //     Ext.Array.each(conditions.fields, function(field) {
    //         query += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
    //     });
    //     return query;
    // },

    // queryToConditions: function (query) {
    //     var decodedParam,
    //         decodedParamParts,
    //         conditions = {
    //             fields: [],
    //             since: 1,
    //         }, key, val;

    //     Ext.Array.each(query.split('&'), function (paramCond) {

    //         decodedParam = decodeURIComponent(paramCond);

    //         if (decodedParam.indexOf(':') > 0) {
    //             decodedParamParts = decodedParam.split(':');
    //             conditions.fields.push({
    //                 column: decodedParamParts[0],
    //                 operator: decodedParamParts[1],
    //                 value: decodedParamParts[2],
    //                 autoFormatValue: parseInt(decodedParamParts[3], 10) === 1 ? true : false,
    //             });
    //         } else {
    //             decodedParamParts = decodedParam.split('=');
    //             key = decodedParamParts[0];
    //             val = decodedParamParts[1];

    //             if (key === 'since') {
    //                 var since, sinceDate = new Date(parseInt(val, 10));
    //                 conditions.since = val;
    //             }
    //         }
    //     });
    //     return conditions;
    // },

});
