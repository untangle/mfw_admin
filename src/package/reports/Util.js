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
                // var since, predefSince = val, sinceDate = new Date(parseInt(val, 10));

                // switch (val) {
                //     case '1h': since = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1); break;
                //     case '6h': since = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6); break;
                //     case 'today': since = Ext.Date.clearTime(Util.serverToClientDate(new Date())); break;
                //     case 'yesterday': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1); break;
                //     case 'thisweek': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()); break;
                //     case 'lastweek': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7); break;
                //     case 'month': since = Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())); break;
                //     default:
                //         if (sinceDate.getTime() > 0 && Ext.Date.diff(sinceDate, new Date(), Ext.Date.YEAR) < 1) {
                //             since = sinceDate;
                //             predefSince = sinceDate.getTime();
                //         } else {
                //             since = Ext.Date.clearTime(Util.serverToClientDate(new Date()));
                //             predefSince = 'today';
                //         }
                //         break;

                // }
                // route.psince = predefSince;
                // route.since = since.getTime();
                // return;
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
        // create query
        Ext.Ajax.request({
            url: '/api/reports/create_query',
            params: Ext.JSON.encode(report.getData(true)),
            success: function(response) {
                // get data
                var queryId = Ext.decode(response.responseText);
                Ext.Ajax.request({
                    url: '/api/reports/get_data/' + queryId,
                    success: function (response) {
                        var data = Ext.decode(response.responseText);
                        // close query
                        Ext.Ajax.request({
                            url: '/api/reports/close_query/' + queryId,
                            method: 'POST',
                            success: function (response) {
                                cb(data);
                            },
                            failure: function () {
                                console.error('Unable to to close query ' + queryId);
                            }
                        });
                    },
                    failure: function (response) {
                        console.error('Unable to fetch data for query ' + queryId);
                    }
                });
            },
            failure: function (response, opts) {
                console.error('Unable to create query!');
            }
        });
    }

});
