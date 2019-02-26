Ext.define('Mfw.settings.network.GenericInterfaceDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.generic-interface-dialog',

    viewModel: {
        formulas: {
            bridgedOptions: function (get) {
                var interfaces = [];
                Ext.getStore('interfaces').each(function (intf) {
                    // interface should be ADDRESSED
                    if (intf.get('interfaceId') === get('interface.interfaceId') ||
                        intf.get('configType') !== 'ADDRESSED') {
                            return;
                        }

                    interfaces.push({
                        text: intf.get('name'),
                        value: intf.get('interfaceId')
                    });
                });
                return interfaces;
            },

            ipv6Configs: function (get) {
                var options;
                if (get('interface.wan')) {
                    options = [
                        { text: 'Disabled'.t(),  value: 'DISABLED' },
                        { text: 'Static'.t(),   value: 'STATIC' },
                        { text: 'SLAAC'.t(), value: 'SLAAC' },
                        { text: 'DHCP'.t(), value: 'DHCP' }
                    ];
                } else {
                    options = [
                        { text: 'Disabled'.t(),  value: 'DISABLED' },
                        { text: 'Static'.t(),   value: 'STATIC' },
                        { text: 'Assign'.t(), value: 'ASSIGN' }
                    ];
                }
                return options;
            }
        }
    },

    config: {
        interface: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} {interface.type === "NIC" ? "Card" : ""} Interface',
    },
    width: 900,
    height: 600,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    bodyPadding: '0 8',

    items: [{
        xtype: 'formpanel',
        padding: 0,
        layout: 'vbox',
        defaults: {
            margin: '0 8',
            labelAlign: 'top'
        },
        items: [{
            xtype: 'containerfield',
            margin: 0,
            defaults: {
                margin: '0 8',
                labelAlign: 'top'
            },
            items: [{
                xtype: 'selectfield',
                label: 'Interface Type',
                name: 'type',
                width: 150,
                placeholder: 'Select Type ...',
                required: true,
                disabled: true,
                bind: '{interface.type}',
                options: [
                    { text: 'OpenVPN', value: 'OPENVPN' },
                    { text: 'Interface Card (NIC)', value: 'NIC' },
                    { text: 'Wireless', value: 'WIFI' }
                ]
            }, {
                xtype: 'textfield',
                name: 'name',
                label: 'Interface Name',
                placeholder: 'Enter Name ...',
                autoComplete: false,
                required: true,
                bind: '{interface.name}',
                flex: 1,
            }, {
                xtype: 'selectfield',
                name: 'configType',
                label: 'Config Type'.t(),
                flex: 1,
                editable: false,
                required: true,
                bind: '{interface.configType}',
                options: [
                    { text: 'Addressed'.t(), value: 'ADDRESSED' },
                    { text: 'Bridged'.t(),   value: 'BRIDGED' },
                    { text: 'Disabled'.t(),  value: 'DISABLED' }
                ]
            }, {
                xtype: 'checkbox',
                name: 'wan',
                label: '&nbsp;',
                boxLabel: 'Is WAN',
                bodyAlign: 'start',
                margin: '0 16',
                flex: 1,
                disabled: true,
                bind: {
                    checked: '{interface.wan}',
                    disabled: '{interface.configType !== "ADDRESSED"}'
                }
            }]
        }, {
            xtype: 'selectfield',
            name: 'bridgedTo',
            width: '50%',
            label: 'Bridged To'.t(),
            placeholder: 'Select bridge ...',
            editable: false,
            required: false,
            autoSelect: true,
            hidden: true,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            bind: {
                value: '{interface.bridgedTo}',
                hidden: '{interface.configType !== "BRIDGED"}',
                required: '{interface.configType === "BRIDGED"}',
                options: '{bridgedOptions}'
            }
        }, {
            xtype: 'container',
            flex: 1,
            layout: 'center',
            hidden: true,
            bind: {
                hidden: '{interface.configType !== "DISABLED"}'
            },
            items: [{
                xtype: 'component',
                html: '<h1 style="color: #777; font-weight: 100;">INTERFACE IS DISABLED</h1>',
            }]
        }, {
            xtype: 'segmentedbutton',
            userCls: 'button-tabs',
            margin: '16 8 16 8',
            allowMultiple: false,
            reference: 'viewSelection',
            // hidden: true,
            // bind: {
            //     hidden: '{interface.configType !== "ADDRESSED"}'
            // },
            defaults: {
                ripple: false,
                hidden: true,
                bind: {
                    hidden: '{interface.configType !== "ADDRESSED"}'
                },
            },
            activeItem: 0,
            items: [
                { text: 'IPv4', value: '#ipv4', pressed: true },
                { text: 'IPv6', value: '#ipv6' },
                { text: 'DHCP', value: '#dhcp' },
                { text: 'VRRP', value: '#vrrp' },
                {
                    text: 'WiFi',
                    value: '#wifi',
                    hidden: true,
                    bind: {
                        hidden: '{interface.type !== "WIFI" || interface.configType === "DISABLED"}'
                    }
                }
            ]
        }, {
            xtype: 'panel',
            itemId: 'cardPanel',
            layout: {
                type: 'card',
                deferRender: false
                // animation: {
                //     duration: 150,
                //     type: 'slide',
                //     direction: 'horizontal'
                // },
            },
            flex: 1,
            hidden: true,
            bind: {
                activeItem: '{viewSelection.value}',
                hidden: '{interface.configType === "DISABLED" || (interface.configType === "BRIDGED" && interface.type !== "WIFI")}'
            },
            items: [{
                xtype: 'container',
                layout: 'hbox',
                itemId: 'ipv4',
                items: [{
                    // IPv4
                    xtype: 'panel',
                    flex: 1,
                    layout: 'vbox',
                    padding: '0 16',
                    items: [{
                        xtype: 'containerfield',
                        defaults: {
                            labelAlign: 'top'
                        },
                        items: [{
                            xtype: 'selectfield',
                            name: 'v4ConfigType',
                            reference: 'v4Config',
                            label: 'Config Type'.t(),
                            // labelAlign: 'left',
                            // labelTextAlign: 'right',
                            editable: false,
                            margin: '0 16 0 0',
                            disabled: true,
                            width: 200,
                            bind: {
                                value: '{interface.v4ConfigType}',
                                disabled: '{!interface.wan}'
                            },
                            options: [
                                { text: 'Auto (DHCP)'.t(), value: 'DHCP' },
                                { text: 'Static'.t(),   value: 'STATIC' },
                                { text: 'PPPoE'.t(),  value: 'PPPOE' }
                            ],
                        }, {
                            xtype: 'checkbox',
                            name: 'overrideDefaults',
                            reference: 'override',
                            label: '&nbsp;',
                            boxLabel: 'Override Defaults',
                            bodyAlign: 'start',
                            flex: 1,
                            hidden: true,
                            bind: { hidden: '{interface.v4ConfigType !== "DHCP"}' }
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        defaults: {
                            // labelTextAlign: 'right',
                            // labelWidth: 100,
                            labelAlign: 'top',
                            disabled: true,
                            hidden: true,
                            bind: {
                                disabled: '{!override.checked}',
                                hidden: '{!override.checked}'
                            }
                        },
                        hidden: true,
                        bind: { hidden: '{interface.v4ConfigType !== "DHCP"}' },
                        items: [{
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                disabled: true,
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v4DhcpAddressOverride',
                                label: 'Address Override'.t(),
                                flex: 1,
                                bind: {
                                    value: '{interface.v4DhcpAddressOverride}',
                                    placeholder: '{interface.v4StaticAddress}',
                                    disabled: '{!override.checked}'
                                }
                            }, {
                                xtype: 'selectfield',
                                name: 'v4DhcpPrefixOverride',
                                label: 'Netmask Override'.t(),
                                editable: false,
                                clearable: false,
                                flex: 1,
                                margin: '0 0 0 16',
                                bind: {
                                    value: '{interface.v4DhcpPrefixOverride}',
                                    placeholder: '{interface.v4StaticPrefix}',
                                    disabled: '{!override.checked}'
                                },
                                options: Globals.prefixes
                            }]
                        }, {
                            xtype: 'textfield',
                            name: 'v4DhcpGatewayOverride',
                            label: 'Gateway Override'.t(),
                            bind: {
                                value: '{interface.v4DhcpGatewayOverride}',
                                placeholder: '{interface.v4StaticGateway}'
                            }
                        }, {
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                disabled: true,
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v4DhcpDNS1Override',
                                label: 'Primary DNS Override'.t(),
                                flex: 1,
                                bind: {
                                    value: '{interface.v4DhcpDNS1Override}',
                                    placeholder: '{interface.v4StaticDNS1}',
                                    disabled: '{!override.checked}'
                                }
                            }, {
                                xtype: 'textfield',
                                name: 'v4DhcpDNS2Override',
                                label: 'Secondary DNS Override'.t(),
                                flex: 1,
                                margin: '0 0 0 16',
                                bind: {
                                    value: '{interface.v4DhcpDNS2Override}',
                                    placeholder: '{interface.v4StaticDNS2}',
                                    disabled: '{!override.checked}'
                                }
                            }]
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        defaults: {
                            labelAlign: 'top',
                        },
                        hidden: true,
                        bind: { hidden: '{interface.v4ConfigType !== "STATIC"}' },
                        items: [{
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v4StaticAddress',
                                label: 'Address'.t(),
                                errorLabel: 'IPv4 Static Address'.t(),
                                flex: 1,
                                required: false,
                                bind: {
                                    value: '{interface.v4StaticAddress}',
                                    required: '{interface.v4ConfigType === "STATIC"}'
                                },
                                validators: ['ipaddress']
                            }, {
                                xtype: 'selectfield',
                                name: 'v4StaticPrefix',
                                label: 'Netmask'.t(),
                                editable: false,
                                clearable: false,
                                flex: 1,
                                required: false,
                                margin: '0 0 0 16',
                                bind: {
                                    value: '{interface.v4StaticPrefix}',
                                    required: '{interface.v4ConfigType === "STATIC"}'
                                },
                                options: Globals.prefixes
                            }]
                        }, {
                            xtype: 'textfield',
                            name: 'v4StaticGateway',
                            label: 'Gateway'.t(),
                            errorLabel: 'IPv4 Static Gateway'.t(),
                            hidden: true,
                            required: false,
                            bind: {
                                value: '{interface.v4StaticGateway}',
                                hidden: '{!interface.wan}', // ????
                                required: '{interface.wan && interface.v4ConfigType === "STATIC"}'
                            },
                            validators: ['presence', 'ipaddress']
                        }, {
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v4StaticDNS1',
                                label: 'Primary DNS'.t(),
                                flex: 1,
                                hidden: true,
                                bind: {
                                    value: '{interface.v4StaticDNS1}',
                                    hidden: '{!interface.wan}'
                                }
                            }, {
                                xtype: 'textfield',
                                name: 'v4StaticDNS2',
                                label: 'Secondary DNS'.t(),
                                flex: 1,
                                margin: '0 0 0 16',
                                hidden: true,
                                bind: {
                                    value: '{interface.v4StaticDNS2}',
                                    hidden: '{!interface.wan}'
                                }
                            }]
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        defaults: {
                            labelAlign: 'top',
                        },
                        hidden: true,
                        bind: { hidden: '{interface.v4ConfigType !== "PPPOE"}' },
                        items: [{
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v4PPPoEUsername',
                                label: 'Username'.t(),
                                flex: 1,
                                required: false,
                                bind: {
                                    value: '{interface.v4PPPoEUsername}',
                                    required: '{interface.v4ConfigType === "PPPOE"}'
                                }
                            }, {
                                inputType: 'password',
                                name: 'v4PPPoEPassword',
                                label: 'Password'.t(),
                                flex: 1,
                                margin: '0 0 0 16',
                                required: false,
                                bind: {
                                    value: '{interface.v4PPPoEPassword}',
                                    required: '{interface.v4ConfigType === "PPPOE"}'
                                }
                            }]
                        }, {
                            xtype: 'checkbox',
                            name: 'v4PPPoEUsePeerDNS',
                            boxLabel: 'Use Peer DNS'.t(),
                            bodyAlign: 'left',
                            bind: '{interface.v4PPPoEUsePeerDNS}',
                        }, {
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v4PPPoEOverrideDNS1',
                                label: 'Primary DNS'.t(),
                                flex: 1,
                                disabled: true,
                                bind: {
                                    value: '{interface.v4PPPoEOverrideDNS1}',
                                    disabled: '{interface.v4PPPoEUsePeerDNS}'
                                }
                            }, {
                                xtype: 'textfield',
                                name: 'v4PPPoEOverrideDNS2',
                                label: 'Secondary DNS'.t(),
                                flex: 1,
                                margin: '0 0 0 16',
                                disabled: true,
                                bind: {
                                    value: '{interface.v4PPPoEOverrideDNS2}',
                                    disabled: '{interface.v4PPPoEUsePeerDNS}'
                                }
                            }]
                        }]
                    }, {
                        xtype: 'checkbox',
                        name: 'natEgress',
                        boxLabel: 'NAT traffic exiting this interface (and bridged peers)',
                        bodyAlign: 'start',
                        hidden: true,
                        margin: '0 0 32 0',
                        bind: {
                            checked: '{interface.natEgress}',
                            hidden: '{!interface.wan}'
                        }
                    }, {
                        xtype: 'checkbox',
                        name: 'natIngress',
                        boxLabel: 'NAT traffic coming from this interface (and bridged peers)',
                        bodyAlign: 'start',
                        hidden: true,
                        margin: '0 0 32 0',
                        bind: {
                            checked: '{interface.natIngress}',
                            hidden: '{interface.wan}'
                        }
                    }]
                }, {
                    // IPv4 Aliases
                    xtype: 'panel',
                    layout: 'fit',
                    width: '50%',
                    docked: 'right',
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    items: [{
                        xtype: 'toolbar',
                        docked: 'top',
                        shadow: false,
                        padding: '0 8',
                        items: [{
                            xtype: 'component',
                            html: 'IPv4 Aliases',
                            style: 'font-weight: 100;'
                        }, '->', {
                            iconCls: 'md-icon-add',
                            handler: 'addV4Alias'
                        }]
                    }, {
                        xtype: 'grid',
                        itemId: 'v4Aliases',
                        bind: '{interface.v4Aliases}',
                        selectable: false,
                        plugins: {
                            gridcellediting: {
                                triggerEvent: 'tap'
                            }
                        },
                        deferEmptyText: false,
                        emptyText: true,
                        columns: [{
                            text: 'Address'.t(),
                            dataIndex: 'v4Address',
                            menuDisabled: true,
                            width: 150,
                            cell: { encodeHtml: false },
                            renderer: function (value) {
                                return value || '<em>click to edit ...</em>';
                            },
                            editable: true,
                            editor: {
                                xtype: 'textfield',
                                required: true,
                                validators: ['ipaddress']
                            }
                        }, {
                            text: 'Netmask/Prefix'.t(),
                            dataIndex: 'v4Prefix',
                            menuDisabled: true,
                            flex: 1,
                            renderer: function (value) {
                                return Globals.prefixesMap[value].text;
                            },
                            editable: true,
                            editor: {
                                xtype: 'selectfield',
                                editable: false,
                                clearable: false,
                                options: Globals.prefixes
                            }
                        }, {
                            width: 44,
                            resizable: false,
                            menuDisabled: true,
                            cell: {
                                tools: [{
                                    type: 'delete',
                                    iconCls: 'md-icon-delete',
                                    handler: function (grid, info) {
                                        grid.getStore().remove(info.record);
                                    }
                                }]
                            }
                        }]
                    }]
                }]
            }, {
                xtype: 'container',
                itemId: 'ipv6',
                layout: 'hbox',
                items: [{
                    // IPv6
                    xtype: 'panel',
                    flex: 1,
                    layout: 'vbox',
                    padding: '0 16',
                    items: [{
                        xtype: 'containerfield',
                        defaults: {
                            labelAlign: 'top'
                        },
                        items: [{
                            xtype: 'selectfield',
                            name: 'v6ConfigType',
                            // reference: 'v4Config',
                            label: 'Config Type'.t(),
                            editable: false,
                            margin: '0 16 0 0',
                            width: 200,
                            bind: {
                                value: '{interface.v6ConfigType}',
                                options: '{ipv6Configs}'
                            }
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        hidden: true,
                        bind: { hidden: '{interface.v6ConfigType !== "DHCP"}' },
                        html: 'DHCP conf ...'
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        hidden: true,
                        bind: { hidden: '{interface.v6ConfigType !== "SLAAC"}' },
                        html: 'SLAAC conf ...'
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        defaults: {
                            labelAlign: 'top',
                        },
                        hidden: true,
                        bind: { hidden: '{interface.v6ConfigType !== "ASSIGN"}' },
                        items: [{
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v6AssignHint',
                                label: 'Assign Hint'.t(),
                                errorLabel: 'IPv6 Assign Hint'.t(),
                                required: false,
                                flex: 1,
                                bind: {
                                    value: '{interface.v6AssignHint}',
                                    required: '{interface.v6ConfigType === "ASSIGN"}'
                                }
                            }, {
                                xtype: 'numberfield',
                                name: 'v6AssignPrefix',
                                label: 'Assign Prefix'.t(),
                                errorLabel: 'IPv6 Assign Prefix'.t(),
                                placeholder: 'Integer between 1 and 128',
                                decimals: 0,
                                minValue: 1,
                                maxValue: 128,
                                required: false,
                                allowBlank: true,
                                margin: '0 0 0 16',
                                flex: 1,
                                bind: {
                                    value: '{interface.v6AssignPrefix}',
                                    required: '{interface.v6ConfigType === "ASSIGN"}'
                                }
                            }]
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'vbox',
                        margin: '16 0 0 0',
                        defaults: {
                            labelAlign: 'top',
                        },
                        hidden: true,
                        bind: { hidden: '{interface.v6ConfigType !== "STATIC"}' },
                        items: [{
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v6StaticAddress',
                                label: 'Address'.t(),
                                errorLabel: 'IPv4 Static Address'.t(),
                                flex: 1,
                                required: false,
                                bind: {
                                    value: '{interface.v6StaticAddress}',
                                    required: '{interface.v6ConfigType === "STATIC"}'
                                },
                                validators: ['ipaddress']
                            }, {
                                xtype: 'numberfield',
                                name: 'v6StaticPrefix',
                                label: 'Prefix Length'.t(),
                                flex: 1,
                                required: false,
                                margin: '0 0 0 16',
                                bind: {
                                    value: '{interface.v6StaticPrefix}',
                                    required: '{interface.v6ConfigType === "STATIC"}'
                                }
                            }]
                        }, {
                            xtype: 'textfield',
                            name: 'v6StaticGateway',
                            label: 'Gateway'.t(),
                            hidden: true,
                            required: false,
                            bind: {
                                value: '{interface.v6StaticGateway}',
                                hidden: '{!interface.wan}', // ????
                                required: '{interface.wan && interface.v6ConfigType === "STATIC"}'
                            },
                            validators: ['presence', 'ipaddress']
                        }, {
                            xtype: 'containerfield',
                            layout: 'hbox',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{
                                xtype: 'textfield',
                                name: 'v6StaticDNS1',
                                label: 'Primary DNS'.t(),
                                flex: 1,
                                hidden: true,
                                bind: {
                                    value: '{interface.v6StaticDNS1}',
                                    hidden: '{!interface.wan}'
                                }
                            }, {
                                xtype: 'textfield',
                                name: 'v6StaticDNS2',
                                label: 'Secondary DNS'.t(),
                                flex: 1,
                                margin: '0 0 0 16',
                                hidden: true,
                                bind: {
                                    value: '{interface.v6StaticDNS2}',
                                    hidden: '{!interface.wan}'
                                }
                            }]
                        }]
                    }],

                }, {
                    // IPv6 Aliases
                    xtype: 'panel',
                    layout: 'fit',
                    width: '50%',
                    docked: 'right',
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    items: [{
                        xtype: 'toolbar',
                        docked: 'top',
                        shadow: false,
                        padding: '0 8',
                        items: [{
                            xtype: 'component',
                            html: 'IPv6 Aliases',
                            style: 'font-weight: 100;'
                        }, '->', {
                            iconCls: 'md-icon-add',
                            handler: 'addV6Alias'
                        }]
                    }, {
                        xtype: 'grid',
                        itemId: 'v6Aliases',
                        bind: '{interface.v6Aliases}',
                        selectable: false,
                        plugins: {
                            gridcellediting: {
                                triggerEvent: 'tap'
                            }
                        },
                        deferEmptyText: false,
                        emptyText: true,
                        columns: [{
                            text: 'Address'.t(),
                            dataIndex: 'v6Address',
                            menuDisabled: true,
                            width: 150,
                            cell: { encodeHtml: false },
                            renderer: function (value) {
                                return value || '<em>click to edit ...</em>';
                            },
                            editable: true,
                            editor: {
                                xtype: 'textfield',
                                required: true,
                                validators: ['ipaddress']
                            }
                        }, {
                            text: 'Netmask/Prefix'.t(),
                            dataIndex: 'v6Prefix',
                            menuDisabled: true,
                            flex: 1,
                            renderer: function (value) {
                                return Globals.prefixesMap[value].text;
                            },
                            editable: true,
                            editor: {
                                xtype: 'selectfield',
                                editable: false,
                                clearable: false,
                                options: Globals.prefixes
                            }
                        }, {
                            width: 44,
                            resizable: false,
                            menuDisabled: true,
                            cell: {
                                tools: [{
                                    type: 'delete',
                                    iconCls: 'md-icon-delete',
                                    handler: function (grid, info) {
                                        grid.getStore().remove(info.record);
                                    }
                                }]
                            }
                        }]
                    }]
                }]
            }, {
                xtype: 'container',
                itemId: 'dhcp',
                layout: 'hbox',
                items: [{
                    // DHCP
                    xtype: 'panel',
                    flex: 1,
                    layout: 'vbox',
                    padding: '0 16',
                    // defaults: {
                    //     margin: '0 0 24 0'
                    // },
                    items: [{
                        xtype: 'checkbox',
                        name: 'dhcpEnabled',
                        boxLabel: 'Enable DHCP Serving',
                        bodyAlign: 'start',
                        bind: {
                            checked: '{interface.dhcpEnabled}',
                        }
                    }, {
                        xtype: 'containerfield',
                        layout: 'hbox',
                        defaults: {
                            labelAlign: 'top'
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'dhcpRangeStart',
                            label: 'Range Start'.t(),
                            clearable: false,
                            required: false,
                            hidden: true,
                            flex: 1,
                            bind: {
                                value: '{interface.dhcpRangeStart}',
                                required: '{interface.dhcpEnabled}',
                                hidden: '{!interface.dhcpEnabled}'
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'dhcpRangeEnd',
                            label: 'Range End'.t(),
                            clearable: false,
                            required: false,
                            hidden: true,
                            flex: 1,
                            margin: '0 16',
                            bind: {
                                value: '{interface.dhcpRangeEnd}',
                                required: '{interface.dhcpEnabled}',
                                hidden: '{!interface.dhcpEnabled}'
                            }
                        }, {
                            xtype: 'numberfield',
                            name: 'dhcpLeaseDuration',
                            label: 'Lease Duration'.t(),
                            hidden: true,
                            width: 100,
                            bind: {
                                value: '{interface.dhcpLeaseDuration}',
                                hidden: '{!interface.dhcpEnabled}'
                            }
                        }]
                    }, {
                        xtype: 'containerfield',
                        layout: 'hbox',
                        defaults: {
                            labelAlign: 'top'
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'dhcpGatewayOverride',
                            label: 'Gateway Override'.t(),
                            hidden: true,
                            flex: 1,
                            bind: {
                                value: '{interface.dhcpGatewayOverride}',
                                hidden: '{!interface.dhcpEnabled}'
                            }
                        }, {
                            xtype: 'selectfield',
                            name: 'dhcpPrefixOverride',
                            label: 'Netmask Override'.t(),
                            hidden: true,
                            flex: 1,
                            margin: '0 0 0 16',
                            bind: {
                                value: '{interface.dhcpPrefixOverride}',
                                hidden: '{!interface.dhcpEnabled}',
                            },
                            options: Globals.prefixes
                        }]
                    }, {
                        xtype: 'textfield',
                        name: 'dhcpDNSOverride',
                        label: 'DNS Override'.t(),
                        labelAlign: 'top',
                        hidden: true,
                        bind: {
                            value: '{interface.dhcpDNSOverride}',
                            hidden: '{!interface.dhcpEnabled}'
                        }
                    }]
                }, {
                    // VRRP Aliases
                    xtype: 'panel',
                    layout: 'fit',
                    width: '50%',
                    docked: 'right',
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{!interface.dhcpEnabled}'
                    },
                    items: [{
                        xtype: 'toolbar',
                        docked: 'top',
                        shadow: false,
                        padding: '0 8',
                        items: [{
                            xtype: 'component',
                            html: 'DHCP Options',
                            style: 'font-weight: 100;'
                        }, '->', {
                            iconCls: 'md-icon-add',
                            handler: 'addDhcpOption'
                        }]
                    }, {
                        xtype: 'grid',
                        itemId: 'dhcpOptions',
                        bind: '{interface.dhcpOptions}',
                        selectable: false,
                        plugins: {
                            gridcellediting: {
                                triggerEvent: 'tap'
                            }
                        },
                        deferEmptyText: false,
                        emptyText: true,
                        columns: [{
                            xtype: 'checkcolumn',
                            width: 44,
                            dataIndex: 'enabled'
                        }, {
                            text: 'Description'.t(),
                            dataIndex: 'description',
                            menuDisabled: true,
                            flex: 1,
                            cell: { encodeHtml: false },
                            renderer: function (value) {
                                return value || '<em>click to edit ...</em>';
                            },
                            editable: true,
                            editor: {
                                xtype: 'textfield',
                                required: true
                            }
                        }, {
                            text: 'Value'.t(),
                            dataIndex: 'value',
                            menuDisabled: true,
                            width: 100,
                            cell: { encodeHtml: false },
                            renderer: function (value) {
                                return value || '<em>click to edit ...</em>';
                            },
                            editable: true
                        }, {
                            width: 44,
                            resizable: false,
                            menuDisabled: true,
                            cell: {
                                tools: [{
                                    type: 'delete',
                                    iconCls: 'md-icon-delete',
                                    handler: function (grid, info) {
                                        grid.getStore().remove(info.record);
                                    }
                                }]
                            }
                        }]
                    }]
                }]
            }, {
                xtype: 'container',
                itemId: 'vrrp',
                layout: 'hbox',
                items: [{
                    // VRRP
                    xtype: 'panel',
                    flex: 1,
                    layout: 'vbox',
                    padding: '0 16',
                    items: [{
                        xtype: 'checkbox',
                        name: 'vrrpEnabled',
                        boxLabel: 'Enable VRRP',
                        bodyAlign: 'start',
                        bind: {
                            checked: '{interface.vrrpEnabled}',
                        }
                    }, {
                        xtype: 'containerfield',
                        layout: 'hbox',
                        defaults: {
                            labelAlign: 'top'
                        },
                        items: [{
                            xtype: 'numberfield',
                            name: 'vrrpID',
                            label: 'VRRP ID'.t(),
                            required: false,
                            hidden: true,
                            flex: 1,
                            bind: {
                                value: '{interface.vrrpID}',
                                required: '{interface.vrrpEnabled}',
                                hidden: '{!interface.vrrpEnabled}'
                            }
                        }, {
                            xtype: 'numberfield',
                            name: 'vrrpPriority',
                            label: 'VRRP Priority'.t(),
                            required: false,
                            hidden: true,
                            flex: 1,
                            margin: '0 0 0 16',
                            bind: {
                                value: '{interface.vrrpPriority}',
                                required: '{interface.vrrpEnabled}',
                                hidden: '{!interface.vrrpEnabled}'
                            }
                        }]
                    }]
                }, {
                    // VRRP Aliases
                    xtype: 'panel',
                    layout: 'fit',
                    width: '50%',
                    docked: 'right',
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{!interface.vrrpEnabled}'
                    },
                    items: [{
                        xtype: 'toolbar',
                        docked: 'top',
                        shadow: false,
                        padding: '0 8',
                        items: [{
                            xtype: 'component',
                            html: 'VRRP Aliases',
                            style: 'font-weight: 100;'
                        }, '->', {
                            iconCls: 'md-icon-add',
                            handler: 'addVrrpAlias'
                        }]
                    }, {
                        xtype: 'grid',
                        itemId: 'vrrpAliases',
                        bind: '{interface.vrrpV4Aliases}',
                        selectable: false,
                        plugins: {
                            gridcellediting: {
                                triggerEvent: 'tap'
                            }
                        },
                        deferEmptyText: false,
                        emptyText: true,
                        columns: [{
                            text: 'Address'.t(),
                            dataIndex: 'v4Address',
                            menuDisabled: true,
                            width: 150,
                            cell: { encodeHtml: false },
                            renderer: function (value) {
                                return value || '<em>click to edit ...</em>';
                            },
                            editable: true,
                            editor: {
                                xtype: 'textfield',
                                required: true,
                                validators: ['ipaddress']
                            }
                        }, {
                            text: 'Netmask/Prefix'.t(),
                            dataIndex: 'v4Prefix',
                            menuDisabled: true,
                            flex: 1,
                            renderer: function (value) {
                                return Globals.prefixesMap[value].text;
                            },
                            editable: true,
                            editor: {
                                xtype: 'selectfield',
                                editable: false,
                                clearable: false,
                                options: Globals.prefixes
                            }
                        }, {
                            width: 44,
                            resizable: false,
                            menuDisabled: true,
                            cell: {
                                tools: [{
                                    type: 'delete',
                                    iconCls: 'md-icon-delete',
                                    handler: function (grid, info) {
                                        grid.getStore().remove(info.record);
                                    }
                                }]
                            }
                        }]
                    }]
                }]
            }, {
                // WIFI
                xtype: 'container',
                itemId: 'wifi',
                layout: 'vbox',
                padding: '0 16',
                defaults: {
                    margin: '0 0 32 0'
                },
                disabled: true,
                bind: {
                    disabled: '{interface.type !== "WIFI"}'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'wirelessSsid',
                    label: 'Wireless SSID'.t(),
                    labelAlign: 'top',
                    required: true,
                    bind: {
                        value: '{interface.wirelessSsid}',
                        required: '{interface.type === "WIFI"}'
                    }
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'selectfield',
                        name: 'wirelessEncryption',
                        label: 'Wireless Encryption'.t(),
                        width: 200,
                        required: true,
                        bind: {
                            value: '{interface.wirelessEncryption}',
                            required: '{interface.type === "WIFI"}'
                        },
                        options: [
                            { text: 'None'.t(), value: 'NONE' },
                            { text: 'WPA1'.t(), value: 'WPA1' },
                            { text: 'WPA12'.t(), value: 'WPA12' },
                            { text: 'WPA2'.t(), value: 'WPA2' }
                        ]
                    }, {
                        xtype: 'passwordfield',
                        name: 'wirelessPassword',
                        label: 'Wireless Password'.t(),
                        flex: 1,
                        margin: '0 0 0 16',
                        required: true,
                        bind: {
                            value: '{interface.wirelessPassword}',
                            required: '{interface.type === "WIFI"}'
                        }
                    }]
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'selectfield',
                        name: 'wirelessMode',
                        label: 'Wireless Mode'.t(),
                        bind: '{interface.wirelessMode}',
                        width: 150,
                        options: [
                            { text: 'AP'.t(), value: 'AP' },
                            { text: 'Client'.t(), value: 'CLIENT' }
                        ]
                    }, {
                        xtype: 'numberfield',
                        name: 'wirelessChannel',
                        label: 'Wireless Channel'.t(),
                        width: 150,
                        margin: '0 0 0 16',
                        bind: '{interface.wirelessChannel}'
                    }]
                }]
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }, {
            bind: {
                text: '{action === "ADD" ? "Create" : "Update"}'
            },
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = view.getInterface();

            vm.set({
                interface: intf,
                action: intf ? 'EDIT' : 'ADD'
            });

            if (intf.get('type') === "WIFI") {
                view.down('segmentedbutton').setValue('#wifi');
                // console.log('yeah');
            }
        },

        addV4Alias: function () {
            var me = this, grid = me.getView().down('#v4Aliases');

            grid.getStore().add({
                v4Address: '',
                v4Prefix: 24
            });
        },

        addV6Alias: function () {
            var me = this, grid = me.getView().down('#v6Aliases');

            grid.getStore().add({
                v6Address: '',
                v6Prefix: 24
            });
        },

        addDhcpOption: function () {
            var me = this, grid = me.getView().down('#dhcpOptions');

            grid.getStore().add({
                enabled: true,
                description: '',
                value: ''
            });
        },

        addVrrpAlias: function () {
            var me = this, grid = me.getView().down('#vrrpAliases');

            grid.getStore().add({
                v4Address: '',
                v4Prefix: 24
            });
        },

        onSubmit: function () {
            var me = this,
                vm = me.getViewModel(),
                interface = vm.get('interface'),
                interfacesStore = Ext.getStore('interfaces'),
                form = me.getView().down('formpanel');

            var invalidFields = [];

            Ext.Object.each(form.getFields(), function (key, field) {
                if (key !== 'null') {
                    if (!field.isValid()) {
                        invalidFields.push(field.getLabel() + ' [<strong>' + field.getName() + '</strong>]');
                    }
                }
            });

            if (invalidFields.length > 0) {
                Ext.Msg.alert('Fill or correct following fields', invalidFields.join('<br/>'));
                return;
            }

            me.getView().mask({ xtype: 'loadmask' });

            interface.commit();
            interfacesStore.each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            interfacesStore.sync({
                success: function () {
                    Ext.toast('Settings saved!');
                },
                failure: function () {
                    console.warn('Unable to save interfaces!');
                },
                callback: function () {
                    me.getView().unmask();
                    me.getView().close();
                }
            });
        }
    }

});
