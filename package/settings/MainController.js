Ext.define('Mfw.settings.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.settings',

    onSelectionChange: function (el, record) {
        var me = this, view = me.getView();

        if (!record || !record.get('href')) { return; }

        if (view.getType() === 'api') {
            Mfw.app.redirectTo(record.get('href'));
        }

    }

});
