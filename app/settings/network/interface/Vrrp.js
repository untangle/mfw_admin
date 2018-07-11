Ext.define('Mfw.settings.network.interface.Vrrp', {
    extend: 'Ext.Container',
    alias: 'widget.interface-vrrp',
    itemId: 'vrrp',

    headerTitle: 'VRRP Settings'.t(),

    layout: 'fit',

    items: [{
        xtype: 'container',
        layout: 'center',
        html: 'Redundancy (VRRP) is Disabled'.t(),
        hidden: true,
        bind: { hidden: '{rec.vrrpEnabled}' }
    }, {
        xtype: 'container',
        padding: 8,
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right'
        },
        defaultType: 'numberfield',
        hidden: true,
        bind: { hidden: '{!rec.vrrpEnabled}' },
        items: [{
            label: 'VRRP ID'.t(),
            bind: '{rec.vrrpID}'
        }, {
            label: 'VRRP Priority'.t(),
            bind: '{rec.vrrpPriority}'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{!rec.vrrpEnabled}' },
        items: [{
            xtype: 'button',
            text: 'VRRP Aliases',
            textAlign: 'right',
            iconCls: 'x-fa fa-arrow-right',
            iconAlign: 'right',
            flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#vrrp-aliases');
            }
        }]
    }]
});
