Ext.define('Mfw.App', {
    extend: 'Mfw.AppBase',

    config: {
        packages: ['auth', 'settings'],
        resourcesPath: 'res',
        account: null,
        routeAfterAuth: null
    },

    routes: {
        '*': { before: 'checkAuth' },
        'settings:route': { action: 'onSettings', conditions: { ':route' : '(.*)' } }
    },

    setViews: function () {
        Mfw.app.viewport.add([
            { xtype: 'mfw-header' },
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-pkg-settings' }
        ]);
    }

});
// Ext.define('Mfw.App', {
//     extend: 'Ext.app.Application',
//     name: 'Mfw',

//     config: {
//         account: null,
//         routeAfterAuth: null
//     },

//     packages: ['auth', 'settings'],
//     resPath: '../res',

//     routes: {
//         // if auth package included, check auth on ebery route
//         '*': { before: 'checkAuth' },
//         'dashboard:query': { before: 'onDashboardBefore', action: 'onDashboard', conditions: { ':query' : '(.*)' } },
//         /**
//          * if settings package included add settings route
//          * onSettings method is defined in settings package
//          */
//         'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } }
//     },

//     viewport: {
//         viewModel: {},
//         layout: 'card'
//     },

//     checkAuth: function (action) {
//         var me = this,
//             hash = window.location.hash;

//         if (!Mfw.app.getAccount()) {
//             Ext.Ajax.request({
//                 url: '/account/status',
//                 success: function (response) {
//                     Mfw.app.setAccount(Ext.decode(response.responseText));
//                     me.setViews();
//                     action.resume();
//                 },

//                 failure: function() {
//                     Mfw.app.viewport.removeAll(true, true);
//                     Mfw.app.viewport.add({
//                         xtype: 'mfw-pkg-auth'
//                     });
//                     Mfw.app.redirectTo('login');
//                     Mfw.app.setRouteAfterAuth(hash);
//                 }
//             });
//         } else {
//             action.resume();
//         }
//     },

//     setViews: function () {
//         Mfw.app.viewport.removeAll(true, true);
//         Mfw.app.viewport.add([
//             { xtype: 'mfw-header' },
//             { xtype: 'mfw-dashboard' },
//             { xtype: 'mfw-pkg-settings' }
//         ]);
//     },


//     /**
//      * Updates route based on existance or not of predefined conditions in ViewModel
//      * arguments of the method are ([query], action) with query missing if not set
//      */
//     onDashboardBefore: function (action) {
//         // var me = this, conds, action,
//         //     vm = me.getDashboardView().getViewModel();

//         // if (arguments.length === 1) {
//         //     action = arguments[0];
//         // } else {
//         //     conds = arguments[0].replace('?', '');
//         //     action = arguments[1];
//         // }


//         // if (!conds) {
//         //     // if no condition parameters, load those condition params from view model and redirect
//         //     Mfw.app.redirectTo('dashboard?' + Util.modelToParams('dashboard', vm.get('conditions')));
//         //     action.stop();
//         // } else {
//         //     // otherwise update View Model with the new condition params
//         //     vm.set('conditions', Util.paramsToModel('dashboard', conds));
//         //     action.resume();
//         // }
//         action.resume();
//     },

//     onDashboard: function () {
//         Mfw.app.viewport.setActiveItem('mfw-dashboard');
//     },

//     launch: function () {
//         console.log('Admin App Launch ...')
//         var me = this, scripts = [];
//         Ext.Array.each(me.packages, function(pkg) {
//             scripts.push('mfw/pkg/mfw-pkg-' + pkg + '.js')
//         });


//         Ext.Loader.loadScriptsSync(scripts);

//         // need this trick to trigger beforeAnyRoute in case of empty hash
//         if (!window.location.hash) {
//             Mfw.app.redirectTo('#dashboard');
//         }
//     }
// });
