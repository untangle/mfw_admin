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
                    decimals: 3,
                    validators: function(val) {
                        var licInfo = null,
                         qosAlert = this.up().up().up().down('#qosAlert');

                        console.log("Finding QOS alert:");
                        console.log(qosAlert);

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


                        if(licInfo && licInfo.list.length > 0) {
                            var licSeats = licInfo.list[0].seats;

                            console.log("Seats:");
                            console.log(licSeats);

                            console.log("Current val:");
                            console.log(val);

                            if(!(val >= licSeats - 50 && val <= licSeats + 50)) {
                                console.log("Display qos alert");
                                qosAlert.show();
                            } else {
                                qosAlert.hide();
                            }
                        }

                        return true;

                    }
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
                xtype: 'label',
                itemId: 'qosAlert',
                html: 'QoS is most effective when configured based on your actual network performance. Use the Test Performance button to find out how your network is performing',
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
