/**
 * QoS options
 * shown only if interface is WAN
 */
Ext.define('Mfw.settings.interface.Qos', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-qos',

    scrollable: true,

    layout: {
        type: 'hbox'
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        items: [{
            xtype: 'formpanel',
            width: 300,
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'QoS Settings'
            }, {
                xtype: 'togglefield',
                boxLabel: 'Enable QoS',
                bind: {
                    value: '{intf.qosEnabled}',
                }
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    xtype: 'numberfield',
                    flex: 1,
                    labelAlign: 'top',
                    required: false,
                    clearable: false,
                    autoComplete: false
                },
                items: [{
                    label: 'Download Kbps',
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf.downloadKbps}',
                        required: '{intf.qosEnabled}',
                        disabled: '{!intf.qosEnabled}'
                    }
                }, {
                    label: 'Upload Kbps',
                    margin: '0 0 0 16',
                    bind: {
                        value: '{intf.uploadKbps}',
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
                    buttons: []
                });

            if (!device) { return; }

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
                    testMsg.setMessage('<p style="margin: 0; text-align: center;">' + intf.get('name') + ' performance test result<br/><br/><strong>download:</strong> ' + result.download + 'Kbps, <strong>upload:</strong> ' + result.upload + 'Kbps');
                },
                failure: function () {
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
