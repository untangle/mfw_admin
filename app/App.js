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

    stores: ['Interfaces', 'Sessions', 'SettingsNav', 'ReportsNav', 'RuleConditions', 'PortForwardRules'],

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


    redirect: function () {
        var gvm = Ext.Viewport.getViewModel(), view = gvm.get('currentView'), conditions;
        if (view === 'mfw-reports') {
            conditions = Util.modelToParams('reports', gvm.get('reportsConditions'));
        }
        if (view === 'mfw-dashboard') {
            conditions = Util.modelToParams('dashboard', gvm.get('dashboardConditions'));
        }
        Mfw.app.redirectTo(window.location.hash.split('?')[0] + '?' + conditions);
    }
});
