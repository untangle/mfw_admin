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
                            { text: 'Resources'.t() },
                            { text: 'CPU Load'.t() },
                            { text: 'Network Info'.t() },
                            { text: 'Network Layout'.t() },
                            { text: 'Map Distribution'.t() },
                            { text: 'Notifications'.t() }
                        ]
                    }
                }, '-', '-', {
                    text: 'Import'.t(),
                    iconCls: 'x-fa fa-download'
                }, {
                    text: 'Export'.t(),
                    iconCls: 'x-fa fa-upload'
                }, '-', {
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
            ui: 'action',
            text: 'Save',
            handler: 'onSave'
        }]
    }, {
        xtype: 'grid',
        hideHeaders: true,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        selectable: {
            mode: 'single',
            cells: false,
            // checkbox: true,
            allowDeselect: true,
        },
        store: {
            type: 'widgets'
        },
        columns: [{
            text: 'Widget',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            dataIndex: 'name',
            flex: 1,
        }, {
            text: 'Interval',
            width: 70,
            align: 'right',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            dataIndex: 'interval',
            renderer: function (val) {
                return val ? val + 's' : 'manual';
            },
            editable: true,
            editor: {
                xtype: 'selectfield',
                required: true,
                options: [{
                    text: 'manual', value: 0
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
            text: 'Actions',
            width: 100,
            align: 'right',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    up: {
                        iconCls: 'md-icon-keyboard-arrow-up',
                        tooltip: 'Move Up',
                        zone: 'end',
                        type: 'up',
                        handler: 'onSort'
                    },
                    down: {
                        iconCls: 'md-icon-keyboard-arrow-down',
                        tooltip: 'Move Down',
                        zone: 'end',
                        type: 'down',
                        handler: 'onSort'
                    },
                    remove: {
                        iconCls: 'md-icon-close',
                        tooltip: 'Remove',
                        zone: 'end',
                        handler: 'removeWidget'
                    },
                }
            }
        }]
        // listeners: {
        //     select: 'onSelect'
        // }
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

            widgetsStore.on('load', function (store) {
                me.updateWidgetsComponents(store);
            }, me);

            widgetsStore.on('add', me.onWidgetAdd, me);
            widgetsStore.on('remove', me.onWidgetRemove, me);

            widgetsStore.load(function (store) {
                me.updateWidgetsMenu(store);
            });
        },

        updateWidgetsComponents: function (store) {
            var me = this, record, widgetsCmp = [],
                widgetsContainer = me.getView().up('dashboard').down('#widgets');

            widgetsContainer.removeAll();

            store.each(function (widget) {
                if (widget.get('isReport')) {
                    record = Ext.getStore('reports').findRecord('name', widget.get('name'), 0, false, true, true);

                    if (!record) {
                        console.warn('There is no report matching "' + widget.get('name') + '"');
                        return;
                    }
                }

                widgetsCmp.push({
                    xtype: widget.get('isReport') ? 'widget-report' : ('widget-' + widget.get('_identifier')),
                    itemId: 'widget_' + widget.get('_identifier'),
                    viewModel: {
                        data: {
                            widget: widget,
                            record: record
                        }
                    }
                });
            });
            widgetsContainer.add(widgetsCmp);
        },

        updateWidgetsMenu: function () {
            var me = this,
                reportsStore = Ext.getStore('reports'),
                settingsBtn = me.getView().down('#settings-btn'),
                category, menus = {}, icon;


            // settingsBtn.getMenu().getItems().each(function (item) {
            //     console.log(item.getUserCls());
            // });

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
                interval: 30, // default interval 30s
                isReport: false
            });
        },

        onWidgetAdd: function (store, widgets, index) {
            var me = this, record,
                widget = widgets[0],
                widgetsContainer = me.getView().up('dashboard').down('#widgets');

            if (widget.get('isReport')) {
                record = Ext.getStore('reports').findRecord('name', widget.get('name'), 0, false, true, true);

                if (!record) {
                    console.warn('There is no report matching "' + widget.get('name') + '"');
                    return;
                }

                widgetsContainer.insert(index, {
                    xtype: 'widget-report',
                    itemId: 'widget_' + widget.get('_identifier'),
                    viewModel: {
                        data: {
                            widget: widget,
                            record: record
                        }
                    }
                });
            } else {
                widgetsContainer.insert(index, {
                    xtype: 'widget-' + widget.get('_identifier'),
                    itemId: 'widget_' + widget.get('_identifier'),
                    viewModel: {
                        data: {
                            widget: widget
                        }
                    }
                });
            }
        },

        removeWidget: function (grid, info) {
            grid.getStore().remove(info.record);
        },

        onWidgetRemove: function (store, widgets, index) {
            var me = this,
                widget = widgets[0],
                widgetsContainer = me.getView().up('dashboard').down('#widgets'),
                cmp = widgetsContainer.down('#widget_' + widget.get('_identifier'));

            if (!cmp) {
                console.warn('Widget compoenent not found! ' + widget.get('_identifier'));
            }

            widgetsContainer.remove(cmp);
        },

        onSort: function (grid, info) {
            // var grid = this;
            var store = grid.getStore(),
                record = info.record,
                newIndex, oldIndex = store.indexOf(record);
            // newIndex, pos;
            switch (info.tool.type) {
                case 'up':    newIndex = oldIndex > 0 ? (oldIndex - 1) : oldIndex; break;
                case 'down':  newIndex = oldIndex < store.getCount() ? (oldIndex + 1) : oldIndex; break;
                default: break;
            }

            store.removeAt(oldIndex);
            store.insert(newIndex, record);
            // store.sync();
        },

        // reset widgets to default
        onLoadDefaults: function () {
            var store = Ext.getStore('widgets'),
                model = store.getModel(),
                proxy = model.getProxy(),
                api = proxy.getApi();

            proxy.setApi({ read: api.read.replace('/settings/', '/defaults/') });
            // revert api to it's default values
            store.load(function() {
                proxy.setApi(api);
            });
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
