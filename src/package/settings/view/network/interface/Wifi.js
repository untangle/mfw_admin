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
                clearable: false,
                required: true,
                bind: {
                    value: '{intf.wirelessSsid}',
                    required: '{intf.type === "WIFI"}'
                }
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    required: false,
                    clearable: false,
                    flex: 1
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'Encryption',
                    autoSelect: true,
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf.wirelessEncryption}',
                        required: '{intf.type === "WIFI"}'
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
                        hidden: '{intf.wirelessEncryption === "NONE"}'
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
                    flex: 1
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'Mode',
                    autoSelect: true,
                    margin: '0 16 0 0',
                    options: [
                        { text: 'Access Point', value: 'AP' },
                        { text: 'Client', value: 'CLIENT' }
                    ],
                    bind: {
                        value: '{intf.wirelessMode}',
                        required: '{intf.type === "WIFI"}'
                    }
                }, {
                    xtype: 'selectfield',
                    label: 'Channel',
                    queryMode: 'remote',
                    displayTpl: '{channel} [{frequency}]',
                    itemTpl: '{channel} <span style="color: #999">[{frequency}]</span>',
                    valueField: 'channel',
                    bind: {
                        value: '{intf.wirelessChannel}',
                        required: '{intf.type === "WIFI"}',
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
                }, {
                    xtype: 'selectfield',
                    label: 'HT Mode',
                    queryMode: 'remote',
                    displayTpl: '{name}',
                    itemTpl: '{name}',
                    valueField: 'mode',
                    bind: {
                        value: '{intf.wirelessMode}',
                        required: '{intf.type === "WIFI"}',
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
                }]
            }]
        }]
    }]
});
