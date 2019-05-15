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
            query += '&' + condition.column + '=' + condition.operator.toLowerCase() + '$' + condition.value;
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
    },

    computeSince: function (route) {
        var tz = moment().tz(Mfw.app.tz.displayName), conditionSince;

        if (!route.psince && !route.since) {
            conditionSince = tz.startOf('day').valueOf();
        }

        // set time conditions
        if (route.psince && !route.since) {
            switch (route.psince) {
                case '1h': conditionSince = tz.subtract(1, 'hour').valueOf(); break;
                case '6h': conditionSince = tz.subtract(6, 'hour').valueOf(); break;
                // today
                case 'yesterday': conditionSince = tz.subtract(1, 'day').startOf('day').valueOf(); break;
                case 'thisweek': conditionSince = tz.startOf('week').valueOf(); break;
                case 'lastweek': conditionSince = tz.subtract(1, 'week').startOf('week').valueOf(); break;
                case 'month': conditionSince = tz.startOf('month').valueOf(); break;
                default: conditionSince = tz.startOf('day').valueOf();
            }
        }

        if (route.since) {
            if (route.since <= 24) {
                // for dashboard represents since hour
                conditionSince = tz.subtract(route.since, 'hour').valueOf();
            } else {
                // for reports represents timestamp
                conditionSince = route.since;
            }
        }
        return conditionSince;
    },


    fetchReportData: function (report, cb) {
        var data = [],
            createQuery = function (report, cb2) {
                Ext.Ajax.request({
                    url: '/api/reports/create_query',
                    params: Ext.JSON.encode(report.getData(true)),
                    success: function(response) {
                        // get data
                        var queryId = Ext.decode(response.responseText);
                        cb2(queryId);
                        // ReportsUtil.fetch2(queryId, 0);
                    },
                    failure: function () {
                        cb2();
                        // console.error('Unable to create query!');
                    }
                });
            },
            /**
             * Gets data "recursively" till completes the time range (error from backend)
             * @param {integer} queryId
             * @param {function} cb
             */
            getData = function (queryId, cb3) {
                var partialData;
                Ext.Ajax.request({
                    url: '/api/reports/get_data/' + queryId,
                    success: function (response) {
                        partialData = Ext.decode(response.responseText);

                        /**
                         * ! for EVENTS reports limit the data length to max 3000 records
                         * ! until some real paging will be available
                         */
                        if (report.get('type') === 'EVENTS' && data.length >= 2000) {
                            Ext.Array.push(data, partialData);
                            cb3();
                            return;
                        }

                        if (!partialData.error) {
                            Ext.Array.push(data, partialData);
                            getData(queryId, cb3);
                        } else {
                            cb3();
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
                    success: function () {
                        // cb(data);
                    },
                    failure: function () {
                        console.error('Unable to to close query ' + queryId);
                    }
                });
            };

        createQuery(report, function (queryId) {
            if (!queryId) {
                cb('error');
                return;
            }
            getData(queryId, function () {
                closeQuery(queryId);
                cb(data);
            });
        });
    }
});
