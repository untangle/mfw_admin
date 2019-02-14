Ext.define('Mfw.settings.network.GenericInterfaceDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.generic-interface-dialog',

    viewModel: {},

    config: {
        interface: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} Interface',
    },
    width: 900,
    height: 600,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',



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
                // margin: '0 16',
                width: 150,
                placeholder: 'Select Type ...',
                required: true,
                disabled: true,
                bind: {
                    value: '{interface.type}',
                },
                options: [
                    { text: 'OpenVPN', value: 'OPENVPN' },
                    { text: 'Interface Card (NIC)', value: 'NIC' }
                ]
            }, {
                xtype: 'textfield',
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
                label: '&nbsp;',
                boxLabel: 'Is WAN',
                bodyAlign: 'start',
                margin: '0 16',
                disabled: true,
                bind: {
                    checked: '{interface.wan}',
                    disabled: '{interface.configType !== "ADDRESSED"}'
                }
            }, {
                xtype: 'checkbox',
                label: '&nbsp;',
                boxLabel: 'NAT Enabled',
                bodyAlign: 'start',
                allowNull: false,
                bind: {
                    checked: '{interface.wan ? true : false}',
                    disabled: '{interface.wan}'
                }
            }]
        }, {
            xtype: 'selectfield',
            name: 'bridgedTo',
            label: 'Bridged To'.t(),
            placeholder: 'Select bridge ...',
            editable: false,
            required: false,
            autoSelect: true,
            forceSelection: true,
            hidden: true,
            bind: {
                value: '{interface.bridgedTo}',
                hidden: '{interface.configType !== "BRIDGED"}',
                required: '{interface.configType === "BRIDGED"}',
                options: '{bridgedOptions}'
            }
        }, {
            xtype: 'segmentedbutton',
            margin: '16 8 16 8',
            items: [
                { text: 'IPv4' },
                { text: 'IPv6' },
                { text: 'VRRP' },
                { text: 'DHCP' },
                { text: 'WiFi' }
            ]
        }, {
            xtype: 'panel',
            layout: 'card',
            flex: 1,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    // IPv4
                    xtype: 'panel',
                    flex: 1,
                    layout: 'vbox',
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
                            hidden: true,
                            bind: { hidden: '{interface.v4ConfigType !== "DHCP"}' }
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        // padding: 8,
                        layout: {
                            type: 'vbox',
                            itemSpacing: 8
                        },
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
                        items: [{
                            xtype: 'textfield',
                            name: 'v4DhcpAddressOverride',
                            label: 'Address'.t(),
                            bind: {
                                value: '{interface.v4DhcpAddressOverride}',
                                placeholder: '{interface.v4StaticAddress}'
                            }
                        }, {
                            xtype: 'selectfield',
                            name: 'v4DhcpPrefixOverride',
                            label: 'Netmask'.t(),
                            editable: false,
                            clearable: true,
                            bind: {
                                value: '{interface.v4DhcpPrefixOverride}',
                                placeholder: '{interface.v4StaticPrefix}'
                            },
                            options: Globals.prefixes
                        }, {
                            xtype: 'textfield',
                            name: 'v4DhcpGatewayOverride',
                            label: 'Gateway'.t(),
                            bind: {
                                value: '{interface.v4DhcpGatewayOverride}',
                                placeholder: '{interface.v4StaticGateway}'
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'v4DhcpDNS1Override',
                            label: 'Primary DNS'.t(),
                            bind: {
                                value: '{interface.v4DhcpDNS1Override}',
                                placeholder: '{interface.v4StaticDNS1}'
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'v4DhcpDNS2Override',
                            label: 'Secondary DNS'.t(),
                            bind: {
                                value: '{interface.v4DhcpDNS2Override}',
                                placeholder: '{interface.v4StaticDNS2}'
                            }
                        }]
                    }]

                }, {
                    // IPv4 Aliases
                    xtype: 'panel',
                    width: '50%',
                    docked: 'right',
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    tbar: {
                        shadow: false,
                        items: [{
                            xtype: 'component',
                            html: 'IPv4 Aliases'
                        }]
                    }
                }]
            }
                // { xtype: 'interface-ipv4' },
                // { xtype: 'interface-ipv4-aliases' },
                // { xtype: 'interface-ipv6' },
                // { xtype: 'interface-ipv6-aliases' },
                // { xtype: 'interface-dhcp' },
                // { xtype: 'interface-dhcp-options' },
                // { xtype: 'interface-vrrp' },
                // { xtype: 'interface-vrrp-aliases' },
                // { xtype: 'interface-wifi' }
            ]
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
        },

        onSubmit: function () {
            console.log('onsubmit');
        }
    }

});
