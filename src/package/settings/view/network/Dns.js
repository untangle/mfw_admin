Ext.define('Mfw.settings.network.Dns', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-dns',

    title: 'DNS'.t(),

    viewModel: {
        data: {
            visibleAddStaticEntry: false,
            visibleAddLocalServer: false
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
                padding: '0 8 0 16',
                bind: {
                    shadow: '{!visibleAddStaticEntry}'
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
                        hidden: '{visibleAddStaticEntry}'
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
                    hidden: '{!visibleAddStaticEntry}'
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
                    name: 'name',
                    width: 200,
                    label: 'Name'.t(),
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
                }],
                listeners: {
                    show: function (form) {
                        form.getFields('name').focus();
                    },
                    hide: function (form) {
                        form.reset(true);
                    }
                }
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
                bind: {
                    shadow: '{!visibleAddLocalServer}'
                },
                zIndex: 2,
                padding: '0 8 0 16',
                items: [{
                    xtype: 'component',
                    html: 'Local Servers',
                    style: 'font-weight: 400;'
                }, '->', {
                    xtype: 'button',
                    iconCls: 'md-icon-add',
                    text: 'Add',
                    handler: 'toggleAddLocalServer',
                    hidden: true,
                    bind: {
                        hidden: '{visibleAddLocalServer}'
                    },
                }]
            }, {
                xtype: 'formpanel',
                itemId: 'localserverform',
                docked: 'top',
                shadow: true,
                // style: 'box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2)',
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
                hidden: true,
                bind: {
                    hidden: '{!visibleAddLocalServer}'
                },
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    style: 'background: transparent',
                    items: [{
                        xtype: 'component',
                        style: 'font-weight: 100; font-size: 14px;',
                        html: 'Add Local Server',
                    }, '->', {
                        xtype: 'button',
                        iconCls: 'md-icon-close',
                        handler: 'toggleAddLocalServer'
                    }]
                }, {
                    xtype: 'textfield',
                    name: 'domain',
                    flex: 1,
                    label: 'Domain'.t(),
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
                }],
                listeners: {
                    show: function (form) {
                        form.getFields('domain').focus();
                    },
                    hide: function (form) {
                        form.reset(true);
                    }
                }
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

        toggleAddStaticEntry: function () {
            var me = this,
                vm = me.getViewModel(),
                visible = vm.get('visibleAddStaticEntry');
            vm.set('visibleAddStaticEntry', !visible);
        },

        toggleAddLocalServer: function () {
            var me = this,
                vm = me.getViewModel(),
                visible = vm.get('visibleAddLocalServer');
            vm.set('visibleAddLocalServer', !visible);
        },

        addStaticEntryBtn: function (btn) {
            var me = this, form = btn.up('formpanel');
            if (!form.validate()) { return; }

            me.getView().down('#staticEntries').getStore().add(form.getValues());
            form.getFields('name').focus();
            form.reset(true);
        },

        addStaticEntryKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#staticEntries').getStore().add(form.getValues());
            fld.blur();
            form.getFields('name').focus();
            form.reset(true);
        },


        addLocalServerBtn: function (btn) {
            var me = this, form = btn.up('formpanel');
            if (!form.validate()) { return; }

            me.getView().down('#localServers').getStore().add(form.getValues());
            form.getFields('domain').focus();
            form.reset(true);
        },

        addLocalServerKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#localServers').getStore().add(form.getValues());
            form.getFields('domain').focus();
            fld.blur();
            form.reset(true);
        },

        onSave: function (cb) {
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

            me.getViewModel().set({
                visibleAddStaticEntry: false,
                visibleAddLocalServer: false
            });

            Sync.progress();
            dns.save({
                success: function () {
                    if (Ext.isFunction(cb)) { cb(); } else { me.load(); }
                    Sync.success();
                }
            });
        },

        checkModified: function (cb) {
            var me = this, isModified = false,
                dns = me.getViewModel().get('dns'),
                entries = dns.staticEntries(),
                servers = dns.localServers();

            if (entries.getModifiedRecords().length > 0 ||
                entries.getNewRecords().length > 0 ||
                entries.getRemovedRecords().length > 0 ||
                servers.getModifiedRecords().length > 0 ||
                servers.getNewRecords().length > 0 ||
                servers.getRemovedRecords().length > 0) {
                isModified = true;
            }
            cb(isModified);
        }
    }
});
