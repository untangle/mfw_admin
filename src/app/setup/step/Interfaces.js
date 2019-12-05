Ext.define('Mfw.setup.step.Interfaces', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interfaces',

    scrollable: true,

    padding: '32 0 0 0',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'container',
        width: 800,
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            width: 120
        }, {
            xtype: 'component',
            flex: 1,
            html: '<h1 style="text-align: center; margin: 0;">Interfaces</h1>'
        }, {
            xtype: 'button',
            width: 120,
            iconCls: 'md-icon-refresh',
            text: 'Refresh',
            handler: 'refresh'
        }]
    }, {
        xtype: 'component',
        margin: '8 0 8 0',
        width: 800,
        html: '<hr/>'
    }, {
        xtype: 'component',
        margin: '0 0 24 0',
        style: 'color: #777;',
        html: 'select an interface to view/edit configuration'
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        width: 800,
        flex: 1,
        store: 'interfaces',
        rowLines: false,
        selectable: false,
        itemConfig: {
            viewModel: true,
            ripple: false
        },

        columns: [{
            align: 'center',
            dataIndex: 'type',
            width: 44,
            resizable: false,
            hideable: false,
            menuDisabled: true,
            cell: { encodeHtml: false },
            renderer: Renderer.interfaceIcon
        }, {
            text: 'Name',
            dataIndex: 'name',
            width: 120,
            menuDisabled: true,
            sortable: false,
            cell: { encodeHtml: false },
            renderer: function (value) {
                return '<b>' + value + '</b>';
            }
        }, {
            text: 'Status',
            dataIndex: '_status',
            align: 'center',
            width: 80,
            resizable: false,
            hideable: false,
            menuDisabled: true,
            cell: { encodeHtml: false },
            renderer: Renderer.intfStatusConnected
        }, {
            text: 'Config',
            dataIndex: 'configType',
            menuDisabled: true,
            sortable: false,
            minWidth: 150,
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: 'configTypeRenderer'
        }, {
            text: 'IPv4',
            width: 180,
            flex: 1,
            dataIndex: 'v4ConfigType',
            sortable: false,
            menuDisabled: true,
            renderer: Renderer.ipv4
        }, {
            text: 'IPv6',
            width: 180,
            flex: 1,
            dataIndex: 'v6ConfigType',
            sortable: false,
            menuDisabled: true,
            renderer: Renderer.ipv6
        }, {
            width: 44,
            sortable: false,
            resizable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    edit: {
                        handler: 'onEdit'
                    }
                }
            }
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function () {
            var store = Ext.getStore('interfaces');
            store.load();
            store.clearFilter(true);
            store.setFilters([
                { property: 'hidden', value: false }
            ]);
        },

        onEdit: function (view, info) {
            var me = this;

            me.intfDialog = Ext.Viewport.add({
                xtype: 'dialog',
                ownerCmp: me.getView(),
                layout: 'fit',
                width: 416,
                height: Ext.getBody().getViewSize().height < 700 ? (Ext.getBody().getViewSize().height - 20) : 700,
                padding: 0,

                showAnimation: false,
                hideAnimation: false,

                items: [{
                    xtype: 'mfw-settings-network-interface',
                    viewModel: {
                        data: {
                            intf: info.record,
                            isDialog: true
                        }
                    }
                }]
            });

            me.intfDialog.on('destroy', function () {
                me.intfDialog = null;
            });
            me.intfDialog.show();
        },

        continue: function (cb) {
            var me = this,
                vm = me.getViewModel(),
                store = Ext.getStore('interfaces');

            // if no changes made just skip to next step
            if (store.getModifiedRecords().length === 0) {
                cb();
                return;
            }

            // important, oterwise non-dirty records won't be included in sync
            store.getDataSource().each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            store.sync({
                // callback regardless of success/failure
                callback: function () {
                    cb();
                }
            });
        },

        configTypeRenderer: function (value, record) {
            if (value === 'ADDRESSED') {
                return 'Addressed';
            }
            if (value === 'BRIDGED') {
                var bridged = Ext.getStore('interfaces').findRecord('interfaceId', record.get('bridgedTo'));
                return 'Bridged to <strong>' + (bridged ? bridged.get('name') : 'undefined') + '</strong>';
            }
        },

        refresh: function () {
            Ext.getStore('interfaces').load();
        }
    }

});
