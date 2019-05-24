Ext.define('Mfw.settings.view.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',

    routes: {
        'settings:query': {
            action: 'onAction',
            conditions: { ':query' : '(.*)' }
        }
    },

    onAction: function (route) {
        var me = this, view = me.getView(),
            cmp = view.down('#currentSettings'),
            tree = view.down('treelist'),
            node = tree.getStore().findNode('href', 'settings'),
            prefix, // used for chains routing in /firewall or /routing
            routeParts, table, chain, widget;

        Mfw.app.viewport.setActiveItem('settings');

        if (cmp) { cmp.destroy(); }

        if (route) {
            if (Ext.String.startsWith(route, '/firewall') || Ext.String.startsWith(route, '/routing/wan-rules')) {
                routeParts = route.split('/'),
                prefix = routeParts[1], // "firewall" or "routing"
                table = routeParts[2],
                chain = routeParts[3],

                widget = {
                    xtype: 'mfw-settings-' + prefix,
                };

                node = tree.getStore().findNode('href', 'settings/' + prefix);
                if (table) {
                    widget.xtype = 'mfw-settings-' + prefix + '-' + table;
                    node = tree.getStore().findNode('href', 'settings/' + prefix + '/' + table);
                    if (chain) {
                        widget.chain = chain;
                    }
                }
            } else {
                node = tree.getStore().findNode('href', 'settings' + route);
                widget = {
                    xtype: 'mfw-settings' + route.replace(/\//g, '-'),
                };
            }

        } else {
            tree.getStore().getRoot().collapseChildren(true);
            widget = {
                xtype: 'noselection-settings'
            };
        }
        widget.itemId = 'currentSettings';

        if (Ext.ClassManager.getByAlias('widget.' + widget.xtype)) {
            view.add(widget);
        } else {
            console.log('view does not exists');
        }


        if (node) {
            tree.setSelection(node);
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
            isModified = false,
            win,
            currentView = me.getView().down('#currentSettings'),
            currentViewController;

        if (!currentView) {
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
                title: '<span style="font-size: 16px;">' + currentView.getTitle() + ' changes not saved!</span>',
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
                        win.close();
                        Mfw.app.redirectTo(info.node.get('href'));
                    }
                }, {
                    text: 'Save',
                    ui: 'action',
                    handler: function () {
                        win.close();
                        currentViewController.onSave(function () {
                            Mfw.app.redirectTo(info.node.get('href'));
                        });
                    }
                }]
            });
        } else {
            Mfw.app.redirectTo(info.node.get('href'));
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
