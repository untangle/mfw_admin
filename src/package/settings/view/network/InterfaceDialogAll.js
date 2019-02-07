Ext.define('Mfw.settings.network.InterfaceDialogAll', {
    // extend: 'Ext.Panel',
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog-all',

    viewModel: {},

    title: 'Add/Edit Interface'.t(),
    width: 800,
    height: 600,
    maximizable: true,
    resizable: {
        edges: 'all',
        dynamic: true
    },
    showAnimation: {
        duration: 0
    },

    layout: 'fit',



    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }, {
            text: 'Add',
            ui: 'action',
            // handler: 'onSubmit'
        }]
    }, {
        xtype: 'container',
        docked: 'top',
        padding: '0 8',
        // defaults: {
        //     labelAlign: 'left'
        // },
        autosize: true,
        items: [{
            xtype: 'containerfield',
            defaults: {
                // flex: 1,
                margin: '0 8'
            },
            items: [{
                xtype: 'combobox',
                name: 'type',
                width: 100,
                label: 'Type'.t(),
                editable: false,
                required: true,
                disabled: true,
                bind: {
                    value: '{record.type}',
                    disabled: '{record.type !== "OPENVPN"}'
                },
                options: [
                    { text: 'NIC'.t(), value: 'NIC' },
                    { text: 'WiFi'.t(),   value: 'WIFI' },
                    { text: 'OpenVPN'.t(),  value: 'OPENVPN' }
                ]
            }, {
                xtype: 'textfield',
                name: 'name',
                label: 'Name'.t(),
                width: 200,
                autoComplete: false,
                maxLength: 9,
                errorLabel: 'Interface Name'.t(),
                required: true,
                bind: '{record.name}'
            }, {
                xtype: 'combobox',
                name: 'configType',
                width: 200,
                label: 'Configuration Type'.t(),
                editable: false,
                required: true,
                bind: '{record.configType}',
                options: [
                    { text: 'Addressed'.t(), value: 'ADDRESSED' },
                    { text: 'Bridged'.t(),   value: 'BRIDGED' },
                    { text: 'Disabled'.t(),  value: 'DISABLED' }
                ]
            }, {
                xtype: 'selectfield',
                name: 'bridgedTo',
                label: 'Bridged To'.t(),
                editable: false,
                required: false,
                autoSelect: true,
                forceSelection: true,
                hidden: true,
                bind: {
                    value: '{record.bridgedTo}',
                    hidden: '{record.configType !== "BRIDGED"}',
                    required: '{record.configType === "BRIDGED"}',
                    options: '{bridgedOptions}'
                }
            }, {
                xtype: 'selectfield',
                name: 'wan',
                label: '&nbsp;'.t(),
                width: 100,
                editable: false,
                // required: true,
                autoSelect: true,
                forceSelection: true,
                hidden: true,
                bind: {
                    value: '{record.wan}',
                    hidden: '{record.configType !== "ADDRESSED"}'
                },
                options: [
                    { text: 'WAN'.t(), value: true },
                    { text: 'Not WAN'.t(),   value: false }
                ]
            }, {
                xtype: 'component',
                flex: 1
            }]
        }]
    }],

    controller: {
        init: function (view) {
            view.getViewModel().set('record', Ext.getStore('interfaces').getAt(0));
        },

    }

});
