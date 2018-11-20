// Ext.define('Mfw.App', {
//     extend: 'Ext.app.Application',
//     name: 'Mfw',

//     mainView: 'Mfw.setup.Main',

//     stores: ['Interfaces', 'Devices'],

//     config: {
//     	account: null
//     },

//     api: window.location.origin,

//     launch: function () {
//         console.log('launch');
//     	this.checkAuth();
//     },

//     checkAuth: function () {
//         var mainView = Mfw.app.getMainView();
//         Ext.Ajax.request({
//             url: '/account/status',
//             success: function (response) {
//             	var su = mainView.down('setup-auth');
//                 if (su) {
//                     mainView.remove(su, true);
//                 }
//                 Mfw.app.getMainView().add({ xtype: 'setup-wizard' });
//                 // Mfw.app.setAccount(Ext.decode(response.responseText));
//             },
//             failure: function() {
//                 Mfw.app.getMainView().add({ xtype: 'setup-auth' });
//             }
//         });
//     },

// });
Ext.define('Mfw.App', {
    extend: 'Mfw.AppBase',

    stores: ['Interfaces', 'Devices'],

    config: {
        account: null,
        routeAfterAuth: null
    },

    setViews: function () {
        Mfw.app.viewport.add([
            { xtype: 'setup-wizard' }
        ]);
    }
});
