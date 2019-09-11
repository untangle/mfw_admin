Ext.define('Mfw.settings.interface.Dhcp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-dhcp',

    layout: 'fit',

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
                html: 'DHCP configuration'
            }, {
                xtype: 'togglefield',
                boxLabel: 'Enable DHCP Serving',
                bind: {
                    value: '{intf.dhcpEnabled}',
                }
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
                    label: 'Range Start',
                    margin: '0 16 0 0',
                    disabled: true,
                    bind: {
                        value: '{intf.dhcpRangeStart}',
                        required: '{intf.configType === "ADDRESSED" && intf.dhcpEnabled}',
                        disabled: '{!intf.dhcpEnabled}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'Range End',
                    margin: '0 0 0 16',
                    disabled: true,
                    bind: {
                        value: '{intf.dhcpRangeEnd}',
                        required: '{intf.configType === "ADDRESSED" && intf.dhcpEnabled}',
                        disabled: '{!intf.dhcpEnabled}'
                    }
                }]
            }, {
                xtype: 'numberfield',
                label: 'Lease Duration',
                disabled: true,
                clearable: false,
                width: 100,
                bind: {
                    value: '{intf.dhcpLeaseDuration}',
                    disabled: '{!intf.dhcpEnabled}'
                }
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    clearable: false,
                    disabled: true,
                    autocomplete: false,
                    flex: 1
                },
                items: [{
                    xtype: 'textfield',
                    label: 'Gateway Override',
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf.dhcpGatewayOverride}',
                        disabled: '{!intf.dhcpEnabled}'
                    }
                }, {
                    xtype: 'selectfield',
                    label: 'Netmask Override',
                    margin: '0 0 0 16',
                    bind: {
                        value: '{intf.dhcpPrefixOverride}',
                        disabled: '{!intf.dhcpEnabled}',
                    },
                    options: Map.options.prefixes
                }]
            }, {
                xtype: 'textfield',
                label: 'DNS Override',
                disabled: true,
                bind: {
                    value: '{intf.dhcpDNSOverride}',
                    disabled: '{!intf.dhcpEnabled}'
                }
            }, {
                xtype: 'button',
                margin: '16 0',
                hidden: true,
                disabled: true,
                bind: {
                    text: 'DHCP Options ({intf.dhcpOptions.count || "none"})',
                    hidden: '{setupContext}',
                    disabled: '{!intf.dhcpEnabled}'
                },
                ui: 'action',
                handler: 'showDhcpOptions'
            }]
        }]
    }],
    controller: {
        showDhcpOptions: function () {
            var me = this;

            me.optionsDialog = Ext.Viewport.add({
                xtype: 'interface-dhcpoptions',
                width: 500,
                height: 600,
                ownerCmp: me.getView()
            });

            me.optionsDialog.show();
        }
    }

});
