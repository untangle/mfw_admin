Ext.define('Mfw.settings.network.interface.Ipv4', {
    extend: 'Ext.Container',
    alias: 'widget.interface-ipv4',
    itemId: 'ipv4',

    headerTitle: 'IPv4'.t(),

    layout: 'vbox',

    scrollable: 'y',

    items: [{
        xtype: 'combobox',
        name: 'v4ConfigType',
        reference: 'v4Config',
        label: 'Config Type'.t(),
        labelAlign: 'left',
        labelTextAlign: 'right',
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
        name: 'overrideDefaults',
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
                name: 'v4DhcpAddressOverride',
                label: 'Address'.t(),
                bind: {
                    value: '{rec.v4DhcpAddressOverride}',
                    placeholder: '{rec.v4StaticAddress}'
                }
            }, {
                xtype: 'selectfield',
                name: 'v4DhcpPrefixOverride',
                label: 'Netmask'.t(),
                editable: false,
                clearable: true,
                bind: {
                    value: '{rec.v4DhcpPrefixOverride}',
                    placeholder: '{rec.v4StaticPrefix}'
                },
                options: Globals.prefixes
            }, {
                xtype: 'textfield',
                name: 'v4DhcpGatewayOverride',
                label: 'Gateway'.t(),
                bind: {
                    value: '{rec.v4DhcpGatewayOverride}',
                    placeholder: '{rec.v4StaticGateway}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS1Override',
                label: 'Primary DNS'.t(),
                bind: {
                    value: '{rec.v4DhcpDNS1Override}',
                    placeholder: '{rec.v4StaticDNS1}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS2Override',
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
            // disabled: true
        },
        items: [{
            xtype: 'textfield',
            name: 'v4StaticAddress',
            label: 'Addres'.t(),
            errorLabel: 'IPv4 Static Address'.t(),
            required: false,
            bind: {
                value: '{rec.v4StaticAddress}',
                required: '{rec.v4ConfigType === "STATIC"}'
            },
            validators: ['ipaddress']
        }, {
            xtype: 'combobox',
            name: 'v4StaticPrefix',
            label: 'Netmask'.t(),
            editable: false,
            // clearable: true,
            required: false,
            bind: {
                value: '{rec.v4StaticPrefix}',
                required: '{rec.v4ConfigType === "STATIC"}'
            },
            options: Globals.prefixes
        }, {
            xtype: 'textfield',
            name: 'v4StaticGateway',
            label: 'Gateway'.t(),
            errorLabel: 'IPv4 Static Gateway'.t(),
            hidden: true,
            required: false,
            bind: {
                value: '{rec.v4StaticGateway}',
                hidden: '{!rec.wan}',
                required: '{rec.wan && rec.v4ConfigType === "STATIC"}'
            },
            validators: ['presence', 'ipaddress']
        }, {
            xtype: 'textfield',
            name: 'v4StaticDNS1',
            label: 'Primary DNS'.t(),
            hidden: true,
            bind: {
                value: '{rec.v4StaticDNS1}',
                hidden: '{!rec.wan}'
            }
        }, {
            xtype: 'textfield',
            name: 'v4StaticDNS2',
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
            name: 'v4PPoEUsername',
            required: false,
            bind: {
                value: '{rec.v4PPoEUsername}',
                required: '{rec.v4ConfigType === "PPPOE"}'
            }
        }, {
            inputType: 'password',
            name: 'v4PPoEPassword',
            label: 'Password'.t(),
            required: false,
            bind: {
                value: '{rec.v4PPoEPassword}',
                required: '{rec.v4ConfigType === "PPPOE"}'
            }
        }, {
            xtype: 'checkbox',
            name: 'v4PPPoEUsePeerDNS',
            label: 'Use Peer DNS'.t(),
            bind: '{rec.v4PPPoEUsePeerDNS}'
        }, {
            label: 'Primary DNS'.t(),
            name: 'v4PPPoEOverrideDNS1',
            disabled: true,
            bind: {
                value: '{rec.v4PPPoEOverrideDNS1}',
                disabled: '{rec.v4PPPoEUsePeerDNS}'
            }
        }, {
            label: 'Secondary DNS'.t(),
            name: 'v4PPPoEOverrideDNS2',
            disabled: true,
            bind: {
                value: '{rec.v4PPPoEOverrideDNS2}',
                disabled: '{rec.v4PPPoEUsePeerDNS}'
            }
        }]
    }, {
        xtype: 'togglefield',
        name: 'natEgress',
        boxLabel: 'NAT traffic exiting this interface<br/>(and bridged peers)'.t(),
        margin: '0 16',
        hidden: true,
        bind: {
            value: '{rec.natEgress}',
            hidden: '{!rec.wan}'
        }
    }, {
        xtype: 'togglefield',
        name: 'natIngress',
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
        items: ['->', {
            xtype: 'button',
            text: 'IPv4 Aliases',
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#ipv4-aliases');
            }
        }]
    }]
});
