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

        me.rulesheet = grid.add({
            xtype: 'rulesheet',
            table: grid
        });

        table.chains().on({
            // when adding a new chain, update chains menu and select the new chain
            add: function (store, records) {
                var chain = records[0];
                chain.rules().loadData([]); // important so the rules store is initialized
                me.selectChain(chain.get('name'));
                me.updateChainsMenu();
            },
            remove: function () {
                me.selectChain();
                me.updateChainsMenu();
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
        grid.mask({
            xtype: 'loadmask',
            message: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
        });

        me.table.load({
            success: function (record) {
                // on load set records as not dirty or phantom
                record.chains().each(function (chain) {
                    chain.rules().each(function (record) {
                        record.dirty = false;
                        record.phantom = false;
                    });
                });

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

        Ext.Msg.confirm(
            '<i class="x-fa fa-exclamation-triangle"></i> Warning',
            '<p>All existing <strong>' + grid.getTitle() +
            '</strong> settings will be replace with System defauts.</p><p style="font-weight: bold;">Do you want to continue?</p>',
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
        me.updateChainsMenu();
    },

    /**
     * Updates the chains menu
     */
    updateChainsMenu: function () {
        var me = this, menuItems = [], tpl, store = [];
        me.table.chains().each(function (chain) {
            if (chain.get('name') !== me.selectedChain.get('name')) {
                store.push({ name: chain.get('name') });
            }

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
        me.getViewModel().set('chainNames', store);
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
        var me = this, grid = me.getView(), msg = '';

        if (me.selectedChain.get('default')) {
            msg += Ext.String.format('<p><strong>{0}</strong> is a <strong>DEFAULT</strong> chain. You may consider selecting a new default chain before deleting!</p>'.t(), me.selectedChain.get('name'));
        }

        msg += Ext.String.format('<p>By deleting <strong>{0}</strong> all the rules defined by it will be lost!</p>'.t(), me.selectedChain.get('name'));

        msg += '<p><span style="color: red;">' + 'WARNING'.t() + '!</span> <br/>' +
                Ext.String.format('Any <strong>{0}</strong> rules having <strong>{1}</strong> or <strong>{2}</strong> actions pointing to this chain will be removed!'.t(), grid.getTitle(), 'Go to'.t(), 'Jump to'.t());
        msg += '</p>';

        msg += '<br/><p style="font-weight: bold;">' + 'Do you want to continue?'.t() + '</p>',
        Ext.Msg.confirm(
            '<i class="x-fa fa-exclamation-triangle"></i> ' + 'Delete Chain'.t(),
            msg,
            function (answer) {
                if (answer === 'yes') {
                    /**
                     * Deletes all rules having action Jump or Goto pointing to the
                     * chain to be deleted
                     */
                    me.table.chains().each(function (chain) {
                        chain.rules().each(function (rule) {
                            if (rule.get('action').type === "JUMP" || rule.get('action').type === "GOTO") {
                                if (rule.get('action').chain === me.selectedChain.get('name')) {
                                    rule.drop();
                                }
                            }
                        })
                    })
                    // remove the chain
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
        // if (!me.rulesheet) {
        //     me.rulesheet = grid.add({
        //         xtype: 'rulesheet',
        //         table: grid
        //     });
        // }
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
                description: 'New Rule'.t() + '...',
                conditions: []
            });

        if (!me.rulesheet) {
            me.rulesheet = grid.add({
                xtype: 'rulesheet',
                table: grid
            });
        }
        me.rulesheet.table = grid;
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
        var me = this, json;
        var dialog = Ext.create({
            xtype: 'dialog',
            width: 400,
            title: 'Import Rules into Chain'.t(),
            items: [{
                xtype: 'filefield',
                label: 'Choose File'.t(),
                listeners: {
                    change: {
                        element: 'element',
                        fn: function (event) {
                            var input = event.target;
                            var reader = new FileReader();
                            reader.onload = function() {
                              var text = reader.result;
                              json = Ext.JSON.decode(text);
                              // dialog.setJson(text);
                            };
                            reader.readAsText(input.files[0]);
                        }
                    }
                }
            }],

            buttons: {
                ok: {
                    text: 'OK'.t(),
                    handler: function () {  // standard button (see below)
                        me.selectedChain.rules().loadRawData(json);
                        dialog.destroy();
                    }
                },
                cancel: {
                    text: 'Cancel'.t(),
                    handler: function () {  // standard button (see below)
                        dialog.destroy();
                    }
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
                minWidth: 150,
                userCls: 'x-htmlmenu',
                items: [{
                    xtype: 'component',
                    bind: {
                        html: '{selectedChain.editable ? "Rules" : "Rules (readonly)"}'
                    },
                    style: 'font-size: 14px; font-weight: bold;'
                }, {
                    html: 'New'.t(),
                    iconCls: 'md-icon-add',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable}' },
                    handler: 'onNewRule'
                }, {
                    html: 'Import'.t(),
                    iconCls: 'md-icon-call-received',
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable}' },
                    handler: 'onImport'
                }, {
                    html: 'Export'.t(),
                    iconCls: 'md-icon-call-made',
                    // handler: 'onExport'
                }, '-', {
                    xtype: 'component',
                    html: 'Chain',
                    style: 'font-size: 14px; font-weight: bold;'
                }, {
                    html: 'New'.t(),
                    iconCls: 'md-icon-add',
                    menuHideDelay: 0,
                    operation: 'NEW',
                    handler: 'onChainOperation'
                }, {
                    html: 'Edit'.t(),
                    iconCls: 'md-icon-edit',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable}' },
                    operation: 'EDIT',
                    handler: 'onChainOperation'
                }, {
                    html: 'Delete'.t(),
                    iconCls: 'md-icon-delete',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable}' },
                    handler: 'onDeleteChain'
                }, {
                    html: 'Set as Default'.t(),
                    iconCls: 'md-icon-star',
                    menuHideDelay: 0,
                    hidden: true,
                    bind: { hidden: '{!selectedChain.editable || selectedChain.default}' },
                    handler: 'onSetDefaultChain'
                }, '-', {
                    html: 'Reload'.t(),
                    iconCls: 'md-icon-refresh',
                    handler: 'onLoad'
                }, {
                    html: 'Load Defaults'.t(),
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


    },


    conditionRenderer: function (conditions, record) {
        var strArr = [], op, name;

        record.conditions().each(function (c) {
            switch (c.get('op')) {
                case '==': op = '='; break;
                case '!=': op = '&ne;'; break;
                case '>': op = '&gt;'; break;
                case '<': op = '&lt;'; break;
                case '>=': op = '&ge;'; break;
                case '<=': op = '&le;'; break;
                default: op = '?'; break;
            }
            name = Ext.Array.findBy(Util.conditions, function (condition) {
                return condition.type === c.get('type');
            }).name;

            strArr.push('<div class="condition"><span>' + name + '</span> ' +
                   '<em style="font-weight: bold; font-style: normal; color: #000; padding: 0 3px;">' + op + '</em> <strong>' + c.get('value') + '</strong></div>');
        });
        if (strArr.length > 0) {
            return strArr.join('');
        } else {
            return '<span style="color: #999; font-style: italic; font-size: 11px; padding: 0 10px;">No Conditions!</span>'
        }
    },

    actionRenderer: function (action) {
        // console.log (action);
        var actionStr = 'Missing or No Action...'.t();
        if (action && action.type) {
            switch (action.type) {
                case 'JUMP':            actionStr = 'Jump to'.t(); break;
                case 'GOTO':            actionStr = 'Go to'.t(); break;
                case 'ACCEPT':          actionStr = 'Accept'.t(); break;
                case 'RETURN':          actionStr = 'Return'.t(); break;
                case 'REJECT':          actionStr = 'Reject'.t(); break;
                case 'DROP':            actionStr = 'Drop'.t(); break;
                case 'DNAT':            actionStr = 'Destination Address'.t(); break;
                case 'SNAT':            actionStr = 'Source Address'.t(); break;
                case 'MASQUERADE':      actionStr = 'Masquerade'.t(); break;
                case 'SET_PRIORITY':    actionStr = 'Priority'.t(); break;
                case 'WAN_DESTINATION': actionStr = 'Wan Destination'.t(); break;
                default: break;
            }
            if (action.type === 'JUMP' || action.type === 'GOTO') {
                actionStr += ' ' + action.chain;
            }
            if (action.type === 'SNAT') {
                actionStr += ' ' + action.snat_address;
            }
            if (action.type === 'DNAT') {
                actionStr += ' ' + action.dnat_address;
            }
            if (action.type === 'SET_PRIORITY') {
                actionStr += ' ' + action.priority;
            }
        }
        return actionStr;
    }


});
