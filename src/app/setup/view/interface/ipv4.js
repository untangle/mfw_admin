Ext.define('Mfw.setup.interface.Ipv4', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv4',

    title: 'IPv4'.t(),

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
            labelWidth: 130
        },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'selectfield',
                labelAlign: 'left',
                labelWidth: 130,
                flex: 1,
                // reference: 'v4Config',
                label: '<span style="font-size: 14px;">IPv4 Config Type</span>'.t(),
                editable: false,
                // margin: '0 16',
                disabled: true,
                bind: {
                    value: '{intf.v4ConfigType}',
                    disabled: '{!intf.wan}'
                },
                options: [
                    { text: 'Auto (DHCP)'.t(), value: 'DHCP' },
                    { text: 'Static'.t(),   value: 'STATIC' },
                    { text: 'PPPoE'.t(),  value: 'PPPOE' },
                    { text: 'Disabled'.t(),  value: 'DISABLED' }
                ]
            }]
        },
        items: [
            // WAN DHCP
            // {
            //     xtype: 'checkbox',
            //     // name: 'overrideDefaults',
            //     bodyAlign: 'start',
            //     boxLabel: 'Override DHCP defaults'.t(),
            //     hidden: true,
            //     bind: {
            //         checked: '{overrideDefaults}',
            //         hidden: '{intf.v4ConfigType !== "DHCP"}'
            //     }
            // },
            {
                xtype: 'component',
                style: 'font-size: 14px; color: #777; padding: 16px 0;',
                html: '<strong>Override DHCP defaults</strong> (optional)',
                hidden: true,
                bind: {
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                }
            },
            {
                xtype: 'textfield',
                name: 'v4DhcpAddressOverride',
                label: 'Address'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpAddressOverride}',
                    placeholder: '{intf.v4StaticAddress}',
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                },
                validators: ['ipaddress']
            }, {
                xtype: 'selectfield',
                name: 'v4DhcpPrefixOverride',
                label: 'Netmask/Prefix'.t(),
                required: false,
                editable: false,
                clearable: false,
                options: Globals.prefixes,
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpPrefixOverride}',
                    placeholder: '{intf.v4StaticPrefix}',
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpGatewayOverride',
                label: 'Gateway'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpGatewayOverride}',
                    placeholder: '{intf.v4StaticGateway}',
                    hidden: '{intf.v4ConfigType !== "DHCP"}',
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS1Override',
                label: 'Primary DNS'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpDNS1Override}',
                    placeholder: '{intf.v4StaticDNS1}',
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS2Override',
                label: 'Secondary DNS'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpDNS2Override}',
                    placeholder: '{intf.v4StaticDNS2}',
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                }
            },

            // WAN STATIC
            {
                xtype: 'textfield',
                name: 'v4StaticAddress',
                label: 'Address'.t(),
                errorLabel: 'IPv4 Static Address'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4StaticAddress}',
                    required: '{intf.v4ConfigType === "STATIC"}',
                    hidden: '{intf.v4ConfigType !== "STATIC"}'

                }
            }, {
                xtype: 'selectfield',
                name: 'v4StaticPrefix',
                label: 'Netmask'.t(),
                editable: false,
                clearable: false,
                hidden: true,
                required: true,
                options: Globals.prefixes,
                bind: {
                    value: '{intf.v4StaticPrefix}',
                    required: '{intf.v4ConfigType === "STATIC"}',
                    hidden: '{intf.v4ConfigType !== "STATIC" }'
                }
            }, {
                xtype: 'textfield',
                name: 'v4StaticGateway',
                label: 'Gateway'.t(),
                errorLabel: 'IPv4 Static Gateway'.t(),
                hidden: true,
                required: false,
                bind: {
                    value: '{intf.v4StaticGateway}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "STATIC" }',
                    required: '{intf.wan && intf.v4ConfigType === "STATIC"}'
                },
                validators: ['presence', 'ipaddress']
            }, {
                xtype: 'textfield',
                name: 'v4StaticDNS1',
                label: 'Primary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4StaticDNS1}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "STATIC" }',
                }
            }, {
                xtype: 'textfield',
                name: 'v4StaticDNS2',
                label: 'Secondary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4StaticDNS2}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "STATIC" }',
                }
            },


            // WAN PPPoE
            {
                xtype: 'textfield',
                label: 'Username'.t(),
                name: 'v4PPoEUsername',
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4PPoEUsername}',
                    required: '{intf.wan && intf.v4ConfigType === "PPPOE"}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "PPPOE"}'
                }
            }, {
                xtype: 'passwordfield',
                name: 'v4PPoEPassword',
                label: 'Password'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4PPoEPassword}',
                    required: '{intf.wan && intf.v4ConfigType === "PPPOE"}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "PPPOE"}'
                }
            }, {
                xtype: 'checkbox',
                name: 'v4PPPoEUsePeerDNS',
                bodyAlign: 'start',
                label: 'Use Peer DNS'.t(),
                hidden: true,
                bind: {
                    checked: '{intf.v4PPPoEUsePeerDNS}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "PPPOE"}'
                },
            }, {
                xtype: 'textfield',
                label: 'Primary DNS'.t(),
                name: 'v4PPPoEOverrideDNS1',
                disabled: true,
                hidden: true,
                bind: {
                    value: '{intf.v4PPPoEOverrideDNS1}',
                    disabled: '{intf.v4PPPoEUsePeerDNS}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "PPPOE"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Secondary DNS'.t(),
                name: 'v4PPPoEOverrideDNS2',
                disabled: true,
                hidden: true,
                bind: {
                    value: '{intf.v4PPPoEOverrideDNS2}',
                    disabled: '{intf.v4PPPoEUsePeerDNS}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "PPPOE"}'
                }
            }, {
                xtype: 'component',
                margin: 24,
                hidden: true,
                bind: {
                    hidden: '{intf.v4ConfigType !== "DISABLED"}'
                },
                html: '<h1 style="text-align: center; color: #777;"><i class="x-fa fa-exclamation-triangle"></i><br/><br/>IPv4 is disabled</h1>'
            }
        ]
    }],

    bbar: {
        // style: 'background: transparent',
        shadow: false,
        hidden: true,
        bind: {
            hidden: '{intf.v4ConfigType === "DISABLED"}'
        },
        items: [{
            xtype: 'checkbox',
            name: 'natEgress',
            bodyAlign: 'start',
            boxLabel: 'NAT traffic exiting this interface (and bridged peers)'.t(),
            // padding: 16,
            // margin: '0 16',
            hidden: true,
            bind: {
                checked: '{intf.natEgress}',
                hidden: '{!intf.wan}'
            }
        }, {
            xtype: 'checkbox',
            name: 'natIngress',
            bodyAlign: 'start',
            boxLabel: 'NAT traffic coming from this interface (and bridged peers)'.t(),
            hidden: true,
            bind: {
                checked: '{intf.natIngress}',
                hidden: '{intf.wan}'
            }
        }]
    }
});
