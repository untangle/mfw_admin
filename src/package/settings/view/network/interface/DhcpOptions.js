Ext.define('Mfw.settings.interface.DhcpOptions', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dhcpoptions',

    draggable: false,
    resizable: false,

    layout: 'vbox',

    padding: 0,

    // renderTo: 'document.body',

    items: [{
        xtype: 'toolbar',
        style: 'font-weight: 100; font-size: 20px;',
        docked: 'top',
        items: [{
            xtype: 'component',
            bind: {
                html: '<strong>{intf.name}</strong> DHCP options'
            }
        }]
    }, {
        xtype: 'grid',
        itemId: 'dhcpOptions',
        bind: '{intf.dhcpOptions}',
        flex: 1,
        selectable: false,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        rowLines: false,
        deferEmptyText: false,
        emptyText: 'No DHCP Options',
        columns: [{
            xtype: 'checkcolumn',
            width: 44,
            dataIndex: 'enabled'
        }, {
            text: 'Description',
            dataIndex: 'description',
            menuDisabled: true,
            flex: 1,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                required: true
            }
        }, {
            text: 'Value',
            dataIndex: 'value',
            menuDisabled: true,
            width: 100,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true
        }, {
            width: 44,
            resizable: false,
            menuDisabled: true,
            cell: {
                tools: [{
                    type: 'delete',
                    iconCls: 'md-icon-close',
                    handler: function (grid, info) {
                        grid.getStore().remove(info.record);
                    }
                }]
            }
        }]
    }, {
        xtype: 'formpanel',
        layout: 'vbox',
        bodyStyle: 'background: #F5F5F5;',
        padding: '0 16 16 16',
        items: [{
            xtype: 'component',
            html: '<h3>New DHCP Option</h3>'
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'bottom'
            },
            defaults: {
                labelAlign: 'top',
                required: true,
                clearable: false,
                autoComplete: false
            },
            items: [{
                xtype: 'checkbox',
                required: false,
                name: 'enabled',
                bodyAlign: 'start',
                boxLabel: 'Enabled',
                margin: '0 32 0 0'
            }, {
                xtype: 'textfield',
                name: 'description',
                label: 'Description',
                placeholder: 'enter description ...',
                flex: 1
            }, {
                xtype: 'textfield',
                name: 'value',
                label: 'Value',
                placeholder: 'enter value ...',
                margin: '0 16',
                width: 100
            }, {
                xtype: 'button',
                text: 'Add',
                ui: 'action',
                handler: 'addDhcpOption'
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            handler: 'onCancel',
            margin: '0 16 0 0'
        }, {
            text: 'Close',
            ui: 'action',
            handler: 'onClose'
        }]
    }],

    controller: {
        addDhcpOption: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                intf = me.getViewModel().get('intf');

            if (!form.validate()) { return; }

            intf.dhcpOptions().add(form.getValues());
            form.reset(true);
        },

        onCancel: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            // intf.dhcpOptions().rejectChanges();
            me.getView().close();
        },

        onClose: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            // intf.dhcpOptions().commitChanges();
            me.getView().close();
        }
    }

});
