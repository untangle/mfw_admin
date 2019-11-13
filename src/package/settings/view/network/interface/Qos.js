/**
 * QoS options
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
                handler: 'runPerformanceTest',
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
        runPerformanceTest: function () {
            var me = this,
                vm = me.getViewModel(),
                intf = vm.get('intf');

            // use performance dialog
            Ext.Viewport.add({
                xtype: 'performance-dialog',
                interfaces: [intf]
            }).show();
        }
    }
});
