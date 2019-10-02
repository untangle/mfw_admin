Ext.define('Mfw.settings.interface.Dhcp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-dhcp',

    layout: 'fit',

    viewModel: {},

    items: [{
        xtype: 'container',
        scrollable: true,
        layout: 'hbox',
        items: [{
            xtype: 'formpanel',
            padding: '2 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                margin: '16 0',
                items: [{
                    xtype: 'component',
                    flex: 1,
                    style: 'font-size: 20px; font-weight: 100;',
                    html: 'DHCP configuration'
                }, {
                    xtype: 'togglefield',
                    activeBoxLabel: 'Enable DHCP Serving',
                    inactiveBoxLabel: 'Disabled DHCP Serving',
                    bind: {
                        value: '{intf.dhcpEnabled}',
                        disabled: '{intf.wan}'
                    }
                }]
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
                        disabled: '{!intf.dhcpEnabled || intf.wan}'
                    },
                    validators: 'ipv4'
                }, {
                    xtype: 'textfield',
                    label: 'Range End',
                    margin: '0 0 0 16',
                    disabled: true,
                    bind: {
                        value: '{intf.dhcpRangeEnd}',
                        required: '{intf.configType === "ADDRESSED" && intf.dhcpEnabled}',
                        disabled: '{!intf.dhcpEnabled || intf.wan}'
                    },
                    validators: 'ipv4'
                }]
            }, {
                xtype: 'numberfield',
                label: 'Lease Duration',
                disabled: true,
                clearable: false,
                width: 100,
                bind: {
                    value: '{intf.dhcpLeaseDuration}',
                    disabled: '{!intf.dhcpEnabled || intf.wan}'
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
                        disabled: '{!intf.dhcpEnabled || intf.wan}'
                    }
                }, {
                    xtype: 'selectfield',
                    label: 'Netmask Override',
                    margin: '0 0 0 16',
                    bind: {
                        value: '{intf.dhcpPrefixOverride}',
                        disabled: '{!intf.dhcpEnabled || intf.wan}',
                    },
                    options: Map.options.prefixes
                }]
            }, {
                xtype: 'textfield',
                label: 'DNS Override',
                disabled: true,
                bind: {
                    value: '{intf.dhcpDNSOverride}',
                    disabled: '{!intf.dhcpEnabled || intf.wan}'
                }
            }, {
                xtype: 'button',
                margin: '16 0',
                hidden: true,
                disabled: true,
                bind: {
                    text: 'DHCP Options ({intf.dhcpOptions.count || "none"})',
                    hidden: '{setupContext}',
                    disabled: '{!intf.dhcpEnabled || intf.wan}'
                },
                ui: 'action',
                handler: 'showDhcpOptions'
            }, {
                xtype: 'component',
                docked: 'bottom',
                margin: 16,
                style: 'background: #ffe8c9; padding: 16px; border-radius: 5px;',
                hidden: true,
                bind: {
                    html: '<strong>Invalid DHCP range!</strong><br/>' +
                        'Update DHCP range to match static address <strong>{intf.v4StaticAddress}/{intf.v4StaticPrefix}</strong><br/>' +
                        'Full valid range is <strong>{validDhcpRange}</strong>',
                    hidden: '{!validDhcpRange}'
                }
            }]
        }]
    }],
    controller: {
        init: function (view) {
            // reset range validation on enable/disable DHCP
            view.getViewModel().bind('{intf.dhcpEnabled}', function () {
                view.getViewModel().set('validDhcpRange', null);
            });
        },
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
