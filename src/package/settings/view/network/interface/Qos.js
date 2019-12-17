/**
 * QoS options
 */
Ext.define('Mfw.settings.interface.Qos', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-qos',

    layout: 'fit',

    viewModel: {
        data: {
            performanceTestEnabled: false
        }
    },

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
                    hidden: '{setupContext || !performanceTestEnabled}',
                    disabled: '{!intf.qosEnabled}'
                }
            }]
        }]
    }],
    listeners: {
        activate: 'onActivate',
    },

    controller: {
        onActivate: function (view) {
            var vm = view.getViewModel();

            /**
             * MFW-846 - check board name
             * if not E3 show performance test options
             */
            Ext.Ajax.request({
                url: '/api/status/hardware',
                success: function (response) {
                    var hardware = Ext.decode(response.responseText),
                        boardName = hardware.boardName;

                    // enable performance testing if not E3
                    if (boardName && !boardName.match(/e3/i)) {
                        vm.set('performanceTestEnabled', true);
                    }
                },
                failure: function () {
                    vm.set('performanceTestEnabled', true);
                }
            });
        },

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
