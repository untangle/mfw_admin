Ext.define('Mfw.settings.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.settings',

    onInitialize: function () {
        // Ext.create('Mfw.settings.Nav',{
        //     autoLoad: true
        // });
        Mfw.app.setRoutes({
            'settings:p1': { action: function () { console.log('route') }, conditions: { ':p1' : '(.*)' } }
        });
    },

    onSelectionChange: function (el, record) {
        var me = this, view = me.getView();

        if (!record || !record.get('href')) { return; }

        if (view.getType() === 'api') {
            Mfw.app.redirectTo(record.get('href'));
        }

    }

});
