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
                        items: [
                            { text: 'Information'.t() },
                            { text: 'Resources'.t() },
                            { text: 'CPU Load'.t() },
                            { text: 'Network Information'.t() },
                            { text: 'Network Layout'.t() },
                            { text: 'Map Distribution'.t() },
                            { text: 'Notifications'.t() }
                        ]
                    }
                    // handler: 'showSettings'
                }, '-', '-', {
                    text: 'Import'.t(),
                    iconCls: 'x-fa fa-download'
                }, {
                    text: 'Export'.t(),
                    iconCls: 'x-fa fa-upload'
                }, '-', {
                    text: 'Reset'.t(),
                    iconCls: 'x-fa fa-rotate-left'
                }]
            }
        }]
    }, {
        xtype: 'grid',
        hideHeaders: true,
        disableSelection: true,
        store: 'widgets',
        columns: [{
            text: 'Widget',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            dataIndex: 'name',
            flex: 1,
            cell: {
                tools: {
                    remove: {
                        iconCls: 'md-icon-delete',
                        zone: 'end',
                        handler: 'removeWidget'
                    }
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

            widgetsStore.on('load', function (store) {
                me.updateWidgetsComponents(store);
                me.updateWidgetsMenu(store);
            }, me);

            widgetsStore.on('add', me.onWidgetsAdd, me);

            widgetsStore.load();
        },

        updateWidgetsComponents: function (store) {
            var me = this, record, widgetsCmp = [],
                widgetsContainer = me.getView().up('dashboard').down('#widgets');

            store.each(function (widget) {
                record = Ext.getStore('reports').findRecord('name', widget.get('name'), 0, false, true, true);

                if (!record) {
                    console.warn('There is no report matching "' + widget.get('name') + '"');
                    return;
                }

                widgetsCmp.push({
                    xtype: 'widget-report',
                    itemId: 'widget_' + widget.get('_identifier'),
                    viewModel: {
                        data: {
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
                category, menus = {};


            reportsStore.each(function (record) {
                category = record.get('category');
                if (!menus[category]) {
                    menus[category] = [];
                }
                menus[category].push({
                    text: record.get('name'),
                    identifier: record.get('_identifier'),
                    handler: 'addWidget'
                    // iconCls: 'x-fa ' + record.getRendering().get('_icon')
                });
            });

            Ext.Object.each(menus, function (key, val) {
                settingsBtn.getMenu().insert(2, {
                    text: key,
                    iconCls: 'md-icon-add',
                    menu: {
                        items: val
                    }
                });
            });

            // console.log(menus);
        },


        removeWidget: function (grid, info) {
            var me = this,
                widgetsContainer = me.getView().up('dashboard').down('#widgets'),
                cmp = widgetsContainer.down('#widget_' + info.record.get('_identifier'));

            if (!cmp) {
                console.warn('Widget compoenent not found! ' + info.record.get('_identifier'));
            }

            widgetsContainer.remove(cmp);
            grid.getStore().remove(info.record);
        },

        addWidget: function (menuItem) {
            if (Ext.getStore('widgets').findRecord('name', menuItem.getText(), 0, false, true, true)) {
                Ext.Msg.alert('Info', 'Widget already in Dashboard!', Ext.emptyFn);
                return;
            }

            menuItem.up('menu').hide();

            Ext.getStore('widgets').add({
                name: menuItem.getText()
            });
        },

        onWidgetsAdd: function (store, widgets) {
            var me = this, record,
                widget = widgets[0],
                widgetsContainer = me.getView().up('dashboard').down('#widgets');

            record = Ext.getStore('reports').findRecord('name', widget.get('name'), 0, false, true, true);

            if (!record) {
                console.warn('There is no report matching "' + widget.get('name') + '"');
                return;
            }

            widgetsContainer.add({
                xtype: 'widget-report',
                itemId: 'widget_' + widget.get('_identifier'),
                viewModel: {
                    data: {
                        record: record
                    }
                }
            });
        }
    }

});
