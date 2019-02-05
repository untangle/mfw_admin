Ext.define('Mfw.monitor.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitor',

    routes: {
        // '*': function () { },
        'monitor/:param': {
            // before: 'onBefore',
            action: 'onAction',
            conditions: { ':param' : '(.*)' }
        }
    },

    onAction: function (param) {
        Mfw.app.viewport.setActiveItem('monitor');
        Mfw.app.viewport.getActiveItem().setActiveItem('monitor-' + param);
    },


});
