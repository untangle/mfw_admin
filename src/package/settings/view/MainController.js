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
            routeParts, table, chain, widget;

        Mfw.app.viewport.setActiveItem('settings');

        if (cmp) { cmp.destroy(); }

        if (route) {
            if (Ext.String.startsWith(route, '/firewall')) {
                routeParts = route.split('/'),
                table = routeParts[2],
                chain = routeParts[3],
                widget = {
                    xtype: 'mfw-settings-firewall',
                };

                node = tree.getStore().findNode('href', 'settings/firewall');
                if (table) {
                    widget.xtype = 'mfw-settings-firewall-' + table;
                    node = tree.getStore().findNode('href', 'settings/firewall/' + table);
                    if (chain) {
                        widget.chain = chain;
                        node = tree.getStore().findNode('href', 'settings/firewall/' + table + '/' + chain);
                    }
                }
            } else {
                node = tree.getStore().findNode('href', 'settings' + route);
                widget = {
                    xtype: 'mfw-settings' + route.replace(/\//g, '-'),
                };
            }

            widget.itemId = 'currentSettings';

            if (Ext.ClassManager.getByAlias('widget.' + widget.xtype)) {
                view.add(widget);
            } else {
                console.log('view does not exists');
            }
        }

        // Ext.defer(function () {
        tree.setSelection(node);
        // }, 100);

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
        }

        return !isModified;
    },

    onSelectionChange: function (el, node) {
        var hash = window.location.hash.replace('#', '');

        if (!node || !node.get('href')) { return; }

        if (!node.isLeaf()) {
            node.expand();
        }

        if (hash !== node.get('href')) {
            // console.log(node.get('redirect'));
            Mfw.app.redirectTo(node.get('href'));
        }
    },

    filterSettings: function (field, value) {
        var me = this,
            tree = me.getView().down('treelist'),
            store = tree.getStore(),
            root = store.getRoot();
            // expandedNode = null;

        store.clearFilter();

        if (value) {
            // find expanded node if exists
            // root.eachChild(function (child) {
            //     if (child.isExpanded()) {
            //         expandedNode = child;
            //     }
            // });

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
