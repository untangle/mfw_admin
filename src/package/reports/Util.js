Ext.define('Mfw.reports.Util', {
    alternateClassName: 'ReportsUtil',
    singleton: true,

    data: [],

    routeToQuery: function (route) {
        var query = 'reports?';
        // var hash = Ext.Object.fromQueryString(window.location.hash.replace('#reports?', '')), route = 'reports?';

        if (route.cat) { query += 'cat=' + route.cat; }
        if (route.rep) { query += '&rep=' + route.rep; }

        if (route.psince && route.psince !== 'today') {
            query += '&psince=' + route.psince;
        }

        if (route.since) {
            query += '&since=' + route.since;
        }

        // else {
        //     query += '&since=' + (route.since || 1);
        // }

        if (route.until) {
            query += '&until=' + route.until;
        }

        Ext.Array.each(route.conditions, function(condition) {
            query += '&' + condition.column + '=' + condition.operator.toLowerCase() + ':' + condition.value;
        });

        return query;
    },

    queryToRoute: function (query) {
        var route = {
            cat: null,
            rep: null,
            psince: null,
            since: null,
            until: null,
            conditions: []
        };

        // if (query[0] === '?') {
        //     query = query.substr(1);
        // }
        if (!query) { return; }
        var queryObj = Ext.Object.fromQueryString(query);

        Ext.Object.each(queryObj, function (key, val) {
            if (key === 'cat' || key === 'rep') {
                route[key] = val;
                return;
            }
            if (key === 'psince') {
                route.psince = val;
                return;
            }

            if (key === 'since') {
                route.since = parseInt(val, 10);
                return;
            }

            if (key === 'until') {
                route.until = parseInt(val, 10);
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

    fetchReportData: function (report, cb) {
        ReportsUtil.data = [];
        // create query
        ReportsUtil.createQuery(report, function (queryId) {
            ReportsUtil.getData(queryId, function () {
                ReportsUtil.closeQuery(queryId);
                cb(ReportsUtil.data);
            });
        });
    },

    createQuery: function (report, cb) {
        Ext.Ajax.request({
            url: '/api/reports/create_query',
            params: Ext.JSON.encode(report.getData(true)),
            success: function(response) {
                // get data
                var queryId = Ext.decode(response.responseText);
                cb(queryId);
                // ReportsUtil.fetch2(queryId, 0);
            },
            failure: function (response, opts) {
                console.error('Unable to create query!');
            }
        });
    },

    /**
     * Gets data "recursively" till completes the time range (error from backend)
     * @param {integer} queryId
     * @param {function} cb
     */
    getData: function (queryId, cb) {
        var data;
        Ext.Ajax.request({
            url: '/api/reports/get_data/' + queryId,
            success: function (response) {
                data = Ext.decode(response.responseText);
                if (!data.error) {
                    Ext.Array.push(ReportsUtil.data, data);
                    ReportsUtil.getData(queryId, cb);
                } else {
                    cb();
                }
            },
            failure: function (response) {
                console.error('Unable to fetch data for query ' + queryId);
            }
        });
    },

    closeQuery: function (queryId) {
        Ext.Ajax.request({
            url: '/api/reports/close_query/' + queryId,
            method: 'POST',
            success: function (response) {
                // cb(data);
            },
            failure: function () {
                console.error('Unable to to close query ' + queryId);
            }
        });
    }

});
