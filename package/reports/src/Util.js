Ext.define('Mfw.reports.Util', {
    alternateClassName: 'ReportsUtil',
    singleton: true,

    conditionsToQuery: function (conditions) {
        var query = '';

        if (conditions.predefinedSince) {
            query += 'since=' + conditions.predefinedSince;
        } else {
            query += 'since=' + (conditions.since || 1);
        }

        if (conditions.until) {
            query += '&until=' + conditions.until;
        }


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
                predefinedSince: 1
            }, key, val;

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
                // if it's normal parameter like since, until
                decodedParamParts = decodedParam.split('=');
                key = decodedParamParts[0];
                val = decodedParamParts[1];

                if (key === 'since') {
                    var since, predefSince = val, sinceDate = new Date(parseInt(val, 10));

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
    }

});
