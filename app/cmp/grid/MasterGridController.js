/**
 * MasterGrid controller
 * Methods can be overridden by child controllers extending this
 */
Ext.define('Mfw.cmp.grid.MasterGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mastergrid',


    onDestroy: function () {
        // this.getView().setRecordActions([]);
    },

    onBlur: function () {
        console.log('blur');
    },

    onInitialize: function (g) {
        var me = this, titleBar = g.getTitleBar(),
            toolbarActions = [],
            actionsColumn;

        // add status column
        g.insertColumn(0, {
            width: 5,
            minWidth: 5,
            sortable: false,
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

        if (g.getEnableEdit() || g.getEnableDelete()) {
            actionsColumn = {
                align: 'center',
                cell: {
                    xtype: 'widgetcell',
                    widget: {
                        xtype: 'container',
                        items: [],
                        bind: {
                            record: '{record}'
                        }
                    },
                }
            };

            if (g.getEnableEdit()) {
                actionsColumn.cell.widget.items.push({
                    xtype: 'tool',
                    margin: '0 5',
                    iconCls: 'x-fa fa-pencil',
                    handler: 'onEditRecord',
                    hidden: true,
                    bind: { hidden: '{record._deleteSchedule}' }
                })
            }

            if (g.getEnableDelete()) {
                actionsColumn.cell.widget.items.push({
                    xtype: 'tool',
                    margin: '0 5',
                    iconCls: 'x-fa fa-trash',
                    handler: function (cmp) {
                        if (cmp.getRecord().phantom) {
                            cmp.getRecord().drop();
                            return;
                        }
                        cmp.getRecord().set('_deleteSchedule', true);
                        cmp.up('gridrow').setUserCls('x-removed');
                    },
                    hidden: true,
                    bind: {
                        hidden: '{record._deleteSchedule}',
                        disabled: Ext.isString(g.getEnableDelete()) ? g.getEnableDelete() : false
                    }
                });
                actionsColumn.cell.widget.items.push({
                    xtype: 'button',
                    text: 'Undo'.t(),
                    iconCls: 'x-fa fa-trash',
                    iconAlign: 'right',
                    handler: function (btn) { btn.up('container').getRecord().set('_deleteSchedule', false); btn.up('gridrow').setUserCls(''); },
                    hidden: true,
                    bind: { hidden: '{!record._deleteSchedule}' }
                });
            }
            g.addColumn(actionsColumn);
        }


        if (g.getEnableManualSort()) {
            // g.setSortable(false);
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
            })
        }

        if (g.getEnableAdd()) {
            toolbarActions.push({
                // text: 'Add'.t(),
                iconCls: 'x-fa fa-plus-circle',
                align: 'right',
                handler: 'onAddRecord'
            })
        }

        if (g.getEnableReload()) {
            toolbarActions.push({
                // text: 'Reload'.t(),
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                handler: 'onLoad'
            })
        }

        toolbarActions.push({
            text: 'Save'.t(),
            iconCls: 'x-fa fa-floppy-o',
            align: 'right',
            handler: 'onSync'
        })

        if (toolbarActions.length > 0) {
            titleBar.add(toolbarActions);
        }

        this.onLoad();
    },

    onLoad: function () {
        console.log('load');
        this.getView().getStore().load({
            success: function () {
                console.log('success');
            },
            failure: function () {}
        });
    },

    onBeforeSync: function (opts) {

    },

    onSync: function () {
        this.getView().getStore().each(function (record) {
            if (record.get('_deleteSchedule')) {
                record.drop();
            }
            record.dirty = true; // to push all non-dropped records
            record.phantom = false; // to push new records
        });
        this.getView().getStore().sync({
            success: function () {
                Ext.toast('Settings saved!');
            }
        });
    },

    onAddRecord: function () {
        var me = this,
            newRecord = Ext.create(me.getView().getNewRecordModel());
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: me.getView().getEditorDialog(),
                isNewRecord: true,
                ownerCmp: me.getView()
            });
        }
        // info.record.getValidation()
        me.dialog.isNewRecord = true;
        me.dialog.getViewModel().set('rec', newRecord);
        me.dialog.show();
    },

    onEditRecord: function (cmp) {
        var me = this;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: me.getView().getEditorDialog(),
                isNewRecord: false,
                ownerCmp: me.getView()
            });
        }
        // info.record.getValidation()
        me.dialog.isNewRecord = false;
        me.dialog.getViewModel().set('rec', cmp.getRecord());
        me.dialog.show();
    },

    onSelect: function (grid, selected) {
        grid.getViewModel().set('selcount', selected.length);
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

    addRecord: function () {

    },

    onEdit: function () {
        var store = this.getView().getStore(),
        record = this.getView().getSelection();

        var me = this;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: 'rule-dialog',
                // ownerCmp: me.getView(),
                listeners: {
                    hide: function () {
                        console.log('hide');
                        store.commitChanges();
                    }
                }
            });
        }
        // me.dialog.setAddAction(!condition);
        me.dialog.getViewModel().set('record', record);
        me.dialog.show();
    },

    // onDialogHide: function () {
    //     console.log('hide');
    // }
    ////////////////////////////////
    // onDeleteRecord: function (grid, info) {
    //     console.log(info);
    //     info.record.set('_deleteSchedule', true);
    //     console.log(info.record.getData());
    //     // info.record.drop();
    // }

    onDeleteRecord: function (cmp, info) {

        console.log(cmp.getRecord());
    },

    onUndoDeleteRecord: function (btn) {

    }
});
