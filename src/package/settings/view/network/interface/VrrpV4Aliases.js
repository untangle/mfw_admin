Ext.define('Mfw.settings.interface.VrrpV4Aliases', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-vrrpv4aliases',

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
                html: '<strong>{intf.name}</strong> VRRP v4 Aliases'
            }
        }]
    }, {
        xtype: 'grid',
        itemId: 'vrrpV4Aliases',
        flex: 1,
        bind: '{intf.vrrpV4Aliases}',
        selectable: false,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        rowLines: false,
        deferEmptyText: false,
        emptyText: 'No VRRP v4 Aliases',
        columns: [{
            text: 'Address',
            dataIndex: 'v4Address',
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
                validators: 'ipv4'
            }
        }, {
            text: 'Netmask/Prefix',
            dataIndex: 'v4Prefix',
            menuDisabled: true,
            flex: 1,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            renderer: function (value) {
                return Map.prefixes[value];
            },
            editable: true,
            editor: {
                xtype: 'selectfield',
                clearable: false,
                options: Map.options.prefixes
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
            html: '<h3>New VRRP v4 Alias</h3>'
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
                name: 'v4Address',
                label: 'Address',
                placeholder: 'enter address ...',
                flex: 1,
                validators: 'ipv4'
            }, {
                xtype: 'selectfield',
                name: 'v4Prefix',
                label: 'Prefix',
                placeholder: 'select prefix ...',
                margin: '0 16',
                flex: 1,
                value: 24,
                options: Map.options.prefixes
            }, {
                xtype: 'button',
                text: 'Add',
                ui: 'action',
                handler: 'addV4Alias'
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
        addV4Alias: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                intf = me.getViewModel().get('intf');

            if (!form.validate()) { return; }

            intf.vrrpV4Aliases().add(form.getValues());
            form.reset(true);
        },

        onCancel: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            intf.vrrpV4Aliases().rejectChanges();
            me.getView().close();
        },

        onClose: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            intf.vrrpV4Aliases().commitChanges();
            me.getView().close();
        }
    }

});
