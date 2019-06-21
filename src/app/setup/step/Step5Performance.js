Ext.define('Mfw.setup.step.Performance', {
    extend: 'Ext.Panel',
    alias: 'widget.step-performance',

    viewModel: {
        data: {
            testprogress: true
        }
    },

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        width: 600,
        html: '<h1 style="text-align: center;">WAN Performance</h1><hr/>'
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        minWidth: 600,
        flex: 1,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },

        hidden: true,
        bind: {
            hidden: '{testprogress}'
        },

        store: 'interfaces',
        rowLines: false,
        selectable: false,
        sortable: false,
        itemConfig: {
            viewModel: true,
        },

        columns: [{
            text: 'Interface Name [ id ] / device',
            dataIndex: 'name',
            flex: 1,
            minWidth: 150,
            menuDisabled: true,
            sortable: false,
            cell: { encodeHtml: false },
            renderer: function (value, record) {
                return '<b>' + record.get('name') + ' [ ' + record.get('interfaceId') + ' ]</b> / ' + record.get('device');
            }
        }, {
            text: 'Download',
            align: 'right',
            width: 120,
            menuDisabled: true,
            dataIndex: 'downloadKbps',
            cell: {
                encodeHtml: false,
                tools: [{
                    cls: 'cell-edit-icon',
                    iconCls: 'md-icon-edit',
                    zone: 'start'
                }]
            },
            renderer: function (value) {
                return value ? '<strong>' + (value/1000).toFixed(2) + ' Mbps</strong>' : '<em style="color: #777;">< not set ></em>';
            },
            editor: {
                xtype: 'numberfield',
                clearable: false,
                required: true,
                maxLength: 6
            }
        }, {
            text: 'Upload',
            align: 'right',
            width: 120,
            dataIndex: 'uploadKbps',
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                tools: [{
                    cls: 'cell-edit-icon',
                    iconCls: 'md-icon-edit',
                    zone: 'start'
                }]
            },
            editable: true,
            renderer: function (value) {
                return value ? '<strong>' + (value/1000).toFixed(2) + ' Mbps</strong>' : '<em style="color: #777;">< not set ></em>';
            },
            editor: {
                xtype: 'numberfield',
                clearable: false,
                required: true,
                maxLength: 6
            }
        }, {
            text: 'Ping',
            align: 'right',
            width: 60,
            menuDisabled: true,
            dataIndex: '_ping',
            renderer: function (value) {
                return value ? value + ' ms' : '-';
            }
        }]
    }, {
        xtype: 'container',
        style: 'text-align: center',
        height: 400,
        layout: 'center',
        html: '<p>Testing WAN performance. Please wait ...</p><br/><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
        hidden: true,
        bind: {
            hidden: '{!testprogress}'
        }
    }, {
        xtype: 'container',
        width: 600,
        flex: 1,
        layout: { type: 'hbox', align: 'top', pack: 'center' },
        hidden: true,
        bind: {
            hidden: '{testprogress}'
        },
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-play',
            text: 'Run Test',
            handler: 'runPerformanceTest',
            width: 120
        }, {
            flex: 1
        }, {
            xtype: 'component',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            width: 150,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue',
            hidden: true,
            bind: { hidden: '{processing}' }
        }, {
            flex: 1,
            margin: '0 120 0 0'
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
                { property: 'wan', value: true }
            ]);

            // make sure interfaces store is loaded then check for wans
            if (!store.isLoaded()) {
                store.on('load', me.checkForTest, me);
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
            } else {
                me.getViewModel().set('testprogress', false);
            }
        },

        /**
         * actual test which runs simultaneously on all wans
         */
        runPerformanceTest: function () {
            var me = this, fns = [],
                vm = me.getViewModel(),
                store = Ext.getStore('interfaces');

            vm.set('testprogress', true);

            // real call
            store.each(function (wan) {
                // is wan but it needs to have static address set
                if (wan.get('wan')) {
                    fns.push(function () {
                        var deferred = new Ext.Deferred(),
                            device = wan.get('device');
                        Ext.Ajax.request({
                            url: '/api/status/wantest/' + device,
                            timeout: 10000, // 10 seconds timeout
                            success: function (response) {
                                var result = Ext.decode(response.responseText);
                                deferred.resolve({
                                    device: device,
                                    test: result
                                });
                            },
                            failure: function (err) {
                                deferred.reject({
                                    device: device,
                                    err: err.statusText
                                });
                            }
                        });
                        return deferred.promise;
                    });
                }
            });

            // test call simulator for 'wan' device
            // fns = [function () {
            //     var deferred = new Ext.Deferred(); // create the Ext.Deferred object
            //     Ext.defer(function () {
            //         deferred.resolve({
            //             device: 'wan',
            //             test: {
            //                 ping: 16,
            //                 download: 78901,
            //                 upload: 56489
            //             }
            //         });
            //     }, 2000);

            //     return deferred.promise;
            // }];
            // end test call simulator


            Ext.Deferred.parallel(fns, me)
                .then(function (result) {
                    var intf;
                    console.log(result);
                    Ext.Array.each(result, function (res) {
                        intf = store.findRecord('device', res.device);
                        intf.set({
                            qosEnabled: true,
                            downloadKbps: res.test.download,
                            uploadKbps: res.test.upload,
                            _ping: res.test.ping
                        });
                    });
                }, function (error) {
                    Ext.Msg.show({
                        title: 'Performance test failed!',
                        message: 'You can set manually the download/upload limits!',
                        width: 400,
                        showAnimation: null,
                        hideAnimation: null,
                        buttons: [{
                            text: 'OK',
                            handler: function () {
                                this.up('messagebox').hide();
                            }
                        }]
                    });
                    console.warn('Wan performance test failed: ', error);
                })
                .always(function () {
                    vm.set('testprogress', false);
                });
        },

        onContinue: function () {
            var me = this,
                info = [],
                wzCtrl = me.getView().up('setup-wizard').getController();

            me.getView().down('grid').getStore().each(function (intf) {
                if (intf.get('wan')) {
                    if (!intf.get('downloadKbps') || !intf.get('uploadKbps')) {
                        info.push('<p style="font-size: 14px;">Interface <strong>' + intf.get('name') + '</strong> requires download/upload limits to be set!</p>');
                    } else {
                        intf.set('qosEnabled', true);
                    }
                }
            });

            if (info.length > 0) {
                Ext.Msg.alert('Info', info.join('<br/>'));
                return;
            }

            Ext.getStore('interfaces').getDataSource().each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            me.getViewModel().set('processing', true);
            Ext.getStore('interfaces').sync({
                success: function () {
                    wzCtrl.update();
                },
                failure: function () {
                    console.warn('Unable to save interfaces!');
                }
            });
        }
    }

});
