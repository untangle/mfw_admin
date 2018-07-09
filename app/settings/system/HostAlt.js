Ext.define('Mfw.settings.system.HostAlt', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-host-alt',

    viewTitle: 'Host/Domain Alt'.t(),
    header: false,

    padding: 16,


    layout: "form",

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
