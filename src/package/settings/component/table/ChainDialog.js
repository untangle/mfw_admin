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
    width: 400,
    minHeight: 500,

    bodyPadding: '0 0 16 0',

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    items: [{
        xtype: 'formpanel',
        // padding: 0,
        layout: 'vbox',
        defaults: {
            labelAlign: 'top',
            clearable: false
        },
        items: [{
            xtype: 'containerfield',
            layout: 'hbox',
            items: [{
                xtype: 'checkboxfield',
                margin: '0 32 0 0',
                name: 'base',
                boxLabel: 'BASE'.t(),
                bodyAlign: 'left',
                bind: '{chain.base}'
            }]
        }, {
            xtype:'textfield',
            placeholder: 'Enter a name',
            name: 'name',
            label: 'Name'.t(),
            autoComplete: false,
            required: true,
            bind: '{chain.name}',
            listeners: {
                painted: function (field) {
                    field.focus();
                }
            },
            validators: function (value) {
                if (value.indexOf(' ') >= 0) {
                    return 'Name should not contain spaces!';
                }
                return true;
            }
        }, {
            xtype: 'textareafield',
            name: 'description',
            margin: '0 0 16 0',
            placeholder: 'Enter a description',
            label: 'Description'.t(),
            autoComplete: false,
            required: true,
            bind: '{chain.description}'
        }, {
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                labelAlign: 'top',
                clearable: false
            },
            items: [{
                xtype: 'combobox',
                width: 120,
                name: 'hook',
                label: 'Hook'.t(),
                placeholder: 'Choose hook',
                editable: false,
                itemTpl: '<tpl>{text}</tpl>',
                required: true,
                hidden: true,
                bind: {
                    value: '{chain.hook}',
                    required: '{chain.base}',
                    hidden: '{!chain.base}'
                },
                options: Map.options.hooks
            }, {
                xtype: 'numberfield',
                margin: '0 0 0 16',
                flex: 1,
                name: 'priority',
                label: 'Priority'.t(),
                placeholder: 'Integer between -500 and 500',
                minValue: -500,
                maxValue: 500,
                autoComplete: false,
                required: true,
                hidden: true,
                bind: {
                    value: '{chain.priority}',
                    required: '{chain.base}',
                    hidden: '{!chain.base}'
                }
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: 'onCancel'
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
                // chain.commit();
            }

            me.getView().destroy();
        },

        onCancel: function() {
            var me = this,
                grid = me.getView().ownerCmp;

            grid.table.chains().each(function (ch) {
                ch.reject();
            });

            me.getView().destroy();
        }
    }

});
