/**
 * QoS options
 */
Ext.define('Mfw.settings.interface.Qos', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-qos',

    layout: 'fit',

    viewModel: {
        data: {
            performanceTestEnabled: false,
            licenseInfo: null
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
                    decimals: 3,
                    validators: function(val) {
                        return this.up().up().up().up().up().getController().validateQos();

                    }
                },
                items: [{
                    label: 'Download Mbps',
                    itemId: 'qosDl',
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf._downloadMbps}',
                        required: '{intf.qosEnabled}',
                        disabled: '{!intf.qosEnabled}'
                    }
                }, {
                    label: 'Upload Mbps',
                    itemId: 'qosUl',
                    margin: '0 0 0 16',
                    bind: {
                        value: '{intf._uploadMbps}',
                        required: '{intf.qosEnabled}',
                        disabled: '{!intf.qosEnabled}'
                    }
                }]
            }, {
                xtype: 'label',
                itemId: 'qosAlert',
                html: '',
                margin: '32 0 0 0',
                hidden: true
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
        initialize: 'onInit',
    },

    controller: {
        onInit: function (view) {
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
        },

        /**
         * validateQos validates current Qos settings and will display a message if the user has configured QOS outside of the accepted license range.
         * 
         * This function is not only a Validator because we also need to access View Model data for the License Info, as well as the PerformanceTestEnabled data.
         * 
         */

        validateQos: function() {
            var me = this,
                vm = me.getViewModel(),
                v = me.getView(),
                licInfo = vm.get('licenseInfo');


            // If no License Info exists, call the status/license API to get the license data
            if(!licInfo) {
                Ext.Ajax.request({
                    async: false,
                    url: '/api/status/license',
                    success: function (response) {
                        licInfo = Ext.decode(response.responseText);
                    },
                    failure: function () {
                        return true;
                    }
                });

                vm.set('licenseInfo', licInfo)
            }

            if(licInfo) {
                var qosAlert = v.down('#qosAlert'),
                    dlMbps = v.down('#qosDl').getValue(),
                    ulMbps = v.down('#qosUl').getValue(),
                    seats = licInfo.list[0].seats,
                    perfEnabled = vm.get('performanceTestEnabled');

                // if Test Performance is disabled, then we want to display a different button
                if(perfEnabled) {
                    qosAlert.setHtml('QoS is most effective when configured based on your actual network performance. Use the Test Performance button to find out how your network is performing');
                } else {
                    qosAlert.setHtml('QoS is most effective when configured based on your actual network performance.');
                }

                // If seats exists on the license, then we want to toggle the message depending on the QOS settings.
                if(seats) {
                    var upperLic = seats + 50,
                        lowerLic = seats - 50;

                    if(!(dlMbps >= lowerLic && dlMbps <= upperLic) || !(ulMbps >= lowerLic && ulMbps <= upperLic)) {
                        qosAlert.show();
                    } else {
                        qosAlert.hide();
                    }
                }
            } else {
                var qosAlert = v.down('#qosAlert');
                if (qosAlert) {
                    qosAlert.setHtml('QoS is most effective when configured based on your actual network performance.');
                    qosAlert.show();
                }
            }

            return true;
        }
    }
});
