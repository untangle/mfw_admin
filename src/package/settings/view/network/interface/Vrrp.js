Ext.define('Mfw.settings.network.interface.Vrrp', {
    extend: 'Ext.Container',
    alias: 'widget.interface-vrrp',
    itemId: 'vrrp',

    headerTitle: 'VRRP'.t(),

    layout: 'fit',

    items: [{
        xtype: 'container',
        layout: 'center',
        html: 'Redundancy (VRRP) is Disabled'.t(),
        hidden: true,
        bind: { hidden: '{record.vrrpEnabled}' }
    }, {
        xtype: 'container',
        padding: 16,
        layout: {
            type: 'vbox',
            // itemSpacing: 8
        },
        hidden: true,
        bind: { hidden: '{!record.vrrpEnabled}' },
        defaultType: 'numberfield',
        defaults: {
            margin: 0,
            labelAlign: 'left',
            labelWidth: 100,
            // labelTextAlign: 'right',
            inputType: 'number',
            errorTarget: 'qtip',
            // required: true,
            // decimals: 0,
            // minValue: 1,
            // maxValue: 255,
            // minValueText: 'Should be 1 - 255'
        },
        items: [{
            label: 'VRRP ID'.t(),
            name: 'vrrpID',
            required: false,
            bind: {
                value: '{record.vrrpID}',
                required: '{record.vrrpEnabled}'
            }
        }, {
            label: 'VRRP Priority'.t(),
            name: 'vrrpPriority',
            required: false,
            bind: {
                value: '{record.vrrpPriority}',
                required: '{record.vrrpEnabled}'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{!record.vrrpEnabled}' },
        items: ['->', {
            xtype: 'button',
            text: 'VRRP Aliases',
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#vrrp-aliases');
            }
        }]
    }]
});
