/**
 * IPv6 options
 * shown only if interface type is NIC
 */
Ext.define('Mfw.settings.interface.Ipv6', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv6',

    layout: 'fit',

    viewModel: {
        formulas: {
            /**
             * set possible IPv6 config types if it's wan or not
             */
            _ipv6ConfigTypes: function (get) {
                var options;
                if (get('intf.wan')) {
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
                html: 'IPv6 Configuration'
            }, {
                xtype: 'selectfield',
                // label: 'Config Type',
                // labelAlign: 'top',
                required: true,
                bind: {
                    value: '{intf.v6ConfigType}',
                    options: '{_ipv6ConfigTypes}',
                    required: '{intf.configType === "ADDRESSED" && intf.type !== "OPENVPN" && intf.type !== "WWAN"}'
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
                bind: { hidden: '{intf.v6ConfigType !== "STATIC"}' },
                items: [{
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        required: false,
                        clearable: false,
                        autoComplete: false,
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Address',
                        placeholder: 'enter address ...',
                        flex: 1,
                        margin: '0 32 0 0',
                        bind: {
                            value: '{intf.v6StaticAddress}',
                            required: '{intf.configType === "ADDRESSED" && intf.v6ConfigType === "STATIC"}',
                            disabled: '{intf.v6ConfigType !== "STATIC"}'
                        },
                        validators: 'ipv6'
                    }, {
                        xtype: 'numberfield',
                        label: 'Prefix Length',
                        placeholder: '1 - 128',
                        width: 100,
                        bind: {
                            value: '{intf.v6StaticPrefix}',
                            required: '{intf.configType === "ADDRESSED" && intf.v6ConfigType === "STATIC"}',
                            disabled: '{intf.v6ConfigType !== "STATIC"}'
                        }
                    }]
                }, {
                    xtype: 'textfield',
                    label: 'Gateway',
                    hidden: true,
                    required: false,
                    clearable: false,
                    bind: {
                        value: '{intf.v6StaticGateway}',
                        hidden: '{!intf.wan}', // ????
                        required: '{intf.wan && intf.configType === "ADDRESSED" && intf.v6ConfigType === "STATIC"}',
                        disabled: '{intf.v6ConfigType !== "STATIC"}'
                    },
                    validators: 'ipv6'
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        clearable: false,
                        autoComplete: false,
                        labelAlign: 'top',
                        hidden: true
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Primary DNS',
                        hidden: true,
                        margin: '0 16 0 0',
                        flex: 1,
                        bind: {
                            value: '{intf.v6StaticDNS1}',
                            hidden: '{!intf.wan}',
                            disabled: '{intf.v6ConfigType !== "STATIC"}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Secondary DNS',
                        margin: '0 0 0 16',
                        flex: 1,
                        bind: {
                            value: '{intf.v6StaticDNS2}',
                            hidden: '{!intf.wan}',
                            disabled: '{intf.v6ConfigType !== "STATIC"}'
                        }
                    }]
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
                layout: 'hbox',
                defaults: {
                    labelAlign: 'top',
                    clearable: false,
                    required: false,
                    autoComplete: false
                },
                hidden: true,
                bind: { hidden: '{intf.v6ConfigType !== "ASSIGN"}' },
                items: [{
                    xtype: 'textfield',
                    label: 'Assign Hint',
                    width: 120,
                    margin: '0 32 0 0',
                    bind: {
                        value: '{intf.v6AssignHint}',
                        required: '{intf.configType === "ADDRESSED" && intf.v6ConfigType === "ASSIGN"}',
                        disabled: '{intf.v6ConfigType !== "ASSIGN"}'
                    }
                }, {
                    xtype: 'numberfield',
                    label: 'Assign Prefix',
                    placeholder: 'Integer between 1 and 128',
                    width: 120,
                    decimals: 0,
                    minValue: 1,
                    maxValue: 128,
                    allowBlank: true,
                    bind: {
                        value: '{intf.v6AssignPrefix}',
                        required: '{intf.configType === "ADDRESSED" && intf.v6ConfigType === "ASSIGN"}',
                        disabled: '{intf.v6ConfigType !== "ASSIGN"}'
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
                bind: { hidden: '{intf.v6ConfigType !== "DHCP"}' },
                defaults: {
                    labelAlign: 'top',
                    clearable: false
                },
                items: [{
                    xtype: 'component',
                    margin: '16 0 8 0',
                    html: '<span style="font-size: 14px; font-weight: 100;">Override Defaults (optional)</span>'
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Primary DNS Override',
                        flex: 1,
                        margin: '0 16 0 0',
                        bind: {
                            value: '{intf.v6DhcpDNS1Override}',
                            disabled: '{intf.v6ConfigType !== "DHCP"}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Secondary DNS Override',
                        flex: 1,
                        margin: '0 0 0 16',
                        bind: {
                            value: '{intf.v6DhcpDNS2Override}',
                            disabled: '{intf.v6ConfigType !== "DHCP"}'
                        }
                    }]
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
                bind: { hidden: '{intf.v6ConfigType !== "SLAAC"}' }
                /**
                 * IPv6 SLAAC config end
                 */

            }, {                    
                xtype: 'containerfield',
                bodyAlign: 'start',
                layout: 'hbox',
                defaults: {
                    clearable: false
                },
                items: [{
                    xtype: 'checkbox',
                    boxLabel: '<strong>Send router advertisements</strong>',
                    hidden: true,
                    margin: '16 0',
                    bind: {
                        checked: '{intf.routerAdvertisements}',
                        hidden: '{intf.v6ConfigType === "DISABLED"}'
                    }
                }, {
                    xtype: 'checkbox',
                    boxLabel: '<strong>DHCPv6 Relay</strong>',
                    hidden: true,
                    margin: '16 16',
                    bind: {
                        checked: '{intf.v6RelayEnabled}',
                        hidden: '{!intf.wan || intf.v6ConfigType === "DISABLED"}'
                    }
                } ]
            }, {
                xtype: 'button',
                hidden: true,
                bind: {
                    text: 'IPv6 Aliases ({intf.v6Aliases.count || "none"})',
                    hidden: '{setupContext || intf.v6ConfigType === "DISABLED"}'
                },
                ui: 'action',
                handler: 'showIpv6Aliases'
            }]
        }]
    }],
    controller: {
        showIpv6Aliases: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            console.log(intf.v6Aliases());

            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-ipv6aliases',
                width: 500,
                height: 600,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        }
    }

});
