/**
 * Interface dialog editor
 */
Ext.define('Mfw.settings.network.InterfaceDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',

    viewModel: {
        formulas: {
            /**
             * set possible interface config types based on its type (NIC, OPENVPN)
             */
            configTypes: function (get) {
                // all types
                var options = [
                    { text: 'Addressed', value: 'ADDRESSED' },
                    { text: 'Bridged',   value: 'BRIDGED' },
                    { text: 'Disabled',  value: 'DISABLED' }
                ];
                if (get('interface.type') === 'OPENVPN') {
                    options = [
                        { text: 'Addressed', value: 'ADDRESSED' },
                        { text: 'Disabled',  value: 'DISABLED' }
                    ];
                }
                return options;
            },

            /**
             * set possible IPv6 config types if it's wan or not
             */
            ipv6ConfigTypes: function (get) {
                var options;
                if (get('interface.wan')) {
                    options = [
                        { text: 'Static'.t(),   value: 'STATIC' },
                        { text: 'DHCP'.t(), value: 'DHCP' },
                        { text: 'SLAAC'.t(), value: 'SLAAC' },
                        { text: 'Disabled'.t(),  value: 'DISABLED' }
                    ];
                } else {
                    options = [
                        { text: 'Static'.t(),   value: 'STATIC' },
                        { text: 'Assign'.t(), value: 'ASSIGN' },
                        { text: 'Disabled'.t(),  value: 'DISABLED' }
                    ];
                }
                return options;
            },

            /**
             * set possible interfaces which can be bridged
             */
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

            /**
             * set possible interfaces which can be bound to an openvpn
             */
            boundOptions: function () {
                var interfaces = [{
                    text: 'any WAN',
                    value: 0
                }];
                Ext.getStore('interfaces').each(function (intf) {
                    if (intf.get('type') === 'NIC' && intf.get('wan')) {
                        interfaces.push({
                            text: intf.get('name'),
                            value: intf.get('interfaceId')
                        });
                    }
                });
                return interfaces;
            }
        }
    },

    config: {
        interface: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} Interface ({interface.type})',
    },
    width: 750,
    height: '75%',

    padding: 0,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    // defaults: {
    //     padding: '8 16',
    // },

    items: [{
        xtype: 'container',
        docked: 'top',
        padding: '0 8 16 8',
        shadow: true,
        zIndex: 10,
        items: [{
            xtype: 'formpanel',
            itemId: 'main',
            validateOnSync: true,
            padding: 0,
            layout: {
                type: 'hbox',
                align: 'bottom'
            },
            defaults: {
                margin: '0 8',
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                name: 'name',
                label: 'Interface Name',
                placeholder: 'Enter Name ...',
                autoComplete: false,
                required: true,
                clearable: false,
                bind: '{interface.name}',
                width: 150,
                maxLength: 10,
                validators: [{
                    type: 'format',
                    matcher: new RegExp('^[A-za-z0-9]+$'),
                    message: 'must be alphanumeric, without spaces'
                }]
            }, {
                xtype: 'selectfield',
                name: 'configType',
                label: 'Config Type'.t(),
                width: 150,
                editable: false,
                required: true,
                bind: {
                    value: '{interface.configType}',
                    options: '{configTypes}'
                }
            }, {
                xtype: 'selectfield',
                name: 'bridgedTo',
                label: 'Bridged To',
                flex: 1,
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
                xtype: 'selectfield',
                name: 'openvpnBoundInterfaceId',
                label: 'Bound to',
                flex: 1,
                editable: false,
                required: true,
                displayTpl: '{text} [ {value} ]',
                itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                hidden: true,
                bind: {
                    value: '{interface.openvpnBoundInterfaceId}',
                    hidden: '{interface.type !== "OPENVPN" || interface.configType === "DISABLED"}',
                    required: '{interface.type === "OPENVPN"}',
                    options: '{boundOptions}'
                }
            }, {
                xtype: 'checkbox',
                name: 'wan',
                // label: '&nbsp;',
                boxLabel: 'Is WAN',
                bodyAlign: 'start',
                flex: 1,
                hidden: true,
                bind: {
                    checked: '{interface.wan}',
                    hidden: '{interface.configType !== "ADDRESSED"}'
                }
            }]
        }]
    }, {

        /**
         * settings navigation tree
         * each node/leaf corresponds to a settings card identified with itemId,
         * card which activates on node selection
         */
        xtype: 'treelist',
        reference: 'treelist',
        userCls: 'no-icons',
        scrollable: true,
        ui: 'nav',
        docked: 'left',
        width: 250,
        style: {
            background: '#f5f5f5'
        },
        animation: {
            duration: 0
        },
        singleExpand: true,
        expanderFirst: false,
        expanderOnly: false,
        selectOnExpander: true,

        hidden: true,
        bind: {
            hidden: '{interface.configType !== "ADDRESSED" && interface.type !== "WIFI"}'
        }
        /**
         * setting navigation tree end
         */

    }, {

        /**
         * card layout panel holding each section with following itemIds:
         * - ipv4
         *   - ipv4Aliases
         * - ipv6
         *   - ipv6Aliases
         * - dhcp
         *   - dhcpOptions
         * - vrrp
         *   - vrrpv4aliases
         * - wifi
         * - qos
         * - bridged
         * - disabled
         */
        xtype: 'panel',
        itemId: 'card',
        layout: {
            type: 'card',
            deferRender: false
            // animation: {
            //     duration: 150,
            //     type: 'fade',
            //     direction: 'horizontal'
            // },
        },
        bind: {
            activeItem: '#{treelist.selection.key}'
        },
        defaults: {
            padding: 16
        },
        items: [{

            /**
             * IPv4 settings
             */
            xtype: 'formpanel',
            itemId: 'ipv4',
            validateOnSync: true,
            layout: 'vbox',
            items: [{
                xtype: 'selectfield',
                name: 'v4ConfigType',
                reference: 'v4Config',
                label: 'Config Type'.t(),
                editable: false,
                // disabled: true,
                // hidden: true,
                bind: {
                    value: '{interface.v4ConfigType}',
                    // disabled: '{!interface.wan}',
                    // hidden: '{interface.type === "OPENVPN"}'
                },
                options: [
                    { text: 'Auto (DHCP)'.t(), value: 'DHCP' },
                    { text: 'Static'.t(),   value: 'STATIC' },
                    { text: 'PPPoE'.t(),  value: 'PPPOE' }
                ],
            }, {

                /**
                 * IPv4 STATIC config
                 * - v4StaticAddress
                 * - v4StaticPrefix
                 * - v4StaticGateway
                 * - v4StaticDNS1
                 * - v4StaticDNS2
                 */
                xtype: 'container',
                flex: 1,
                layout: 'vbox',
                defaults: {
                    labelAlign: 'top',
                },
                hidden: true,
                bind: { hidden: '{interface.v4ConfigType !== "STATIC"}' },
                items: [{
                    xtype: 'textfield',
                    name: 'v4StaticAddress',
                    label: 'Address'.t(),
                    errorLabel: 'IPv4 Static Address'.t(),
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v4StaticAddress}',
                        required: '{interface.v4ConfigType === "STATIC"}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'selectfield',
                    name: 'v4StaticPrefix',
                    label: 'Netmask'.t(),
                    editable: false,
                    clearable: false,
                    required: false,
                    bind: {
                        value: '{interface.v4StaticPrefix}',
                        required: '{interface.v4ConfigType === "STATIC"}'
                    },
                    options: Map.options.prefixes
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
                    validators: 'ipv4'
                }, {
                    xtype: 'textfield',
                    name: 'v4StaticDNS1',
                    label: 'Primary DNS'.t(),
                    hidden: true,
                    bind: {
                        value: '{interface.v4StaticDNS1}',
                        hidden: '{!interface.wan}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'v4StaticDNS2',
                    label: 'Secondary DNS'.t(),
                    hidden: true,
                    bind: {
                        value: '{interface.v4StaticDNS2}',
                        hidden: '{!interface.wan}'
                    }
                }]
                /**
                 * IPv4 STATIC config end
                 */

            }, {

                /**
                 * IPv4 Auto (DHCP) defaults override
                 * - v4DhcpAddressOverride
                 * - v4DhcpPrefixOverride
                 * - v4DhcpGatewayOverride
                 * - v4DhcpDNS1Override
                 * - v4DhcpDNS2Override
                 */
                xtype: 'container',
                layout: 'vbox',
                defaults: {
                    labelAlign: 'top',
                    disabled: true,
                    hidden: true
                },
                hidden: true,
                bind: { hidden: '{interface.v4ConfigType !== "DHCP"}' },
                items: [{
                    xtype: 'checkbox',
                    name: 'overrideDefaults',
                    reference: 'override',
                    boxLabel: 'Override Defaults',
                    bodyAlign: 'start',
                    disabled: false,
                    hidden: false
                }, {
                    xtype: 'textfield',
                    name: 'v4DhcpAddressOverride',
                    label: 'Address Override'.t(),
                    bind: {
                        value: '{interface.v4DhcpAddressOverride}',
                        placeholder: '{interface.v4StaticAddress}',
                        disabled: '{!override.checked}',
                        hidden: '{!override.checked}'
                    }
                }, {
                    xtype: 'selectfield',
                    name: 'v4DhcpPrefixOverride',
                    label: 'Netmask Override'.t(),
                    editable: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v4DhcpPrefixOverride}',
                        placeholder: '{interface.v4StaticPrefix}',
                        disabled: '{!override.checked}',
                        hidden: '{!override.checked}'
                    },
                    options: Map.options.prefixes
                }, {
                    xtype: 'textfield',
                    name: 'v4DhcpGatewayOverride',
                    label: 'Gateway Override'.t(),
                    bind: {
                        value: '{interface.v4DhcpGatewayOverride}',
                        placeholder: '{interface.v4StaticGateway}',
                        disabled: '{!override.checked}',
                        hidden: '{!override.checked}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'textfield',
                    name: 'v4DhcpDNS1Override',
                    label: 'Primary DNS Override'.t(),
                    bind: {
                        value: '{interface.v4DhcpDNS1Override}',
                        placeholder: '{interface.v4StaticDNS1}',
                        disabled: '{!override.checked}',
                        hidden: '{!override.checked}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'v4DhcpDNS2Override',
                    label: 'Secondary DNS Override'.t(),
                    bind: {
                        value: '{interface.v4DhcpDNS2Override}',
                        placeholder: '{interface.v4StaticDNS2}',
                        disabled: '{!override.checked}',
                        hidden: '{!override.checked}'
                    }
                }]
                /**
                 * IPv4 Auto (DHCP) end
                 */

            }, {

                /**
                 * IPv4 PPPoE settings
                 * - v4PPPoEUsername
                 * - v4PPPoEPassword
                 * - v4PPPoEUsePeerDNS
                 * - v4PPPoEOverrideDNS1
                 * - v4PPPoEOverrideDNS2
                 */
                xtype: 'container',
                layout: 'vbox',
                defaults: {
                    labelAlign: 'top',
                },
                hidden: true,
                bind: { hidden: '{interface.v4ConfigType !== "PPPOE"}' },
                items: [{
                    xtype: 'textfield',
                    name: 'v4PPPoEUsername',
                    label: 'Username'.t(),
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v4PPPoEUsername}',
                        required: '{interface.v4ConfigType === "PPPOE"}'
                    }
                }, {
                    xtype: 'passwordfield',
                    name: 'v4PPPoEPassword',
                    label: 'Password'.t(),
                    clearable: false,
                    required: false,
                    bind: {
                        value: '{interface.v4PPPoEPassword}',
                        required: '{interface.v4ConfigType === "PPPOE"}'
                    }
                }, {
                    xtype: 'checkbox',
                    name: 'v4PPPoEUsePeerDNS',
                    boxLabel: 'Use Peer DNS'.t(),
                    margin: '16 0 0 0',
                    bodyAlign: 'left',
                    bind: '{interface.v4PPPoEUsePeerDNS}',
                }, {
                    xtype: 'textfield',
                    name: 'v4PPPoEOverrideDNS1',
                    label: 'Primary DNS'.t(),
                    disabled: true,
                    hidden: true,
                    bind: {
                        value: '{interface.v4PPPoEOverrideDNS1}',
                        disabled: '{interface.v4PPPoEUsePeerDNS}',
                        hidden: '{interface.v4PPPoEUsePeerDNS}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'v4PPPoEOverrideDNS2',
                    label: 'Secondary DNS'.t(),
                    disabled: true,
                    hidden: true,
                    bind: {
                        value: '{interface.v4PPPoEOverrideDNS2}',
                        disabled: '{interface.v4PPPoEUsePeerDNS}',
                        hidden: '{interface.v4PPPoEUsePeerDNS}'
                    }
                }]
                /**
                 * IPv4 PPPoE settings
                 */

            }, {
                flex: 1
            }, {
                xtype: 'checkbox',
                name: 'natEgress',
                boxLabel: 'NAT traffic exiting this interface (and bridged peers)',
                bodyAlign: 'start',
                hidden: true,
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
                bind: {
                    checked: '{interface.natIngress}',
                    hidden: '{interface.wan}'
                }
            }]
            /**
             * IPv4 settings end
             */

        }, {

            /**
             * IPv6 settings
             */
            xtype: 'formpanel',
            itemId: 'ipv6',
            validateOnSync: true,
            layout: 'vbox',
            items: [{
                xtype: 'selectfield',
                name: 'v6ConfigType',
                label: 'Config Type'.t(),
                editable: false,
                bind: {
                    value: '{interface.v6ConfigType}',
                    options: '{ipv6ConfigTypes}'
                }
            }, {

                /**
                 * IPv6 STATIC config
                 * - v6StaticAddress
                 * - v6StaticPrefix
                 * - v6StaticGateway
                 * - v6StaticDNS1
                 * - v6StaticDNS2
                 */
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
                    xtype: 'textfield',
                    name: 'v6StaticAddress',
                    label: 'Address'.t(),
                    errorLabel: 'IPv6 Static Address'.t(),
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticAddress}',
                        required: '{interface.v6ConfigType === "STATIC"}'
                    },
                    validators: 'ipv6'
                }, {
                    xtype: 'numberfield',
                    name: 'v6StaticPrefix',
                    label: 'Prefix Length'.t(),
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticPrefix}',
                        required: '{interface.v6ConfigType === "STATIC"}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'v6StaticGateway',
                    label: 'Gateway'.t(),
                    hidden: true,
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticGateway}',
                        hidden: '{!interface.wan}', // ????
                        required: '{interface.wan && interface.v6ConfigType === "STATIC"}'
                    },
                    validators: 'ipv6'
                }, {
                    xtype: 'textfield',
                    name: 'v6StaticDNS1',
                    label: 'Primary DNS'.t(),
                    hidden: true,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticDNS1}',
                        hidden: '{!interface.wan}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'v6StaticDNS2',
                    label: 'Secondary DNS'.t(),
                    hidden: true,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticDNS2}',
                        hidden: '{!interface.wan}'
                    }
                }]
                /**
                 * IPv6 STATIC config end
                 */

            }, {

                /**
                 * IPv6 ASSIGN config
                 * - v6AssignHint
                 * - v6AssignPrefix
                 */
                xtype: 'container',
                layout: 'vbox',
                defaults: {
                    labelAlign: 'top',
                },
                hidden: true,
                bind: { hidden: '{interface.v6ConfigType !== "ASSIGN"}' },
                items: [{
                    xtype: 'textfield',
                    name: 'v6AssignHint',
                    label: 'Assign Hint'.t(),
                    errorLabel: 'IPv6 Assign Hint'.t(),
                    required: false,
                    autoComplete: false,
                    clearable: false,
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
                    clearable: false,
                    autoComplete: false,
                    decimals: 0,
                    minValue: 1,
                    maxValue: 128,
                    required: false,
                    allowBlank: true,
                    bind: {
                        value: '{interface.v6AssignPrefix}',
                        required: '{interface.v6ConfigType === "ASSIGN"}'
                    }
                }]
                /**
                 * IPv6 ASSIGN config end
                 */

            }, {

                /**
                 * IPv6 DHCP config
                 * ! not defined or no more configs
                 */
                xtype: 'container',
                layout: 'vbox',
                padding: '16, 0',
                hidden: true,
                bind: { hidden: '{interface.v6ConfigType !== "DHCP"}' },
                html: 'DHCP conf ...'
                /**
                 * IPv6 DHCP config end
                 */

            }, {

                /**
                 * IPv6 SLAAC config
                 * ! not defined or no more configs
                 */
                xtype: 'container',
                layout: 'vbox',
                padding: '16, 0',
                hidden: true,
                bind: { hidden: '{interface.v6ConfigType !== "SLAAC"}' },
                html: 'SLAAC conf ...'
                /**
                 * IPv6 SLAAC config end
                 */

            }],
            /**
             * IPv6 settings end
             */

        }, {

            /**
             * DHCP settings
             * - dhcpEnabled
             * - dhcpRangeStart
             * - dhcpRangeEnd
             * - dhcpLeaseDuration
             * - dhcpGatewayOverride
             * - dhcpPrefixOverride
             * - dhcpDNSOverride
             */
            xtype: 'formpanel',
            itemId: 'dhcp',
            validateOnSync: true,
            layout: 'vbox',
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'checkbox',
                name: 'dhcpEnabled',
                boxLabel: 'Enable DHCP Serving',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.dhcpEnabled}',
                }
            }, {
                xtype: 'textfield',
                name: 'dhcpRangeStart',
                label: 'Range Start'.t(),
                clearable: false,
                required: false,
                hidden: true,
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
                clearable: false,
                width: 100,
                bind: {
                    value: '{interface.dhcpLeaseDuration}',
                    hidden: '{!interface.dhcpEnabled}'
                }
            }, {
                xtype: 'textfield',
                name: 'dhcpGatewayOverride',
                label: 'Gateway Override'.t(),
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.dhcpGatewayOverride}',
                    hidden: '{!interface.dhcpEnabled}'
                }
            }, {
                xtype: 'selectfield',
                name: 'dhcpPrefixOverride',
                label: 'Netmask Override'.t(),
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.dhcpPrefixOverride}',
                    hidden: '{!interface.dhcpEnabled}',
                },
                options: Map.options.prefixes
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
            /**
             * DHCP settings end
             */

        }, {

            /**
             * VRRP settings
             * - vrrpEnabled
             * - vrrpID
             * - vrrpPriority
             */
            xtype: 'formpanel',
            itemId: 'vrrp',
            validateOnSync: true,
            layout: 'vbox',
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'checkbox',
                name: 'vrrpEnabled',
                boxLabel: 'Enable VRRP',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.vrrpEnabled}',
                }
            }, {
                xtype: 'numberfield',
                name: 'vrrpID',
                label: 'VRRP ID'.t(),
                required: false,
                clearable: false,
                autoComplete: false,
                hidden: true,
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
                clearable: false,
                autoComplete: false,
                hidden: true,
                bind: {
                    value: '{interface.vrrpPriority}',
                    required: '{interface.vrrpEnabled}',
                    hidden: '{!interface.vrrpEnabled}'
                }
            }],
            /**
             * VRRP settings end
             */

        }, {

            /**
             * WIFI settings
             * - wirelessSsid
             * - wirelessEncryption
             * - wirelessPassword
             * - wirelessMode
             * - wirelessChannel
             */
            xtype: 'formpanel',
            itemId: 'wifi',
            validateOnSync: true,
            layout: 'vbox',
            defaults: {
                labelAlign: 'top'
            },
            disabled: true,
            bind: {
                disabled: '{interface.type !== "WIFI"}'
            },
            items: [{
                xtype: 'textfield',
                name: 'wirelessSsid',
                label: 'Wireless SSID'.t(),
                clearable: false,
                required: true,
                bind: {
                    value: '{interface.wirelessSsid}',
                    required: '{interface.type === "WIFI"}'
                }
            }, {
                xtype: 'selectfield',
                name: 'wirelessEncryption',
                label: 'Wireless Encryption'.t(),
                required: true,
                clearable: false,
                autoSelect: true,
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
                required: true,
                bind: {
                    value: '{interface.wirelessPassword}',
                    required: '{interface.type === "WIFI"}'
                },
                validators: [{
                    type: 'length',
                    min: 8
                }]
            }, {
                xtype: 'selectfield',
                name: 'wirelessMode',
                label: 'Wireless Mode'.t(),
                bind: '{interface.wirelessMode}',
                autoSelect: true,
                clearable: false,
                options: [
                    { text: 'AP'.t(), value: 'AP' },
                    { text: 'Client'.t(), value: 'CLIENT' }
                ]
            }, {
                xtype: 'numberfield',
                name: 'wirelessChannel',
                label: 'Wireless Channel'.t(),
                clearable: false,
                bind: '{interface.wirelessChannel}'
            }]
            /**
             * WIFI settings end
             */

        }, {

            /**
             * QoS settings:
             * - qosEnabled
             * - downloadKbps
             * - uploadKbps
             */
            xtype: 'formpanel',
            itemId: 'qos',
            validateOnSync: true,
            layout: 'vbox',
            defaults: {
                labelAlign: 'top',
            },
            items: [{
                xtype: 'checkbox',
                name: 'qosEnabled',
                boxLabel: 'Enable QoS',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.qosEnabled}',
                }
            }, {
                xtype: 'numberfield',
                name: 'downloadKbps',
                label: 'Download Kbps'.t(),
                required: false,
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.downloadKbps}',
                    required: '{interface.qosEnabled}',
                    hidden: '{!interface.qosEnabled}'
                }
            }, {
                xtype: 'numberfield',
                name: 'uploadKbps',
                label: 'Upload Kbps'.t(),
                required: false,
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.uploadKbps}',
                    required: '{interface.qosEnabled}',
                    hidden: '{!interface.qosEnabled}'
                }
            }]
            /**
             * QoS settings end
             */

        }, {
            /**
             * Interface is bridged card
             */
            xtype: 'container',
            itemId: 'bridged',
            layout: 'center',
            items: [{
                xtype: 'component',
                html: '<h1 style="font-weight: 100;">Interface is Bridged!</h1>'
            }]
        }, {
            /**
             * Interface is disabled card
             */
            xtype: 'container',
            itemId: 'disabled',
            layout: 'center',
            items: [{
                xtype: 'component',
                html: '<h1 style="font-weight: 100;">Interface is Disabled!</h1>'
            }]
        }, {

            /**
             * IPv4 Aliases
             */
            xtype: 'container',
            layout: 'fit',
            itemId: 'ipv4aliases',
            padding: 0,
            items: [{
                xtype: 'grid',
                itemId: 'v4Aliases',
                bind: '{interface.v4Aliases}',
                selectable: false,
                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                rowLines: false,
                deferEmptyText: false,
                emptyText: 'No IPv4 Aliases',
                columns: [{
                    text: 'Address'.t(),
                    dataIndex: 'v4Address',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                        tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                    },
                    renderer: function (value) {
                        return value || '<em>click to edit ...</em>';
                    },
                    editable: true,
                    editor: {
                        xtype: 'textfield',
                        required: true,
                        clearable: false,
                        validators: 'ipv4'
                    }
                }, {
                    text: 'Netmask/Prefix'.t(),
                    dataIndex: 'v4Prefix',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                    },
                    renderer: function (value) {
                        return Map.prefixes[value];
                    },
                    editable: true,
                    editor: {
                        xtype: 'selectfield',
                        editable: false,
                        clearable: false,
                        options: Map.options.prefixes
                    }
                }, {
                    width: 44,
                    resizable: false,
                    menuDisabled: true,
                    cell: {
                        tools: [{
                            type: 'delete',
                            iconCls: 'md-icon-close',
                            handler: function (grid, info) {
                                grid.getStore().remove(info.record);
                            }
                        }]
                    }
                }]
            }, {
                xtype: 'formpanel',
                layout: 'vbox',
                docked: 'bottom',
                margin: '0 0 16 0',
                items: [{
                    xtype: 'component',
                    style: 'border-top: 1px #EEE solid',
                    html: '<h3>New IPv4 Alias</h3>'
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    defaults: {
                        labelAlign: 'top',
                        required: true,
                        clearable: false,
                        autoComplete: false
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'v4Address',
                        label: 'Address',
                        placeholder: 'enter address ...',
                        flex: 1,
                        validators: 'ipv4'
                    }, {
                        xtype: 'selectfield',
                        name: 'v4Prefix',
                        label: 'Prefix',
                        placeholder: 'select prefix ...',
                        margin: '0 16',
                        flex: 1,
                        value: 24,
                        options: Map.options.prefixes
                    }, {
                        xtype: 'button',
                        text: 'Add',
                        ui: 'action',
                        handler: 'addV4Alias'
                    }]
                }]
            }]
            /**
             * IPv4 Aliases end
             */

        }, {

            /**
             * IPv6 Aliases
             */
            xtype: 'container',
            layout: 'fit',
            itemId: 'ipv6aliases',
            padding: 0,
            items: [{
                xtype: 'grid',
                itemId: 'v6Aliases',
                bind: '{interface.v6Aliases}',
                selectable: false,
                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                rowLines: false,
                deferEmptyText: false,
                emptyText: 'No IPv6 Aliases',
                columns: [{
                    text: 'Address'.t(),
                    dataIndex: 'v6Address',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                        tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                    },
                    renderer: function (value) {
                        return value || '<em>click to edit ...</em>';
                    },
                    editable: true,
                    editor: {
                        xtype: 'textfield',
                        required: true,
                        clearable: false,
                        validators: 'ipv6'
                    }
                }, {
                    text: 'Netmask/Prefix'.t(),
                    dataIndex: 'v6Prefix',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                    },
                    renderer: function (value) {
                        return Map.prefixes[value];
                    },
                    editable: true,
                    editor: {
                        xtype: 'selectfield',
                        editable: false,
                        clearable: false,
                        options: Map.options.prefixes
                    }
                }, {
                    width: 44,
                    resizable: false,
                    menuDisabled: true,
                    cell: {
                        tools: [{
                            type: 'delete',
                            iconCls: 'md-icon-close',
                            handler: function (grid, info) {
                                grid.getStore().remove(info.record);
                            }
                        }]
                    }
                }]
            }, {
                xtype: 'formpanel',
                layout: 'vbox',
                docked: 'bottom',
                margin: '0 0 16 0',
                items: [{
                    xtype: 'component',
                    style: 'border-top: 1px #EEE solid',
                    html: '<h3>New IPv6 Alias</h3>'
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    defaults: {
                        labelAlign: 'top',
                        required: true,
                        clearable: false,
                        autoComplete: false
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'v6Address',
                        label: 'Address',
                        placeholder: 'enter address ...',
                        flex: 1,
                        validators: 'ipv6'
                    }, {
                        xtype: 'selectfield',
                        name: 'v6Prefix',
                        label: 'Prefix',
                        placeholder: 'select prefix ...',
                        margin: '0 16',
                        flex: 1,
                        value: 24,
                        options: Map.options.prefixes
                    }, {
                        xtype: 'button',
                        text: 'Add',
                        ui: 'action',
                        handler: 'addV6Alias'
                    }]
                }]
            }]
            /**
             * IPv6 Aliases end
             */
        }, {

            /**
             * DHCP options
             */
            xtype: 'container',
            layout: 'fit',
            itemId: 'dhcpoptions',
            padding: 0,
            items: [{
                xtype: 'grid',
                itemId: 'dhcpOptions',
                bind: '{interface.dhcpOptions}',
                selectable: false,
                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                rowLines: false,
                deferEmptyText: false,
                emptyText: 'No DHCP Options',
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
                    editable: true
                }, {
                    width: 44,
                    resizable: false,
                    menuDisabled: true,
                    cell: {
                        tools: [{
                            type: 'delete',
                            iconCls: 'md-icon-close',
                            handler: function (grid, info) {
                                grid.getStore().remove(info.record);
                            }
                        }]
                    }
                }]
            }, {
                xtype: 'formpanel',
                layout: 'vbox',
                docked: 'bottom',
                margin: '0 0 16 0',
                items: [{
                    xtype: 'component',
                    style: 'border-top: 1px #EEE solid',
                    html: '<h3>New Option</h3>'
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    defaults: {
                        labelAlign: 'top',
                        required: true,
                        clearable: false,
                        autoComplete: false
                    },
                    items: [{
                        xtype: 'hiddenfield',
                        name: 'enabled',
                        value: true
                    }, {
                        xtype: 'textfield',
                        name: 'description',
                        label: 'Description',
                        placeholder: 'enter description ...',
                        flex: 1
                    }, {
                        xtype: 'textfield',
                        name: 'value',
                        label: 'Value',
                        placeholder: 'enter value ...',
                        margin: '0 16',
                        width: 100
                    }, {
                        xtype: 'button',
                        text: 'Add',
                        ui: 'action',
                        handler: 'addDhcpOption'
                    }]
                }]
            }]
            /**
             * DHCP options end
             */

        }, {

            /**
             * VRRP v4 Aliases
             */
            xtype: 'container',
            layout: 'fit',
            itemId: 'vrrpv4aliases',
            padding: 0,
            items: [{
                xtype: 'grid',
                itemId: 'vrrpv4Aliases',
                bind: '{interface.vrrpV4Aliases}',
                selectable: false,
                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                rowLines: false,
                deferEmptyText: false,
                emptyText: 'No IPv4 VRRP Aliases',
                columns: [{
                    text: 'Address'.t(),
                    dataIndex: 'v4Address',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                        tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                    },
                    renderer: function (value) {
                        return value || '<em>click to edit ...</em>';
                    },
                    editable: true,
                    editor: {
                        xtype: 'textfield',
                        required: true,
                        clearable: false,
                        validators: 'ipv4'
                    }
                }, {
                    text: 'Netmask/Prefix'.t(),
                    dataIndex: 'v4Prefix',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                    },
                    renderer: function (value) {
                        return Map.prefixes[value];
                    },
                    editable: true,
                    editor: {
                        xtype: 'selectfield',
                        editable: false,
                        clearable: false,
                        options: Map.options.prefixes
                    }
                }, {
                    width: 44,
                    resizable: false,
                    menuDisabled: true,
                    cell: {
                        tools: [{
                            type: 'delete',
                            iconCls: 'md-icon-close',
                            handler: function (grid, info) {
                                grid.getStore().remove(info.record);
                            }
                        }]
                    }
                }]
            }, {
                xtype: 'formpanel',
                layout: 'vbox',
                docked: 'bottom',
                margin: '0 0 16 0',
                items: [{
                    xtype: 'component',
                    style: 'border-top: 1px #EEE solid',
                    html: '<h3>New IPv4 VRRP Alias</h3>'
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    defaults: {
                        labelAlign: 'top',
                        required: true,
                        autoComplete: false,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'v4Address',
                        label: 'Address',
                        placeholder: 'enter address ...',
                        flex: 1,
                        validators: 'ipv4'
                    }, {
                        xtype: 'selectfield',
                        name: 'v4Prefix',
                        label: 'Prefix',
                        placeholder: 'select prefix ...',
                        margin: '0 16',
                        flex: 1,
                        value: 24,
                        options: Map.options.prefixes
                    }, {
                        xtype: 'button',
                        text: 'Add',
                        ui: 'action',
                        handler: 'addVrrpAlias'
                    }]
                }]
            }]
            /**
             * VRRP v4 Aliases end
             */
        }, {

            /**
             * OpenVPN config file
             */
            xtype: 'formpanel',
            validateOnSync: true,
            layout: 'vbox',
            itemId: 'openvpnconf',
            // padding: 0,
            items: [{
                xtype: 'containerfield',
                margin: '0 0 16 0',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'filefield',
                    flex: 1,
                    placeholder: 'Select a file',
                    // label: 'OpenVPN config file',
                    listeners: {
                        change: 'onFileChange'
                    }
                }, {
                    xtype: 'checkbox',
                    reference: 'inlineEdit',
                    // label: '&nbsp',
                    boxLabel: 'Inline Edit',
                    margin: '0 0 0 16',
                    // hidden: true,
                    checked: false,
                    // bind: {
                    //     hidden: '{!confFileSet}'
                    // }
                }]
            }, {
                xtype: 'textareafield',
                itemId: 'openvpnConfContent',
                cls: 'file-upload',
                flex: 1,
                autoCorrect: false,
                editable: false,
                focusable: false,
                placeholder: 'Select a file ...',
                required: true,
                bind: {
                    userCls: '{inlineEdit.checked ? "editable" : ""}',
                    editable: '{inlineEdit.checked}'
                }
            }]
            /**
             * OpenVPN config file end
             */
        }, {

            /**
             * OpenVPN auth credentials
             * - openvpnUsernamePasswordEnabled
             * - openvpnUsername
             * - openvpnPasswordBase64
             */
            xtype: 'formpanel',
            itemId: 'openvpnauth',
            validateOnSync: true,
            layout: 'vbox',
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'checkbox',
                name: 'openvpnUsernamePasswordEnabled',
                boxLabel: 'Requires authentication',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.openvpnUsernamePasswordEnabled}',
                }
            }, {
                xtype: 'textfield',
                label: 'OpenVPN Username',
                clearable: false,
                required: false,
                disabled: true,
                bind: {
                    value: '{interface.openvpnUsername}',
                    required: '{interface.openvpnUsernamePasswordEnabled}',
                    disabled: '{!interface.openvpnUsernamePasswordEnabled}',
                    hidden: '{!interface.openvpnUsernamePasswordEnabled}'
                }
            }, {
                xtype: 'textfield',
                label: 'OpenVPN Password',
                itemId: 'openvpnPassword',
                clearable: false,
                required: false,
                disabled: true,
                bind: {
                    required: '{interface.openvpnUsernamePasswordEnabled}',
                    disabled: '{!interface.openvpnUsernamePasswordEnabled}',
                    hidden: '{!interface.openvpnUsernamePasswordEnabled}'
                }
            }]
            /**
             * OpenVPN auth credentials
             */

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
            var me = this,
                vm = view.getViewModel(),
                treelist = view.down('treelist'),
                intf = view.getInterface(), type, configType;

            me.setTreeListStore();

            /**
             * ! empty node text turns hidden
             */
            vm.bind('{interface}', function (intf) {
                if (configType === intf.get('configType')) {
                    return;
                }

                type = intf.get('type'),
                configType = intf.get('configType');

                if (type === 'OPENVPN') {
                    treelist.getStore().each(function (node) {
                        if (node.get('key') !== 'openvpnconf' &&
                            node.get('key') !== 'openvpnauth' &&
                            node.get('key') !== 'qos') {
                            node.set('text', '');
                        } else {
                            node.set('text', node.get('lbl'));
                        }
                    });
                    treelist.setSelection(treelist.getStore().findNode('key', 'openvpnconf'));

                    if (intf.getOpenvpnConfFile().get('contents')) {
                        view.down('#openvpnConfContent').setValue(atob(intf.getOpenvpnConfFile().get('contents')));
                    }
                    if (intf.get('openvpnPasswordBase64')) {
                        view.down('#openvpnPassword').setValue(atob(intf.get('openvpnPasswordBase64')));
                    }
                }

                if (type === 'WIFI') {
                    treelist.getStore().each(function (node) {
                        if (node.get('key') !== 'wifi') {
                            node.set('text', '');
                        } else {
                            node.set('text', node.get('lbl'));
                        }
                    });
                    treelist.setSelection(treelist.getStore().findNode('key', 'wifi'));
                }

                if (type === 'NIC') {
                    treelist.getStore().each(function (node) {
                        if (node.get('key') === 'wifi' ||
                            node.get('key') === 'openvpnconf' ||
                            node.get('key') === 'openvpnauth') {
                            node.set('text', '');
                        } else {
                            node.set('text', node.get('text') || node.get('lbl'));
                        }
                    });
                    treelist.setSelection(treelist.getStore().findNode('key', 'ipv4'));
                }

                if (configType === 'BRIDGED') {
                    // if (type === 'OPENVPN') {
                    //     return;
                    // }
                    if (type === 'WIFI') {
                        treelist.setSelection(treelist.getStore().findNode('key', 'wifi'));
                    } else {
                        treelist.setSelection(treelist.getStore().findNode('key', 'bridged'));
                    }
                }

                if (configType === 'DISABLED') {
                    treelist.setSelection(treelist.getStore().findNode('key', 'disabled'));
                }
            }, me, {
                deep: true
            });

            vm.set({
                interface: intf,
                action: intf ? 'EDIT' : 'ADD'
            });
        },


        /**
         * based on application context (admin or setup) or interface type
         * there are different settings available or not
         */
        setTreeListStore: function () {
            var me = this,
                treelist = me.getView().down('treelist'),
                adminStore = {
                    root: {
                        expanded: true,
                        children: [{
                            lbl: 'IPv4',
                            key: 'ipv4',
                            children: [{
                                text: 'Aliases',
                                key: 'ipv4aliases',
                                leaf: true
                            }]
                        }, {
                            lbl: 'IPv6',
                            key: 'ipv6',
                            children: [{
                                text: 'Aliases',
                                key: 'ipv6aliases',
                                leaf: true
                            }]
                        }, {
                            lbl: 'DHCP',
                            key: 'dhcp',
                            children: [{
                                text: 'Options',
                                key: 'dhcpoptions',
                                leaf: true
                            }]
                        }, {
                            lbl: 'VRRP',
                            key: 'vrrp',
                            children: [{
                                text: 'IPv4 Aliases',
                                key: 'vrrpv4aliases',
                                leaf: true
                            }]
                        }, {
                            lbl: 'WIFI',
                            key: 'wifi',
                            leaf: true
                        }, {
                            lbl: 'OpenVPN Conf',
                            key: 'openvpnconf',
                            leaf: true
                        }, {
                            lbl: 'Authentication',
                            key: 'openvpnauth',
                            leaf: true
                        }, {
                            lbl: 'QoS',
                            key: 'qos',
                            leaf: true
                        }, {
                            key: 'bridged',
                            hidden: true,
                            leaf: true
                        }, {
                            key: 'disabled',
                            hidden: true,
                            leaf: true
                        }]
                    }
                },
                setupStore = {
                    root: {
                        expanded: true,
                        children: [{
                            lbl: 'IPv4',
                            key: 'ipv4',
                            leaf: true
                        }, {
                            lbl: 'IPv6',
                            key: 'ipv6',
                            leaf: true
                        }, {
                            lbl: 'WIFI',
                            key: 'wifi',
                            leaf: true
                        }, {
                            lbl: 'OpenVPN Conf',
                            key: 'openvpnconf',
                            leaf: true
                        }, {
                            lbl: 'Authentication',
                            key: 'openvpnauth',
                            leaf: true
                        }, {
                            key: 'bridged',
                            hidden: true,
                            leaf: true
                        }, {
                            key: 'disabled',
                            hidden: true,
                            leaf: true
                        }]
                    }
                };

            if (Mfw.app.context === 'admin') {
                treelist.setStore(adminStore);
            }

            if (Mfw.app.context === 'setup') {
                treelist.setStore(setupStore);
            }
        },


        addV4Alias: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                grid = me.getView().down('#v4Aliases');

            if (!form.validate()) { return; }

            grid.getStore().add(form.getValues());
            form.reset(true);
        },

        addV6Alias: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                grid = me.getView().down('#v6Aliases');

            if (!form.validate()) { return; }

            grid.getStore().add(form.getValues());
            form.reset(true);
        },

        addDhcpOption: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                grid = me.getView().down('#dhcpOptions');


            if (!form.validate()) { return; }

            grid.getStore().add(form.getValues());
            form.reset(true);
        },

        addVrrpAlias: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                grid = me.getView().down('#vrrpv4Aliases');

            if (!form.validate()) { return; }

            grid.getStore().add(form.getValues());
            form.reset(true);
        },

        /**
         * for each section there is a form
         * if any of those form are invalid, the view will switch to that form to highlight fields
         */
        onSubmit: function () {
            var me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                treelist = view.down('treelist'),
                interface = vm.get('interface'),
                interfacesStore = Ext.getStore('interfaces'),
                forms = me.getView().query('formpanel'),
                invalidForm;

            // find any invalid form
            Ext.Array.each(forms, function (form) {
                if (!form.validateOnSync || invalidForm) { return; }

                if (!form.validate()) {
                    invalidForm = form;
                }
            });

            // switch to invalid form except if it's the main top form (always visible)
            if (invalidForm && invalidForm.getItemId() !== 'main') {
                treelist.setSelection(treelist.getStore().findNode('key', invalidForm.getItemId()));
                Ext.toast('Please fill or correct invalid fields!', 3000);
                return;
            }

            /**
             * for OPENVPN interfaces set conf file and password if needed
             */
            if (interface.get('type') === 'OPENVPN') {
                var ovpnConfFile = Ext.create('Mfw.model.OpenVpnConfFile', {
                    encoding: 'base64',
                    contents: btoa(view.down('#openvpnConfContent').getValue())
                });
                interface.setOpenvpnConfFile(ovpnConfFile);
                if (interface.get('openvpnUsernamePasswordEnabled')) {
                    interface.set('openvpnPasswordBase64', btoa(view.down('#openvpnPassword').getValue()));
                } else {
                    interface.set('openvpnPasswordBase64', null);
                }
            }

            Sync.progress();

            interface.commit();
            interfacesStore.each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            interfacesStore.sync({
                success: function () {
                    Sync.success();
                    me.getView().close();
                },
                failure: function () {
                    console.warn('Unable to save interfaces!');
                }
            });
        }
    }
});
