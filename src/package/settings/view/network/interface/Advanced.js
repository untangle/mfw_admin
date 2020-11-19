/**
 * NIC Advanced options.
 * shown only if interface type is NIC
 */
Ext.define('Mfw.settings.interface.Advanced', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-advanced',

    layout: 'fit',
    viewModel: {
        data: {
            linkModes: []
        },
        formulas: {
            _linkSpeedTypes: function (get) {
                let speedOptions = [];
                reSpeed = /[0-9]*/;
                get('intf._status.ethLinkSupported').forEach(function (s) {
                    speed = s.match(reSpeed)[0];
                    obj = { text: speed, value: speed };
                    if (!speedOptions.some(o => o['text'] === speed)) {
                        speedOptions.push(obj);
                    }
                });
                return speedOptions;
            },
            _linkDuplexTypes: function (get) {
                options = get('intf._status.ethLinkSupported');
                speed = get('intf.ethSpeed');
                return(CommonUtil.getDuplexOptions(options, speed));
            }
        }
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        items: [{
            xtype: 'formpanel',
            padding: '8 16 16 16',
            width: 400,
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [
                    {
                        xtype: 'component',
                        margin: '16 0',
                        flex: 1,
                        style: 'font-size: 20px; font-weight: 100;',
                        html: 'NIC Settings'
                    }]
            },
            {
                xtype: 'containerfield',
                layout: 'vbox',
                defaults: {
                    flex: 1,
                    required: false,
                    clearable: false,
                    autoComplete: false,

                },
                items: [
                    {
                        xtype: 'component',
                        flex: 1,
                        bind: {
                            html: 'Current settings: <strong>{intf._status.ethSpeed}</strong> Mbps, <strong>{intf._status.ethDuplex}</strong>' +
                                ' duplex, auto Negotiation: <strong>{intf._status.ethAutoneg}</strong>',
                        }
                    },
                    {
                        boxLabel: 'Auto negotiation',
                        userCls: 'advancedAutoNeg',
                        xtype: 'checkbox',
                        bodyAlign: 'start',
                        id: 'ethAutoneg',
                        bind: {
                            checked: '{intf.ethAutoneg}'
                        },
                        listeners: {
                            change: function (_, newvalue) {
                                if (newvalue) {
                                    Ext.getCmp('ethSpeed').disable();
                                    Ext.getCmp('ethDuplex').disable();
                                }
                                else {
                                    Ext.getCmp('ethSpeed').enable();
                                    Ext.getCmp('ethDuplex').enable();
                                }
                            }
                        }
                    },
                    {
                        label: 'Link Speed',
                        xtype: 'selectfield',
                        id: 'ethSpeed',
                        bind: {
                            value: '{intf.ethSpeed}',
                            disabled: '{intf.ethAutoneg}',
                            options: '{_linkSpeedTypes}'
                        },
                        listeners : {
                            change: 'setDuplexOptions'
                        }
                    },
                    {
                        label: 'Duplex',
                        xtype: 'selectfield',
                        id: 'ethDuplex',
                        bind: {
                            value: '{intf.ethDuplex}',
                            disabled: '{intf.ethAutoneg}',
                            options: '{_linkDuplexTypes}'
                        },
                    }]
            }]
        }]
    }],
    controller: {
        setDuplexOptions: function() {
            var vm = this.getViewModel();
            var options = vm.get('intf._status.ethLinkSupported');
            var speed = vm.get('intf.ethSpeed');
            let duplexOptions = CommonUtil.getDuplexOptions(options, speed);
            if (duplexOptions.length == 1) {
                Ext.getCmp('ethDuplex').setValue(duplexOptions[0].value);
            }
        }
    }
});
