Ext.define('Mfw.App', {
    extend: 'Mfw.AppBase',

    config: {
        account: null,
        routeAfterAuth: null
    },

    setViews: function () {
        Mfw.app.viewport.add([
            { xtype: 'mfw-nav' },
            { xtype: 'settings' }
        ]);
    }
});
