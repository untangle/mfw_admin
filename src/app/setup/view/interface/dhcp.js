Ext.define('Mfw.setup.interface.Dhcp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-dhcp',

    title: 'DHCP'.t(),

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
                xtype: 'checkbox',
                bodyAlign: 'start',
                boxLabel: '<span style="font-size: 14px;">DHCP Enabled</span>',
                flex: 1,
                bind: {
                    checked: '{intf.dhcpEnabled}',
                }
            }]
        },
        defaultType: 'textfield',
        items: [{
            label: 'Range Start'.t(),
            bind: '{intf.dhcpRangeStart}'
        }, {
            label: 'Range End'.t(),
            bind: '{intf.dhcpRangeEnd}'
        }, {
            xtype: 'numberfield',
            label: 'Lease Duration'.t(),
            bind: '{intf.dhcpLeaseDuration}'
        }, {
            label: 'Gateway Override'.t(),
            bind: '{intf.dhcpGatewayOverride}'
        }, {
            xtype: 'combobox',
            label: 'Netmask Override'.t(),
            bind: '{intf.dhcpPrefixOverride}',
            minValue: 1,
            maxValue: 32
        }, {
            label: 'DNS Override'.t(),
            bind: '{intf.dhcpDNSOverride}'
        }]
    }, {
        xtype: 'component',
        width: 5,
        style: 'background: #EEE',
        hidden: true,
        bind: {
            hidden: '{!intf.dhcpEnabled}'
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
                label: '<span style="font-size: 14px;">DHCP Options</span>'
            }, '->', {
                iconCls: 'md-icon-add',
                ui: 'round action',
                tooltip: 'Add new DHCP Option',
                handler: 'addDhcpOption'
            }]
        },
        hidden: true,
        bind: {
            hidden: '{!intf.dhcpEnabled}'
        },
        items: [{
            xtype: 'grid',
            selectable: false,
            emptyText: 'No DHCP Options!',
            plugins: {
                gridcellediting: {
                    triggerEvent: 'tap'
                }
            },
            bind: {
                store: '{intf.dhcpOptions}'
            },
            columns: [{
                xtype: 'checkcolumn',
                width: 44,
                text: '<i class="x-fa fa-check"></i>',
                dataIndex: 'enabled',
                menuDisabled: true,
                hideable: false,
                sortable: true,
                resizable: false,
                editable: true
            }, {
                text: 'Description',
                dataIndex: 'description',
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
                text: 'Value',
                dataIndex: 'value',
                width: 180,
                menuDisabled: true,
                hideable: false,
                sortable: true,
                resizable: false,
                editable: true,
                editor: {
                    xtype: 'textfield',
                    required: true,
                    clearable: false
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
        addDhcpOption: function (btn) {
            var grid = btn.up('panel').down('grid');
            grid.getStore().add({
                enabled: true,
                description: 'enter description ...',
                value: 'enter value ...'
            })
        }

    }

});
