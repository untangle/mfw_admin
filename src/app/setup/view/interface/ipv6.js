Ext.define('Mfw.setup.interface.Ipv6', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv6',

    title: 'IPv6'.t(),

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    scrollable: 'y',


    items: [{
        xtype: 'panel',
        flex: 1,
        bodyPadding: 16,
        // border: true,
        bodyBorder: false,
        style: 'border-right: 1px #EEE solid;',

        defaults: {
            labelAlign: 'left',
            labelWidth: 130
        },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'selectfield',
                labelAlign: 'left',
                labelWidth: 130,
                flex: 1,
                // reference: 'v4Config',
                label: '<span style="font-size: 14px;">IPv6 Config Type</span>'.t(),
                editable: false,
                // margin: '0 16',
                disabled: true,
                bind: {
                    value: '{intf.v6ConfigType}',
                    disabled: '{!intf.wan}'
                },
                options: [
                    { text: 'Auto (DHCP)'.t(), value: 'DHCP' },
                    { text: 'SLAAC'.t(), value: 'SLAAC' },
                    { text: 'Assign'.t(), value: 'ASSIGN' },
                    { text: 'Static'.t(),   value: 'STATIC' },
                    { text: 'Disabled'.t(),  value: 'DISABLED' }
                ]
            }]
        },
        items: [
            // WAN ASSIGN
            {
                xtype: 'textfield',
                label: 'Assign Hint'.t(),
                // errorLabel: 'IPv6 Assign Hint'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v6AssignHint}',
                    hidden: '{intf.v6ConfigType !== "ASSIGN"}',
                    required: '{intf.v6ConfigType === "ASSIGN"}'
                }
            }, {
                xtype: 'numberfield',
                label: 'Assign Prefix'.t(),
                // errorLabel: 'IPv6 Assign Prefix'.t(),
                placeholder: 'Integer between 1 and 128',
                decimals: 0,
                minValue: 1,
                maxValue: 128,
                required: false,
                allowBlank: true,
                hidden: true,
                bind: {
                    value: '{intf.v6AssignPrefix}',
                    hidden: '{intf.v6ConfigType !== "ASSIGN"}',
                    required: '{intf.v6ConfigType === "ASSIGN"}'
                }
            },
            // STATIC
            {
                xtype: 'textfield',
                label: 'Address'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticAddress}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                },
                validators: [ 'ipaddress' ]
            }, {
                xtype: 'numberfield',
                label: 'Prefix Length'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticPrefix}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Gateway'.t(),
                hidden: true,
                bind: {
                    value: '{intf.staticGateway}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Primary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticDNS1}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Secondary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticDNS2}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            },

            {
                xtype: 'component',
                margin: 24,
                hidden: true,
                bind: {
                    hidden: '{intf.v6ConfigType !== "DISABLED"}'
                },
                html: '<h1 style="text-align: center; color: #777;"><i class="x-fa fa-exclamation-triangle"></i><br/><br/>IPv6 is disabled</h1>'
            }
        ]
    }, {
        xtype: 'component',
        width: 5,
        style: 'background: #EEE',
        hidden: true,
        bind: {
            hidden: '{intf.v4ConfigType === "DISABLED"}'
        }
    }, {
        xtype: 'panel',
        width: '50%',
        layout: 'fit',
        // border: true,
        // bodyBorder: false,
        tbar: {
            shadow: false,
            padding: '0 8 0 16',
            items: [{
                xtype: 'displayfield',
                labelAlign: 'left',
                label: '<span style="font-size: 14px;">IPv6 Aliases</span>'
            }, '->', {
                iconCls: 'md-icon-add',
                ui: 'round action',
                tooltip: 'Add new Alias',
                handler: 'addV6Alias'
            }]
        },
        hidden: true,
        bind: {
            hidden: '{intf.v6ConfigType === "DISABLED"}'
        },
        items: [{
            xtype: 'grid',
            selectable: false,
            emptyText: 'No Aliases!',
            plugins: {
                gridcellediting: {
                    triggerEvent: 'tap'
                }
            },
            bind: {
                store: '{intf.v6Aliases}'
            },
            columns: [{
                text: 'Address',
                dataIndex: 'v6Address',
                flex: 1,
                menuDisabled: true,
                hideable: false,
                sortable: true,
                editable: true,
                editor: {
                    xtype: 'textfield',
                    required: true,
                    clearable: false
                }
            }, {
                text: 'Prefix',
                dataIndex: 'v6Prefix',
                width: 180,
                menuDisabled: true,
                hideable: false,
                sortable: true,
                resizable: false,
                renderer: function (value) {
                    var prefix = Ext.Array.findBy(Data.prefix, function (item) {
                        return item.value === value;
                    });
                    if (prefix) {
                        return prefix.text;
                    }
                    return 'not set';
                },
                editable: true,
                editor: {
                    xtype: 'selectfield',
                    editable: false,
                    required: true,
                    options: Data.prefix
                    // clearable: false
                }
            }, {
                width: 44,
                menuDisabled: true,
                hideable: false,
                sortable: false,
                resizable: false,
                cell: {
                    // toolDefaults: {}
                    tools: {
                        remove: {
                            iconCls: 'md-icon-close',
                            tooltip: 'Remove Alias',
                            handler: function (grid, info) {
                                info.record.drop();
                            }
                        }
                    }
                }
            }]
        }]
    }],

    controller: {
        addV6Alias: function (btn) {
            var grid = btn.up('panel').down('grid');
            grid.getStore().add({
                v6Address: '192.168.0.1',
                v6Prefix: 24
            })
        }

    }

});
