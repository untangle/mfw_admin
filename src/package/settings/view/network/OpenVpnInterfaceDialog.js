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
        title: '{action === "ADD" ? "Create" : "Edit"} OpenVPN Interface',
    },
    width: 900,
    height: 600,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',



    items: [{
        xtype: 'formpanel',
        padding: 0,
        layout: 'vbox',
        items: [{
            xtype: 'containerfield',
            defaults: {
                // margin: '0 8',
                labelAlign: 'top',
                clearable: false
            },
            items: [{
                xtype: 'selectfield',
                label: 'Interface Type',
                margin: '0 16',
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
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                labelAlign: 'top',
                clearable: false,
                autoComplete: false
            },
            items: [{
                xtype: 'checkbox',
                label: '&nbsp;',
                margin: '0 0 0 16',
                boxLabel: 'Requires authentication',
                bodyAlign: 'start',
                bind: {
                    checked: '{interface.openvpnUsernamePasswordEnabled}'
                }
            }, {
                xtype: 'textfield',
                label: 'OpenVPN Username',
                margin: '0 16',
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
                margin: '0 16',
                flex: 1,
                bind: {
                    // value: '{interface.openvpnPasswordBase64}',
                    required: '{interface.openvpnUsernamePasswordEnabled}',
                    disabled: '{!interface.openvpnUsernamePasswordEnabled}',
                    hidden: '{!interface.openvpnUsernamePasswordEnabled}'
                }
            }]
        }, {
            xtype: 'filefield',
            label: 'OpenVPN config file',
            margin: 16,
            width: 516,
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
            margin: 16,
            autoCorrect: false,
            editable: false,
            focusable: true,
            value: 'No file selected.'
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
