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
        width: 600,
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
        margin: '8 0 24 0',
        width: 600,
        html: '<hr/>'
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        width: 600,
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
            renderer: function (value) {
                var svgIcon = '';
                switch (value) {
                    case 'NIC': svgIcon = 'network-wired.svg'; break;
                    case 'WIFI': svgIcon = 'wifi.svg'; break;
                    case 'VLAN':
                    case 'OPENVPN': svgIcon = 'project-diagram.svg'; break;
                    default: svgIcon = 'signal.svg';
                }
                return '<img width=16 src="../static/res/icons/intf/' + svgIcon + '">';
            }
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
            text: 'Download',
            flex: 1,
            menuDisabled: true,
            dataIndex: 'downloadKbps',
            cell: {
                encodeHtml: false,
                tools: [{
                    cls: 'cell-edit-icon',
                    iconCls: 'md-icon-edit'
                }]
            },
            renderer: function (value) {
                return value ? (value/1000).toFixed(2) + ' Mbps' : '<em style="color: #777;">< not set ></em>';
            },
            editor: {
                xtype: 'numberfield',
                clearable: false,
                required: true,
                maxLength: 6
            }
        }, {
            text: 'Upload',
            flex: 1,
            dataIndex: 'uploadKbps',
            menuDisabled: true,
            cell: {
                encodeHtml: false,
                tools: [{
                    cls: 'cell-edit-icon',
                    iconCls: 'md-icon-edit'
                }]
            },
            editable: true,
            renderer: function (value) {
                return value ? (value/1000).toFixed(2) + ' Mbps' : '<em style="color: #777;">< not set ></em>';
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
            width: 100,
            menuDisabled: true,
            dataIndex: '_ping',
            renderer: function (value) {
                return value ? value + ' ms' : '-';
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
                { property: 'wan', value: true }
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
         * actual test which runs simultaneously on all wans
         */
        runPerformanceTest: function () {
            var me = this, fns = [],
                store = Ext.getStore('interfaces');

            var testMsg = Ext.create('Ext.MessageBox', {
                title: '',
                bodyStyle: 'font-size: 14px; color: #333; padding: 0;',
                message: '<p style="margin: 0; text-align: center;"><i class="fa fa-spinner fa-spin fa-fw"></i><br/><br/>Performing WAN test. Please wait ...</p>',
                width: 400,
                showAnimation: null,
                hideAnimation: null,
                buttons: []
            });

            Ext.defer(function () {
                testMsg.show();
            }, 250);

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
                                // if responseText is not a decadable JSON than will return null
                                var result = Ext.JSON.decode(response.responseText, true);
                                if (!result) {
                                    deferred.reject('Invalid test result!');
                                    return;
                                }

                                deferred.resolve({
                                    device: device,
                                    test: result
                                });
                            },
                            failure: function (err) {
                                // resolve the promise even if failed
                                deferred.resolve({
                                    device: device,
                                    err: err.statusText
                                });
                            }
                        });
                        return deferred.promise;
                    });
                }
            });

            Ext.Deferred.parallel(fns, me)
                .then(function (result) {
                    var intf, errors = [], msg;

                    Ext.Array.each(result, function (res) {
                        if (res.err) {
                            errors.push('Unable to test <strong>' + res.device + '</strong>: <em>' + res.err + '</em>');
                            return;
                        }
                        intf = store.findRecord('device', res.device);
                        intf.set({
                            qosEnabled: true,
                            downloadKbps: res.test.download,
                            uploadKbps: res.test.upload,
                            _ping: res.test.ping
                        });
                    });

                    if (errors.length > 0) {
                        msg = errors.join('<br/>');
                        msg += '<p style="font-weight: bold;">You can set manually the download/upload limits!</p>';

                        // this message will appear only if test faild for at least a wan
                        Ext.Msg.show({
                            title: 'Performance test result',
                            bodyStyle: 'font-size: 14px;',
                            message: msg,
                            width: 400,
                            showAnimation: null,
                            hideAnimation: null,
                            buttons: [{
                                text: 'OK',
                                ui: 'action',
                                handler: function () {
                                    this.up('messagebox').hide();
                                }
                            }]
                        });
                    }
                }, function (err) {
                    Ext.Msg.show({
                        title: 'Unable to test',
                        bodyStyle: 'font-size: 14px; color: #333;',
                        message: err,
                        width: 400,
                        showAnimation: null,
                        hideAnimation: null,
                        buttons: [{
                            text: 'OK',
                            ui: 'action',
                            handler: function () {
                                this.up('messagebox').hide();
                            }
                        }]
                    });
                })
                .always(function () {
                    testMsg.hide();
                });
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
                Ext.Msg.alert('Info', info.join('<br/>'));
                vm.set('processing', false);
                return;
            }

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
        }
    }

});
