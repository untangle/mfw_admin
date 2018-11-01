Ext.define('Mfw.settings.system.Host', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-host',

    viewTitle: 'Host/Domain'.t(),
    header: false,

    padding: 16,


    // layout: "form",
    // bind: {
    //     layout: '{!smallScreen ? "form" : "vbox"}',
    // },

    // defaults: {
    //     labelAlign: 'right'
    // },

    items: [{
        xtype: 'textfield',
        label: 'Host Name'.t(),
        labelAlign: 'top'
    }, {
        xtype: 'textfield',
        label: 'Domain Name'.t(),
        labelAlign: 'top'
    }],

    buttons: {
        save: {
            text: 'Save'.t(),
            ui: 'action'
        }
    }

});
