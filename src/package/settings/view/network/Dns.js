Ext.define('Mfw.settings.network.Dns', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-dns',

    title: 'DNS'.t(),

    viewModel: {},

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
        xtype: 'panel',
        layout: 'fit',
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
                shadow: false,
                zIndex: 2,
                items: [{
                    xtype: 'component',
                    html: 'Static Entries',
                    style: 'font-weight: 400;'
                }]
            }, {
                xtype: 'formpanel',
                reference: 'staticentryform',
                itemId: 'staticentryform',
                docked: 'top',
                shadow: true,
                padding: '0 16 16 16',
                zIndex: 1,
                layout: {
                    type: 'hbox',
                    align: 'bottom'
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
                    xtype: 'textfield',
                    name: 'name',
                    width: 200,
                    label: 'Add Static Entry'.t(),
                    placeholder: 'Enter name ...'
                }, {
                    xtype: 'textfield',
                    name: 'description',
                    label: 'Description',
                    margin: '0 8 0 16',
                    flex: 1,
                    placeholder: 'Enter description ...'
                }, {
                    xtype: 'textfield',
                    name: 'address',
                    label: 'Address',
                    margin: '0 16 0 8',
                    width: 200,
                    placeholder: 'Enter address ...',
                    validators: ['ipaddress']
                }, {
                    xtype: 'button',
                    text: 'Add',
                    ui: 'action',
                    margin: '0 0 0 16',
                    handler: 'addStaticEntryBtn'
                }]
            }],

            bind: '{dns.staticEntries}',
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
                text: 'Name'.t(),
                dataIndex: 'name',
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
                    clearable: false,
                    required: true
                }
            }, {
                text: 'Address'.t(),
                dataIndex: 'address',
                width: 220,
                cell: {
                    tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                },
                editable: true,
                editor: {
                    xtype: 'textfield',
                    clearable: false,
                    required: true,
                    validators: ['ipaddress']
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
        }]
    }, {
        xtype: 'panel',
        layout: 'fit',
        width: '40%',
        docked: 'right',
        resizable: {
            split: true,
            edges: 'west'
        },
        items: [{
            xtype: 'grid',
            itemId: 'localServers',
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
                shadow: false,
                // padding: '0 8',
                zIndex: 2,
                items: [{
                    xtype: 'component',
                    html: 'Local Servers',
                    style: 'font-weight: 400;'
                }]
            }, {
                xtype: 'formpanel',
                itemId: 'localserverform',
                docked: 'top',
                shadow: true,
                padding: '0 16 16 16',
                zIndex: 1,
                layout: {
                    type: 'hbox',
                    align: 'bottom'
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
                            handler: 'addLocalServerKeyEvt'
                        }
                    }
                },
                items: [{
                    xtype: 'textfield',
                    name: 'domain',
                    flex: 1,
                    label: 'Add Local Server'.t(),
                    placeholder: 'Enter domain ...'
                }, {
                    xtype: 'textfield',
                    name: 'localServer',
                    label: 'Server',
                    margin: '0 8 0 16',
                    width: 200,
                    placeholder: 'Enter server ...',
                    validators: ['ipaddress']
                }, {
                    xtype: 'button',
                    text: 'Add',
                    ui: 'action',
                    margin: '0 0 0 16',
                    handler: 'addLocalServerBtn'
                }]
            }],

            bind: '{dns.localServers}',
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
                text: 'Domain'.t(),
                dataIndex: 'domain',
                flex: 1,
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
                text: 'Server'.t(),
                dataIndex: 'localServer',
                width: 220,
                cell: {
                    tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                },
                editable: true,
                editor: {
                    xtype: 'textfield',
                    clearable: false,
                    required: true,
                    validators: ['ipaddress']
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
        }]
    }],

    controller: {
        init: function (view) {
            this.load();
        },

        load: function () {
            var me = this,
                vm = me.getViewModel();

            me.model = new Mfw.model.Dns();

            me.getView().mask({ xtype: 'loadmask' });
            me.model.load({
                success: function (record) {
                    vm.set('dns', record);
                    record.staticEntries().commitChanges();
                    record.localServers().commitChanges();
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        },

        addStaticEntryBtn: function (btn) {
            var me = this, form = btn.up('formpanel');
            if (!form.validate()) { return; }

            me.getView().down('#staticEntries').getStore().add(form.getValues());
            form.reset(true);
        },

        addStaticEntryKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#staticEntries').getStore().add(form.getValues());
            fld.blur();
            form.reset(true);
        },


        addLocalServerBtn: function (btn) {
            var me = this, form = btn.up('formpanel');
            if (!form.validate()) { return; }

            me.getView().down('#localServers').getStore().add(form.getValues());
            form.reset(true);
        },

        addLocalServerKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#localServers').getStore().add(form.getValues());
            fld.blur();
            form.reset(true);
        },

        onSave: function () {
            var me = this,
                dns = me.getViewModel().get('dns');

            dns.staticEntries().each(function (record) {
                if (record.get('_deleteSchedule')) {
                    record.drop();
                }
                record.dirty = true;
                record.phantom = false;
            });
            dns.localServers().each(function (record) {
                if (record.get('_deleteSchedule')) {
                    record.drop();
                }
                record.dirty = true;
                record.phantom = false;
            });

            me.getView().mask({ xtype: 'loadmask' });
            dns.save({
                callback: function () {
                    me.load();
                    // me.getView().unmask();
                }
            });

        }
    }
});
