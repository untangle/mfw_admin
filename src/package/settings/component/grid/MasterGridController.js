/**
 * MasterGrid controller
 * Methods can be overridden by child controllers extending this
 */
Ext.define('Mfw.cmp.grid.MasterGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mastergrid',

    onInitialize: function (g) {
        var titleBar = g.getTitleBar(),
            toolbarActions = [],
            tools = {},
            toolbarMenu,
            actionsColumn;

        // g.getStore().on('beforesync', me.onBeforeSync);

        // add status column
        if (g.getEnableStatusColumn()) {
            g.insertColumn(0, {
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
            });
        }

        if (g.getEnableCopy() || g.getEnableEdit() || g.getEnableDelete()) {
            actionsColumn = {
                text: 'Actions'.t(),
                align: 'center',
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,
                cell: {
                    tools: {}
                }
            };

            if (g.getEnableEdit()) {
                tools.edit = {
                    handler: 'onEditRecord',
                    iconCls: 'md-icon-edit',
                    hidden: true,
                    bind: {
                        hidden: '{record._deleteSchedule}',
                    }
                };
                if (g.getDisableEditCondition()) {
                    tools.edit.disabled = true;
                    tools.edit.bind.disabled = g.getDisableEditCondition();
                }
            }

            if (g.getEnableCopy()) {
                tools.copy =  {
                    handler: 'onCopyRecord',
                    iconCls: 'md-icon-library-add',
                    hidden: true,
                    bind: {
                        hidden: '{record._deleteSchedule}'
                    }
                };

                if (g.getDisableCopyCondition()) {
                    tools.copy.disabled = true;
                    tools.copy.bind.disabled = g.getDisableCopyCondition();
                }
            }

            if (g.getEnableDelete()) {
                tools.delete =  {
                    handler: 'onDeleteRecord',
                    iconCls: 'md-icon-delete',
                    hidden: true,
                    bind: {
                        hidden: '{record._deleteSchedule}',
                    }
                };

                if (g.getDisableDeleteCondition()) {
                    tools.delete.disabled = true;
                    tools.delete.bind.disabled = g.getDisableDeleteCondition();
                }

                tools.undodelete = {
                    handler: 'onUndoDeleteRecord',
                    iconCls: 'md-icon-undo',
                    hidden: true,
                    bind: {
                        hidden: '{!record._deleteSchedule}',
                    }
                };
            }

            actionsColumn.cell.tools = tools;
            g.addColumn(actionsColumn);
        }


        if (g.getEnableManualSort()) {
            toolbarActions.push({
                xtype: 'segmentedbutton',
                allowToggle: false,
                align: 'right',
                hidden: true,
                bind: {
                    hidden: '{selcount !== 1}'
                },
                defaults: {
                    // ui: 'default',
                    handler: 'onSort',
                },
                items: [{
                    iconCls: 'x-fa fa-angle-double-up',
                    tooltip: 'Move First'.t(),
                    pos: 'first'
                }, {
                    iconCls: 'x-fa fa-angle-up',
                    tooltip: 'Move Up'.t(),
                    pos: 'up'
                }, {
                    iconCls: 'x-fa fa-angle-down',
                    tooltip: 'Move Down'.t(),
                    pos: 'down'
                }, {
                    iconCls: 'x-fa fa-angle-double-down',
                    tooltip: 'Move Last'.t(),
                    pos: 'last'
                }]
            });
        }

        if (g.getEnableReload()) {
            toolbarActions.push({
                // text: 'Reload'.t(),
                iconCls: 'md-icon-refresh',
                align: 'right',
                handler: 'onLoad'
            });
        }

        if (g.getEnableAdd()) {
            toolbarActions.push({
                text: 'Add'.t(),
                iconCls: 'md-icon-add',
                align: 'right',
                handler: 'onAddRecord'
            });
        }

        if (g.getEnableAddInterface()) {
            toolbarActions.push({
                text: 'Add Interface'.t(),
                iconCls: 'md-icon-keyboard-arrow-down',
                align: 'right',
                arrow: false,
                menuAlign: 'tr-br?',
                stretchMenu: true,
                menu: {
                    items: [{
                        text: 'OpenVPN',
                        type: 'OPENVPN',
                        handler: 'onAddInterface'
                    },{
                        text: 'WireGuard VPN',
                        type: 'WIREGUARD',
                        handler: 'onAddInterface'
                    }]
                }
            });
        }

        if (g.getEnableReload() || g.getEnableImport() || g.getEnableExport() || g.getEnableReset()) {
            toolbarMenu = {
                xtype: 'button',
                iconCls: 'md-icon-keyboard-arrow-down',
                text: 'More',
                arrow: false,
                menuAlign: 'tr-br?',
                align: 'right',
                menu: {
                    items: []
                }
            };

            // not implemented
            // if (g.getEnableImport()) {
            //     toolbarMenu.menu.items.push( { text: 'Import'.t(), iconCls: 'md-icon-call-received', handler: 'onImport' } );
            // }

            if (g.getEnableExport()) {
                toolbarMenu.menu.items.push( { text: 'Export'.t(), iconCls: 'md-icon-call-made', handler: 'onExport' } );
            }

            if (g.getEnableReset()) {
                toolbarMenu.menu.items.push( { text: 'Load Defaults'.t(), iconCls: 'md-icon-sync', handler: 'onReset' } );
            }

            toolbarActions.push(toolbarMenu);
        }

        if (g.getEnableSave()) {
            toolbarActions.push({
                text: 'Save'.t(),
                iconCls: 'md-icon-save',
                align: 'right',
                handler: 'onSave'
            });
        }

        if (toolbarActions.length > 0) {
            titleBar.add(toolbarActions);
        }

        this.onLoad();
    },

    onLoad: function () {
        var grid = this.getView();
        grid.getSelectable().deselectAll();

        grid.mask({xtype: 'loadmask'});

        grid.getStore().load(function(records) {
            // console.log(records);
        });
    },

    /**
     * Important, set record flags so it pushes (update) all the data regardless
     * of the records is modified or not
     */
    beforeSave: function () {
        this.getView().getStore().each(function (record) {
            if (record.get('_deleteSchedule')) {
                record.drop();
            }
            record.dirty = true; // to push all non-dropped records
            record.phantom = false; // to push new records
        });
    },

    onSave: function () {
        var me = this,
            grid = me.getView();

        me.beforeSave();

        Sync.progress();

        grid.getStore().sync({
            success: function (cb) {
                if (Ext.isFunction(cb)) { cb(); } else { me.onLoad(); }
                Sync.success();
            }
        });
    },

    onAddRecord: function () {
        var me = this, grid = me.getView(),
            newRecord = Ext.create(grid.getStore().getModel());

        // if custom editor sheet
        if (grid.getEditor()) {
            if (!me.sheet) {
                me.sheet = Ext.Viewport.add({
                    xtype: grid.getEditor(),
                    isNewRecord: true,
                    // ownerCmp: grid
                });
            }
            me.sheet.isNewRecord = true;
            me.sheet.getViewModel().set('rec', newRecord);
            me.sheet.show();
            return;
        }

        // otherwise use generic editor sheet
        me.getView().fireEvent('masteredit', grid, newRecord);
    },

    onEditRecord: function (grid, info) {
        var me = this;

        // if custom editor sheet
        if (grid.getEditor()) {
            if (!me.sheet) {
                me.sheet = grid.add({
                    xtype: grid.getEditor(),
                    // record: info.record,
                    isNewRecord: false
                });
            }
            me.sheet.isNewRecord = false;

            me.sheet.getViewModel().set('record', info.record);
            me.sheet.show();
            return;
        }

        // otherwise use generic editor sheet
        me.getView().fireEvent('masteredit', grid, info.record);
    },

    onCopyRecord: function (cmp) {
        var me = this,
            copiedRecord = cmp.getRecord().clone();

        // copiedRecord.phantom = true;
        // copiedRecord.dirty = false;
        // if (!me.dialog) {
        //     me.dialog = Ext.Viewport.add({
        //         xtype: me.getView().getEditorDialog(),
        //         // xtype: 'masterdialog',
        //         isNewRecord: true,
        //         ownerCmp: me.getView()
        //     });
        // }
        // me.dialog.isNewRecord = true;
        // me.dialog.getViewModel().set('rec', copiedRecord);
        // me.dialog.show();

        copiedRecord.phantom = true;
        copiedRecord.dirty = false;
        if (!me.sheet) {
            me.sheet = Ext.Viewport.add({
                xtype: me.getView().getEditorDialog(),
                ownerCmp: me.getView()
            });
        }
        me.sheet.getViewModel().set({ rec: copiedRecord, isNew: true });
        me.sheet.show();
    },

    onDeleteRecord: function (grid, info) {
        info.record.set('_deleteSchedule', true);
    },

    onUndoDeleteRecord: function (grid, info) {
        info.record.set('_deleteSchedule', false);
    },

    onSelect: function (grid, selected) {
        grid.getViewModel().set('selcount', selected.length);
    },

    onDeselect: function (grid) {
        grid.getViewModel().set('selcount', 0);
    },

    onSort: function (btn) {
        // var grid = this;
        var store = this.getView().getStore(),
        record = this.getView().getSelection(),
        oldIndex = store.indexOf(record),
        newIndex, pos;
        switch (btn.pos) {
            case 'first': newIndex = 0; break;
            case 'up':    newIndex = oldIndex > 0 ? (oldIndex - 1) : oldIndex; break;
            case 'down':  newIndex = oldIndex < store.getCount() ? (oldIndex + 1) : oldIndex; break;
            case 'last':  newIndex = store.getCount(); break;
            default: break;
        }
        store.removeAt(oldIndex);
        store.insert(newIndex, record);
        store.sync();

        if (store.indexOf(record) === 0) { pos = 'first'; }
        if (store.indexOf(record) === store.getCount() - 1) { pos = 'last'; }

        this.getView().setSelection(record);
        this.getViewModel().set('pos', pos);
    },

    onImport: function () {
        Ext.toast('open import dialog');
    },

    onExport: function () {
        var grid = this.getView(),
            fileName = grid.getTitle().replace(/ /g, '_') + '-' + moment.tz(Mfw.app.tz.displayName).format('DD-MM-YY-hhmmA');

        Util.export(grid.getStore(), fileName);
    },

    onReset: function () {
        var me = this, store = me.getView().getStore(),
            api = store.getProxy().getApi();

        Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
            'All existing <strong>' + this.getView().getTitle() + '</strong> settings will be replace with defauts.<br/>Do you want to continue?',
            function (answer) {
                if (answer === 'yes') {
                    // update proxy api to support reset
                    store.getProxy().setApi({ read: api.read.replace('/settings/', '/defaults/') });
                    // revert api to it's default values
                    store.load(function (records, operation, success) {
                        store.getProxy().setApi(api);
                        if (!success) {
                            console.error('Unable to fetch defaults!');
                        }
                    });
                }
            });
    },


    checkModified: function (cb) {
        var isModified = false,
            store = this.getView().getStore(),
            modified = store.getModifiedRecords(),
            added = store.getNewRecords(),
            removed = store.getRemovedRecords();
        if (modified.length > 0 || added.length > 0 || removed.length > 0) {
            isModified = true;
        }
        cb(isModified);
    },

    onDestroy: function () {
        console.log('destroy');
    }

});
