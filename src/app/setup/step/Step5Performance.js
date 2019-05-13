Ext.define('Mfw.setup.step.Performance', {
    extend: 'Ext.Panel',
    alias: 'widget.step-performance',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        width: 600,
        html: '<h1 style="text-align: center;">WAN(s) Performance</h1><hr/>' +
            '<br/><p style="text-align: center;">Testing WAN(s) performance. You can alter the Download/Upload bandwidth.</p>'
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
        store: {
            type: 'interfaces',
            // do not display hidden interfaces
            filters: [{
                property: 'wan',
                value: true
            }]
        },
        rowLines: false,
        selectable: false,
        itemConfig: {
            viewModel: true,
        },

        columns: [{
            text: 'Interface Name [ id ]',
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
            xtype: 'checkcolumn',
            text: 'QoS',
            width: 50,
            dataIndex: 'qosEnabled'
        }, {
            text: 'Download',
            align: 'right',
            width: 120,
            dataIndex: 'downloadKbps',
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'start' }]
            },
            renderer: function (value) {
                return '<strong>' + (value || '?') + '</strong> Kbps';
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
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'start' }]
            },
            editable: true,
            renderer: function (value) {
                return '<strong>' + (value || '?') + '</strong> Kbps';
            },
            editor: {
                xtype: 'numberfield',
                clearable: false,
                required: true,
                maxLength: 6
            }
        }, {
            text: 'Performance Test',
            minWidth: 420,
            cell: {
                encodeHtml: false,
                tools: [{
                    xtype: 'button',
                    cls: 'btn-tool',
                    zone: 'end',
                    margin: '0 16 0 0',
                    text: 'Set',
                    hidden: true,
                    bind: {
                        value: '{record.interfaceId}',
                        hidden: '{!record._ping}',
                        ui: '{record._ping ? "action" : ""}'
                    },
                    handler: 'setValues'
                }, {
                    xtype: 'button',
                    cls: 'btn-tool',
                    zone: 'end',
                    text: 'Run',
                    bind: {
                        value: '{record.interfaceId}',
                        ui: '{!record._ping ? "action" : ""}',
                        hidden: '{!record.device}'
                    },
                    handler: 'testInterface'
                }]
            },
            renderer: function (value, record) {
                if (record.get('_download') && record.get('_upload') && record.get('_ping')) {
                    return '<i class="x-fa fa-arrow-down"> ' + record.get('_download') + ' Kbps / ' +
                           '<i class="x-fa fa-arrow-up"> ' + record.get('_upload') + ' Kbps / ' +
                           'ping ' + record.get('_ping') + ' ms';
                }
                return '<span style="color: #777; font-style: italic;">Not tested yet</span>';
            }
        }]
    }, {
        xtype: 'container',
        flex: 1,
        layout: { type: 'hbox', align: 'top', pack: 'center' },
        items: [{
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
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function (view) {
            if (view.down('grid').getStore().loadCount === 0) {
                view.down('grid').getStore().load();
            }
        },

        testInterface: function (btn) {
            var me = this, interfaceId = btn.getValue(),
                interface = me.getView().down('grid').getStore().findRecord('interfaceId', interfaceId);

                Ext.Msg.show({
                    title: '',
                    message: '<p>Testing performance for <span style="color: #333;">' + interface.get('name') + '</span></p>' +
                             '<p style="text-align: center; margin: 0;">Please wait! It might take few minutes ... <br/><br/><i class="fa fa-spinner fa-spin fa-fw"></i></p>',
                    showAnimation: false,
                    hideAnimation: false,
                    buttons: []
                });

                Ext.Ajax.request({
                    url: '/api/status/wantest/' + interface.get('device'),
                    timeout: 100000, // 10 minutes timeout
                    success: function (response) {
                        var resp = Ext.decode(response.responseText);
                        interface.set({
                            _ping: resp.ping,
                            _download: resp.download,
                            _upload: resp.upload
                        });
                        interface.set('downloadKbps', resp.download);
                        interface.set('uploadKbps', resp.upload);
                        Ext.Msg.hide();
                    },
                    failure: function () {
                        // error is caught/displayed by exception handling mechanism
                        Ext.Msg.hide();
                    }
                });
        },

        setValues: function (btn) {
            var me = this, interfaceId = btn.getValue(),
                interface = me.getView().down('grid').getStore().findRecord('interfaceId', interfaceId);

            interface.set({
                downloadKbps: interface.get('_download'),
                uploadKbps: interface.get('_upload')
            });
        },

        onContinue: function () {
            var me = this,
                info = [],
                wzCtrl = me.getView().up('setup-wizard').getController();

            me.getView().down('grid').getStore().each(function (intf) {
                if (intf.get('qosEnabled')) {
                    if (!intf.get('downloadKbps') || !intf.get('uploadKbps')) {
                        info.push('<p style="font-size: 14px;">Interface <strong>' + intf.get('name') + '</strong> requires download/upload limits to be set!</p>');
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
