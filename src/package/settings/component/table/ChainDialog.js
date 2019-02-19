Ext.define('Mfw.cmp.grid.table.ChainDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.chain-dialog',

    viewModel: {},

    config: {
        chain: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} Chain',
    },
    width: 300,
    height: 400,

    bodyPadding: '0 16',

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    items: [{
        xtype: 'container',
        padding: 0,
        layout: 'vbox',
        items: [{
            xtype: 'formpanel',
            // padding: 0,
            layout: 'vbox',
            defaults: {
                labelAlign: 'top',
                clearable: false
            },
            items: [{
                xtype:'textfield',
                name: 'name',
                label: 'Name'.t(),
                autoComplete: false,
                required: true,
                bind: '{chain.name}'
            }, {
                xtype: 'textfield',
                name: 'description',
                label: 'Description'.t(),
                autoComplete: false,
                required: true,
                bind: '{chain.description}'
            }, {
                xtype: 'combobox',
                name: 'type',
                label: 'Type'.t(),
                editable: false,
                itemTpl: '<tpl>{text}</tpl>',
                bind: '{chain.type}',
                options: [
                    { value: 'filter', text: 'Filter'.t() },
                    { value: 'route', text: 'Route'.t() },
                    { value: 'nat', text: 'NAT'.t() }
                ]
            }, {
                xtype: 'combobox',
                name: 'hook',
                label: 'Hook'.t(),
                editable: false,
                itemTpl: '<tpl>{text}</tpl>',
                bind: '{chain.hook}',
                options: [
                    { value: 'prerouting', text: 'Prerouting'.t() },
                    { value: 'input', text: 'Input'.t() },
                    { value: 'forward', text: 'Forward'.t() },
                    { value: 'output', text: 'Output'.t() },
                    { value: 'postrouting', text: 'Postrouting'.t() },
                    { value: 'ingress', text: 'Ingress'.t() }
                ]
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
        init: function (dialog) {
            var vm = dialog.getViewModel(),
                chain = dialog.getChain();

            vm.set({
                chain: chain || new Mfw.model.table.Chain(),
                action: !chain ? 'ADD' : 'EDIT'
            });
        },



        onSubmit: function () {
            var me = this,
                grid = me.getView().ownerCmp,
                vm = me.getViewModel(),
                chain = vm.get('chain'),
                form = me.getView().down('formpanel');

            if (!form.validate()) { return; }

            if (vm.get('action') === 'ADD') {
                grid.table.chains().add(chain);
            } else {
                chain.commit();
            }

            me.getView().destroy();
        }
    }

});
