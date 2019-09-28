/**
 * IPv4 options
 * shown only if interface type is NIC
 */
Ext.define('Mfw.settings.interface.Ipv4', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv4',

    layout: 'fit',

    viewModel: {
        formulas: {
            _ipv4ConfigTypes: function (get) {
                // all types
                var wanOptions = [
                    { text: 'Auto (DHCP)', value: 'DHCP' },
                    { text: 'Static',   value: 'STATIC' },
                    { text: 'PPPoE',  value: 'PPPOE' }
                ],
                nonWanOptions = [
                    { text: 'Static',   value: 'STATIC' },
                ];
                return get('intf.wan') ? wanOptions : nonWanOptions;
            },
            _v4StaticPrefixOverridePlaceholder: function (get) {
                return Map.prefixes[get('intf.v4StaticPrefix')];
            }
        }
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        layout: 'hbox',
        items: [{
            xtype: 'formpanel',
            padding: '8 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'IPv4 Configuration'
            }, {
                xtype: 'selectfield',
                // label: '<b>IPv4 Config Type</b>',
                labelAlign: 'top',
                required: true,
                margin: '0 0 16 0',
                bind: {
                    value: '{intf.v4ConfigType}',
                    options: '{_ipv4ConfigTypes}',
                    required: '{intf.configType === "ADDRESSED" && intf.type !== "OPENVPN" && intf.type !== "WWAN"}'
                }
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
                margin: '0 0 24 0',
                hidden: true,
                bind: { hidden: '{intf.v4ConfigType !== "DHCP"}' },
                items: [{
                    xtype: 'component',
                    margin: '16 0 8 0',
                    html: '<span style="font-size: 14px; font-weight: 100;">Override Defaults (optional)</span>'
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        flex: 1,
                        required: false,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Address',
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v4DhcpAddressOverride}',
                            placeholder: '{intf.v4StaticAddress}',
                            disabled: '{intf.v4ConfigType !== "DHCP"}'
                        },
                        validators: 'ipv4'
                    }, {
                        xtype: 'selectfield',
                        label: 'Netmask/Prefix',
                        margin: '0 0 0 16',
                        bind: {
                            value: '{intf.v4DhcpPrefixOverride}',
                            placeholder: '{_v4StaticPrefixOverridePlaceholder}',
                            disabled: '{intf.v4ConfigType !== "DHCP"}'
                        },
                        options: Map.options.prefixes
                    }]
                }, {
                    xtype: 'textfield',
                    label: 'Gateway Override',
                    required: false,
                    bind: {
                        value: '{intf.v4DhcpGatewayOverride}',
                        placeholder: '{intf.v4StaticGateway}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        required: false,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Primary DNS',
                        flex: 1,
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v4DhcpDNS1Override}',
                            placeholder: '{intf.v4StaticDNS1}',
                            disabled: '{intf.v4ConfigType !== "DHCP"}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Secondary DNS',
                        flex: 1,
                        margin: '0 0 0 16',
                        bind: {
                            value: '{intf.v4DhcpDNS2Override}',
                            placeholder: '{intf.v4StaticDNS2}',
                            disabled: '{intf.v4ConfigType !== "DHCP"}'
                        }

                    }]
                }]
                /**
                 * IPv4 Auto (DHCP) end
                 */

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
                layout: 'vbox',
                margin: '0 0 32 0',
                hidden: true,
                bind: { hidden: '{intf.v4ConfigType !== "STATIC"}' },
                items: [{
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        flex: 1,
                        required: false,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Address',
                        name: 'v4StaticAddress',
                        errorLabel: 'IPv4 Static Address',
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v4StaticAddress}',
                            required: '{intf.configType === "ADDRESSED" && intf.v4ConfigType === "STATIC"}',
                            disabled: '{intf.v4ConfigType !== "STATIC"}'
                        },
                        validators: 'ipv4'
                    }, {
                        xtype: 'selectfield',
                        label: 'Netmask/Prefix',
                        margin: '0 0 0 16',
                        bind: {
                            value: '{intf.v4StaticPrefix}',
                            required: '{intf.configType === "ADDRESSED" && intf.v4ConfigType === "STATIC"}',
                            disabled: '{intf.v4ConfigType !== "STATIC"}'
                        },
                        options: Map.options.prefixes
                    }]
                }, {
                    xtype: 'textfield',
                    label: 'Gateway',
                    errorLabel: 'IPv4 Static Gateway',
                    hidden: true,
                    required: false,
                    bind: {
                        value: '{intf.v4StaticGateway}',
                        hidden: '{!intf.wan}', // ????
                        required: '{intf.wan && intf.configType === "ADDRESSED" && intf.v4ConfigType === "STATIC"}',
                        disabled: '{intf.v4ConfigType !== "STATIC"}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    hidden: true,
                    bind: {
                        hidden: '{!intf.wan}'
                    },
                    defaults: {
                        required: false,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Primary DNS',
                        flex: 1,
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v4StaticDNS1}',
                            disabled: '{intf.v4ConfigType !== "STATIC"}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Secondary DNS',
                        flex: 1,
                        margin: '0 0 0 16',
                        bind: {
                            value: '{intf.v4StaticDNS2}',
                            disabled: '{intf.v4ConfigType !== "STATIC"}'
                        }
                    }]
                }]
                /**
                 * IPv4 STATIC config end
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
                margin: '0 0 24 0',
                hidden: true,
                bind: { hidden: '{intf.v4ConfigType !== "PPPOE"}' },
                items: [{
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        // labelAlign: 'top',
                        required: true,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Username',
                        flex: 1,
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v4PPPoEUsername}',
                            required: '{intf.v4ConfigType === "PPPOE"}',
                            disabled: '{intf.v4ConfigType !== "PPPOE"}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Password',
                        inputType: 'password',
                        margin: '0 0 0 16',
                        triggers: {
                            reveal: {
                                type: 'trigger',
                                iconCls: 'x-fa fa-eye',
                                hidden: true,
                                bind: {
                                    hidden: '{!intf.enabled || intf.v4PPPoEPassword.length === 0}',
                                },
                                handler: function (field, trigger) {
                                    if (field.getDisabled()) {
                                        return;
                                    }
                                    var inputType = field.getInputType();
                                    if (inputType === 'password') {
                                        field.setInputType('text');
                                        trigger.setIconCls('x-fa fa-eye-slash');
                                    } else {
                                        field.setInputType('password');
                                        trigger.setIconCls('x-fa fa-eye');
                                    }
                                }
                            }
                        },
                        bind: {
                            value: '{intf.v4PPPoEPassword}',
                            required: '{intf.v4ConfigType === "PPPOE"}',
                            disabled: '{intf.v4ConfigType !== "PPPOE"}'
                        },
                        validators: [{
                            type: 'length',
                            min: 6
                        }]
                    }]
                }, {
                    xtype: 'checkbox',
                    boxLabel: '<strong>Use Peer DNS</strong>',
                    margin: '16 0 0 0',
                    bodyAlign: 'left',
                    bind: '{intf.v4PPPoEUsePeerDNS}',
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'textfield',
                        clearable: false,
                        disabled: true,
                        required: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Primary DNS',
                        flex: 1,
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v4PPPoEOverrideDNS1}',
                            disabled: '{intf.v4ConfigType !== "PPPOE" || intf.v4PPPoEUsePeerDNS}',
                            required: '{intf.v4ConfigType === "PPPOE" && !intf.v4PPPoEUsePeerDNS}',
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Secondary DNS',
                        flex: 1,
                        margin: '0 0 0 16',
                        bind: {
                            value: '{intf.v4PPPoEOverrideDNS2}',
                            disabled: '{intf.v4ConfigType !== "PPPOE" || intf.v4PPPoEUsePeerDNS}',
                            required: '{intf.v4ConfigType === "PPPOE" && !intf.v4PPPoEUsePeerDNS}'
                        }
                    }]
                }]
                /**
                 * IPv4 PPPoE settings
                 */
            }, {
                xtype: 'button',
                hidden: true,
                bind: {
                    text: 'IPv4 Aliases ({intf.v4Aliases.count || "none"})',
                    hidden: '{setupContext}'
                },
                ui: 'action',
                handler: 'showIpv4Aliases'
            }]
        }]
    }],
    controller: {
        showIpv4Aliases: function () {
            var me = this;
            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-ipv4aliases',
                width: 500,
                height: 600,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        }
    }

});
