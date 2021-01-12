/**
 * IPv4 options
 * shown only if interface type is NIC
 */
Ext.define('Mfw.settings.interface.Ipv4', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv4',

    layout: 'fit',

    viewModel: {
        data: {
            // used when renew API call is made
            renewingIp: false,
            // message shwon after renew API call
            renewMsg: null
        },
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
            },
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
                    required: '{intf.configType === "ADDRESSED" && intf.type !== "OPENVPN" && intf.type !== "WWAN" && intf.type !== "WIREGUARD"}'
                }
            }, {
                xtype: 'container',
                padding: '0 0 16 0',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                hidden: true,
                bind: {
                    hidden: '{intf.v4ConfigType !== "DHCP"}'
                },
                items: [{
                    xtype: 'container',
                    layout: 'vbox',
                    flex: 1,
                    items: [{
                        xtype: 'component',
                        bind: {
                            html: 'Current address: <strong>{renewingIp ? "<i class=\'fa fa-spinner fa-spin fa-fw\'></i> renewing ..." : "<strong>" + intf._status.ip4Addr.0 + "</strong>"}'
                        }
                    }, {
                        // error message shown after renewing API call finishes
                        xtype: 'component',
                        style: 'line-height: 1.2; font-size: 11px;',
                        hidden: true,
                        bind: {
                            html: '{renewMsg}',
                            hidden: '{!renewMsg}',
                        }
                    }]
                }, {
                    xtype: 'button',
                    ui: 'action',
                    handler: 'onRenew',
                    text: 'Renew IP',
                    bind: {
                        disabled: '{!(intf._status.addressSource.0 === "dhcp" || intf._status.addressSource.1 === "dhcp") || renewingIp}',
                    }
                }]
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
                        }
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
                    text: '{_v4AliasText}',
                    hidden: '{setupContext}'
                },
                ui: 'action',
                handler: 'showIpv4Aliases'
            }]
        }]
    }],
    controller: {
        init: function () {
            var vm = this.getViewModel();
            // hide any renew IP message after 3 seconds
            vm.bind('{renewMsg}', function (msg) {
                if (msg !== null) {
                    Ext.defer(function () {
                        vm.set('renewMsg', null);
                    }, 3000);
                }
            });

            var form = this.getView().down('formpanel');
            var v4StaticAddressField = form.getFields('v4StaticAddress');
            var currentIntf = vm.get('intf');

            /**
             * For v4StaticAddress, use the ipv4 validator to ensure
             * it is a properly formated ipv4 address, and then check
             * to see if any other interfaces are already using the
             * input address
             */
            v4StaticAddressValidator = Ext.bind(CommonUtil.checkV4Dups, this, [v4StaticAddressField, currentIntf]);
            v4StaticAddressField.setValidators([ 'ipv4', v4StaticAddressValidator ]);
        },

        /**
         * showIpv4Aliases generates a dialog box that shows the ipv4aliases editor
         */
        showIpv4Aliases: function () {
            var me = this;
            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-ipv4aliases',
                width: 500,
                height: 600,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        },
        /**
         * releaseDhcp will send a DHCP release on the device specified
         * @param device (string) - the device name to be passed to the release DHCP API call
         */
        releaseDhcp: function (device) {
            var releaseResult = false;
            Ext.Ajax.request({
                url: '/api/releasedhcp/' + device,
                method: 'POST',
                async: false,
                success: function () {
                    releaseResult = true;
                },
                failure: function () {
                }
            });
            return releaseResult;
        },
        /**
         * renewDhcp will send a DHCP renew on the device specified
         * @param device (string) - the device name to be passed to the renew DHCP API call
         * @param cb (function) - callback to use after API call is completed
         */
        renewDhcp: function (device, cb) {
            Ext.Ajax.request({
                url: '/api/renewdhcp/' + device,
                method: 'POST',
                async: false,
                success: function () {
                    // means the renew was successfull
                    cb(true)
                },
                failure: function (repsonse) {
                    cb(false)
                }
            });
        },

        // handler which triggers renew API call
        onRenew: function (btn) {
            var me = this,
                vm = me.getViewModel(),
                intf = vm.get('intf'),
                errorMsg = '<span style="color: #c62828;"><i class="fa fa-exclamation-triangle"></i> Unable to renew IP address</span>';

            vm.set('renewingIp', true);
            me.renewDhcp(intf.get('device'), function (success) {
                // on success reload interfaces && their status
                if (success) {
                    // MFW-790 - add a small timeout before fetching status after IP renew
                    Ext.defer(function () {
                        me.refreshStatus(intf.get('device'), 0);
                    }, 3000, me);
                } else {
                    vm.set({
                        renewingIp: false,
                        renewMsg: errorMsg
                    });
                }
            })
        },

        /**
         * try 5 times to refresh status until new IP appears
         */
        refreshStatus: function (device, count) {
            var me = this,
                vm = me.getViewModel(),
                errorMsg = '<span style="color: #c62828;"><i class="fa fa-exclamation-triangle"></i> Unable to renew IP address</span>';
                store = Ext.getStore('interfaces');

            Ext.defer(function () {
                if (count === 5) {
                    vm.set({
                        renewingIp: false,
                        renewMsg: errorMsg
                    });
                    return;
                }
                store.getStatus(function () {
                    store.each(function (intf) {
                        if (intf.get('device') === device) {
                            var status = intf.get('_status');
                            if (!status.ip4Addr) {
                                count++;
                                me.refreshStatus(device, count);
                            } else {
                                vm.set({
                                    renewingIp: false,
                                    renewMsg: null
                                });
                            }
                        }
                    });
                });
            }, 1000, me);
        }
    }
});
