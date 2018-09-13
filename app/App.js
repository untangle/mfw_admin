Ext.define('Mfw.App', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    // profiles: [
    //     'App.profile.Desktop',
    //     'App.profile.Mobile'
    // ],

    controllers: ['Mfw.controller.MfwController'],

    // // namespace: 'Mfw',
    // controllers: ['Mfw.controller.MfwController'],
    defaultToken: '',

    stores: ['Interfaces', 'Sessions', 'SettingsNav', 'RuleConditions', 'PortForwardRules'],

    viewport: {
        viewModel: {
            data: {
                smallScreen: true,
                currentView: '',
                dashboardConditions: {
                    since: 1,
                    fields: []
                },
                reportsConditions: {
                    predefinedSince: 'today',
                    since: '',
                    until: '',
                    fields: []
                }
            }
        },
        bind: {
            activeItem: '{currentView}'
        },

        plugins: 'responsive',
        responsiveFormulas: {
            small: 'width < 1000',
            large: 'width >= 1000'
        },
        listeners: {
            resize: function (el, width) {
                el.getViewModel().set({
                    smallScreen: width < 1000
                });
            }
        }
    },

    listen : {
        global : {
            unmatchedroute : 'onUnmatchedRoute'
        }
    },

    launch: function () {
        console.log('launched');
        // add main views to the viewport
        Ext.Viewport.add([
            // header
            { xtype: 'mfw-header' },
            // views
            { xtype: 'component', html: '' }, // empty component to avoid flicker from dashboard to the specified route
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-reports' },
            { xtype: 'mfw-settings' },
            // 404 view
            { xtype: 'mfw-404' }
        ]);

        // this is necessary to determine initial viewport size after launch
        Ext.Viewport.getViewModel().set({
            smallScreen: Ext.Viewport.getSize().width < 1000
        });

        Ext.Msg.defaultAllowedConfig.maxWidth = 350;
        Ext.Msg.defaultAllowedConfig.showAnimation = false;
        Ext.Msg.defaultAllowedConfig.hideAnimation = false;
    },

    onUnmatchedRoute: function () {
        Mfw.app.redirectTo('404');
    },

    /**
     * Global method to update route/query based on conditions for dashboard and reports
     */
    updateQuery: function (query) {
        var conditions = { fields: [] } , newQuery = '',
            gvm = Ext.Viewport.getViewModel(), view = gvm.get('currentView');

        // if no route query, build the route from existing viewmodel conditions if any, then redirect to new generated query
        if (!query) {
            if (view === 'mfw-dashboard') {
                conditions = gvm.get('dashboardConditions');
                newQuery += 'dashboard?since=' + (conditions.since || 1);
            }
            if (view === 'mfw-reports') {
                conditions = gvm.get('reportsConditions');
                newQuery += 'reports?since=' + (conditions.predefinedSince || 'today');
                if (conditions.until) {
                    newQuery += '&until=' + conditions.until;
                }
            }
            Ext.Array.each(conditions.fields, function(field) {
                newQuery += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
            });
            Mfw.app.redirectTo(newQuery);
        } else {
        // if route query is defined, then update the viewmodel based on this query params
            var decodedPart, parts, key, val;
            Ext.Array.each(query.replace('?', '').split('&'), function (part) {
                decodedPart = decodeURIComponent(part);

                // if it's a field condition
                if (decodedPart.indexOf(':') > 0) {
                    parts = decodedPart.split(':');
                    conditions.fields.push({
                        column: parts[0],
                        operator: parts[1],
                        value: parts[2],
                        autoFormatValue: parseInt(parts[3], 10) === 1 ? true : false,
                    });
                } else {
                // if it's normal parameter like since, until
                    parts = decodedPart.split('=');
                    key = parts[0];
                    val = parts[1];

                    // in reports case need to process the since/until params
                    if (view === 'mfw-reports') {
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
                    } else {
                        conditions[key] = val;
                    }
                }
            });

            if (view === 'mfw-dashboard') {
                gvm.set('dashboardConditions', conditions);
            }

            if (view === 'mfw-reports') {
                gvm.set('reportsConditions', conditions);
            }
        }
    }
});
