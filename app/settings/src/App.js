Ext.define('Mfw.SettingsApp', {
    extend: 'Ext.app.Application',
    name: 'MfwSettings',

    viewport: {
    },

    launch: function () {
        console.log('launched');

        Ext.Viewport.add([
            { xtype: 'settings' },
        ]);
        Ext.Msg.defaultAllowedConfig.maxWidth = 350;
        Ext.Msg.defaultAllowedConfig.showAnimation = false;
        Ext.Msg.defaultAllowedConfig.hideAnimation = false;
    }
});
