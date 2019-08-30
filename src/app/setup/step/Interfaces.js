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
        margin: '8 0 24 0',
        width: 800,
        html: '<hr/>'
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
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
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
            renderer: function (value, record) {
                if (value === 'DHCP' || value === 'PPPOE') {
                    return value;
                }
                if (value === 'STATIC') {
                    return 'STATIC, ' + record.get('v4StaticAddress') + '/' + record.get('v4StaticPrefix');
                }
                return '-';
            }
        }, {
            text: 'IPv6',
            width: 180,
            flex: 1,
            dataIndex: 'v6ConfigType',
            sortable: false,
            menuDisabled: true,
            renderer: function (value) {
                if (value) {
                    return value;
                }
                return '-';
            }
        }, {
            width: 44,
            sortable: false,
            resizable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    edit: {
                        // bind: {
                        //     hidden: '{record.configType !== "ADDRESSED" && record.type !== "WIFI"}'
                        // },
                        handler: 'onEdit',
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

        continue: function (cb) {
            var store = Ext.getStore('interfaces');

            // if no changes made just skip to next step
            if (store.getModifiedRecords().length <= 0) {
                cb();
                return;
            }

            store.getDataSource().each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            store.sync({
                success: function () {
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

        onEdit: function (grid, info) {
            var me = this,
                intf = info.record;

            me.intfDialog = Ext.Viewport.add({
                xtype: 'interface-dialog',
                ownerCmp: me.getView(),
                interface: intf
            });

            me.intfDialog.on('destroy', function () {
                me.intfDialog = null;
            });
            me.intfDialog.show();
        },

        refresh: function () {
            Ext.getStore('interfaces').load();
        }
    }

});
