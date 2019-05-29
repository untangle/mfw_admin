Ext.define('Mfw.settings.network.Dhcp', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-dhcp',

    title: 'DHCP'.t(),

    viewModel: {
        data: {
            visibleAdd: false
        }
    },

    layout: 'fit',

    tools: [{
        xtype: 'button',
        cls: 'btn-tool',
        iconCls: 'md-icon-refresh',
        handler: 'load'
    }, {
        xtype: 'button',
        cls: 'btn-tool',
        iconCls: 'md-icon-save',
        text: 'Save',
        handler: 'onSave'
    }],

    items: [{
        xtype: 'grid',
        itemId: 'staticEntries',
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        emptyText: 'No data',
        selectable: false,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            zIndex: 3,
            shadow: false,
            items: [{
                xtype: 'checkbox',
                label: 'DHCP Authoritative'.t(),
                labelAlign: 'right',
                labelWidth: 200,
                bind: '{dhcp.dhcpAuthoritative}'
            }]
        }, {
            xtype: 'toolbar',
            docked: 'top',
            shadow: false,
            zIndex: 2,
            padding: '0 8 0 16',
            bind: {
                shadow: '{!visibleAdd}'
            },
            items: [{
                xtype: 'component',
                html: 'Static Entries',
                style: 'font-weight: 400;'
            }, '->', {
                xtype: 'button',
                iconCls: 'md-icon-add',
                text: 'Add',
                handler: 'toggleAddStaticEntry',
                hidden: true,
                bind: {
                    hidden: '{visibleAdd}'
                },
            }],
        }, {
            xtype: 'formpanel',
            reference: 'staticentryform',
            itemId: 'staticentryform',
            docked: 'top',
            shadow: true,
            // style: 'box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2)',
            padding: '0 16 16 16',
            zIndex: 1,
            layout: {
                type: 'hbox',
                align: 'bottom'
            },
            hidden: true,
            bind: {
                hidden: '{!visibleAdd}'
            },
            defaults: {
                labelAlign: 'top',
                autoComplete: false,
                required: true,
                clearable: false,
                keyMapEnabled: true,
                keyMap: {
                    enter: {
                        key: Ext.event.Event.ENTER,
                        handler: 'addStaticEntryKeyEvt'
                    }
                }
            },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                shadow: false,
                style: 'background: transparent',
                items: [{
                    xtype: 'component',
                    style: 'font-weight: 100; font-size: 14px;',
                    html: 'Add Static Entry',
                }, '->', {
                    xtype: 'button',
                    iconCls: 'md-icon-close',
                    handler: 'toggleAddStaticEntry'
                }]
            }, {
                xtype: 'textfield',
                name: 'address',
                label: 'Address',
                margin: '0 16 0 0',
                width: 200,
                placeholder: 'Enter address ...',
                validators: 'ipany'
            }, {
                xtype: 'textfield',
                name: 'macAddress',
                width: 200,
                label: 'MAC'.t(),
                placeholder: 'Enter MAC address ...'
            }, {
                xtype: 'textfield',
                name: 'description',
                label: 'Description',
                margin: '0 8 0 16',
                flex: 1,
                required: false,
                placeholder: 'Enter description ...'
            }, {
                xtype: 'button',
                text: 'Add',
                ui: 'action',
                margin: '0 0 0 16',
                handler: 'addStaticEntryBtn'
            }],
            listeners: {
                show: function (form) {
                    form.getFields('address').focus();
                },
                hide: function (form) {
                    form.reset(true);
                }
            }
        }],

        bind: '{dhcp.staticDhcpEntries}',
        itemConfig: {
            viewModel: true
        },

        columns: [{
            width: 5,
            minWidth: 5,
            sortable: false,
            hideable: false,
            resizable: false,
            menuDisabled: true,
            cell: {
                userCls: 'x-statuscolumn'
            },
            renderer: function (value, record, dataIndex, cell) {
                cell.setUserCls('');
                if (record.isDirty()) {
                    cell.setUserCls('status-dirty');
                }
                if (record.get('_deleteSchedule')) {
                    cell.setUserCls('status-delete');
                }
                if (record.phantom) {
                    cell.setUserCls('status-phantom');
                }
            }
        }, {
            text: 'Address'.t(),
            dataIndex: 'address',
            width: 360,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                clearable: false,
                required: true,
                validators: 'ipany'
            }
        }, {
            text: 'MAC'.t(),
            dataIndex: 'macAddress',
            width: 220,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                clearable: false,
                required: true
            }
        }, {
            text: 'Description'.t(),
            dataIndex: 'description',
            flex: 1,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                clearable: false
            }
        }, {
            width: 90,
            align: 'right',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    delete: {
                        iconCls: 'md-icon-delete',
                        hidden: true,
                        bind: {
                            hidden: '{record._deleteSchedule}',
                        },
                        handler: function (grid, info) {
                            if (info.record.phantom) {
                                info.record.drop();
                            } else {
                                info.record.set('_deleteSchedule', true);
                            }
                        }
                    },
                    undo: {
                        iconCls: 'md-icon-undo',
                        hidden: true,
                        bind: {
                            hidden: '{!record._deleteSchedule}',
                        },
                        handler: function (grid, info) {
                            info.record.reject();
                        }
                    }
                }
            }
        }]
    }],

    controller: {
        init: function (view) {
            this.load();
        },

        load: function () {
            var me = this,
                vm = me.getViewModel();

            me.model = new Mfw.model.Dhcp();

            me.getView().mask({ xtype: 'loadmask' });
            me.model.load({
                success: function (record) {
                    vm.set('dhcp', record);
                    record.staticDhcpEntries().commitChanges();
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        },

        toggleAddStaticEntry: function () {
            var me = this,
                vm = me.getViewModel(),
                visible = vm.get('visibleAdd');
            vm.set('visibleAdd', !visible);
        },

        addStaticEntryBtn: function (btn) {
            var me = this, form = btn.up('formpanel');
            if (!form.validate()) { return; }

            me.getView().down('#staticEntries').getStore().add(form.getValues());
            form.getFields('address').focus();
            form.reset(true);
        },

        addStaticEntryKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#staticEntries').getStore().add(form.getValues());
            fld.blur();
            form.getFields('address').focus();
            form.reset(true);
        },


        onSave: function (cb) {
            var me = this,
                dhcp = me.getViewModel().get('dhcp');

            dhcp.staticDhcpEntries().each(function (record) {
                if (record.get('_deleteSchedule')) {
                    record.drop();
                }
                record.dirty = true;
                record.phantom = false;
            });

            me.getViewModel().set('visibleAdd', false);

            Sync.progress();
            dhcp.save({
                success: function () {
                    if (Ext.isFunction(cb)) { cb(); } else { me.load(); }
                    Sync.success();
                }
            });
        },

        checkModified: function (cb) {
            var me = this, isModified = false,
                dhcp = me.getViewModel().get('dhcp'),
                store = dhcp.staticDhcpEntries();

            if (dhcp.isDirty() ||
                store.getModifiedRecords().length > 0 ||
                store.getNewRecords().length > 0 ||
                store.getRemovedRecords().length > 0) {
                isModified = true;
            }
            cb(isModified);
        }
    }
});
