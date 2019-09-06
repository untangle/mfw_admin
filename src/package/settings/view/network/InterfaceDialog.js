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
                    { text: 'Bridged',   value: 'BRIDGED' }
                ];
                if (get('interface.type') === 'OPENVPN') {
                    options = [
                        { text: 'Addressed', value: 'ADDRESSED' }
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
                        { text: 'Static',   value: 'STATIC' },
                        { text: 'DHCP', value: 'DHCP' },
                        { text: 'SLAAC', value: 'SLAAC' },
                        { text: 'Disabled',  value: 'DISABLED' }
                    ];
                } else {
                    options = [
                        { text: 'Static',   value: 'STATIC' },
                        { text: 'Assign', value: 'ASSIGN' },
                        { text: 'Disabled',  value: 'DISABLED' }
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
                        intf.get('configType') === 'ADDRESSED') {
                            interfaces.push({
                                text: intf.get('name'),
                                value: intf.get('interfaceId')
                            });
                        }
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
            },

            v4StaticPrefixOverridePlaceholder: function (get) {
                return Map.prefixes[get('interface.v4StaticPrefix')];
            }
        }
    },

    config: {
        interface: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} Interface ({interface.type})',
    },
    width: 700,
    height: 700,
    draggable: false,
    responsiveConfig: { large: { maximized: false }, small: { maximized: true } },

    padding: 0,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    tools: [{
        xtype: 'togglefield',
        bind: {
            boxLabel: '<strong>{interface.enabled ? "Enabled" : "Disabled"}</strong>',
            value: '{interface.enabled}'
        }
    }],

    items: [{
        xtype: 'container',
        docked: 'top',
        shadow: true,
        zIndex: 10,
        items: [{
            xtype: 'formpanel',
            itemId: 'main',
            validateOnSync: true,
            padding: '0 8 24 8',
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
                label: 'Config Type',
                width: 150,
                required: true,
                hidden: true,
                bind: {
                    value: '{interface.configType}',
                    options: '{configTypes}',
                    required: '{interface.type !== "WWAN"}',
                    hidden: '{interface.type === "WWAN"}'
                }
            }, {
                xtype: 'selectfield',
                label: 'Bridged To',
                flex: 1,
                placeholder: 'Select bridge ...',
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
                label: 'Bound to',
                flex: 1,
                required: true,
                displayTpl: '{text} [ {value} ]',
                itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                hidden: true,
                bind: {
                    value: '{interface.openvpnBoundInterfaceId}',
                    hidden: '{interface.type !== "OPENVPN" || !interface.enabled}',
                    required: '{interface.type === "OPENVPN"}',
                    options: '{boundOptions}'
                }
            }, {
                xtype: 'checkbox',
                boxLabel: 'Is WAN',
                bodyAlign: 'start',
                flex: 1,
                hidden: true,
                disabled: false,
                bind: {
                    checked: '{interface.wan}',
                    hidden: '{interface.configType !== "ADDRESSED"}',
                    disabled: '{interface.type === "OPENVPN"}'
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
        userCls: 'no-icons shrink',
        scrollable: true,
        ui: 'nav',
        docked: 'left',
        width: 200,
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
            hidden: '{(interface.configType !== "ADDRESSED" && interface.type !== "WIFI" && interface.type !== "WWAN")}'
        }
        /**
         * setting navigation tree end
         */

    }, {

        /**
         * card layout panel holding each section with following itemIds:
         * - ipv4
         * - ipv6
         * - dhcp
         * - vrrp
         * - wifi
         * - qos
         * - bridged
         * - disabled
         */
        xtype: 'panel',
        layout: {
            type: 'card',
            deferRender: false
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
                label: 'Config Type',
                labelAlign: 'top',
                required: true,
                // disabled: true,
                // hidden: true,
                bind: {
                    value: '{interface.v4ConfigType}',
                    required: '{interface.configType === "ADDRESSED" && interface.type !== "OPENVPN" && interface.type !== "WWAN"}'
                    // disabled: '{!interface.wan}',
                    // hidden: '{interface.type === "OPENVPN"}'
                },
                options: [
                    { text: 'Auto (DHCP)', value: 'DHCP' },
                    { text: 'Static',   value: 'STATIC' },
                    { text: 'PPPoE',  value: 'PPPOE' }
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
                scrollable: true,
                items: [{
                    xtype: 'textfield',
                    label: 'Address',
                    errorLabel: 'IPv4 Static Address',
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v4StaticAddress}',
                        required: '{interface.configType === "ADDRESSED" && interface.v4ConfigType === "STATIC"}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'selectfield',
                    label: 'Netmask/Prefix',
                    clearable: false,
                    required: false,
                    bind: {
                        value: '{interface.v4StaticPrefix}',
                        required: '{interface.configType === "ADDRESSED" && interface.v4ConfigType === "STATIC"}'
                    },
                    options: Map.options.prefixes
                }, {
                    xtype: 'textfield',
                    label: 'Gateway',
                    errorLabel: 'IPv4 Static Gateway',
                    hidden: true,
                    required: false,
                    bind: {
                        value: '{interface.v4StaticGateway}',
                        hidden: '{!interface.wan}', // ????
                        required: '{interface.wan && interface.configType === "ADDRESSED" && interface.v4ConfigType === "STATIC"}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'textfield',
                    label: 'Primary DNS',
                    hidden: true,
                    bind: {
                        value: '{interface.v4StaticDNS1}',
                        hidden: '{!interface.wan}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Secondary DNS',
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
                flex: 1,
                margin: '8 0 0 0',
                defaults: {
                    labelAlign: 'top'
                },
                hidden: true,
                bind: { hidden: '{interface.v4ConfigType !== "DHCP"}' },
                scrollable: true,
                items: [{
                    xtype: 'component',
                    margin: '16 0 8 0',
                    html: '<span style="font-size: 14px; font-weight: 100;">Override Defaults (optional)</span>'
                }, {
                    xtype: 'textfield',
                    label: 'Address Override',
                    bind: {
                        value: '{interface.v4DhcpAddressOverride}',
                        placeholder: '{interface.v4StaticAddress}'
                    }
                }, {
                    xtype: 'selectfield',
                    label: 'Netmask Override',
                    clearable: false,
                    bind: {
                        value: '{interface.v4DhcpPrefixOverride}',
                        placeholder: '{v4StaticPrefixOverridePlaceholder}'
                    },
                    options: Map.options.prefixes
                }, {
                    xtype: 'textfield',
                    label: 'Gateway Override',
                    bind: {
                        value: '{interface.v4DhcpGatewayOverride}',
                        placeholder: '{interface.v4StaticGateway}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'textfield',
                    label: 'Primary DNS Override',
                    bind: {
                        value: '{interface.v4DhcpDNS1Override}',
                        placeholder: '{interface.v4StaticDNS1}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Secondary DNS Override',
                    bind: {
                        value: '{interface.v4DhcpDNS2Override}',
                        placeholder: '{interface.v4StaticDNS2}'
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
                flex: 1,
                defaults: {
                    labelAlign: 'top',
                },
                hidden: true,
                bind: { hidden: '{interface.v4ConfigType !== "PPPOE"}' },
                scrollable: true,
                items: [{
                    xtype: 'textfield',
                    label: 'Username',
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v4PPPoEUsername}',
                        required: '{interface.configType === "ADDRESSED" && interface.v4ConfigType === "PPPOE"}'
                    }
                }, {
                    xtype: 'passwordfield',
                    label: 'Password',
                    clearable: false,
                    required: false,
                    bind: {
                        value: '{interface.v4PPPoEPassword}',
                        required: '{interface.configType === "ADDRESSED" && interface.v4ConfigType === "PPPOE"}'
                    },
                    validators: [{
                        type: 'length',
                        min: 6
                    }]
                }, {
                    xtype: 'checkbox',
                    boxLabel: 'Use Peer DNS',
                    margin: '16 0 0 0',
                    bodyAlign: 'left',
                    bind: '{interface.v4PPPoEUsePeerDNS}',
                }, {
                    xtype: 'textfield',
                    label: 'Primary DNS',
                    disabled: true,
                    hidden: true,
                    bind: {
                        value: '{interface.v4PPPoEOverrideDNS1}',
                        disabled: '{interface.v4PPPoEUsePeerDNS}',
                        hidden: '{interface.v4PPPoEUsePeerDNS}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Secondary DNS',
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
                xtype: 'checkbox',
                boxLabel: 'NAT traffic exiting this interface (and bridged peers)',
                bodyAlign: 'start',
                hidden: true,
                bind: {
                    checked: '{interface.natEgress}',
                    hidden: '{!interface.wan}'
                }
            }, {
                xtype: 'checkbox',
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
                label: 'Config Type',
                labelAlign: 'top',
                required: true,
                bind: {
                    value: '{interface.v6ConfigType}',
                    options: '{ipv6ConfigTypes}',
                    required: '{interface.configType === "ADDRESSED" && interface.type !== "OPENVPN" && interface.type !== "WWAN"}'
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
                    label: 'Address',
                    errorLabel: 'IPv6 Static Address',
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticAddress}',
                        required: '{interface.configType === "ADDRESSED" && interface.v6ConfigType === "STATIC"}'
                    },
                    validators: 'ipv6'
                }, {
                    xtype: 'numberfield',
                    label: 'Prefix Length',
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticPrefix}',
                        required: '{interface.configType === "ADDRESSED" && interface.v6ConfigType === "STATIC"}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Gateway',
                    hidden: true,
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticGateway}',
                        hidden: '{!interface.wan}', // ????
                        required: '{interface.wan && interface.configType === "ADDRESSED" && interface.v6ConfigType === "STATIC"}'
                    },
                    validators: 'ipv6'
                }, {
                    xtype: 'textfield',
                    label: 'Primary DNS',
                    hidden: true,
                    clearable: false,
                    bind: {
                        value: '{interface.v6StaticDNS1}',
                        hidden: '{!interface.wan}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Secondary DNS',
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
                flex: 1,
                layout: 'vbox',
                defaults: {
                    labelAlign: 'top',
                },
                hidden: true,
                bind: { hidden: '{interface.v6ConfigType !== "ASSIGN"}' },
                items: [{
                    xtype: 'textfield',
                    label: 'Assign Hint',
                    errorLabel: 'IPv6 Assign Hint',
                    required: false,
                    autoComplete: false,
                    clearable: false,
                    bind: {
                        value: '{interface.v6AssignHint}',
                        required: '{interface.configType === "ADDRESSED" && interface.v6ConfigType === "ASSIGN"}'
                    }
                }, {
                    xtype: 'numberfield',
                    label: 'Assign Prefix',
                    errorLabel: 'IPv6 Assign Prefix',
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
                        required: '{interface.configType === "ADDRESSED" && interface.v6ConfigType === "ASSIGN"}'
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
                flex: 1,
                layout: 'vbox',
                padding: '16, 0',
                hidden: true,
                bind: { hidden: '{interface.v6ConfigType !== "DHCP"}' },
                defaults: {
                    labelAlign: 'top',
                    clearable: false
                },
                items: [{
                    xtype: 'component',
                    margin: '16 0 8 0',
                    html: '<span style="font-size: 14px; font-weight: 100;">Override Defaults (optional)</span>'
                }, {
                    xtype: 'textfield',
                    label: 'Primary DNS Override',
                    bind: {
                        value: '{interface.v6DhcpDNS1Override}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Secondary DNS Override',
                    bind: {
                        value: '{interface.v6DhcpDNS2Override}'
                    }
                }]
                /**
                 * IPv6 DHCP config end
                 */

            }, {

                /**
                 * IPv6 SLAAC config
                 * ! not defined or no more configs
                 */
                xtype: 'container',
                flex: 1,
                layout: 'vbox',
                padding: '16, 0',
                hidden: true,
                bind: { hidden: '{interface.v6ConfigType !== "SLAAC"}' }
                /**
                 * IPv6 SLAAC config end
                 */

            }, {
                xtype: 'checkbox',
                boxLabel: 'Send router advertisements',
                bodyAlign: 'start',
                hidden: true,
                bind: {
                    checked: '{interface.routerAdvertisements}',
                    hidden: '{interface.v6ConfigType === "DISABLED"}'
                }
            }]
            /**
             * IPv6 settings end
             */

        }, {

            /**
             * WWAN settings
             * - network ???
             * - simApn
             * - simPin
             * - simUsername
             * - simPassword
             */
            xtype: 'formpanel',
            itemId: 'lte',
            validateOnSync: true,
            layout: 'vbox',
            defaults: {
                clearable: false
            },
            items: [{
                /// ?????
                xtype: 'selectfield',
                reference: 'simNetwork',
                label: 'Network',
                required: true,
                autoSelect: 'true',
                options: [
                    { text: 'T-Mobile', value: 'T-Mobile' },
                    { text: 'Other', value: 'OTHER' }
                ],
                bind: {
                    required: '{interface.type === "WWAN"}'
                }
            }, {
                xtype: 'textfield',
                label: 'APN',
                required: true,
                editable: false,
                disabled: false,
                bind: {
                    value: '{interface.simApn}',
                    required: '{interface.type === "WWAN"}',
                    disabled: '{simNetwork.value !== "OTHER"}'
                }
            }, {
                xtype: 'numberfield',
                label: 'PIN',
                required: true,
                hidden: true,
                bind: {
                    value: '{interface.simPin}',
                    required: '{interface.type === "WWAN" && simNetwork.value === "OTHER"}',
                    hidden: '{simNetwork.value !== "OTHER"}'
                },
                validators: [{
                    type: 'length',
                    min: 4,
                    max: 4
                }]
            }, {
                xtype: 'textfield',
                label: 'Username',
                required: true,
                hidden: true,
                bind: {
                    value: '{interface.simUsername}',
                    required: '{interface.type === "WWAN" && simNetwork.value === "OTHER"}',
                    hidden: '{simNetwork.value !== "OTHER"}'
                }
            }, {
                xtype: 'passwordfield',
                label: 'Password',
                required: true,
                hidden: true,
                bind: {
                    value: '{interface.simPassword}',
                    required: '{interface.type === "WWAN" && simNetwork.value === "OTHER"}',
                    hidden: '{simNetwork.value !== "OTHER"}'
                }
            }]
            /**
             * WWAN settings end
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
                boxLabel: 'Enable DHCP Serving',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.dhcpEnabled}',
                }
            }, {
                xtype: 'textfield',
                label: 'Range Start',
                clearable: false,
                required: false,
                hidden: true,
                bind: {
                    value: '{interface.dhcpRangeStart}',
                    required: '{interface.configType === "ADDRESSED" && interface.dhcpEnabled}',
                    hidden: '{!interface.dhcpEnabled}'
                }
            }, {
                xtype: 'textfield',
                label: 'Range End',
                clearable: false,
                required: false,
                hidden: true,
                bind: {
                    value: '{interface.dhcpRangeEnd}',
                    required: '{interface.configType === "ADDRESSED" && interface.dhcpEnabled}',
                    hidden: '{!interface.dhcpEnabled}'
                }
            }, {
                xtype: 'numberfield',
                label: 'Lease Duration',
                hidden: true,
                clearable: false,
                width: 100,
                bind: {
                    value: '{interface.dhcpLeaseDuration}',
                    hidden: '{!interface.dhcpEnabled}'
                }
            }, {
                xtype: 'textfield',
                label: 'Gateway Override',
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.dhcpGatewayOverride}',
                    hidden: '{!interface.dhcpEnabled}'
                }
            }, {
                xtype: 'selectfield',
                label: 'Netmask Override',
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.dhcpPrefixOverride}',
                    hidden: '{!interface.dhcpEnabled}',
                },
                options: Map.options.prefixes
            }, {
                xtype: 'textfield',
                label: 'DNS Override',
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
                boxLabel: 'Enable VRRP',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.vrrpEnabled}',
                }
            }, {
                xtype: 'numberfield',
                label: 'VRRP ID',
                required: false,
                clearable: false,
                autoComplete: false,
                hidden: true,
                bind: {
                    value: '{interface.vrrpID}',
                    required: '{interface.configType === "ADDRESSED" && interface.vrrpEnabled}',
                    hidden: '{!interface.vrrpEnabled}'
                }
            }, {
                xtype: 'numberfield',
                label: 'VRRP Priority',
                required: false,
                clearable: false,
                autoComplete: false,
                hidden: true,
                bind: {
                    value: '{interface.vrrpPriority}',
                    required: '{interface.configType === "ADDRESSED" && interface.vrrpEnabled}',
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
                label: 'Wireless SSID',
                clearable: false,
                required: true,
                bind: {
                    value: '{interface.wirelessSsid}',
                    required: '{interface.type === "WIFI"}'
                }
            }, {
                xtype: 'selectfield',
                label: 'Wireless Encryption',
                required: true,
                clearable: false,
                autoSelect: true,
                bind: {
                    value: '{interface.wirelessEncryption}',
                    required: '{interface.type === "WIFI"}'
                },
                options: [
                    { text: 'None', value: 'NONE' },
                    { text: 'WPA1', value: 'WPA1' },
                    { text: 'WPA12', value: 'WPA12' },
                    { text: 'WPA2', value: 'WPA2' }
                ]
            }, {
                xtype: 'passwordfield',
                label: 'Wireless Password',
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
                label: 'Wireless Mode',
                bind: '{interface.wirelessMode}',
                autoSelect: true,
                clearable: false,
                options: [
                    { text: 'Access Point', value: 'AP' },
                    { text: 'Client', value: 'CLIENT' }
                ]
            }, {
                xtype: 'numberfield',
                label: 'Wireless Channel',
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
                boxLabel: 'Enable QoS',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.qosEnabled}',
                }
            }, {
                xtype: 'numberfield',
                label: 'Download Kbps',
                required: false,
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.downloadKbps}',
                    required: '{interface.configType === "ADDRESSED" && interface.qosEnabled}',
                    hidden: '{!interface.qosEnabled}'
                }
            }, {
                xtype: 'numberfield',
                label: 'Upload Kbps',
                required: false,
                hidden: true,
                clearable: false,
                bind: {
                    value: '{interface.uploadKbps}',
                    required: '{interface.configType === "ADDRESSED" && interface.qosEnabled}',
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
                    text: 'Address',
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
                    text: 'Netmask/Prefix',
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
                    text: 'Address',
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
                    text: 'Netmask/Prefix',
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
                    text: 'Description',
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
                    text: 'Value',
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
                    text: 'Address',
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
                    text: 'Netmask/Prefix',
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
             * OpenVPN config
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
                    placeholder: 'Select configuration file from disk ...',
                    listeners: {
                        change: 'onFileChange'
                    }
                }, {
                    xtype: 'checkbox',
                    reference: 'openVpnInlineEdit',
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
                required: false,
                bind: {
                    userCls: '{openVpnInlineEdit.checked ? "editable" : ""}',
                    editable: '{openVpnInlineEdit.checked}',
                    required: '{interface.configType === "ADDRESSED" && interface.type === "OPENVPN"}'
                }
            }, {
                xtype: 'container',
                layout: 'vbox',
                margin: '16 0 0 0',
                items: [{
                    xtype: 'checkbox',
                    name: 'openvpnUsernamePasswordEnabled',
                    boxLabel: 'Requires authentication',
                    bodyAlign: 'start',
                    bind: {
                        checked: '{interface.openvpnUsernamePasswordEnabled}',
                    }
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        flex: 1,
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'OpenVPN Username',
                        clearable: false,
                        required: false,
                        disabled: true,
                        margin: '0 16 0 0',
                        bind: {
                            value: '{interface.openvpnUsername}',
                            required: '{interface.configType === "ADDRESSED" && interface.openvpnUsernamePasswordEnabled}',
                            disabled: '{!interface.openvpnUsernamePasswordEnabled}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'OpenVPN Password',
                        itemId: 'openvpnPassword',
                        clearable: false,
                        required: false,
                        disabled: true,
                        bind: {
                            required: '{interface.configType === "ADDRESSED" && interface.openvpnUsernamePasswordEnabled}',
                            disabled: '{!interface.openvpnUsernamePasswordEnabled}'
                        }
                    }]
                }]
            }, {
                xtype: 'checkbox',
                boxLabel: 'NAT traffic exiting this interface (and bridged peers)',
                bodyAlign: 'start',
                margin: '16 0 0 0',
                bind: {
                    checked: '{interface.natEgress}'
                }
            }]
            /**
             * OpenVPN config end
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
                intf = view.getInterface(),
                type, configType;

            vm.set('action', intf ? 'EDIT' : 'ADD');

            // create OPENVPN interface if interface not set
            if (!intf) {
                intf = Ext.create('Mfw.model.Interface', {
                    type: 'OPENVPN',
                    configType: 'ADDRESSED',
                    wan: true,
                    natEgress: true,
                    openvpnBoundInterfaceId: 0,
                });
                intf.setOpenvpnConfFile(Ext.create('Mfw.model.OpenVpnConfFile', {
                    encoding: 'base64',
                    contents: ''
                }));
            }

            me.setTreeListStore();

            /**
             * ! empty node text turns hidden
             */
            vm.bind('{interface}', function (intf) {
                /**
                 * show/hide QoS is it's wan or not
                 */
                var qosNode = treelist.getStore().findNode('key', 'qos');
                if (qosNode) {
                    qosNode.set('text', intf.get('wan') ? qosNode.get('lbl') : '');
                }

                var dhcpOptionsNode = treelist.getStore().findNode('key', 'dhcpoptions');
                if (dhcpOptionsNode) {
                    dhcpOptionsNode.set('text', intf.get('dhcpEnabled') ? dhcpOptionsNode.get('lbl') : '');
                }

                var vrrpV4AliasesNode = treelist.getStore().findNode('key', 'vrrpv4aliases');
                if (vrrpV4AliasesNode) {
                    vrrpV4AliasesNode.set('text', intf.get('vrrpEnabled') ? vrrpV4AliasesNode.get('lbl') : '');
                }

                if (configType === intf.get('configType')) {
                    return;
                }

                type = intf.get('type');
                configType = intf.get('configType');

                /**
                 * if NIC && ADDRESSED, set default v4ConfType to DHCP (auto)
                 * e.g. when switching from BRIDGED to ADDRESSED
                 */
                if (configType === 'ADDRESSED' && type === 'NIC' && !intf.get('v4ConfigType')) {
                    intf.set('v4ConfigType', 'DHCP');
                }

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
                        if (configType === 'ADDRESSED') {
                            if (node.get('key') === 'openvpnconf' ||
                                node.get('key') === 'openvpnauth' ||
                                node.get('key') === 'qos' && !intf.get('wan') ||
                                node.get('key') === 'lte' ||
                                node.get('key') === 'dhcpoptions' && !intf.get('dhcpEnabled') ||
                                node.get('key') === 'vrrpv4aliases' && !intf.get('vrrpEnabled')) {
                                node.set('text', '');
                            } else {
                                node.set('text', node.get('text') || node.get('lbl'));
                            }
                            return;
                        }
                        if (configType === 'BRIDGED') {
                            if (node.get('key') !== 'wifi') {
                                node.set('text', '');
                            } else {
                                node.set('text', node.get('lbl'));
                            }
                        }
                    });
                    treelist.setSelection(treelist.getStore().findNode('key', 'wifi'));
                }

                if (type === 'NIC') {
                    treelist.getStore().each(function (node) {
                        if (node.get('key') === 'wifi' ||
                            node.get('key') === 'lte' ||
                            node.get('key') === 'openvpnconf' ||
                            node.get('key') === 'openvpnauth' ||
                            node.get('key') === 'qos' && !intf.get('wan') ||
                            node.get('key') === 'dhcpoptions' && !intf.get('dhcpEnabled') ||
                            node.get('key') === 'vrrpv4aliases' && !intf.get('vrrpEnabled')) {
                            node.set('text', '');
                        } else {
                            node.set('text', node.get('text') || node.get('lbl'));
                        }
                    });
                    treelist.setSelection(treelist.getStore().findNode('key', 'ipv4'));
                }

                if (type === 'WWAN') {
                    treelist.getStore().each(function (node) {
                        if (node.get('key') !== 'lte') {
                            node.set('text', '');
                        } else {
                            node.set('text', node.get('lbl'));
                        }
                    });
                    treelist.setSelection(treelist.getStore().findNode('key', 'lte'));
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

                // if (configType === 'DISABLED') {
                //     treelist.setSelection(treelist.getStore().findNode('key', 'disabled'));
                // }
            }, me, {
                deep: true
            });

            vm.set({
                interface: intf
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
                        children: [
                            { lbl: 'IPv4', key: 'ipv4', leaf: true },
                            { lbl: 'IPv4 Aliases', key: 'ipv4aliases', leaf: true },
                            { lbl: 'IPv6', key: 'ipv6', leaf: true },
                            { lbl: 'IPv6 Aliases', key: 'ipv6aliases', leaf: true },
                            { lbl: 'LTE', key: 'lte', leaf: true },
                            { lbl: 'DHCP', key: 'dhcp', leaf: true },
                            { lbl: 'DHCP Options', key: 'dhcpoptions', leaf: true },
                            { lbl: 'VRRP', key: 'vrrp', leaf: true },
                            { lbl: 'VRRP IPv4 Aliases', key: 'vrrpv4aliases', leaf: true },
                            { lbl: 'WIFI', key: 'wifi', leaf: true },
                            { lbl: 'OpenVPN Conf', key: 'openvpnconf', leaf: true },
                            { lbl: 'QoS', key: 'qos', leaf: true },
                            { key: 'bridged',  leaf: true },
                            { key: 'disabled', leaf: true }
                        ]
                    }
                },
                setupStore = {
                    root: {
                        expanded: true,
                        children: [
                            { lbl: 'IPv4', key: 'ipv4', leaf: true },
                            { lbl: 'IPv6', key: 'ipv6', leaf: true },
                            { lbl: 'WIFI', key: 'wifi', leaf: true },
                            { lbl: 'LTE', key: 'lte', leaf: true },
                            { lbl: 'OpenVPN Conf', key: 'openvpnconf', leaf: true },
                            { lbl: 'QoS', key: 'qos', leaf: true },
                            { key: 'bridged', leaf: true },
                            { key: 'disabled', leaf: true }
                        ]
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
         * OpenVPN configuration file handler
         */
        onFileChange: function (fileField) {
            var reader = new FileReader(),
                file = fileField.getFiles()[0],
                textarea = fileField.up('formpanel').down('textareafield');

             reader.onload = function () {
                textarea.setValue(reader.result);
                // me.getViewModel().set('confFileSet', true);
            };
            reader.readAsText(file);
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
                intf = vm.get('interface'),
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
            if (invalidForm) {
                if (invalidForm.getItemId() !== 'main') {
                    treelist.setSelection(treelist.getStore().findNode('key', invalidForm.getItemId()));
                }
                Ext.toast('Please fill or correct invalid fields!', 3000);
                return;
            }

            /**
             * if in Setup Wizard just close the editor dialog
             * all interfaces will be updated on Continue action
             */
            if (Mfw.app.context === 'setup') {
                me.getView().close();
                return;
            }

            /**
             * for OPENVPN interfaces set conf file and password if needed
             */
            if (intf.get('type') === 'OPENVPN') {
                var ovpnConfFile = Ext.create('Mfw.model.OpenVpnConfFile', {
                    encoding: 'base64',
                    contents: btoa(view.down('#openvpnConfContent').getValue())
                });
                intf.setOpenvpnConfFile(ovpnConfFile);
                if (intf.get('openvpnUsernamePasswordEnabled')) {
                    intf.set('openvpnPasswordBase64', btoa(view.down('#openvpnPassword').getValue()));
                } else {
                    intf.set('openvpnPasswordBase64', null);
                }
            }

            Sync.progress();

            if (vm.get('action') === 'ADD') {
                interfacesStore.add(intf);
            } else {
                intf.commit();
            }

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
