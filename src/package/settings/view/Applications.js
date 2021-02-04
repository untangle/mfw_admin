Ext.define('Mfw.settings.view.Applications', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-applications',

    title: 'Applications',

    layout: 'center',

    items: [{
        xtype: 'component',
        html: 'Applications Summary'
    }],

    controller: {
        init: function () {
            // redirect to Threat Prevention when landing on settings/applications
            Mfw.app.redirectTo('settings/applications/threat-prevention');
        }
    }
});
