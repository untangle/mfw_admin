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
                items: [  
                {
                    xtype: 'component',
                    flex: 1,
                    style: 'font-size: 20px; font-weight: 100;',
                    html: 'QoS Settings'
                }, {
                    xtype: 'togglefield',
                    activeBoxLabel: 'Enable QoS',
                    inactiveBoxLabel: 'Disabled QoS',
                    bind: {
                        value: '{intf.qosEnabled}',
                        disabled: '{!license}'
                    }
                }]
            }, {
                xtype: 'component',
                style: 'color: red',
                html: 'QOS is Disabled when unlicensed.',
                padding: 8,
                hidden: true,
                bind: {
                    hidden: '{license}'
                }
            },  {
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
                        var licInfo = CommonUtil.readLicense(this.up().up().up().up().up());

                        if (licInfo) {
                            // If seats exists on the license, then we want to toggle the message depending on the QOS settings.
                            if(licInfo.seats) {
                                console.log(licInfo);

                                //Unlimited can return whatever
                                if(licInfo.seatsReadable === 'Unlimited' ) {return true;}

                                // Invalidate form when value is above license
                                if (val > licInfo.seats) {
                                    return "QOS exceeds license limit.";
                                }
                            }
                        }
                       return true;
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
                html: 'QoS is most effective when configured based on your actual network performance',
                bind: {
                    hidden: '{!intf.qosEnabled}',
                    html: "QoS is most effective when configured based on your actual network performance, which will be up to the appliance license limit of {license.seatsReadable}"
                },
                margin: '32 0 0 0',
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
        afterRender: 'onAfterRender'
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

            // Get the license into the VM
            CommonUtil.readLicense(this);
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
