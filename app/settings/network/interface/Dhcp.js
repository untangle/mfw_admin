Ext.define('Mfw.settings.network.interface.Dhcp', {
    extend: 'Ext.Container',
    alias: 'widget.interface-dhcp',
    itemId: 'dhcp',

    headerTitle: 'DHCP'.t(),

    layout: 'fit',

    items: [{
        xtype: 'container',
        layout: 'center',
        html: 'DHCP Serving is Disabled'.t(),
        hidden: true,
        bind: { hidden: '{rec.dhcpEnabled}' }
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
        defaultType: 'textfield',
        hidden: true,
        bind: { hidden: '{!rec.dhcpEnabled}' },
        items: [{
            label: 'Range Start'.t(),
            name: 'dhcpRangeStart',
            bind: '{rec.dhcpRangeStart}'
        }, {
            label: 'Range End'.t(),
            name: 'dhcpRangeEnd',
            bind: '{rec.dhcpRangeEnd}'
        }, {
            xtype: 'numberfield',
            name: 'dhcpLeaseDuration',
            label: 'Lease Duration'.t(),
            bind: '{rec.dhcpLeaseDuration}'
        }, {
            label: 'Gateway Override'.t(),
            name: 'dhcpGatewayOverride',
            bind: '{rec.dhcpGatewayOverride}'
        }, {
            xtype: 'combobox',
            name: 'dhcpPrefixOverride',
            label: 'Netmask Override'.t(),
            bind: '{rec.dhcpPrefixOverride}'
        }, {
            label: 'DNS Override'.t(),
            name: 'dhcpDNSOverride',
            bind: '{rec.dhcpDNSOverride}'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{!rec.dhcpEnabled}' },
        items: ['->', {
            xtype: 'button',
            text: 'DHCP Options'.t(),
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#dhcp-options');
            }
        }]
    }]
});
