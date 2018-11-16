Ext.define('Mfw.setup.interface.Ipv4', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv4',

    title: 'IPv4'.t(),

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    scrollable: 'y',


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
                options: Data.prefix,
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
                label: 'Addres'.t(),
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
                options: Data.prefix,
                bind: {
                    value: '{intf.v4StaticPrefix}',
                    required: '{intf.v4ConfigType === "STATIC"}',
                    hidden: '{!intf.wan || intf.v4ConfigType !== "STATIC" }'
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
            padding: '0 8 0 16',
            items: [{
                xtype: 'displayfield',
                labelAlign: 'left',
                label: '<span style="font-size: 14px;">IPv4 Aliases</span>'
            }, '->', {
                iconCls: 'md-icon-add',
                ui: 'round action',
                tooltip: 'Add new Alias',
                handler: 'addV4Alias'
            }]
        },
        hidden: true,
        bind: {
            hidden: '{intf.v4ConfigType === "DISABLED"}'
        },
        items: [{
            xtype: 'grid',
            selectable: false,
            emptyText: 'No Aliases!',
            plugins: {
                gridcellediting: {
                    triggerEvent: 'tap'
                }
            },
            bind: {
                store: '{intf.v4Aliases}'
            },
            columns: [{
                text: 'Address',
                dataIndex: 'v4Address',
                flex: 1,
                menuDisabled: true,
                hideable: false,
                sortable: true,
                editable: true,
                editor: {
                    xtype: 'textfield',
                    required: true,
                    clearable: false
                }
            }, {
                text: 'Prefix',
                dataIndex: 'v4Prefix',
                width: 180,
                menuDisabled: true,
                hideable: false,
                sortable: true,
                resizable: false,
                renderer: function (value) {
                    var prefix = Ext.Array.findBy(Data.prefix, function (item) {
                        return item.value === value;
                    });
                    if (prefix) {
                        return prefix.text;
                    }
                    return 'not set';
                },
                editable: true,
                editor: {
                    xtype: 'selectfield',
                    editable: false,
                    required: true,
                    options: Data.prefix
                    // clearable: false
                }
            }, {
                width: 44,
                menuDisabled: true,
                hideable: false,
                sortable: false,
                resizable: false,
                cell: {
                    // toolDefaults: {}
                    tools: {
                        remove: {
                            iconCls: 'md-icon-close',
                            tooltip: 'Remove Alias',
                            handler: function (grid, info) {
                                info.record.drop();
                            }
                        }
                    }
                }
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
                v4Address: '192.168.0.1',
                v4Prefix: 24
            })
        }

    }

});
