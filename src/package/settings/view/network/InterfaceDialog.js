Ext.define('Mfw.settings.network.InterfaceDialog', {
    // extend: 'Ext.Panel',
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',

    viewModel: {},

    title: 'Add/Edit Interface'.t(),
    width: 500,
    height: 400,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',



    items: [{
        xtype: 'formpanel',
        padding: 0,
        items: [{
            xtype: 'selectfield',
            name: 'type',
            reference: 'interfaceType',
            label: 'Interface Type',
            labelAlign: 'left',
            margin: '0 16',
            placeholder: 'Please Select',
            required: true,
            options: [{
                text: 'OpenVPN',
                value: 'OPENVPN'
            }]
        }, {
            xtype: 'container',
            defaults: {
                labelAlign: 'left',
                labelTextAlign: 'right'
            },
            hidden: true,
            layout: 'form',
            padding: 0,
            bind: {
                hidden: '{interfaceType.value !== "OPENVPN"}'
            },
            items: [{
                xtype: 'textfield',
                name: 'name',
                label: 'Interface Name',
                required: true
            }, {
                xtype: 'checkbox',
                reference: 'wanCk',
                name: 'wan',
                label: 'Is WAN',
                allowNull: false
            }, {
                xtype: 'checkbox',
                name: 'natEgress',
                label: 'Enable NAT',
                allowNull: false,
                bind: {
                    checked: '{wanCk.checked ? true : false}',
                    disabled: '{wanCk.checked}'
                }
            }, {
                xtype: 'filefield',
                name: 'uploaded',
                label: 'OpenVPN config file',
                required: false,
                bind: {
                    required: '{interfaceType.value === "OPENVPN"}'
                },
                listeners: {
                    change: 'onFileChange'
                }
                // required: true
            }]
        }]
    }],

    buttons: {
        ok: {
            text: 'Add',
            ui: 'action',
            handler: 'onSubmit'
        },
        cancel: {
            text: 'Cancel',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }
    },

    controller: {
        init: function (view) {
            Ext.getStore('files').load({
                callback: function(records, operation, success) {
                    // nothing
                }
            });
        },

        onFileChange: function (fileField, newFile, oldFile, e) {
            var me = this,
                reader = new FileReader(),
                file = fileField.getFiles()[0];

            reader.onload = function () {
                me.uploadedFile = btoa(reader.result);
            };
            reader.readAsText(file);
        },

        onSubmit: function () {
            var me = this,
                interfacesStore = Ext.getStore('interfaces'),
                newInterface = new Mfw.model.Interface(),
                form = me.getView().down('formpanel');

            if (!form.validate()) { return; }

            me.getView().mask({ xtype: 'loadmask' });

            newInterface.set(form.getValues());
            newInterface.set({
                interfaceId: interfacesStore.count() + 1,
                configType: 'ADDRESSED',
                device: 'tunY' // Fix Y
            });

            if (me.uploadedFile) {
                newInterface.set('openvpnConfFile', {
                    encoding: 'base64',
                    contents: me.uploadedFile
                });
            }

            interfacesStore.add(newInterface);

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
