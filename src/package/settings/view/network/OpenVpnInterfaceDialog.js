Ext.define('Mfw.settings.network.OpenVpnInterfaceDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.openvpn-interface-dialog',

    viewModel: {
        data: {
            confFileSet: false
        }
    },

    config: {
        interface: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} OpenVPN Interface',
    },
    width: 900,
    height: 600,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    bodyPadding: '0 8',

    items: [{
        xtype: 'formpanel',
        padding: 0,
        layout: 'vbox',
        defaults: {
            margin: '0 8',
            labelAlign: 'top'
        },
        items: [{
            xtype: 'containerfield',
            margin: 0,
            defaults: {
                margin: '0 8',
                labelAlign: 'top',
                clearable: false
            },
            items: [{
                xtype: 'selectfield',
                label: 'Interface Type',
                width: 150,
                placeholder: 'Select Type ...',
                disabled: true,
                required: true,
                bind: '{interface.type}',
                options: [{
                    text: 'OpenVPN',
                    value: 'OPENVPN'
                }]
            }, {
                xtype: 'textfield',
                label: 'Interface Name',
                placeholder: 'Enter Name ...',
                autoComplete: false,
                required: true,
                bind: '{interface.name}',
                flex: 1,
                listeners: {
                    painted: function (field) {
                        field.focus();
                    }
                }
            }, {
                xtype: 'selectfield',
                name: 'configType',
                label: 'Config Type'.t(),
                flex: 1,
                margin: '0 16',
                editable: false,
                required: true,
                bind: '{interface.configType}',
                options: [
                    { text: 'Addressed'.t(), value: 'ADDRESSED' },
                    { text: 'Disabled'.t(),  value: 'DISABLED' }
                ]
            }, {
                xtype: 'checkbox',
                label: '&nbsp;',
                boxLabel: 'Is WAN',
                bodyAlign: 'start',
                margin: '0 16',
                bind: '{interface.wan}',
            }, {
                xtype: 'checkbox',
                flex: 1,
                label: '&nbsp;',
                boxLabel: 'Enable NAT',
                bodyAlign: 'start',
                allowNull: false,
                bind: {
                    checked: '{interface.wan ? true : false}',
                    disabled: '{interface.wan}'
                }
            }]
        }, {
            xtype: 'segmentedbutton',
            userCls: 'button-tabs',
            margin: '16 8 16 8',
            allowMultiple: false,
            reference: 'viewSelection',
            // hidden: true,
            // bind: {
            //     hidden: '{interface.configType !== "ADDRESSED"}'
            // },
            defaults: {
                ripple: false,
                hidden: true,
                bind: {
                    hidden: '{interface.configType !== "ADDRESSED"}'
                },
            },
            activeItem: 0,
            items: [
                { text: 'Config File', value: '#conf', pressed: true },
                { text: 'Authentication', value: '#auth' },
                {
                    text: 'QoS',
                    value: '#qos',
                    hidden: true,
                    bind: {
                        hidden: '{!interface.wan}'
                    }
                }
            ]
        }, {
            xtype: 'panel',
            itemId: 'cardPanel',
            layout: {
                type: 'card',
                deferRender: false
            },
            flex: 1,
            // hidden: true,
            bind: {
                activeItem: '{viewSelection.value}',
                // hidden: '{interface.configType === "DISABLED" || (interface.configType === "BRIDGED" && interface.type !== "WIFI")}'
            },
            defaults: {
                padding: '0 16',
            },
            items: [{
                xtype: 'container',
                layout: 'vbox',
                itemId: 'conf',
                items: [{
                    xtype: 'filefield',
                    label: 'OpenVPN config file',
                    margin: '0 0 16 0',
                    // width: 516,
                    required: false,
                    bind: {
                        required: '{interface.type === "OPENVPN" && !confFileSet}'
                    },
                    listeners: {
                        change: 'onFileChange'
                    }
                }, {
                    xtype: 'textareafield',
                    userCls: 'file-upload',
                    itemId: 'fileContent',
                    flex: 1,
                    margin: '0 0 16 0',
                    autoCorrect: false,
                    editable: false,
                    focusable: true,
                    value: 'No file selected.'
                }]
            }, {
                xtype: 'container',
                layout: 'vbox',
                itemId: 'auth',
                items: [{
                    xtype: 'checkbox',
                    boxLabel: 'Requires authentication',
                    bodyAlign: 'start',
                    bind: {
                        checked: '{interface.openvpnUsernamePasswordEnabled}'
                    }
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        labelAlign: 'top',
                        clearable: false,
                        autoComplete: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'OpenVPN Username',
                        flex: 1,
                        bind: {
                            value: '{interface.openvpnUsername}',
                            required: '{interface.openvpnUsernamePasswordEnabled}',
                            disabled: '{!interface.openvpnUsernamePasswordEnabled}',
                            hidden: '{!interface.openvpnUsernamePasswordEnabled}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'OpenVPN Password',
                        itemId: 'password',
                        flex: 1,
                        margin: '0 16',
                        bind: {
                            // value: '{interface.openvpnPasswordBase64}',
                            required: '{interface.openvpnUsernamePasswordEnabled}',
                            disabled: '{!interface.openvpnUsernamePasswordEnabled}',
                            hidden: '{!interface.openvpnUsernamePasswordEnabled}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Confirm Password',
                        itemId: 'confirmPassword',
                        flex: 1,
                        bind: {
                            // value: '{interface.openvpnPasswordBase64}',
                            required: '{interface.openvpnUsernamePasswordEnabled}',
                            disabled: '{!interface.openvpnUsernamePasswordEnabled}',
                            hidden: '{!interface.openvpnUsernamePasswordEnabled}'
                        }
                    }]
                }]
            }, {
                xtype: 'container',
                itemId: 'qos',
                layout: 'vbox',
                items: [{
                    xtype: 'checkbox',
                    name: 'qosEnabled',
                    boxLabel: 'Enable QoS',
                    bodyAlign: 'start',
                    bind: {
                        checked: '{interface.qosEnabled}',
                    }
                }, {
                    xtype: 'numberfield',
                    name: 'downloadKbps',
                    label: 'Download Kbps'.t(),
                    required: false,
                    hidden: true,
                    labelAlign: 'top',
                    width: 200,
                    clearable: false,
                    bind: {
                        value: '{interface.downloadKbps}',
                        required: '{interface.qosEnabled}',
                        hidden: '{!interface.qosEnabled}'
                    }
                }, {
                    xtype: 'numberfield',
                    name: 'uploadKbps',
                    label: 'Upload Kbps'.t(),
                    required: false,
                    hidden: true,
                    labelAlign: 'top',
                    width: 200,
                    clearable: false,
                    bind: {
                        value: '{interface.uploadKbps}',
                        required: '{interface.qosEnabled}',
                        hidden: '{!interface.qosEnabled}'
                    }
                }]
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }, {
            bind: {
                text: '{action === "ADD" ? "Create" : "Update"}'
            },
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = view.getInterface(),
                passwordFld = view.down('#password'),
                confirmPasswordFld = view.down('#confirmPassword'),
                content = view.down('#fileContent');

            confirmPasswordFld.setValidators(function (value) {
                if (value !== passwordFld.getValue()) {
                    return 'Passwords do not match!';
                }
                return true;
            });

            if (intf && intf.getOpenvpnConfFile()) {
                vm.set('confFileSet', true);
                content.setValue(atob(intf.getOpenvpnConfFile().get('contents')));
            }
            if (intf && intf.get('openvpnUsernamePasswordEnabled')) {
                passwordFld.setValue(atob(intf.get('openvpnPasswordBase64')));
                confirmPasswordFld.setValue(atob(intf.get('openvpnPasswordBase64')));

            }

            vm.set({
                interface: intf || new Mfw.model.Interface({
                    type: 'OPENVPN',
                    configType: 'ADDRESSED',
                    wan: true,
                    natEgress: true
                }),
                action: intf ? 'EDIT' : 'ADD'
            });
        },
        onFileChange: function (fileField) {
            var me = this,
                reader = new FileReader(),
                file = fileField.getFiles()[0],
                content = me.getView().down('#fileContent');

            reader.onload = function () {
                content.setValue(reader.result);
                me.uploadedFile = btoa(reader.result);
            };
            reader.readAsText(file);
        },

        onSubmit: function () {
            var me = this,
                vm = me.getViewModel(),
                interface = vm.get('interface'),
                interfacesStore = Ext.getStore('interfaces'),
                form = me.getView().down('formpanel'),
                passwordFld = form.down('#password');

            if (!form.validate()) { return; }

            me.getView().mask({ xtype: 'loadmask' });

            if (me.uploadedFile) {
                var ovpnConfFile = Ext.create('Mfw.model.OpenVpnConfFile', {
                    encoding: 'base64',
                    contents: me.uploadedFile
                });
                interface.setOpenvpnConfFile(ovpnConfFile);
            }

            // set base64 password
            if (interface.get('openvpnUsernamePasswordEnabled')) {
                interface.set('openvpnPasswordBase64', btoa(passwordFld.getValue()));
            }

            if (vm.get('action') === 'ADD') {
                // do not set interfaceId
                // interface.set({
                //     interfaceId: interfacesStore.count() + 1
                // });
                interfacesStore.add(interface);
            } else {
                interface.commit();
            }

            interfacesStore.each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            interfacesStore.sync({
                success: function () {
                    me.getView().unmask();
                    me.getView().close();
                },
                failure: function () {
                    console.warn('Unable to save interfaces!');
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        }
    }

});
