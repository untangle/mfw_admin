Ext.define('Mfw.settings.network.InterfaceDialog', {
    // extend: 'Ext.Panel',
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',

    viewModel: {},

    title: 'Add/Edit Interface'.t(),
    width: 500,
    height: 400,
    bodyPadding: 0,
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
                value: 'OpenVPN'
            }]
        }, {
            xtype: 'container',
            layout: 'form',
            defaults: {
                labelAlign: 'left',
                labelTextAlign: 'right'
            },
            hidden: true,
            bind: {
                hidden: '{interfaceType.value !== "OpenVPN"}'
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
                name: 'nat',
                label: 'Is NAT',
                allowNull: false,
                bind: {
                    checked: '{wanCk.checked ? true : false}',
                    disabled: '{wanCk.checked}'
                }
            }, {
                xtype: 'filefield',
                name: 'config',
                label: 'OpenVPN config file',
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
        onSubmit: function () {
            var form = this.getView().down('formpanel');

            if (!form.validate()) { return; }

            console.log(form.getValues());

            form.submit({
                url: '/someurl',
                success: function () {
                    Ext.Msg.alert('Form submitted successfully!');
                },
                failure: function () {
                    Ext.Msg.alert('Form submition failed!');
                }

            });
        }
    }

});
