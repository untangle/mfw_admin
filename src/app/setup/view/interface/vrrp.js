Ext.define('Mfw.setup.interface.Vrrp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-vrrp',

    title: 'VRRP'.t(),
    layout: 'fit',
    scrollable: 'y',

    items: [{
        xtype: 'panel',
        bodyPadding: 16,
        // border: true,
        bodyBorder: false,
        style: 'border-right: 1px #EEE solid;',

        defaults: {
            labelAlign: 'left',
            labelWidth: 130,
            disabled: true
        },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'checkbox',
                bodyAlign: 'start',
                boxLabel: '<span style="font-size: 14px;">VRRP Enabled</span>',
                flex: 1,
                bind: {
                    checked: '{intf.vrrpEnabled}',
                    disabled: '{intf.type === "WIFI"}'
                }
            }]
        },
        items: [{
            xtype: 'numberfield',
            label: 'VRRP Id'.t(),
            bind: {
                value: '{intf.vrrpID}',
                disabled: '{!intf.vrrpEnabled || intf.type === "WIFI"}'
            }
        }, {
            xtype: 'numberfield',
            label: 'VRRP Priority'.t(),
            bind: {
                value: '{intf.vrrpPriority}',
                disabled: '{!intf.vrrpEnabled || intf.type === "WIFI"}'
            }
        }]
    }]
});
