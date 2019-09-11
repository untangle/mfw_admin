Ext.define('Mfw.settings.view.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',

    init: function () {
        /**
         * Set routes based on app context
         */
        if (Mfw.app.context === 'admin') {
            this.setRoutes({
                'settings': {
                    action: 'onAction'
                },
                'settings/:p1': {
                    action: 'onAction'
                },
                'settings/:p1/:p2': {
                    action: 'onAction'
                },
                'settings/:p1/:p2/:p3': {
                    action: 'onAction'
                }
            });
        }
        if (Mfw.app.context === 'settings') {
            this.setRoutes({
                ':query': {
                    action: 'onAction',
                    conditions: { ':query' : '(.*)' }
                }
            });
        }
    },

    /**
     *
     * @param {String} p1 - first level nav, navigation node e.g. Network, Firewall
     * @param {String} p2 - second level nav e.g. Interfaces, or a table e.g. Filter, Access
     * @param {String} p3 - third navigation level, a table chain or an interface name
     */
    onAction: function (p1, p2, p3) {
        var me = this, mainView = me.getView(),
            tree = mainView.down('treelist'),
            subView = mainView.down('#currentSettings'),
            node, intf;

        if (subView) { subView.destroy(); subView = null; }

        Mfw.app.viewport.setActiveItem('settings');

        // tree.getStore().findNode('href', 'network/interfaces').set('text', 'Interfaces');

        // root settings view
        if (p1 === undefined) {
            tree.getStore().getRoot().collapseChildren(true);
            tree.setSelection(null);
            subView = {
                xtype: 'noselection-settings'
            };
        }

        // first level settings view
        if (p1 && p2 === undefined) {
            node = tree.getStore().findNode('href', p1);
            subView = {
                xtype: 'mfw-settings-' + p1
            };
        }

        if (p1 && p2) {
            node = tree.getStore().findNode('href', p1 + '/' + p2);
            subView = {
                xtype: 'mfw-settings-' + p1 + '-' + p2
            };

            // if table chains
            if (p1 === 'firewall' || (p1 === 'routing' && p2 === 'wan-rules')) {
                if (p3) {
                    subView.chain = p3;
                }
            }

            // if interfaces
            if (p1 === 'network' && p2 === 'interfaces') {
                if (p3 !== undefined) {
                    node = tree.getStore().findNode('href', p1 + '/' + p2 + '/' + p3);
                    intf = Ext.getStore('interfaces').findRecord('name', p3);

                    // todo, what id intf is nul ????

                    if (!intf) { return; }

                    subView = {
                        xtype: 'mfw-settings-network-interface',
                        viewModel: {
                            data: {
                                intf: intf
                            }
                        }
                    };
                } else {
                    node = tree.getStore().findNode('href', p1 + '/' + p2);
                }
            }
        }

        subView.itemId = 'currentSettings';

        if (Ext.ClassManager.getByAlias('widget.' + subView.xtype)) {
            mainView.add(subView);
        } else {
            console.log('view does not exists');
        }

        // select the node, required when using a direct link
        if (node) {
            tree.setSelection(node);
            if (!node.isLeaf()) {
                node.expand();
            }
        }
    },


    onDeactivate: function (view) {
        var list = view.down('treelist'),
            store = list.getStore();

        store.each(function (node) {
            if (!node.isLeaf()) {
                list.getItem(node).collapse();
            }
        });
        list.setSelection(null);
    },

    // check if saved
    onItemClick: function (list, info) {
        var me = this,
            route = (Mfw.app.context === 'admin' ? 'settings/' : '') + info.node.get('href'),
            isModified = false,
            win,
            currentView = me.getView().down('#currentSettings'),
            currentViewController;

        if (!currentView) {
            Mfw.app.redirectTo(route);
            return;
        }

        currentViewController = currentView.getController();

        if (currentViewController && Ext.isFunction(currentViewController.checkModified)) {
            currentViewController.checkModified(function (modified) {
                isModified = modified;
            });
        }

        if (isModified) {
            win = Ext.Msg.show({
                title: '<span style="font-size: 16px;">' + (currentView.getTitle() || currentView._title) + ' changes not saved!</span>',
                width: 350,
                message: 'Save changes before continue?',
                showAnimation: false,
                hideAnimation: false,
                buttons: [{
                    text: 'Cancel',
                    margin: '0 16 0 0',
                    handler: function () {
                        win.close();
                    }
                }, {
                    text: 'Discard',
                    ui: 'alt decline',
                    margin: '0 16 0 0',
                    handler: function () {
                        if (Ext.isFunction(currentViewController.discardChanges)) {
                            currentViewController.discardChanges(function () {
                                win.close();
                                Mfw.app.redirectTo(route);
                            });
                            return;
                        }
                        win.close();
                        Mfw.app.redirectTo(route);
                    }
                }, {
                    text: 'Save',
                    ui: 'action',
                    handler: function () {
                        win.close();
                        currentViewController.onSave(function () {
                            Mfw.app.redirectTo(route);
                        });
                    }
                }]
            });
        } else {
            Mfw.app.redirectTo(route);
        }

        return !isModified;
    },

    filterSettings: function (field, value) {
        var me = this,
            tree = me.getView().down('treelist'),
            store = tree.getStore(),
            root = store.getRoot();
            // expandedNode = null;

        store.clearFilter();

        if (value) {
            tree.setSingleExpand(false);
            root.expandChildren(true);
            store.filterBy(function (node) {
                var v = new RegExp(value, 'i');
                return node.isLeaf() ? v.test(node.get('text')) : false;
            });
        } else {
            tree.setSingleExpand(true);
            root.collapseChildren(true);
        }
    },

});
