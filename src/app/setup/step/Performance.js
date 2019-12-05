Ext.define('Mfw.setup.step.Performance', {
    extend: 'Ext.Panel',
    alias: 'widget.step-performance',

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
            width: 140
        }, {
            xtype: 'component',
            flex: 1,
            html: '<h1 style="text-align: center; margin: 0;">WAN Performance</h1>'
        }, {
            xtype: 'button',
            width: 140,
            iconCls: 'md-icon-refresh',
            text: 'Re-run Test',
            handler: 'runPerformanceTest'
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
        html: 'test performance of connected WAN interfaces'
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        width: 800,
        flex: 1,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },

        store: 'interfaces',
        rowLines: false,
        selectable: false,
        sortable: false,
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
            text: 'QoS Download Speed (Mbps)',
            flex: 1,
            menuDisabled: true,
            dataIndex: '_downloadMbps',
            cell: {
                encodeHtml: false,
                tools: [{
                    cls: 'cell-edit-icon',
                    iconCls: 'md-icon-edit'
                }]
            },
            renderer: function (value) {
                return value ? (value + ' Mbps') : '<em style="color: #777;">type value</em>';
            },
            editor: {
                xtype: 'numberfield',
                placeholder: 'enter Mbps',
                clearable: false,
                required: true,
                decimals: 3
            }
        }, {
            text: 'QoS Upload Speed (Mbps)',
            flex: 1,
            dataIndex: '_uploadMbps',
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                tools: [{
                    cls: 'cell-edit-icon',
                    iconCls: 'md-icon-edit'
                }]
            },
            renderer: function (value) {
                return value ? (value + ' Mbps') : '<em style="color: #777;">type value</em>';
            },
            editor: {
                xtype: 'numberfield',
                placeholder: 'enter Mbps',
                clearable: false,
                required: true,
                decimals: 3
            }
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function () {
            var me = this,
                store = Ext.getStore('interfaces');

            store.clearFilter(true);
            store.setFilters([
                { property: 'hidden', value: false },
                { property: 'enabled', value: true },
                { property: 'wan', value: true },
                // add extra filter to test only connected wans
                new Ext.util.Filter({
                    filterFn: function(intf) {
                        return intf.get('_status').connected;
                    }
                })
            ]);

            // make sure interfaces store is loaded then check for wans
            if (!store.isLoaded()) {
                store.load(function () {
                    me.checkForTest();
                });
            } else {
                me.checkForTest();
            }
        },

        /**
         * detects is download/upload limits are set for each WAN and starts the test if not
         */
        checkForTest: function () {
            var me = this,
                store = Ext.getStore('interfaces'),
                runTest = false;

            store.each(function (wan) {
                if (!wan.get('downloadKbps') || !wan.get('uploadKbps')) {
                    runTest = true;
                }
            });

            if (runTest) {
                me.runPerformanceTest();
            }
        },

        /**
         * initiate performance test on each interface
         */
        runPerformanceTest: function () {
            var me = this
                store = Ext.getStore('interfaces');
                interfaces = [];

            store.each(function (wan) {
                if (wan.get('wan')) {
                    interfaces.push(wan);
                }
            });

            // use performance dialog
            Ext.Viewport.add({
                xtype: 'performance-dialog',
                interfaces: interfaces
            }).show();
        },

        continue: function (cb) {
            var me = this,
                vm = me.getViewModel(),
                store = Ext.getStore('interfaces'),
                info = [];

            store.each(function (intf) {
                if (intf.get('wan')) {
                    if (!intf.get('downloadKbps') || !intf.get('uploadKbps')) {
                        info.push('<p style="font-size: 14px;">Interface <strong>' + intf.get('name') + '</strong> requires download/upload limits to be set!</p>');
                    } else {
                        intf.set('qosEnabled', true);
                    }
                }
            });

            if (info.length > 0) {
                vm.set('processing', false);
                Ext.Msg.alert('Info', info.join('<br/>'));
                return;
            }

            if (store.getModifiedRecords().length === 0) {
                cb();
                return;
            }

            /**
             * very important to clear filters otherwise it saves only wans
             * store.clearFilter(); (deprecated and not useful)
             *
             * MFW-691
             * use getDataSource() instead to return unfiltered collection
             * and clear filter only after advancing to next step
             */
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
        }
    }

});
