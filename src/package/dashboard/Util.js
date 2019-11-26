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
        } else {
            query += 'since=1';
        }
        Ext.Array.each(route.conditions, function(condition) {
            query += '&' + condition.column + '=' + condition.operator.toLowerCase() + '$' + encodeURIComponent(condition.value);
        });
        return query;
    },

    queryToRoute: function (query) {
        var route = {
            since: 1,
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
                        operator: v.split('$')[0].toUpperCase(),
                        value: v.split('$')[1]
                    });
                });
            } else {
                route.conditions.push({
                    column: key,
                    operator: val.split('$')[0].toUpperCase(),
                    value: val.split('$')[1]
                });
            }
        });
        return route;
    }
});
