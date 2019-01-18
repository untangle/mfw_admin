Ext.define('Mfw.reports.Util', {
    alternateClassName: 'ReportsUtil',
    singleton: true,

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

    computeSince: function (route) {
        var conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date()));


        if (!route.psince && !route.since) {
            conditionSince = parseInt(conditionSince.getTime(), 10);
        }

        // set time conditions
        if (route.psince && !route.since) {
            switch (route.psince) {
                case '1h': conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1); break;
                case '6h': conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6); break;
                // case 'today': conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); break;
                case 'yesterday': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1); break;
                case 'thisweek': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()); break;
                case 'lastweek': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7); break;
                case 'month': conditionSince = Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())); break;
                default: conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); // today
            }
            conditionSince = conditionSince.getTime();
        }

        if (route.since) {
            if (route.since <= 24) {
                // for dashboard represents since hour
                conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, route.since).getTime();
            } else {
                // for reports represents timestamp
                conditionSince = route.since;
            }
        }
        return conditionSince;
    },


    fetchReportData: function (report, cb) {
        var data = [],
            createQuery = function (report, cb) {
                Ext.Ajax.request({
                    url: '/api/reports/create_query',
                    params: Ext.JSON.encode(report.getData(true)),
                    success: function(response) {
                        // get data
                        var queryId = Ext.decode(response.responseText);
                        cb(queryId);
                        // ReportsUtil.fetch2(queryId, 0);
                    },
                    failure: function () {
                        console.error('Unable to create query!');
                    }
                });
            },
            /**
             * Gets data "recursively" till completes the time range (error from backend)
             * @param {integer} queryId
             * @param {function} cb
             */
            getData = function (queryId, cb) {
                var partialData;
                Ext.Ajax.request({
                    url: '/api/reports/get_data/' + queryId,
                    success: function (response) {
                        partialData = Ext.decode(response.responseText);
                        if (!partialData.error) {
                            Ext.Array.push(data, partialData);
                            getData(queryId, cb);
                        } else {
                            cb();
                        }
                    },
                    failure: function () {
                        console.error('Unable to fetch data for query ' + queryId);
                    }
                });
            },
            closeQuery = function (queryId) {
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
            };

        createQuery(report, function (queryId) {
            getData(queryId, function () {
                closeQuery(queryId);
                cb(data);
            });
        });
    }
});
