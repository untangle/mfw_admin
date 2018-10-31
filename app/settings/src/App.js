Ext.define('Mfw.App', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    viewport: {
    },

    launch: function () {
        console.log('launched');

        Ext.Viewport.add([
            { xtype: 'settings', type: 'api' },
        ]);
        Ext.Msg.defaultAllowedConfig.maxWidth = 350;
        Ext.Msg.defaultAllowedConfig.showAnimation = false;
        Ext.Msg.defaultAllowedConfig.hideAnimation = false;
    }
});
