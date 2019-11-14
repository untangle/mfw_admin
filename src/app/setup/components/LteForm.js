Ext.define('Mfw.setup.cmp.Lte', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lteform',

    layout: {
        type: 'vbox'
    },

    viewModel: {
        data: {
            /**
             * sim data collected from api status call api/status/wwan/:device
             */
            _simInfo: null,
            /**
             * keep original other network APN (if set) while changing networks
             */
            _originalOtherApn: ''
        },
        formulas: {
            /**
             * SIM details message
             */
            _simInfoMessage: function (get) {
                var simInfo = get('_simInfo');
                if (!simInfo) { return; }
                var message =
                    '<p style="font-size: 14px; font-weight: 600;">SIM Details</p>' +
                    '<ul>' +
                        '<li>IMEI: ' + (simInfo['imei'] || 'n/a') +  '</li>' +
                        '<li>IMSI: ' + (simInfo['imsi'] || 'n/a')  + '</li>' +
                        '<li>ICCID: ' + (simInfo['iccid'] || 'n/a') +  '</li>' +
                    '</ul>';
                return message;
            },

            /**
             * formula to set simNetwork null
             * selectfield does not support null value options
             */
            _simNetwork: {
                get: function (get) {
                    return get('intf.simNetwork');
                },
                set: function (value) {
                    var network = Ext.Array.findBy(Map.options.simNetworks, function (item) {
                        return item.value === value;
                    });
                    if (value !== 'OTHER') {
                        this.set('intf.simNetwork', value);
                        // set sim APN based on network
                        if (network.apn) {
                            this.set('intf.simApn', network.apn);
                        }
                    } else {
                        this.set('intf.simNetwork', null);
                        this.set('intf.simApn', this.get('_originalOtherApn'));
                    }
                }
            }
        }
    },

    items: [{
        xtype: 'container',
        width: 300,
        layout: {
            type: 'vbox'
        },
        defaults: {
            clearable: false,
            labelAlign: 'left',
            // labelTextAlign: 'right'
        },
        items: [{
            xtype: 'container',
            margin: '0 0 16 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 24px;',
                html: 'LTE' // hardcode the LTE name
                // bind: {
                //     html: '{intf.name}'
                // }
            }, {
                flex: 1
            }, {
                xtype: 'togglefield',
                activeBoxLabel: 'Enabled',
                inactiveBoxLabel: 'Disabled',
                bind: '{intf.enabled}'
            }]
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Network',
            required: true,
            options: Map.options.simNetworks,
            placeholder: 'Select network provider ...',
            disabled: true,
            bind: {
                value: '{_simNetwork}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'textfield',
            userCls: 'x-custom-field',
            label: 'APN',
            required: true,
            disabled: true,
            autoComplete: false,
            bind: {
                value: '{intf.simApn}',
                required: '{intf.type === "WWAN" && intf.enabled}',
                disabled: '{!intf.enabled || intf.simNetwork}'
            }
        },
        // {
        //     xtype: 'numberfield',
        //     userCls: 'x-custom-field',
        //     label: 'PIN',
        //     hidden: true,
        //     disabled: true,
        //     clearable: false,
        //     bind: {
        //         value: '{intf.simPin}',
        //         hidden: '{intf.simNetwork}',
        //         disabled: '{!intf.enabled}'
        //     },
        //     validators: [{
        //         type: 'length',
        //         min: 4,
        //         max: 4
        //     }]
        // }, {
        //     xtype: 'textfield',
        //     userCls: 'x-custom-field',
        //     label: 'Username',
        //     hidden: true,
        //     disabled: true,
        //     bind: {
        //         value: '{intf.simUsername}',
        //         hidden: '{intf.simNetwork}',
        //         disabled: '{!intf.enabled}'
        //     }
        // }, {
        //     xtype: 'textfield',
        //     userCls: 'x-custom-field',
        //     inputType: 'password',
        //     name: 'password',
        //     label: 'Password',
        //     triggers: {
        //         reveal: {
        //             type: 'trigger',
        //             iconCls: 'x-fa fa-eye',
        //             hidden: true,
        //             bind: {
        //                 hidden: '{!intf.enabled || intf.simPassword.length === 0}',
        //             },
        //             handler: function (field, trigger) {
        //                 if (field.getDisabled()) {
        //                     return;
        //                 }
        //                 var inputType = field.getInputType();
        //                 if (inputType === 'password') {
        //                     field.setInputType('text');
        //                     trigger.setIconCls('x-fa fa-eye-slash');
        //                 } else {
        //                     field.setInputType('password');
        //                     trigger.setIconCls('x-fa fa-eye');
        //                 }
        //             }
        //         }
        //     },
        //     hidden: true,
        //     disabled: true,
        //     bind: {
        //         value: '{intf.simPassword}',
        //         hidden: '{intf.simNetwork}',
        //         disabled: '{!intf.enabled}'
        //     },
        //     validators: [{
        //         type: 'length',
        //         min: 8
        //     }]
        // },
        {
            // sim info
            xtype: 'component',
            style: 'color: #555; border: 1px #CCC solid; border-radius: 5px; padding: 5px 15px;',
            margin: '32 0 0 0',
            hidden: true,
            bind: {
                html: '{_simInfoMessage}',
                hidden: '{!_simInfo}'
            }
        }]
    }],
    controller: {

        init: function () {
            var me = this, vm = me.getViewModel(), device;
            vm.bind('{intf}', function (intf) {
                // MFW-789 - additional setting/status only if WWAN interface
                if (intf.get('type') === 'WWAN') {
                    if (!intf.get('simNetwork') && intf.get('simApn')) {
                        vm.set('_originalOtherApn', intf.get('simApn'));
                    }
                    device = intf.get('device');

                    if (!device) { return; }

                    Ext.Ajax.request({
                        url: '/api/status/wwan/' + device,
                        success: function (response) {
                            var resp = Ext.decode(response.responseText);
                            vm.set('_simInfo', resp);
                        },
                        failure: function () {
                            console.warn('Unable to get SIM info for device: ' + device);
                        }
                    });
                }
            }, me, {
                single: true
            });
        }
    }
});


