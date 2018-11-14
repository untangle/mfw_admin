Ext.define('Mfw.setup.interface.Ipv4', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv4',
    itemId: 'ipv4',

    headerTitle: 'IPv4'.t(),

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    scrollable: 'y',


    defaults: {
        labelAlign: 'left',
        labelTextAlign: 'right',
        // labelWidth: 120
    },


    items: [{
        xtype: 'panel',
        flex: 1,
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
                name: 'v4ConfigType',
                labelAlign: 'left',
                labelWidth: 130,
                flex: 1,
                // reference: 'v4Config',
                label: 'IPv4 Config Type'.t(),
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
            {
                xtype: 'checkbox',
                // name: 'overrideDefaults',
                bodyAlign: 'start',
                label: 'Override defaults'.t(),
                hidden: true,
                bind: {
                    checked: '{overrideDefaults}',
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpAddressOverride',
                label: 'Address'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpAddressOverride}',
                    placeholder: '{intf.v4StaticAddress} (default)',
                    hidden: '{intf.v4ConfigType !== "DHCP" || !overrideDefaults}'
                }
            }, {
                xtype: 'combobox',
                name: 'v4DhcpPrefixOverride',
                label: 'Netmask'.t(),
                queryMode: 'local',
                displayField: 'text',
                valueField: 'value',
                editable: false,
                clearable: true,
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpPrefixOverride}',
                    placeholder: '{intf.v4StaticPrefix}',
                    hidden: '{intf.v4ConfigType !== "DHCP" || !overrideDefaults}'
                },
                // store: Data.netmask
            }, {
                xtype: 'textfield',
                name: 'v4DhcpGatewayOverride',
                label: 'Gateway'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpGatewayOverride}',
                    placeholder: '{intf.v4StaticGateway}',
                    hidden: '{intf.v4ConfigType !== "DHCP" || !overrideDefaults}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS1Override',
                label: 'Primary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpDNS1Override}',
                    placeholder: '{intf.v4StaticDNS1}',
                    hidden: '{intf.v4ConfigType !== "DHCP" || !overrideDefaults}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS2Override',
                label: 'Secondary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v4DhcpDNS2Override}',
                    placeholder: '{intf.v4StaticDNS2}',
                    hidden: '{intf.v4ConfigType !== "DHCP" || !overrideDefaults}'
                }
            },

            // WAN STATIC
            {
                xtype: 'textfield',
                name: 'v4StaticAddress',
                label: 'Addres'.t(),
                errorLabel: 'IPv4 Static Address'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4StaticAddress}',
                    required: '{intf.v4ConfigType === "STATIC"}',
                    hidden: '{intf.v4ConfigType !== "STATIC"}'

                },
                validators: ['ipaddress']
            }, {
                xtype: 'combobox',
                name: 'v4StaticPrefix',
                label: 'Netmask'.t(),
                queryMode: 'local',
                displayField: 'text',
                valueField: 'value',
                editable: false,
                // clearable: true,
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v4StaticPrefix}',
                    required: '{intf.v4ConfigType === "STATIC"}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "STATIC" }'
                },
                // store: Data.netmask
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
    }, {
        xtype: 'component',
        width: 5,
        style: 'background: #EEE',
        hidden: true,
        bind: {
            hidden: '{intf.v4ConfigType === "DISABLED"}'
        }
    }, {
        xtype: 'panel',
        width: '50%',
        layout: 'fit',
        // border: true,
        // bodyBorder: false,
        tbar: {
            shadow: false,
            items: [{
                xtype: 'displayfield',
                labelAlign: 'left',
                label: 'IPv4 Aliases'
            }, '->', {
                iconCls: 'md-icon-add',
                handler: 'addV4Alias'
            }]
        },
        hidden: true,
        bind: {
            hidden: '{intf.v4ConfigType === "DISABLED"}'
        },
        items: [{
            xtype: 'grid',
            plugins: {
                gridcellediting: true
            },
            bind: {
                store: '{intf.v4Aliases}'
            },
            // store: {
            //     fields: ['v4Address', 'v4Prefix'],
            //     data: [
            //         { v4Address: '222.222.222.222', v4Prefix: '255.255.255.255/32' }
            //     ]
            // },
            columns: [{
                text: 'Address',
                dataIndex: 'v4Address',
                flex: 1,
                editable: true
            }, {
                text: 'Prefix',
                dataIndex: 'v4Prefix',
                width: 150,
                cell: {
                    actions: {
                        remove: {
                            iconCls: 'x-fa fa-times'
                        }
                    }
                },
                editable: true
            }]
        }]
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
    },

    controller: {
        addV4Alias: function (btn) {
            var grid = btn.up('panel').down('grid');
            grid.getStore().add({
                v4Address: '1.2.3.4',
                v4Prefix: 24
            })
        }

    }

});
