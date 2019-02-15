Ext.define('Mfw.settings.network.OpenVpnInterfaceDialog', {
    // extend: 'Ext.Panel',
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



    items: [{
        xtype: 'formpanel',
        padding: 0,
        layout: 'vbox',
        items: [{
            xtype: 'containerfield',
            defaults: {
                // margin: '0 8',
                labelAlign: 'top'
            },
            items: [{
                xtype: 'selectfield',
                label: 'Interface Type',
                margin: '0 16',
                width: 200,
                placeholder: 'Select Type ...',
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
                width: 300
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
                content = view.down('#fileContent');

            if (intf && intf.getOpenvpnConfFile()) {
                vm.set('confFileSet', true);
                content.setValue(atob(intf.getOpenvpnConfFile().get('contents')));
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
                form = me.getView().down('formpanel');

            if (!form.validate()) { return; }

            me.getView().mask({ xtype: 'loadmask' });

            if (me.uploadedFile) {
                var ovpnConfFile = Ext.create('Mfw.model.OpenVpnConfFile', {
                    encoding: 'base64',
                    contents: me.uploadedFile
                });
                interface.setOpenvpnConfFile(ovpnConfFile);
            }

            if (vm.get('action') === 'ADD') {
                interface.set({
                    interfaceId: interfacesStore.count() + 1
                });
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
                }
            });
        }
    }

});
