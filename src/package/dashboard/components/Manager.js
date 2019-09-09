Ext.define('Mfw.dashboard.Manager', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard-manager',

    layout: 'fit',

    items: [{
        xtype: 'toolbar',
        userCls: 'x-subbar',
        padding: 8,
        docked: 'top',
        items: [{
            iconCls: 'x-fa fa-angle-left',
            text: 'Widgets',
            handler: 'toggleManager'
        }, '->', {
            iconCls: 'md-icon-menu',
            arrow: false,
            itemId: 'settings-btn',
            menu: {
                items: [{
                    text: 'General'.t(),
                    iconCls: 'md-icon-add',
                    menu: {
                        defaults: {
                            handler: 'addGeneralWidget'
                        },
                        items: [
                            { text: 'Server Info'.t() },
                            { text: 'CPU Load'.t() },
                            // { text: 'Network Info'.t() },
                            { text: 'Network Layout'.t() },
                            { text: 'Map Distribution'.t() },
                            // { text: 'Notifications'.t() }
                        ]
                    }
                }, '-',
                // '-', {
                //     text: 'Import'.t(),
                //     iconCls: 'x-fa fa-download'
                // }, {
                //     text: 'Export'.t(),
                //     iconCls: 'x-fa fa-upload'
                // },
                '-', {
                    text: 'Load Defaults'.t(),
                    iconCls: 'x-fa fa-rotate-left',
                    handler: 'onLoadDefaults'
                }]
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            xtype: 'button',
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: 'onCancel'
        }, {
            xtype: 'button',
            ui: 'action',
            text: 'Save',
            handler: 'onSave'
        }]
    }, {
        xtype: 'grid',
        hideHeaders: true,
        plugins: {
            sortablelist: true,
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        selectable: false,
        store: {
            type: 'widgets'
        },
        viewModel: true,
        columns: [{
            width: 44,
            menuDisabled: true,
            resizable: false,
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'x-list-sortablehandle', iconCls: 'md-icon-drag-handle', zone: 'start', tooltip: 'Drag to Sort' }]
            }
        }, {
            text: 'Widget',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            dataIndex: 'name',
            flex: 1,
        }, {
            text: 'Interval',
            width: 90,
            sortable: false,
            hideable: false,
            menuDisabled: true,
            dataIndex: 'interval',
            renderer: function (val) {
                return val ? val + 's' : 'none';
            },
            editable: true,
            editor: {
                xtype: 'selectfield',
                required: true,
                options: [{
                    text: 'none', value: 0
                }, {
                    text: '5s', value: 5
                }, {
                    text: '10s', value: 10
                }, {
                    text: '20s', value: 20
                }, {
                    text: '30s', value: 30
                }, {
                    text: '60s', value: 60
                }],
                listeners: {
                    focus: function (el) {
                        el.getPicker().show();
                    },
                    select: function (el) {
                        el.blur();
                    }
                }
            }
        }, {
            width: 44,
            sortable: false,
            hideable: false,
            resizable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    remove: {
                        iconCls: 'md-icon-close',
                        tooltip: 'Remove',
                        handler: 'removeWidget'
                    },
                }
            }
        }]
    }],

    controller: {
        init: function () {
            var me = this;
            Ext.getStore('reports').on('load', me.loadWidgets, me);
        },

        toggleManager: function () {
            var me = this, vm = me.getViewModel(),
                manager = vm.get('manager');
            vm.set('manager', !manager);
        },

        loadWidgets: function () {
            var me = this,
                widgetsStore = Ext.getStore('widgets');

            widgetsStore.on('datachanged', function (store) {
                me.updateWidgetsComponents(store);
            });

            widgetsStore.load(function (store) {
                me.updateWidgetsMenu(store);
            });
        },


        /**
         * It updates the rendered widgets components to reflect the changes made in store
         * called on any action made on the store: load, add, remove, sort etc...
         */
        updateWidgetsComponents: function (store) {
            var me = this, record, widgetsCmp = [], widgetCmp,
                mdlIdx, // widget model index in store
                cmpIdx, // widget component index in container
                widgetsContainer = me.getView().up('dashboard').down('#widgets'),
                widgetCmpConfig;

            if (!store) { return; }

            // widgetsContainer.removeAll();

            // remove widget components which are no longer found in the store
            widgetsContainer.items.each(function (cmp) {
                if (!store.findRecord('_identifier', cmp.getItemId().replace('widget_', ''))) {
                    widgetsContainer.remove(cmp);
                }
            });

            // update queue when interval changes
            store.getModifiedRecords().forEach(function(widget) {
                var wgCnt = widgetsContainer.down('#widget_' + widget.get('_identifier'));
                if (wgCnt) {
                    WidgetsPipe.addFirst(wgCnt);
                }
            });

            store.each(function (widget) {
                // establish the widget component config if needed to be added
                if (widget.get('isReport')) {
                    record = Ext.getStore('reports').findRecord('name', widget.get('name'), 0, false, true, true);
                    if (!record) {
                        console.warn('There is no report matching "' + widget.get('name') + '"');
                        return;
                    }

                    widgetCmpConfig = {
                        xtype: 'widget-report',
                        itemId: 'widget_' + widget.get('_identifier'),
                        viewModel: {
                            data: {
                                widget: widget,
                                record: record
                            }
                        }
                    };
                } else {
                    widgetCmpConfig = {
                        xtype: 'widget-' + widget.get('_identifier'),
                        itemId: 'widget_' + widget.get('_identifier'),
                        viewModel: {
                            data: {
                                widget: widget
                            }
                        }
                    };
                }

                // find existing widget component, and if not exists add it to the container
                widgetCmp = widgetsContainer.down('#widget_' + widget.get('_identifier'));
                mdlIdx = store.indexOf(widget);
                if (!widgetCmp) {
                    Ext.Array.insert(widgetsCmp, mdlIdx, [widgetCmpConfig]);
                }

                cmpIdx = widgetsContainer.items.indexOf(widgetCmp);

                // reorder widget components to match the store order
                // the widget model store index should match the rendered widget component container index
                if (cmpIdx >=0 && cmpIdx !== mdlIdx) {
                    widgetsContainer.removeAt(cmpIdx);
                    widgetsContainer.insert(mdlIdx, widgetCmpConfig);
                }
            });

            // add new widgets to the container
            if (widgetsCmp.length > 0) {
                widgetsContainer.add(widgetsCmp);
            }
        },

        updateWidgetsMenu: function () {
            var me = this,
                reportsStore = Ext.getStore('reports'),
                settingsBtn = me.getView().down('#settings-btn'),
                category, menus = {}, icon;


            reportsStore.each(function (record) {
                category = record.get('category');

                if (record.get('type') === 'EVENTS') {
                    icon = 'fa-list';
                } else {
                    if (record.get('type') === 'TEXT') {
                        icon = 'fa-align-left';
                    } else {
                        icon = record.getRendering().get('_icon');
                    }
                }

                if (!menus[category]) {
                    menus[category] = [];
                }
                menus[category].push({
                    text: record.get('name'),
                    iconCls: 'x-fa ' + icon,
                    identifier: record.get('_identifier'),
                    handler: 'addReportWidget'
                });
            });

            Ext.Object.each(menus, function (key, val) {
                settingsBtn.getMenu().insert(2, {
                    // userCls: 'removable',
                    text: key,
                    iconCls: 'md-icon-add',
                    menu: {
                        items: val
                    }
                });
            });
        },


        addReportWidget: function (menuItem) {
            if (Ext.getStore('widgets').findRecord('name', menuItem.getText(), 0, false, true, true)) {
                Ext.Msg.alert('Info', 'Widget already in Dashboard!', Ext.emptyFn);
                return;
            }

            menuItem.up('menu').hide();

            Ext.getStore('widgets').add({
                name: menuItem.getText(),
                interval: 30, // default interval 30s
                isReport: true
            });
        },

        addGeneralWidget: function (menuItem) {
            if (Ext.getStore('widgets').findRecord('name', menuItem.getText(), 0, false, true, true)) {
                Ext.Msg.alert('Info', 'Widget already in Dashboard!', Ext.emptyFn);
                return;
            }

            menuItem.up('menu').hide();

            Ext.getStore('widgets').add({
                name: menuItem.getText(),
                interval: 0, // default interval 30s
                isReport: false
            });
        },

        removeWidget: function (grid, info) {
            grid.getStore().remove(info.record);
        },

        // reset widgets to default
        onLoadDefaults: function () {
            var me = this,
                store = Ext.getStore('widgets'),
                model = store.getModel(),
                proxy = model.getProxy(),
                api = proxy.getApi();

            // wipe all widget components
            me.getView().up('dashboard').down('#widgets').removeAll();

            proxy.setApi({ read: api.read.replace('/settings/', '/defaults/') });
            // revert api to it's default values
            store.load(function() {
                proxy.setApi(api);
            });
        },

        onCancel: function () {
            var me = this,
                view = me.getView();

            view.down('grid').getStore().rejectChanges();
            me.getViewModel().set('manager', false);
            // reload widgets so any sorting is reverted to initial state
            Ext.getStore('widgets').load();
        },

        onSave: function () {
            var me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                grid = view.down('grid');

            grid.getStore().each(function (record) {
                record.dirty = true; // to push all non-dropped records
                record.phantom = false; // to push new records
            });

            view.mask();
            grid.getStore().sync({
                success: function () {
                    Ext.toast('Widgets saved!');
                },
                failure: function () {
                    console.warn('Unable to save widgets!');
                },
                callback: function () {
                    view.unmask();
                    vm.set('manager', false);
                }
            });
        }
    }

});
