Ext.define('Mfw.App', {
    extend: 'Ext.app.Application',
    name: 'Mfw',
    // namespace: 'Mfw',
    controllers: ['Mfw.controller.MfwController'],
    defaultToken: '',
    // mainView: 'Mfw.view.main.Main',

    // router: {
    //     hashbang: true
    // },

    viewport: {
        viewModel: {
            data: {
                currentView: 'mfw-dashboard',
                dashboardConditions: {
                    since: 1,
                    fields: []
                },
                reportsConditions: {
                    since: 100,
                    until: null,
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
        }
    },

    launch: function () {
        console.log('launched');

        // add main views to the viewport
        Ext.Viewport.add([
            // heading
            { xtype: 'mfw-header' },
            // { xtype: 'mfw-mainmenu' },
            // views
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-reports' },
            { xtype: 'mfw-settings' }
        ]);
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
                newQuery += 'reports?since=' + (conditions.since || 1);
            }
            Ext.Array.each(conditions.fields, function(field, idx) {
                newQuery += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
            });
            Mfw.app.redirectTo(newQuery);
        } else {
        // if route query is defined, then update the viewmodel based on this query params
            var decodedPart, parts;
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
                    conditions[parts[0]] = parts[1];
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
