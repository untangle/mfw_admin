/**
 * QoS options
 * shown only if interface is WAN
 */
Ext.define('Mfw.settings.interface.Qos', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-qos',

    layout: 'fit',

    items: [{
        xtype: 'container',
        scrollable: true,
        items: [{
            xtype: 'formpanel',
            padding: '2 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                margin: '16 0',
                items: [{
                    xtype: 'component',
                    flex: 1,
                    style: 'font-size: 20px; font-weight: 100;',
                    html: 'QoS Settings'
                }, {
                    xtype: 'togglefield',
                    activeBoxLabel: 'Enable QoS',
                    inactiveBoxLabel: 'Disabled QoS',
                    bind: '{intf.qosEnabled}'
                }]
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    xtype: 'numberfield',
                    placeholder: 'enter Mbps',
                    flex: 1,
                    labelAlign: 'top',
                    required: false,
                    clearable: false,
                    autoComplete: false,
                    decimals: 3
                },
                items: [{
                    label: 'Download Mbps',
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf._downloadMbps}',
                        required: '{intf.qosEnabled}',
                        disabled: '{!intf.qosEnabled}'
                    }
                }, {
                    label: 'Upload Mbps',
                    margin: '0 0 0 16',
                    bind: {
                        value: '{intf._uploadMbps}',
                        required: '{intf.qosEnabled}',
                        disabled: '{!intf.qosEnabled}'
                    }
                }]
            }, {
                xtype: 'button',
                text: 'Test Performance',
                ui: 'action',
                margin: '32 0 0 0',
                handler: 'onTestPerformance',
                hidden: true,
                disabled: true,
                bind: {
                    hidden: '{setupContext}',
                    disabled: '{!intf.qosEnabled}'
                }
            }]
        }]
    }],

    controller: {
        onTestPerformance: function () {
            var intf = this.getViewModel().get('intf'),
                device = intf.get('device'),
                testMsg = Ext.create('Ext.MessageBox', {
                    title: '',
                    bodyStyle: 'font-size: 14px; color: #333; padding: 0;',
                    message: '<p style="margin: 0; text-align: center;"><i class="fa fa-spinner fa-spin fa-fw"></i><br/><br/>Testing performance of ' + intf.get('name') + '. Please wait ...</p>',
                    width: 400,
                    showAnimation: null,
                    hideAnimation: null,
                    buttons: [{
                        text: 'Cancel',
                        ui: 'action',
                        margin: '16 0 0 0',
                        handler: function () {
                            Ext.Object.each(Ext.Ajax.requests, function (key, req) {
                                if (req.url.startsWith('/api/status/wantest')) {
                                    req.abort();
                                }
                            });
                        }
                    }]
                });

            if (!device) { return; }

            // MFW-681, QoS settings must be saved before running performance test
            if (intf.isModified('qosEnabled') && intf.get('qosEnabled') === true) {
                Ext.Msg.alert('Info', 'Enabling QoS requires settings to be saved before testing the performance!', Ext.emptyFn);
                return;
            }

            testMsg.show();

            Ext.Ajax.request({
                url: '/api/status/wantest/' + device,
                timeout: 10000, // 10 seconds timeout
                success: function (response) {
                    // if responseText is not a decadable JSON than will return null
                    var result = Ext.JSON.decode(response.responseText, true);
                    if (!result) { return; }
                    intf.set('downloadKbps', result.download);
                    intf.set('uploadKbps', result.upload);
                    testMsg.setMessage('<p style="margin: 0; text-align: center;">' + intf.get('name') + ' performance test result<br/><br/><strong>download:</strong> ' + result.download/1000 + 'Mbps, <strong>upload:</strong> ' + result.upload/1000 + 'Mbps');
                },
                failure: function (response) {
                    if (response.aborted) {
                        testMsg.hide();
                        return;
                    }
                    testMsg.setMessage('<p style="margin: 0; text-align: center;">Unable to test ' + intf.get('name') + '!</p>');
                },
                callback: function () {
                    testMsg.setButtons([{
                        text: 'Close',
                        ui: 'action',
                        margin: '16 0 8 0',
                        handler: function () {
                            testMsg.hide();
                        }
                    }]);
                }
            });
        }
    }
});
