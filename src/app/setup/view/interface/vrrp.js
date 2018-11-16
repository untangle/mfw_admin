Ext.define('Mfw.setup.interface.Vrrp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-vrrp',

    title: 'VRRP'.t(),

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
                boxLabel: '<span style="font-size: 14px;">VRRP Enabled</span>',
                flex: 1,
                bind: {
                    checked: '{intf.vrrpEnabled}',
                }
            }]
        },
        items: [{
            xtype: 'numberfield',
            label: 'VRRP Id'.t(),
            bind: '{intf.vrrpID}',
            // minValue: 1,
            // maxValue: 255,
        }, {
            xtype: 'numberfield',
            label: 'VRRP Priority'.t(),
            bind: '{intf.vrrpPriority}',
            // minValue: 1,
            // maxValue: 255
        }]
    }, {
        xtype: 'component',
        width: 5,
        style: 'background: #EEE',
        hidden: true,
        bind: {
            hidden: '{!intf.vrrpEnabled}'
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
                labelWidth: 200,
                label: '<span style="font-size: 14px;">VRRP IPv4 Aliases</span>'
            }, '->', {
                iconCls: 'md-icon-add',
                ui: 'round action',
                tooltip: 'Add IPv4 Alias',
                handler: 'addV4Alias'
            }]
        },
        hidden: true,
        bind: {
            hidden: '{!intf.vrrpEnabled}'
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
                store: '{intf.vrrpV4Aliases}'
            },
            columns: [{
                text: 'Address',
                dataIndex: 'v4Address',
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
                dataIndex: 'v4Prefix',
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
        addV4Alias: function (btn) {
            var grid = btn.up('panel').down('grid');
            grid.getStore().add({
                v4Address: '192.168.0.1',
                v4Prefix: 24
            })
        }

    }

});
