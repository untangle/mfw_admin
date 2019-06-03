Ext.define('Mfw.cmp.grid.table.TableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tablegrid',

    init: function (grid) {
        var me = this,
            table; // the table model which holds the rules

        grid.table = table = new Mfw.model.table.Table();

        if (grid.chainsOnly) {
            grid.table.chains().getProxy().setApi(grid.getApi());
        } else {
            grid.table.getProxy().setApi(grid.getApi());
        }

        me.chainsmenu = grid.down('#chainsmenu');
        me.decorate(); // adds menus, extra columns, buttons

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

        if (grid.before) {
            grid.before(function () {
                me.onLoad();
            });
        } else {
            me.onLoad();
        }
    },

    /**
     * Loads the full table record containing chains with rules
     */
    onLoad: function () {
        var me = this,
            grid = me.getView();

        grid.getSelectable().deselectAll(); // deselect any rule on load

        if (!grid.chainsOnly) {
            grid.table.load({
                success: function (record) {
                    // on load set records as not dirty or phantom
                    // console.log(record.chains());
                    record.chains().commitChanges();
                    record.chains().each(function (chain) {
                        chain.rules().commitChanges();
                    });

                    // record.chains().each(function (chain) {
                    //     chain.rules().each(function (record) {
                    //         record.dirty = false;
                    //         record.phantom = false;
                    //     });
                    // });

                    me.selectChain(grid.getChain());
                    me.updateChainsMenu();
                },
                callback: function () {
                    // if reset API used, revert to default API
                    if (!grid.table.getProxy().getApi().update) {
                        grid.table.getProxy().setApi(grid.getApi());
                    }
                }
            });
        } else {
            grid.table.chains().load(function (records) {
                Ext.Array.each(records, function (chain) {
                    chain.rules().each(function (record) {
                        record.dirty = false;
                        record.phantom = false;
                    });
                });
                me.selectChain(grid.getChain());
                me.updateChainsMenu();
                // grid.unmask();
            });
        }
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
                    grid.table.getProxy().setApi({ read: api.read.replace('/settings/', '/defaults/') });
                    me.onLoad();
                }
            });
    },

    /**
     * Before saving update/drop records
     * so the proxy will push all records via 'UPDATE' method
     */
    beforeSave: function () {
        var me = this, grid = me.getView();
        grid.table.chains().each(function (chain) {
            chain.dirty = true;
            chain.phantom = false;
            chain.rules().each(function (record) {
                if (record.get('_deleteSchedule')) { record.drop(); }
                record.dirty = true;
                record.phantom = false;
            });
            /**
             * don't know why loading an associeted store ("chains") from a model ("table") is polluting the record with the "mfw.model.table.Table" key
             * which is then removed upon sanitization
             */
        });
    },

    /**
     * Push all changes to server
     */
    onSave: function (cb) {
        var me = this,
            grid = me.getView();

        me.beforeSave();

        Sync.progress();

        if (grid.chainsOnly) {
            grid.table.chains().sync({
                success: function () {
                    if (Ext.isFunction(cb)) { cb(); } else { me.onLoad(); }
                    Sync.success();
                }
            });
        } else {
            grid.table.save({
                success: function () {
                    if (Ext.isFunction(cb)) { cb(); } else { me.onLoad(); }
                    Sync.success();
                }
            });
        }
    },

    /**
     * Selects a chain from table chains and fills the grid
     * @param {String} [name] The chain name.
     */
    selectChain: function (name) {
        var me = this,
            grid = me.getView(),
            vm = me.getViewModel(),
            chains = grid.table.chains();
            // chain = grid.table.chains().first();
            // chain;

        // if no name is passed it selects the first chain
        if (!name) {
            me.selectedChain = chains.first();
            Mfw.app.redirectTo(grid.getHash() + '/' + me.selectedChain.get('name'), {
                replace: true // !important so the history stack does not retain previous nonset chain
            });
            return;
        } else {
            me.selectedChain = chains.findRecord('name', name, 0, false, true, true);
        }

        if (!me.selectedChain) {
            console.warn('Table has no chains!');
            return;
        }
        vm.set('selectedChain', me.selectedChain);
        me.updateChainsMenu();
    },

    /**
     * Updates the chains menu
     */
    updateChainsMenu: function () {
        var me = this, grid = me.getView(), menuItems = [], tpl, store = [];
        grid.table.chains().each(function (chain) {
            if (chain.get('name') !== me.selectedChain.get('name')) {
                store.push({ name: chain.get('name') });
            }

            tpl = '<p>' + chain.get('name') +
                   (chain.get('base') ? '<span class="base">BASE</span>' : '') +
                   (!chain.get('editable') ? '<span class="readonly">READONLY</span>' : '') +
                   '<br/><em>' + chain.get('description') + '</em></p>';
            menuItems.push({
                bind: {
                    userCls: '{selectedChain.name === "' + chain.get('name') + '" ? "selected" : ""}'
                },
                html: tpl,
                handler: function (item) {
                    item.up('menu').hide();
                    Mfw.app.redirectTo(grid.getHash() + '/' + chain.get('name'));
                    // me.selectChain(chain.get('name'));
                }
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
            operation = sender.operation;

        Ext.Viewport.add({
            xtype: 'chain-dialog',
            ownerCmp: grid,
            chain: operation === 'EDIT' ? me.selectedChain : null
        }).show();
    },

    /**
     * Removes selected Chain
     */
    onDeleteChain: function () {
        var me = this, grid = me.getView(), msg = '';

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
                    grid.table.chains().each(function (chain) {
                        chain.rules().each(function (rule) {
                            if (rule.getAction() && rule.getAction().get('type') === 'JUMP' || rule.getAction().get('type') === 'GOTO') {
                                if (rule.getAction().get('chain') === me.selectedChain.get('name')) {
                                    rule.drop();
                                }
                            }
                        });
                    });
                    // remove the chain
                    grid.table.chains().remove(me.selectedChain);
                    me.onSave();
                }
            });
    },

    /**
     * Shows the Rule sheet editor
     */
    onEditRule: function (grid, info) {
        var me = this;
        Ext.Viewport.add({
            xtype: 'rule-dialog',
            ownerCmp: me.getView(),
            rule: info.record
        }).show();
    },

    /**
     * Shows the Rule dialog
     */
    onNewRule: function () {
        var me = this;
        Ext.Viewport.add({
            xtype: 'rule-dialog',
            ownerCmp: me.getView()
        }).show();
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
        var grid = this.getView(),
            fileName = grid.getTitle().replace(/ /g, '_') + '-Chains-' + moment.tz(Mfw.app.tz.displayName).format('DD-MM-YY-hhmmA');

        Util.export(grid.table, fileName);
    },

    onDestroy: function () {
        // console.log('destroy');
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
            text: 'More',
            iconCls: 'md-icon-keyboard-arrow-down',
            align: 'right',
            arrow: false,
            menuAlign: 'tr-br?',
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
                    handler: 'onExport'
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
        }, {
            xtype: 'button',
            text: 'Save'.t(),
            iconCls: 'md-icon-save',
            align: 'right',
            handler: 'onSave'
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
    },

    actionRenderer: function (value, record) {
        var me = this, grid = me.getView(),
            action = record.getAction(), type,
            actionStr = 'Missing or No Action...'.t();

        if (grid.policies) {
            var policiesMap = Ext.Array.toValueMap(grid.policies, 'value');
        }
        if (action && action.get('type')) {
            type = action.get('type');
            switch (type) {
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
                case 'WAN_POLICY':      actionStr = ''; break;
                case 'NEW_PORT':        actionStr = 'New Port'.t(); break;
                default: break;
            }
            if (type === 'JUMP' || type === 'GOTO') {
                // anchors generated by replacing in hash the current chain with the new one
                actionStr += ' <a href="' + location.hash.replace(/(?:.(?!\/))+$/, '/' + action.get('chain')) + '"><strong>' + action.get('chain') + '</strong></a>';
            }
            if (type === 'SNAT') {
                actionStr += ' ' + action.get('snat_address');
            }
            if (type === 'DNAT') {
                actionStr += ' ' + action.get('dnat_address');
            }
            if (type === 'SET_PRIORITY') {
                actionStr += ' ' + action.get('priority');
            }
            if (type === 'WAN_POLICY') {
                actionStr += policiesMap[action.get('policy')].text + ' <span style="color: #999;">[ policy ' + action.get('policy') + ' ]</span> ';
            }
            if (type === 'NEW_PORT') {
                actionStr += ' ' + action.get('port');
            }
        }
        return actionStr;
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
    }
});
