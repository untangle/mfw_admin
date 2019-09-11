/**
 * OPENVPN options
 * shown only if interface type is OPENVPN
 */
Ext.define('Mfw.settings.interface.OpenVpn', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-openvpn',

    layout: 'fit',

    viewModel: {
        formulas: {
            /**
             * helper to convert from and to base64 pass
             */
            _openVpnConfFile: {
                get: function (get) {
                    return atob(get('intf.openvpnConfFile.contents'));
                },
                set: function (value) {
                    this.set('intf.openvpnConfFile.contents', btoa(value));
                }
            },
            /**
             * helper to convert from and to base64 pass
             */
            _openVpnPass: {
                get: function (get) {
                    if (!get('intf.openvpnPasswordBase64')) { return null; }
                    return atob(get('intf.openvpnPasswordBase64'));
                },
                set: function (value) {
                    this.set('intf.openvpnPasswordBase64', value ? btoa(value) : null);
                }
            }
        }
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        layout: 'hbox',
        items: [{
            xtype: 'formpanel',
            padding: '8 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'OpenVPN Configuration'
            }, {
                xtype: 'containerfield',
                margin: '0 0 16 0',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'filefield',
                    flex: 1,
                    placeholder: 'Select file from disk ...',
                    listeners: {
                        change: 'onFileChange'
                    }
                }, {
                    xtype: 'checkbox',
                    reference: 'openVpnInlineEdit',
                    boxLabel: 'Inline Edit',
                    margin: '0 0 0 16',
                    checked: false
                }]
            }, {
                xtype: 'textareafield',
                cls: 'file-upload',
                flex: 1,
                autoCorrect: false,
                autoComplete: false,
                editable: false,
                focusable: false,
                placeholder: 'Select a file ...',
                required: false,
                bind: {
                    value: '{_openVpnConfFile}',
                    userCls: '{openVpnInlineEdit.checked ? "editable" : ""}',
                    height: '{isDialog ? 130 : 200}',
                    editable: '{openVpnInlineEdit.checked}',
                    required: '{intf.configType === "ADDRESSED" && intf.type === "OPENVPN"}'
                }
            }, {
                xtype: 'checkbox',
                boxLabel: 'Requires authentication',
                bodyAlign: 'start',
                margin: '16 0 0 0',
                bind: {
                    checked: '{intf.openvpnUsernamePasswordEnabled}',
                }
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'top',
                    flex: 1,
                    required: false,
                    disabled: true,
                    clearable: false
                },
                items: [{
                    label: 'Username',
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf.openvpnUsername}',
                        required: '{intf.configType === "ADDRESSED" && intf.openvpnUsernamePasswordEnabled}',
                        disabled: '{!intf.openvpnUsernamePasswordEnabled}'
                    }
                }, {
                    label: 'Password',
                    inputType: 'password',
                    margin: '0 0 0 16',
                    triggers: {
                        reveal: {
                            type: 'trigger',
                            iconCls: 'x-fa fa-eye',
                            hidden: true,
                            bind: {
                                hidden: '{_openVpnPass.length === 0}',
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
                        value: '{_openVpnPass}',
                        required: '{intf.configType === "ADDRESSED" && intf.openvpnUsernamePasswordEnabled}',
                        disabled: '{!intf.openvpnUsernamePasswordEnabled}'
                    }
                }]
            }]
        }]
    }],

    controller: {
        /**
         * OpenVPN configuration file handler
         */
        onFileChange: function (fileField) {
            var reader = new FileReader(),
                file = fileField.getFiles()[0],
                textarea = fileField.up('formpanel').down('textareafield');

             reader.onload = function () {
                textarea.setValue(reader.result);
            };
            reader.readAsText(file);
        }
    }
});
