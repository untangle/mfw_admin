/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.cmp.grid.MasterGrid', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mastergrid',

    viewModel: {},

    config: {
        // gridActions: ['add'],
        editType: 'dialog', // 'dialog', 'inline',
        // editPlacement: null, // 'row', 'bar'

        addType: 'dialog', // 'dialog', 'inline',
        addRecordModel: null, // the record model to be created on Add action

        editRow: true, // adds an Edit action for the row/record
        deleteRow: true, // adds an Delete action for the row/record

        manualSort: true
    },

    // items: [{
    //     xtype: 'toolbar',
    //     itemId: 'bar',
    //     docked: 'top',
    //     margin: 0,
    //     shadow: false,
    //     items: [{
    //         xtype: 'component',
    //         style: 'color: #777; font-size: 18px; font-weight: normal;',
    //         html: 'Port Forward Rules'.t() + '<br/><span style="font-size: 12px;">Firewall</span>'
    //     }, '->', {
    //         text: 'Add',
    //         iconCls: 'x-fa fa-plus-circle',
    //         handler: 'addRecord'
    //     }]
    //     // margin: '0 0 0 8',
    // }, {
    //     xtype: 'toolbar',
    //     // padding: '0 8',
    //     itemId: 'operations',
    //     // ui: 'footer',
    //     docked: 'top',
    //     shadow: false,
    //     hidden: true,
    //     bind: {
    //         hidden: '{selcount === 0}'
    //     },
    //     items: [{
    //         xtype: 'segmentedbutton',
    //         margin: '0 20 0 0',
    //         allowToggle: false,
    //         hidden: true,
    //         bind: {
    //             hidden: '{selcount !== 1}'
    //         },
    //         defaults: {
    //             ui: 'default',
    //             handler: 'onSort',
    //         },
    //         items: [{
    //             iconCls: 'x-fa fa-angle-double-up',
    //             tooltip: 'Move First'.t(),
    //             pos: 'first'
    //         }, {
    //             iconCls: 'x-fa fa-angle-up',
    //             tooltip: 'Move Up'.t(),
    //             pos: 'up'
    //         }, {
    //             iconCls: 'x-fa fa-angle-down',
    //             tooltip: 'Move Down'.t(),
    //             pos: 'down'
    //         }, {
    //             iconCls: 'x-fa fa-angle-double-down',
    //             tooltip: 'Move Last'.t(),
    //             pos: 'last'
    //         }]
    //     }, '->', {
    //         xtype: 'button',
    //         ui: 'action round',
    //         iconCls: 'x-fa fa-pencil',
    //         margin: '0 16 0 0',
    //         hidden: true,
    //         bind: {
    //             hidden: '{selcount !== 1}'
    //         },
    //         handler: 'onEdit'
    //     }, {
    //         xtype: 'button',
    //         ui: 'action round',
    //         iconCls: 'x-fa fa-trash',
    //         hidden: true,
    //         bind: {
    //             hidden: '{selcount === 0}'
    //         }
    //     }]
    // }],

    scrollable: true,

    selectable: {
        mode: 'multi',
        // checkbox: true,
        deselectable: true,
        drag: true
    },

    bind: {
        hideHeaders: '{smallScreen}'
    },

    itemConfig: {

    },

    listeners: {
        initialize: 'onInitialize',
        select: 'onSelect',
        deselect: 'onSelect',
        destroy: 'onDestroy'
    },


    // constructor: function (config) {
    //     var me = this,
    //         cols = me.getInitialConfig('columns');
    //     console.log(me.config.columns);
    //     // config = Ext.applyIf(config, {
    //     //     columns: cols
    //     // });
    //     // var me = this,
    //     //     actionsColumn = {
    //     //         text: 'Actions'.t(),
    //     //         align: 'center',
    //     //         cell: {
    //     //             tools: {}
    //     //         }
    //     //     };

    //     // var columns = Ext.clone(me.getInitialConfig('columns'));
    //     // console.log();

    //     // // var cols = me.config.columns;

    //     // //
    //     // if (me.config.recordActions.length > 0) {
    //     //     Ext.Array.each(me.config.recordActions, function (action) {
    //     //         switch (action) {
    //     //             case 'edit': actionsColumn.cell.tools.gear = { iconCls: 'x-fa fa-pencil', handler: 'onEditRecord' }; break;
    //     //             case 'delete': actionsColumn.cell.tools.minus = { iconCls: 'x-fa fa-trash', handler: 'onDeleteRecord' }; break;
    //     //             default: Ext.emptyFn;
    //     //         }
    //     //     });
    //     //     // Ext.merge(actionsColumn, columns);
    //     //     columns.push(actionsColumn);
    //     //     Ext.apply(me.config.columns, columns);
    //     //     // console.log(me.config.columns);
    //     // }
    //     var me = this;
    //     me.callParent([ config ]);
    //     return me;
    // },

    controller: {
        onDestroy: function () {
            this.getView().setRecordActions([]);
        },


        onInitialize: function (g) {
            // var columns = grid.getInitialConfig('columns');
            var titleBar = g.getTitleBar(), actionsColumn;

            if (g.getEditRow() || g.getDeleteRow()) {
                actionsColumn = {
                    align: 'center',
                    cell: {
                        tools: {}
                    }
                };
                if (g.getEditRow()) { actionsColumn.cell.tools.gear = { iconCls: 'x-fa fa-pencil', handler: 'onEditRecord' } }
                if (g.getDeleteRow()) { actionsColumn.cell.tools.minus = { iconCls: 'x-fa fa-trash', handler: 'onDeleteRecord' } }
                g.addColumn(actionsColumn);
            }


            if (g.getManualSort()) {
                titleBar.add({
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

            if (g.getAddType()) {
                titleBar.add({
                    text: 'Add'.t(),
                    iconCls: 'x-fa fa-plus-circle',
                    align: 'right',
                    handler: function () {
                        Ext.toast('Add new record!');
                    }
                })
            }

            console.log(g.getTitleBar().getTitle());
        },

        onEditRecord: function (grid, info) {
            if (grid.getEditType() === 'dialog') {
                Ext.toast('Edit dialog to be shown!');
            }
        },

        onSelect: function (grid) {
            var selcount = grid.getSelections().length;
            grid.getViewModel().set('selcount', selcount);
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
        onDeleteRecord: function (grid, info) {
            console.log(info);
            info.record.set('_deleteSchedule', true);
            // info.record.drop();
        }
    }

});
