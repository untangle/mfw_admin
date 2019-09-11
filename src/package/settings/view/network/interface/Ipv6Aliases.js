Ext.define('Mfw.settings.interface.Ipv6Aliases', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-ipv6aliases',

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
                html: '<strong>{intf.name}</strong> IPv6 Aliases'
            }
        }]
    }, {
        xtype: 'grid',
        itemId: 'v6Aliases',
        flex: 1,
        bind: '{intf.v6Aliases}',
        selectable: false,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        rowLines: false,
        deferEmptyText: false,
        emptyText: 'No IPv6 Aliases',
        columns: [{
            text: 'Address',
            dataIndex: 'v6Address',
            menuDisabled: true,
            flex: 1,
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            renderer: function (value) {
                return value || '<em>click to edit ...</em>';
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                required: true,
                clearable: false,
                validators: 'ipv6'
            }
        }, {
            text: 'Prefix Length',
            dataIndex: 'v6Prefix',
            menuDisabled: true,
            width: 120,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'numberfield',
                placeholder: '1 - 128',
                required: true,
                clearable: false,
                minValue: 1,
                maxValue: 128
            },
            renderer: function (value) {
                return '/' + value;
            }
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
            html: '<h3>New IPv6 Alias</h3>'
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
                xtype: 'textfield',
                name: 'v6Address',
                label: 'Address',
                placeholder: 'enter address ...',
                flex: 1,
                validators: 'ipv6'
            }, {
                xtype: 'numberfield',
                name: 'v6Prefix',
                label: 'Prefix Length',
                width: 100,
                placeholder: '1 - 128',
                margin: '0 16',
                value: 64, // default value
                minValue: 1,
                maxValue: 128
            }, {
                xtype: 'button',
                text: 'Add',
                // ui: 'action',
                handler: 'addV6Alias'
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
        addV6Alias: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                intf = me.getViewModel().get('intf');

            if (!form.validate()) { return; }

            intf.v6Aliases().add(form.getValues());
            form.reset(true);
        },

        onCancel: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            // intf.v6Aliases().rejectChanges();
            me.getView().close();
        },

        onClose: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            // intf.v6Aliases().commitChanges();
            me.getView().close();
        }
    }

});
