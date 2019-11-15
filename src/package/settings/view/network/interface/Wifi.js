/**
 * WiFi options
 * shown only if interface type is WIFI
 */
Ext.define('Mfw.settings.interface.Wifi', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wifi',

    scrollable: true,

    layout: {
        type: 'hbox',
        wrap: true
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        items: [{
            xtype: 'formpanel',
            width: 400,
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'WiFi Configuration'
            }, {
                xtype: 'textfield',
                label: 'SSID',
                name: 'wirelessSsid',
                labelAlign: 'top',
                clearable: false,
                required: true,
                bind: {
                    value: '{intf.wirelessSsid}',
                    required: '{intf.type === "WIFI"}',
                    disabled: '{intf.type !== "WIFI"}'
                }
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    required: false,
                    clearable: false,
                    labelAlign: 'top',
                    flex: 1
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'Encryption',
                    name: 'wirelessEncryption',
                    margin: '0 16 0 0',
                    placeholder: 'Select ...',
                    bind: {
                        value: '{intf.wirelessEncryption}',
                        required: '{intf.type === "WIFI"}',
                        disabled: '{intf.type !== "WIFI"}'
                    },
                    options: [
                        { text: 'None', value: 'NONE' },
                        { text: 'WPA1', value: 'WPA1' },
                        { text: 'WPA12', value: 'WPA12' },
                        { text: 'WPA2', value: 'WPA2' }
                    ]
                }, {
                    xtype: 'textfield',
                    label: 'Password',
                    name: 'wirelessPassword',
                    inputType: 'password',
                    margin: '0 0 0 16',
                    triggers: {
                        reveal: {
                            type: 'trigger',
                            iconCls: 'x-fa fa-eye',
                            hidden: true,
                            bind: {
                                hidden: '{!intf.enabled || intf.wirelessPassword.length === 0}',
                            },
                            handler: function (field, trigger) {
                                if (field.getDisabled()) {
                                    return;
                                }
                                var inputType = field.getInputType();
                                if (inputType === 'password') {
                                    field.setInputType('text');
                                    trigger.setIconCls('x-fa fa-eye-slash');
                                } else {
                                    field.setInputType('password');
                                    trigger.setIconCls('x-fa fa-eye');
                                }
                            }
                        }
                    },
                    bind: {
                        value: '{intf.wirelessPassword}',
                        required: '{intf.type === "WIFI"}',
                        hidden: '{intf.wirelessEncryption === "NONE"}',
                        disabled: '{intf.type !== "WIFI"}'
                    },
                    validators: [{
                        type: 'length',
                        min: 8
                    }]
                }]
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    clearable: false,
                    required: false,
                    labelAlign: 'top',
                    flex: 1
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'Mode',
                    name: 'wirelessMode',
                    placeholder: 'Select ...',
                    margin: '0 16 0 0',
                    options: [
                        { text: 'Access Point', value: 'AP' },
                        { text: 'Client', value: 'CLIENT' }
                    ],
                    bind: {
                        value: '{intf.wirelessMode}',
                        required: '{intf.type === "WIFI"}',
                        disabled: '{intf.type !== "WIFI"}'
                    }
                }, {
                    xtype: 'selectfield',
                    label: 'Channel',
                    name: 'wirelessChannel',
                    placeholder: 'Select ...',
                    margin: '0 0 0 16',
                    queryMode: 'remote',
                    displayTpl: '{channel} [{frequency}]',
                    itemTpl: '{channel} <span style="color: #999">[{frequency}]</span>',
                    valueField: 'channel',
                    bind: {
                        value: '{intf.wirelessChannel}',
                        required: '{intf.type === "WIFI"}',
                        disabled: '{intf.type !== "WIFI"}',
                        store: {
                            autoLoad: '{intf.type === "WIFI"}',
                            proxy: {
                                type: 'ajax',
                                url: '/api/status/wifichannels/{intf.device}',
                                reader: {
                                    type: 'json'
                                }
                            }
                        }
                    }
                }]
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    clearable: false,
                    required: false,
                    labelAlign: 'top',
                    flex: 1
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'HT Mode',
                    name: 'wirelessThroughput',
                    placeholder: 'Select ...',
                    margin: '0 32 0 0',
                    queryMode: 'remote',
                    displayField: 'name',
                    valueField: 'mode',
                    bind: {
                        value: '{intf.wirelessThroughput}',
                        required: '{intf.type === "WIFI"}',
                        disabled: '{intf.type !== "WIFI"}',
                        store: {
                            autoLoad: '{intf.type === "WIFI"}',
                            proxy: {
                                type: 'ajax',
                                url: '/api/status/wifimodelist/{intf.device}',
                                reader: {
                                    type: 'json'
                                }
                            }
                        }
                    }
                }, {
                    xtype: 'component',
                    flex: 1
                }]
            }, {
                xtype: 'component',
                margin: '32 0 0 0',
                html: '<p style="margin: 8px 0;"><i class="x-fa fa-exclamation-triangle fa-yellow"></i> <strong>Caution when making changes!</strong></p>' +
                      '<p style="margin: 0;">If you are connecting wirelessly you will need to update the WiFi settings of your device and all other devices connecting to this wireless network.</p>',
                hidden: true,
                bind: {
                    hidden: '{!wifiWarning}'
                }
            }]
        }]
    }]
});
