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
                reportsConditions: {}
            }
        },
        bind: {
            activeItem: '{currentView}'
        },
    },

    /**
     * Computes and applies the new route based on dashboard/reports conditions
     */
    redirect: function (view) {
        var conditions, newQuery = '';
        if (view === 'dashboard') {
            conditions = Ext.Viewport.getViewModel().get('dashboardConditions');
            // if (view === 'DASHBOARD') {
            //     conditions = Ext.Viewport.getViewModel().get('dashboardConditions');
            // }
            newQuery += '?since=' + (conditions.since || 1);

            Ext.Array.each(conditions.fields, function(field, idx) {
                // newQuery += (idx === 0) ? '?' : '&';
                newQuery += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
            });

            // var qs = Ext.Object.toQueryString(form.getValues());
        }
        Mfw.app.redirectTo(view + newQuery);
    },

    launch: function () {
        console.log('launched');

        // add main views to the viewport
        Ext.Viewport.add([
            // heading
            { xtype: 'mfw-heading' },
            // { xtype: 'mfw-mainmenu' },
            // views
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-reports' },
            { xtype: 'mfw-settings' }
        ]);

        // Ext.Viewport.setMenu({ xtype: 'mfw-mainmenu' }, { side: 'right' });

        this.mainMenu = Mfw.app.viewport.setMenu({
            padding: 10,
            width: 200,
            defaults: {
                // width: 200,
                textAlign: 'left',
            },
            // layout: {
            //     type: 'vbox',
            //     align: 'left'
            // },
            items: [{
                xtype: 'component',
                width: 100,
                margin: 10,
                html: '<img src="' + 'res/untangle-logo.png" style="height: 30px;"/>'
            }, {
                text: 'Dashboard'.t(),
                iconCls: 'x-fa fa-home',
                handler: function () { Mfw.app.mainMenu.hide(); Mfw.app.redirectTo('#'); }
            }, {
                text: 'Reports'.t(),
                iconCls: 'x-fa fa-area-chart',
                handler: function () { Mfw.app.mainMenu.hide(); Mfw.app.redirectTo('#reports'); }
            }, {
                text: 'Settings'.t(),
                iconCls: 'x-fa fa-cog',
                handler: function () { Mfw.app.mainMenu.hide(); Mfw.app.redirectTo('#settings'); }
            }, {
                xtype: 'menuseparator'
            }, {
                text: 'Sessions'.t(),
                iconCls: 'icon-monitor sessions'
            }, {
                text: 'Hosts'.t(),
                iconCls: 'icon-monitor hosts',
                // handler: function () { Ung.app.redirectTo('#apps'); }
            }, {
                text: 'Devices'.t(),
                iconCls: 'icon-monitor devices',
                // handler: function () { Ung.app.redirectTo('#apps'); }
            }, {
                text: 'Users'.t(),
                iconCls: 'icon-monitor users',
                // handler: function () { Ung.app.redirectTo('#apps'); }
            }]
        }, {
            side: 'right'
        });
    }
});
