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

    // stores: ['SettingsNav'],

    // stores: ['Interfaces', 'ReportsNav', 'Reports', 'Sessions', 'SettingsNav', 'ReportsNav', 'RuleConditions', 'PortForwardRules'],

    config: {
        account: null
    },

    viewport: {
        viewModel: {
            data: {
                smallScreen: true,
                currentView: '',
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

        Ext.Viewport.add([
            // header
            { xtype: 'mfw-header' },
            // views
            { xtype: 'component', html: '' }, // empty component to avoid flicker from dashboard to the specified route
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-reports' },
            { xtype: 'settings', type: 'api' },
            // 404 view
            { xtype: 'mfw-404' },
            // login view
            // { xtype: 'mfw-login' }
        ]);


        // Ext.util.History.on('change', function () {
        //     Ext.Ajax.request({
        //         url: 'ajax_demo/sample.json',

        //         success: function(response, opts) {
        //             var obj = Ext.decode(response.responseText);
        //             console.dir(obj);
        //         },

        //         failure: function(response, opts) {
        //             console.log('server-side failure with status code ' + response.status);
        //         }
        //     });
        // })


        // add main views to the viewport
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


    redirect: function (view) {
        var conditions = view.getViewModel().get('conditions'), _view;
        if (view.isXType('mfw-dashboard')) { _view = 'dashboard'; }
        if (view.isXType('mfw-reports')) { _view = 'reports'; }
        Mfw.app.redirectTo(window.location.hash.split('?')[0] + '?' + Util.modelToParams(_view, conditions));
    }
});
