Ext.define('Mfw.settings.network.interface.Ipv4', {
    extend: 'Ext.Container',
    alias: 'widget.interface-ipv4',
    itemId: 'ipv4',

    headerTitle: 'IPv4'.t(),

    layout: 'vbox',

    scrollable: 'y',

    items: [{
        xtype: 'combobox',
        reference: 'v4Config',
        label: 'Config Type'.t(),
        labelAlign: 'left',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        margin: '0 16',
        disabled: true,
        bind: {
            value: '{rec.v4ConfigType}',
            disabled: '{!rec.wan}'
        },
        store: [
            { name: 'Auto (DHCP)'.t(), value: 'DHCP' },
            { name: 'Static'.t(),   value: 'STATIC' },
            { name: 'PPPoE'.t(),  value: 'PPPOE' }
        ],
    }, {
        xtype: 'togglefield',
        boxLabel: 'Override defaults'.t(),
        reference: 'override',
        margin: '0 16',
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "DHCP"}' }
    }, {
        xtype: 'container',
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "DHCP"}' },
        items: [{
            xtype: 'container',
            padding: 8,
            layout: {
                type: 'form',
                itemSpacing: 8
            },
            defaults: {
                labelTextAlign: 'right',
                labelWidth: 100,
                disabled: true,
                hidden: true,
                bind: {
                    disabled: '{!override.value}',
                    hidden: '{!override.value}'
                }
            },
            items: [{
                xtype: 'textfield',
                label: 'Address'.t(),
                bind: {
                    value: '{rec.v4DhcpAddressOverride}',
                    placeholder: '{rec.v4StaticAddress}'
                }
            }, {
                xtype: 'combobox',
                label: 'Netmask'.t(),
                queryMode: 'local',
                displayField: 'text',
                valueField: 'value',
                editable: false,
                clearable: true,
                bind: {
                    value: '{rec.v4DhcpPrefixOverride}',
                    placeholder: '{rec.v4StaticPrefix}'
                },
                store: ArrayStore.netmask
            }, {
                xtype: 'textfield',
                label: 'Gateway'.t(),
                bind: {
                    value: '{rec.v4DhcpGatewayOverride}',
                    placeholder: '{rec.v4StaticGateway}'
                }
            }, {
                xtype: 'textfield',
                label: 'Primary DNS'.t(),
                bind: {
                    value: '{rec.v4DhcpDNS1Override}',
                    placeholder: '{rec.v4StaticDNS1}'
                }
            }, {
                xtype: 'textfield',
                label: 'Secondary DNS'.t(),
                bind: {
                    value: '{rec.v4DhcpDNS2Override}',
                    placeholder: '{rec.v4StaticDNS2}'
                }
            }]
        }]
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "STATIC"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        items: [{
            xtype: 'textfield',
            label: 'Address'.t(),
            bind: '{rec.v4StaticAddress}'
        }, {
            xtype: 'combobox',
            label: 'Netmask'.t(),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            // clearable: true,
            bind: '{rec.v4StaticPrefix}',
            store: ArrayStore.netmask
        }, {
            xtype: 'textfield',
            label: 'Gateway'.t(),
            hidden: true,
            bind: {
                value: '{rec.v4StaticGateway}',
                hidden: '{!rec.wan}'
            }
        }, {
            xtype: 'textfield',
            label: 'Primary DNS'.t(),
            hidden: true,
            bind: {
                value: '{rec.v4StaticDNS1}',
                hidden: '{!rec.wan}'
            }
        }, {
            xtype: 'textfield',
            label: 'Secondary DNS'.t(),
            hidden: true,
            bind: {
                value: '{rec.v4StaticDNS2}',
                hidden: '{!rec.wan}'
            }
        }]
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "PPPOE"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaultType: 'textfield',
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        items: [{
            label: 'Username'.t(),
            required: true,
            bind: '{rec.v4PPoEUsername}'
        }, {
            inputType: 'password',
            label: 'Password'.t(),
            required: true,
            bind: '{rec.v4PPoEPassword}'
        }, {
            xtype: 'checkbox',
            label: 'Use Peer DNS'.t(),
            bind: '{rec.v4PPPoEUsePeerDNS}'
        }, {
            label: 'Primary DNS'.t(),
            disabled: true,
            bind: { disabled: '{rec.v4PPPoEUsePeerDNS}' }
        }, {
            label: 'Secondary DNS'.t(),
            disabled: true,
            bind: { disabled: '{rec.v4PPPoEUsePeerDNS}' }
        }]
    }, {
        xtype: 'togglefield',
        boxLabel: 'NAT traffic exiting this interface<br/>(and bridged peers)'.t(),
        margin: '0 16',
        hidden: true,
        bind: {
            value: '{rec.natEgress}',
            hidden: '{!rec.wan}'
        }
    }, {
        xtype: 'togglefield',
        boxLabel: 'NAT traffic coming from this interface<br/>(and bridged peers)'.t(),
        margin: '0 16',
        hidden: true,
        bind: {
            value: '{rec.natIngress}',
            hidden: '{rec.wan}'
        }
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            xtype: 'button',
            text: 'IPv4 Aliases',
            textAlign: 'right',
            iconCls: 'x-fa fa-arrow-right',
            iconAlign: 'right',
            flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#ipv4-aliases');
            }
        }]
    }]
});
