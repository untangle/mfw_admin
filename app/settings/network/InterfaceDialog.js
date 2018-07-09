Ext.define('Mfw.settings.network.InterfaceDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',
    title: 'Edit Interface'.t(),

    viewModel: {},
    scrollable: true,
    closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel',
    layout: 'fit',
    alwaysOnTop: true, // important
    maximized: false,
    maximizeAnimation: null,

    padding: 0,

    height: 500,
    bind: {
        maximized: '{smallScreen}',
        minWidth: '{!smallScreen ? 320 : null}',
        maxHeight: '{!smallScreen ? 600 : null}',
    },
    // bodyPadding: '0 16',

    items: [{
        xtype: 'formpanel',
        layout: 'vbox',

        padding: 0,
        margin: 0,

        defaults: {
            margin: '8 0'
        },

        items: [{
            xtype: 'container',
            layout: 'form',
            style: {
                borderSpacing: 0,
            },
            items: [{
                xtype: 'textfield',
                // labelAlign: 'top',
                errorTarget: 'under',
                required: true,
                width: '100%',
                label: 'Name'.t(),
                // placeholder: 'Name'.t(),
                bind: '{rec.name}'
            }, {
                xtype: 'combobox',
                label: 'Type'.t(),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                store: [
                    { name: 'Addressed'.t(), value: 'ADDRESSED' },
                    { name: 'Bridged'.t(),   value: 'BRIDGED' },
                    { name: 'Disabled'.t(),  value: 'DISABLED' }
                ],
                bind: '{rec.configType}'
            }]
        }, {
            // IPv4 panel
            xtype: 'panel',
            layout: 'vbox',
            hidden: true,
            bind: { hidden: '{rec.configType !== "ADDRESSED"}' },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                shadow: false,
                style: {
                    background: '#cef1c1'
                },
                items: [{
                    xtype: 'component',
                    html: 'IPv4'.t()
                }, '->',
                    {
                        xtype: 'combobox',
                        reference: 'v4Config',
                        width: 150,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'value',
                        editable: false,
                        bind: {
                            value: '{rec.v4ConfigType}'
                        },
                        store: [
                            { name: 'Auto (DHCP)'.t(), value: 'DHCP' },
                            { name: 'Static'.t(),   value: 'STATIC' },
                            { name: 'PPPoE'.t(),  value: 'PPPOE' }
                        ],
                    }
                ],
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{rec.v4ConfigType !== "DHCP"}'
                },
                items: [{
                    xtype: 'togglefield',
                    boxLabel: 'Override defaults'.t(),
                    reference: 'override',
                    margin: '8 16'
                }, {
                    xtype: 'container',
                    layout: 'form',
                    defaults: {
                        disabled: true,
                        hidden: true,
                        bind: {
                            disabled: '{!override.value}',
                            hidden: '{!override.value}'
                        }
                    },
                    items: [{
                        xtype: 'textfield',
                        labelAlign: 'right',
                        label: 'Address'.t(),
                        bind: {
                            // value: '{rec.v4StaticAddress}',
                            placeholder: '{rec.v4StaticAddress}'
                        }
                    }, {
                        xtype: 'combobox',
                        label: 'Netmask'.t(),
                        queryMode: 'local',
                        displayField: 'text',
                        valueField: 'value',
                        editable: false,
                        clearable: true,
                        bind: {
                            placeholder: '{rec.v4StaticPrefix}'
                        },
                        store: ArrayStore.netmask
                    }, {
                        xtype: 'textfield',
                        label: 'Gateway'.t()
                    }, {
                        xtype: 'textfield',
                        label: 'DNS 1'.t()
                    }, {
                        xtype: 'textfield',
                        label: 'DNS 2'.t()
                    }]
                }]
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{rec.v4ConfigType !== "STATIC"}'
                },
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    labelAlign: 'right',
                    label: 'Address'.t(),
                    bind: {
                        value: '{rec.v4StaticAddress}',
                        // placeholder: '{rec.v4StaticAddress}'
                    }
                }, {
                    xtype: 'combobox',
                    label: 'Netmask'.t(),
                    queryMode: 'local',
                    displayField: 'text',
                    valueField: 'value',
                    editable: false,
                    // clearable: true,
                    bind: '{rec.v4StaticPrefix}',
                    store: ArrayStore.netmask
                }, {
                    xtype: 'textfield',
                    label: 'Gateway'.t()
                }, {
                    xtype: 'textfield',
                    label: 'DNS 1'.t()
                }, {
                    xtype: 'textfield',
                    label: 'DNS 2'.t()
                }]
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{rec.v4ConfigType !== "PPPOE"}'
                },
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    label: 'Username'.t(),
                    required: true,
                    bind: '{rec.v4PPoEUsername}'
                }, {
                    xtype: 'textfield',
                    inputType: 'password',
                    label: 'Password'.t(),
                    required: true,
                    bind: '{rec.v4PPoEPassword}'
                }, {
                    xtype: 'checkbox',
                    reference: 'peerDnsCk',
                    boxLabel: 'Use Peer DNS'.t()
                }, {
                    xtype: 'textfield',
                    label: 'DNS 1'.t(),
                    disabled: true,
                    bind: { disabled: '{peerDnsCk.checked}' }
                }, {
                    xtype: 'textfield',
                    label: 'DNS 2'.t(),
                    disabled: true,
                    bind: { disabled: '{peerDnsCk.checked}' }
                }]
            }, {
                xtype: 'togglefield',
                boxLabel: 'NAT traffic exiting this interface<br/>(and bridged peers)'.t(),
                margin: '8 16'
            }]
        }, {
            // IPv6 panel
            xtype: 'panel',
            layout: 'vbox',
            hidden: true,
            bind: { hidden: '{rec.configType !== "ADDRESSED"}' },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                shadow: false,
                style: {
                    background: '#cef1c1'
                },
                items: [{
                    xtype: 'component',
                    html: 'IPv6'.t()
                }, '->',
                    {
                        xtype: 'combobox',
                        reference: 'v4Config',
                        width: 150,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'value',
                        editable: false,
                        bind: {
                            value: '{rec.v6ConfigType}'
                        },
                        store: [
                            { name: 'Auto (SLAAC/RA)'.t(), value: 'AUTO' },
                            { name: 'Static'.t(),   value: 'STATIC' },
                            { name: 'Disabled'.t(),  value: 'DISABLED' }
                        ],
                    }
                ],
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{rec.v6ConfigType !== "STATIC"}'
                },
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    label: 'Address'.t()
                }, {
                    xtype: 'numberfield',
                    label: 'Prefix Length'.t()
                }, {
                    xtype: 'textfield',
                    label: 'Gateway'.t()
                }, {
                    xtype: 'textfield',
                    label: 'DNS 1'.t()
                }, {
                    xtype: 'textfield',
                    label: 'DNS 2'.t()
                }]
            }]
        }, {
            // VRRP panel
            xtype: 'panel',
            layout: 'vbox',
            hidden: true,
            bind: { hidden: '{rec.configType !== "ADDRESSED"}' },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                shadow: false,
                style: {
                    background: '#cef1c1'
                },
                items: [{
                    xtype: 'component',
                    html: 'Redundancy (VRRP)'.t()
                }, '->',
                    {
                        xtype: 'togglefield',
                        reference: 'vrrpTg'
                    }
                ],
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{!vrrpTg.value}'
                },
                layout: 'form',
                items: [{
                    xtype: 'numberfield',
                    label: 'VRRP ID'.t()
                }, {
                    xtype: 'numberfield',
                    label: 'VRRP Priority'.t()
                }]
            }]
        }, {
            xtype: 'container',
            layout: 'form',
            hidden: true,
            bind: { hidden: '{rec.configType !== "BRIDGED"}' },
            items: [{
                xtype: 'combobox',
                label: 'Bridged To'.t(),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                store: [
                    { name: 'Some name'.t(), value: 'Some name' },
                    { name: 'Second name'.t(),   value: 'Second name' },
                ]
            }]
        }]
    }],
    buttons: {
        ok: 'onOk',
        cancel: 'onCancel'
    },

    controller: {
        onOk: function (btn) {
            btn.up('dialog').hide();
        },
        onCancel: function (btn) {
            btn.up('dialog').hide();
        }

    }
});
