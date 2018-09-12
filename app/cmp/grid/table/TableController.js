Ext.define('Mfw.cmp.grid.table.TableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tablegrid',

    onInitialize: function (grid) {
        var me = this,
            table; // the table model which holds the rules

        me.table = table = new Mfw.model.table.Table();
        table.getProxy().setApi(grid.getApi());

        me.chainsmenu = grid.down('#chainsmenu');

        me.decorate(); // adds menus, extra columns, buttons

        table.chains().on({
            // when adding a new chain, update chains menu and select the new chain
            add: function (store, records) {
                var chain = records[0];
                chain.rules().loadData([]); // important so the rules store is initialized
                me.updateChainsMenu();
                me.selectChain(chain.get('name'));
            },
            remove: function () {
                me.updateChainsMenu();
                me.selectChain();
            }
        });

        me.onLoad();
    },

    /**
     * Loads the full table record containing chains with rules
     */
    onLoad: function () {
        var me = this,
            grid = me.getView();

        grid.getSelectable().deselectAll(); // deselect any rule on load
        grid.mask();

        me.table.load({
            success: function (record) {
                // on load set records as not dirty or phantom
                record.chains().each(function (chain) {
                    chain.rules().each(function (record) {
                        record.dirty = false;
                        record.phantom = false;
                    });
                });

                me.updateChainsMenu();
                me.selectChain();
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

        Ext.Msg.confirm(
            '<i class="x-fa fa-exclamation-triangle"></i> Warning',
            'All existing <strong>' + grid.getTitle() +
            '</strong> settings will be replace with defauts.<br/>Do you want to continue?',
            function (answer) {
                if (answer === 'yes') {
                    // update proxy api to load defaults
                    me.table.getProxy().setApi({ read: api.read.replace('/settings/', '/defaults/') });
                    me.onLoad();
                }
            });
    },

    /**
     * Before saving update/drop records
     * so the proxy will push all records via 'UPDATE' method
     */
    beforeSave: function () {
        var me = this;
        me.table.chains().each(function (chain) {
            chain.rules().each(function (record) {
                if (record.get('_deleteSchedule')) { record.drop(); }
                record.dirty = true;
                record.phantom = false;
            });
        });
    },

    /**
     * Push all changes to server
     */
    onSave: function () {
        var me = this;

        me.beforeSave();
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

    /**
     * Selects a chain from table chains and fills the grid
     * @param {String} [name] The chain name.
     */
    selectChain: function (name) {
        var me = this, vm = me.getViewModel(),
            chains = me.table.chains(),
            chain;

        // if no name is passed it selects the default or base chain
        if (!name) {
            me.selectedChain = chain = chains.findRecord('default', true) || chains.findRecord('base', true);
        } else {
            me.selectedChain = chain = chains.findRecord('name', name);
        }

        if (!chain) {
            console.warn('No default, base or given name chain found!');
            return;
        }
        vm.set('selectedChain', chain);
    },

    /**
     * Updates the chains menu
     */
    updateChainsMenu: function () {
        var me = this, menuItems = [], tpl;
        me.table.chains().each(function (chain) {
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

    /**
     * Show chain sheet to edit or create a new Chain
     * @param {Component} sender The button which initiates the EDIT/NEW operation
     */
    onChainOperation: function (sender) {
        var me = this, grid = me.getView(),
            chain, operation = sender.operation;

        if (operation === 'EDIT') {
            chain = me.selectedChain;
        } else {
            chain = new Mfw.model.table.Chain({ name: 'new-chain' });
        }

        if (!me.chainsheet) {
            me.chainsheet = grid.add({ xtype: 'chainsheet' });
            me.chainsheet.table = me.table; // pass table model to sheet
        }
        me.chainsheet.setChain(chain);
        me.chainsheet.getViewModel().set('operation', operation);
        me.chainsheet.show();
        return;
    },

    /**
     * Removes selected Chain
     */
    onDeleteChain: function () {
        var me = this,
            msg = '<p>By deleting <strong>' + me.selectedChain.get('name') + '</strong> chain, ' +
            'all the Rules from this chain will be lost.</p>';

        if (me.selectedChain.get('default')) {
            msg += '<p>This is a <strong>DEFAULT</strong> chain.You may consider selecting a new Default chain before deleting!</p>'
        }
        msg += '<p>Do you want to continue?</p>',
        Ext.Msg.confirm(
            '<i class="x-fa fa-exclamation-triangle"></i> Warning',
            msg,
            function (answer) {
                if (answer === 'yes') {
                    me.table.chains().remove(me.selectedChain);
                }
            });
    },

    /**
     * Sets a Chain as default
     */
    onSetDefaultChain: function () {
        var me = this, oldDefault;

        // find the current default chain and remove default;
        oldDefault = me.table.chains().findRecord('default', true);
        oldDefault.set('default', false);

        // set default the current chain selection
        me.selectedChain.set('default', true);
        // update chains menu to reflect the change
        me.updateChainsMenu();
    },

    /**
     * Shows the Rule sheet editor
     */
    onEditRule: function (grid, info) {
        var me = this;
        if (!me.rulesheet) {
            me.rulesheet = grid.add({ xtype: 'rulesheet' });
        }

        me.rulesheet.getViewModel().set('ruleOperation', 'EDIT');
        me.rulesheet.setRule(info.record);
        me.rulesheet.show();
        return;
    },

    /**
     * Shows the Rule sheet editor
     */
    onNewRule: function () {
        var me = this, grid = me.getView(),
            newRule = new Ext.create('Mfw.model.table.Rule', {
                description: 'New Rule ...',
                conditions: []
            });

        if (!me.rulesheet) {
            me.rulesheet = grid.add({ xtype: 'rulesheet' });
        }
        me.rulesheet.grid = grid;
        me.rulesheet.getViewModel().set('ruleOperation', 'NEW');
        me.rulesheet.setRule(newRule);
        me.rulesheet.show();
        return;
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
        var grid = this.getView(),
            store = grid.getStore(),
            record = grid.getSelection(),
            oldIndex = store.indexOf(record),
            newIndex, pos;

        if (!btn.pos) {
            grid.getSelectable().deselectAll();
            return;
        }

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

        grid.setSelection(record);
        this.getViewModel().set('pos', pos);
    },

    onImport: function () {
        var me = this, dialog = Ext.create({
            xtype: 'dialog',
            width: 400,
            title: 'Import Rules into Chain',

            items: [{
                xtype: 'filefield',
                label: 'Choose File'
            }],

            buttons: {
                ok: function () {  // standard button (see below)
                    dialog.destroy();
                },
                cancel: function () {  // standard button (see below)
                    dialog.destroy();
                }
            }
        });
        dialog.show();
    },

    onExport: function () {
        Ext.toast('open export dialog');
    },

    onDestroy: function () {
        console.log('destroy');
    },


    /**
     * Add all the needed components
     */
    decorate: function () {
        var me = this,
            grid = me.getView(),
            titleBar = grid.getTitleBar(),
            operationsColumn;

        titleBar.setPadding('0 8 0 16');
        titleBar.add([{
            xtype: 'button',
            text: 'Reload'.t(),
            iconCls: 'md-icon-refresh',
            align: 'right',
            handler: 'onLoad'
        }, {
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
                    handler: 'onImport'
                }, {
                    text: 'Export',
                    iconCls: 'md-icon-call-made',
                    // handler: 'onExport'
                }, '-', {
                    xtype: 'component',
                    html: 'Chain',
                    style: 'font-size: 14px; font-weight: bold;'
                }, {
                    text: 'New'.t(),
                    iconCls: 'md-icon-add',
                    menuHideDelay: 0,
                    operation: 'NEW',
                    handler: 'onChainOperation'
                }, {
                    text: 'Edit'.t(),
                    iconCls: 'md-icon-edit',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable}' },
                    operation: 'EDIT',
                    handler: 'onChainOperation'
                }, {
                    text: 'Delete'.t(),
                    iconCls: 'md-icon-delete',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable}' },
                    handler: 'onDeleteChain'
                }, {
                    text: 'Set as Default'.t(),
                    iconCls: 'md-icon-star',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable || selectedChain.default}' },
                    handler: 'onSetDefaultChain'
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


        if (grid.getActionsColumn()) {
            grid.insertColumn(4, grid.getActionsColumn());
        }



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

        operationsColumn = {
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
                        operation: 'EDIT',
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

        grid.addColumn(operationsColumn);


        // titleBar.add()


    }


});
