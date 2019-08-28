Ext.define('Mfw.Setup', {
    extend: 'Ext.app.Application',
    namespace: 'Mfw',

    mainView: 'Mfw.setup.Wizard',

    launch: function() {
        Ext.route.Router.suspend();
        Sync.init();
    }
});
