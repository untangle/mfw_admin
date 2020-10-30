Ext.define('Mfw.settings.network.Dhcp', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-dhcp',

    title: 'Leases and Reservations'.t(),

    viewModel: {
        data: {
            visibleAdd: false
        }
    },

    layout: {
        type: 'vbox',
    },

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
        itemId: 'reservations',
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        emptyText: 'No data',
        selectable: false,
        flex: 1,
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
            items: [{
                xtype: 'component',
                html: 'Reservations'.t(),
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
                    html: 'Add Reservation',
                }, '->', {
                    xtype: 'button',
                    iconCls: 'md-icon-close',
                    handler: 'toggleAddStaticEntry'
                }]
            }, {
                xtype: 'textfield',
                name: 'address',
                label: 'IP Address',
                margin: '0 16 0 0',
                width: 340,
                placeholder: 'Enter IP address ...',
                validators: 'ipany'
            }, {
                xtype: 'textfield',
                name: 'macAddress',
                width: 300,
                label: 'MAC Address'.t(),
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
            text: 'IP Address'.t(),
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
            text: 'MAC Address'.t(),
            dataIndex: 'macAddress',
            width: 320,
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
    }, {
        xtype: 'grid',
        itemId: 'leases',
        flex: 1,
        store: {
            model: 'Mfw.model.DhcpLease'
        },
        emptyText: 'No data',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            shadow: false,
            zIndex: 2,
            padding: '0 8 0 16',
            items: [{
                xtype: 'component',
                html: 'Leases'.t(),
                style: 'font-weight: 400;'
            }, '->', {
                xtype: 'textfield',
                label: 'Search',
                labelAlign: 'left',
                iconCls: 'md-icon-add',
            }],
        }],
        columns: [{
            text: 'Expiration'.t(),
            dataIndex: 'leaseExpiration',
            width: 200
        }, {
            text: 'MAC Address'.t(),
            dataIndex: 'macAddress',
            width: 300
        }, {
            text: 'IP Address'.t(),
            dataIndex: 'ipAddress',
            width: 300
        }, {
            text: 'Host'.t(),
            dataIndex: 'hostName',
            flex: 1,
        }]
    }],

    controller: {
        init: function (view) {
            var me = this;
            me.reservationModel = new Mfw.model.Dhcp();
            me.leaseModel = new Mfw.model.DhcpLease();
            me.load();
        },

        load: function () {
            var me = this,
                vm = me.getViewModel();

            me.getView().mask({ xtype: 'loadmask' });
            me.reservationModel.load({
                success: function (record) {
                    vm.set('dhcp', record);
                    record.staticDhcpEntries().commitChanges();
                },
                callback: function () {
                    me.leaseModel.load({
                        callback: function () {
                            me.getView().unmask();
                        }
                    })
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

            me.getView().down('#reservations').getStore().add(form.getValues());
            form.getFields('address').focus();
            form.reset(true);
            me.toggleAddStaticEntry();
        },

        addStaticEntryKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#reservations').getStore().add(form.getValues());
            fld.blur();
            form.getFields('address').focus();
            form.reset(true);
            me.toggleAddStaticEntry();
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
