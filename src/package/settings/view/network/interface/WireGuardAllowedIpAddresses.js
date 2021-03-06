Ext.define('Mfw.settings.interface.WireGuardalowedIpAddresses', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-wireguard-allowedipaddresses',

    draggable: false,
    resizable: false,

    layout: 'vbox',

    padding: 0,

    items: [{
        xtype: 'toolbar',
        style: 'font-weight: 100; font-size: 20px;',
        docked: 'top',
        items: [{
            xtype: 'component',
            bind: {
                html: '<strong>{intf.name}</strong> Allowed IP Addresses'
            }
        }]
    }, {
        xtype: 'grid',
        itemId: 'allowedIpAddrresses',
        flex: 1,
        bind: '{peer.allowedIps}',
        selectable: false,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        rowLines: false,
        deferEmptyText: false,
        emptyText: 'No Allowed IP Addresses',
        columns: [{
            text: 'Address',
            dataIndex: 'address',
            menuDisabled: true,
            flex: 1,
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            renderer: function (value) {
                return value || '<em>click to edit ...</em>';
            },
            bind: {
                editable: '{intf.wireguardEditMode != "PASTE"}'
            },
            editor: {
                xtype: 'textfield',
                required: true,
                clearable: false,
                validators: 'ipany'
            }
        }, {
            text: 'Netmask/Prefix',
            dataIndex: 'prefix',
            menuDisabled: true,
            flex: 1,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            renderer: function (value) {
                return Map.prefixes[value];
            },
            bind: {
                editable: '{intf.wireguardEditMode != "PASTE"}'
            },
            editor: {
                xtype: 'selectfield',
                clearable: false,
                options: Map.options.prefixes
            }
        }, {
            width: 44,
            resizable: false,
            menuDisabled: true,
            bind: {
                hidden: '{intf.wireguardEditMode == "PASTE"}'
            },
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
            html: '<h3>New Allowed IP Address</h3>',
            bind: {
                hidden: '{intf.wireguardEditMode == "PASTE"}'
            }
        }, {
            xtype: 'component',
            html: '<i>Import addresses are read-only</i>',
            bind: {
                hidden: '{intf.wireguardEditMode != "PASTE"}'
            }
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
            bind: {
                hidden: '{intf.wireguardEditMode == "PASTE"}'
            },
            items: [{
                xtype: 'textfield',
                name: 'address',
                label: 'Address',
                placeholder: 'enter address ...',
                flex: 1,
                validators: 'ipany'
            }, {
                xtype: 'selectfield',
                name: 'prefix',
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
                handler: 'addAllowedIpAddress',
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
            handler: 'onClose',
            bind: {
                hidden: '{intf.wireguardEditMode == "PASTE"}'
            }
        }]
    }],

    controller: {
        addAllowedIpAddress: function (btn) {
            var me = this,
                form = btn.up('formpanel'),
                peer = me.getViewModel().get('peer');

            if (!form.validate()) { return; }

            var netAddr = CommonUtil.getNetworkWithCIDR(form.getValues().address, form.getValues().prefix);
            
            peer.allowedIps().add({
                address: netAddr,
                prefix: form.getValues().prefix
            });
            form.reset(true);
        },

        onCancel: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            me.getView().close();
        },

        onClose: function () {
            var me = this,
                intf = me.getViewModel().get('intf');

            me.getView().close();
        }
    }

});
