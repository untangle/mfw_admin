Ext.define('Mfw.cmp.grid.TableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tablegrid',

    onInitialize: function (grid) {
        var me = this, table,
            actionsColumn;

            me.chainsmenu = grid.down('#chainsmenu');

            grid.getTitleBar().setPadding('0 8 0 16');
            grid.getTitleBar().add([{
                xtype: 'button',
                text: 'Save'.t(),
                iconCls: 'md-icon-save',
                align: 'right',
                handler: 'onSave'
            }, {
                xtype: 'button',
                iconCls: 'md-icon-more-vert',
                align: 'right',
                arrow: false,
                menu: {
                    anchor: true,
                    items: [{
                        xtype: 'component',
                        bind: {
                            html: '{selectedChain.editable ? "Rules" : "Rules (readonly)"}'
                        },
                        style: 'font-size: 14px; font-weight: bold;'
                    }, {
                        text: 'New'.t(),
                        iconCls: 'md-icon-add',
                        menuHideDelay: 0,
                        hidden: true,
                        bind: { hidden: '{!selectedChain.editable}' },
                        handler: 'onNewRule'
                    }, {
                        text: 'Import',
                        iconCls: 'md-icon-call-received',
                        hidden: true,
                        bind: { hidden: '{!selectedChain.editable}' },
                        // handler: 'onImport'
                    }, {
                        text: 'Export',
                        iconCls: 'md-icon-call-made',
                        // handler: 'onNewRule'
                    }, '-', {
                        xtype: 'component',
                        html: 'Chain',
                        style: 'font-size: 14px; font-weight: bold;'
                    }, {
                        text: 'New'.t(),
                        iconCls: 'md-icon-add',
                        menuHideDelay: 0
                    }, {
                        text: 'Edit'.t(),
                        iconCls: 'md-icon-edit',
                        menuHideDelay: 0,
                        hidden: true,
                        bind: { hidden: '{!selectedChain.editable}' },
                    }, {
                        text: 'Delete'.t(),
                        iconCls: 'md-icon-delete',
                        menuHideDelay: 0,
                        hidden: true,
                        bind: { hidden: '{!selectedChain.editable}' },
                    }, {
                        text: 'Set as Default'.t(),
                        iconCls: 'md-icon-star',
                        menuHideDelay: 0,
                        hidden: true,
                        bind: { hidden: '{!selectedChain.editable || selectedChain.default}' },
                    }, '-', {
                        text: 'Reload',
                        iconCls: 'md-icon-refresh',
                        handler: 'onLoad'
                    }, {
                        text: 'Load Defaults',
                        iconCls: 'md-icon-sync',
                        handler: 'onDefaults'
                    }]
                }
            }]);

        // g.getStore().on('beforesync', me.onBeforeSync);

        // add status column
        grid.insertColumn(0, {
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

        actionsColumn = {
            // text: 'Actions'.t(),
            width: 80,
            align: 'center',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            cell: {
                tools: {
                    edit: {
                        iconCls: 'md-icon-edit',
                        hidden: true,
                        bind: { hidden: '{record._deleteSchedule}' },
                        handler: 'onEditRule'
                    },
                    delete: {
                        handler: 'onDeleteRecord',
                        iconCls: 'md-icon-delete',
                        hidden: true,
                        bind: { hidden: '{record._deleteSchedule}' }
                    },
                    undo: {
                        handler: 'onUndoDeleteRecord',
                        iconCls: 'md-icon-undo',
                        hidden: true,
                        bind: { hidden: '{!record._deleteSchedule}' }
                    }
                }
            }
        };

        grid.addColumn(actionsColumn);


        // if (g.getEnableManualSort()) {
        //     toolbarActions.push({
        //         xtype: 'segmentedbutton',
        //         allowToggle: false,
        //         align: 'right',
        //         hidden: true,
        //         bind: {
        //             hidden: '{selcount !== 1}'
        //         },
        //         defaults: {
        //             // ui: 'default',
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
        //     })
        // }

        me.table = table = new Mfw.model.Table();
        table.getProxy().setApi(grid.getApi());

        me.onLoad();
    },

    /**
     * Loads the full table record containing chains with rules
     */
    onLoad: function () {
        var me = this, grid = me.getView();
        grid.getSelectable().deselectAll();
        grid.mask();
        me.table.load({
            success: function (record) {
                me.record = record;
                me.selectChain();
                me.updateChainsMenu();
            },
            callback: function () {
                grid.unmask();
                // if reset API used, revert to default API
                if (!me.table.getProxy().getApi().update) {
                    me.table.getProxy().setApi(grid.getApi());
                }
            }
        });
    },

    /**
     * Load system defaults by modifying the read API route
     */
    onDefaults: function () {
        var me = this, grid = me.getView(),
            api = grid.getApi();

        Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
            'All existing <strong>' + this.getView().getTitle() + '</strong> settings will be replace with defauts.<br/>Do you want to continue?',
            function (answer) {
                if (answer === 'yes') {
                    // update proxy api to load defaults
                    me.table.getProxy().setApi({ read: api.read.replace('/settings/', '/defaults/') });
                    me.onLoad();
                }
            });
    },

    /**
     * Selects a chain from given table chains and fills the grid
     * with selected chain rules
     */
    selectChain: function (name) {
        var me = this,
            // grid = me.getView(),
            vm = me.getViewModel(),
            chains = me.record.chains(), chain;

        if (!name) {
            me.selectedChain = chain = chains.findRecord('default', true) || chains.findRecord('base', true);
        } else {
            me.selectedChain = chain = chains.findRecord('name', name);
        }

        if (!chain) {
            console.error('No default, base or given name chain found!');
            return;
        }

        vm.set('selectedChain', chain);
    },

    /**
     * updates the menuitems selection for chains
     */
    updateChainsMenu: function () {
        var me = this, menuItems = [], tpl;
        me.record.chains().each(function (chain) {
            // on initial load set records as not dirty or phantom
            chain.rules().each(function (record) {
                record.dirty = false;
                record.phantom = false;
            });
            tpl = '<p>' + chain.get('name') +
                   (chain.get('base') ? '<span class="base">BASE</span>' : '') +
                   (chain.get('default') ? '<span class="default">DEFAULT</span>' : '') +
                   (!chain.get('editable') ? '<span class="readonly">READONLY</span>' : '') +
                   '<br/><em>' + chain.get('description') + '</em></p>';
            menuItems.push({
                bind: {
                    userCls: '{selectedChain.name === "' + chain.get('name') + '" ? "selected" : ""}'
                },
                html: tpl,
                handler: function (item) { item.up('menu').hide(); me.selectChain(chain.get('name')) }
            });
        });
        me.chainsmenu.getMenu().setItems(menuItems);
    },

    onEditRule: function (grid, info) {
        var me = this, form;
        if (!me.sheet) {
            me.sheet = grid.add({
                xtype: 'rulesheet'
            });
        }
        form = me.sheet.down('#ruleform');
        form.setRecord(info.record);
        form.down('grid').setStore(info.record.conditions());
        me.sheet.show();
        return;

    },

    onNewRule: function () {
        var me = this, grid = me.getView(),
            rule = new Ext.create('Mfw.model.Rule');
            grid.getStore().add(rule);
        // if (!me.sheet) {
        //     me.sheet = grid.add({
        //         xtype: 'rulesheet',
        //         grid: grid
        //     });
        // }
        // me.sheet.down('grid').setStore({ data: [] });
        // me.sheet.show();
        return;
    },


    // /**
    //  * Important, set record flags so it pushes (update) all the data regardless
    //  * of the records is modified or not
    //  */
    // beforeSave: function () {
    //     console.log('beforesave');
    //     this.getView().getStore().each(function (record) {
    //         if (record.get('_deleteSchedule')) {
    //             record.drop();
    //         }
    //         record.dirty = true; // to push all non-dropped records
    //         record.phantom = false; // to push new records
    //     });
    // },

    onSave: function () {
        var me = this;
        // me.beforeSave();
        me.table.save({
            success: function () {
                Ext.toast('Settings saved!', 3000);
                me.onLoad();
            },
            callback: function () {
                // grid.unmask();
                // if reset API used, revert to default API
            }
        });
    },

    onAddRecord: function () {
        var me = this, grid = me.getView(),
            newRecord = Ext.create(grid.getStore().getModel());
        // if custom editor sheet
        if (me.getView().getEditorDialog()) {
            if (!me.sheet) {
                me.sheet = Ext.Viewport.add({
                    xtype: me.getView().getEditorDialog(),
                    // xtype: 'masterdialog',
                    isNewRecord: true,
                    ownerCmp: me.getView()
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
        Ext.toast('open export dialog');
    },

    onDestroy: function () {
        console.log('destroy');
    }

});
