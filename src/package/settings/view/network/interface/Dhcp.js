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
        bind: { hidden: '{record.dhcpEnabled}' }
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
        bind: { hidden: '{!record.dhcpEnabled}' },
        items: [{
            label: 'Range Start'.t(),
            name: 'dhcpRangeStart',
            bind: '{record.dhcpRangeStart}'
        }, {
            label: 'Range End'.t(),
            name: 'dhcpRangeEnd',
            bind: '{record.dhcpRangeEnd}'
        }, {
            xtype: 'numberfield',
            name: 'dhcpLeaseDuration',
            label: 'Lease Duration'.t(),
            bind: '{record.dhcpLeaseDuration}'
        }, {
            label: 'Gateway Override'.t(),
            name: 'dhcpGatewayOverride',
            bind: '{record.dhcpGatewayOverride}'
        }, {
            xtype: 'combobox',
            name: 'dhcpPrefixOverride',
            label: 'Netmask Override'.t(),
            bind: '{record.dhcpPrefixOverride}'
        }, {
            label: 'DNS Override'.t(),
            name: 'dhcpDNSOverride',
            bind: '{record.dhcpDNSOverride}'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{!record.dhcpEnabled}' },
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
