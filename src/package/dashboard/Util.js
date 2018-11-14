Ext.define('Mfw.dashboard.Util', {
    alternateClassName: 'DashboardUtil',
    singleton: true,

    conditionsToQuery: function (conditions) {
        var query = '';
        query += 'since=' + (conditions.since || 1);

        Ext.Array.each(conditions.fields, function(field) {
            query += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
        });
        return query;
    },

    queryToConditions: function (query) {
        var decodedParam,
            decodedParamParts,
            conditions = {
                fields: [],
                since: 1,
            }, key, val;

        console.log(query);

        Ext.Array.each(query.split('&'), function (paramCond) {

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
                decodedParamParts = decodedParam.split('=');
                key = decodedParamParts[0];
                val = decodedParamParts[1];

                if (key === 'since') {
                    var since, sinceDate = new Date(parseInt(val, 10));
                    conditions.since = val;
                }
            }
        });
        return conditions;
    },

});
