Ext.define('Mfw.settings.system.Accounts', {

    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-system-accounts',

    controller: 'mfw-settings-system-accounts_controller',

    title: 'Acounts'.t(),

    viewModel: {
        data: {
            visibleAdd: false
        }
    },

    config: {
        enableManualSort: false,
        recordModel: 'Mfw.model.Account',
        disableDeleteCondition: '{record.username === "admin"}'
    },

    plugins: {
        gridcellediting: {
            triggerEvent: 'tap'
        }
    },

    sortable: false,

    scrollable: true,
    store: {
        model: 'Mfw.model.Account'
    },

    columns: [{
        text: 'Username',
        dataIndex: 'username',
        width: 250,
        minWidth: 250
    }, {
        text: 'Email',
        dataIndex: 'email',
        minWidth: 200,
        width: 250,
        cell: {
            tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
        },
        editable: true,
        editor: {
            xtype: 'emailfield',
            validators: [ { type: 'email'} ]
        }
    }]
});

Ext.define('Mfw.settings.system.AccountsController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-system-accounts_controller',

    onAddRecord: function () {
        var me = this;
        Ext.create('Mfw.settings.system.AccountDialog', {
            viewModel: {
                data: {
                    account: Ext.create('Mfw.model.Account', {}),
                    action: 'ADD'
                }
            },
            ownerCmp: me.getView() // important so it inherits same controller
        }).show();
    },

    onEditRecord: function (grid, info) {
        var me = this;

        Ext.create('Mfw.settings.system.AccountDialog', {
            viewModel: {
                data: {
                    account: info.record,
                    action: 'EDIT'
                }
            },
            ownerCmp: me.getView() // important so it inherits same controller
        }).show();
    },

    onSubmit: function (btn) {
        var me = this,
            dialog = btn.up('dialog'),
            form = dialog.down('formpanel'),
            vm = dialog.getViewModel(),
            account = vm.get('account');

        if (!form.validate()) { return; }

        if (vm.get('action') === 'ADD') {
            account.set({
                username: form.getFields('username').getValue(),
                passwordCleartext: form.getFields('passwordCleartext').getValue()
            });
            me.getView().getStore().add(account);
            dialog.destroy();
        } else {
            account.set({
                passwordCleartext: form.getFields('passwordCleartext').getValue(),
                passwordHashMD5: null,
                passwordHashSHA256: null,
                passwordHashSHA512: null
            });
            account.commit();
            dialog.destroy();
        }
    }
});

Ext.define('Mfw.settings.system.AccountDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.mfw-settings-system-account-dialog',

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit "} <em>{account.username}</em> Account',
    },
    width: 300,
    height: 400,

    showAnimation: {
        duration: 100
    },

    layout: 'fit',

    items: [{
        xtype: 'formpanel',
        padding: 0,
        layout: 'vbox',
        defaults: {
            labelAlign: 'top',
            clearable: false
        },
        items: [{
            xtype: 'textfield',
            name: 'username',
            label: 'Username'.t(),
            placeholder: 'Enter username ...',
            required: true,
            hidden: true,
            bind: {
                value: '{account.username}',
                hidden: '{action === "EDIT"}',
                required: '{action === "ADD"}'
            }
        }, {
            xtype: 'passwordfield',
            name: 'passwordCleartext',
            placeholder: 'Enter password ...',
            required: true,
            bind: {
                label: '{action === "EDIT" ? "Set New " : ""} Password'
            }
        }, {
            xtype: 'passwordfield',
            name: 'confirm',
            bind: {
                label: 'Confirm {action === "EDIT" ? "New" : ""} Password'
            },
            placeholder: 'Re-type password ...',
            required: true
        }, {
            xtype: 'emailfield',
            name: 'email',
            label: 'Email',
            required: false,
            placeholder: 'Enter email ...',
            bind: '{account.email}'
        }],
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
    listeners: {
        // set some validators
        show: function (dialog) {
            var form = dialog.down('formpanel'),
                vm = dialog.getViewModel(),
                initialUser,
                userField = form.getFields('username'),
                passField = form.getFields('passwordCleartext'),
                confirmField = form.getFields('confirm');

            if (vm.get('action') === 'ADD') {
                form.getFields('username').focus();
            } else {
                form.getFields('passwordCleartext').focus();
                initialUser = vm.get('account').get('username');
            }

            userField.setValidators(function (value) {
                if (value !== initialUser && dialog.ownerCmp.getStore().findRecord('username', value, 0, false, true, true)) {
                    return 'This username already exists!';
                }
                if (value.indexOf(' ') >= 0) {
                    return 'Username must not contain spaces!';
                }
                return true;
            });

            confirmField.setValidators(function (value) {
                if (value !== passField.getValue()) {
                    return 'Passwords do not match!';
                }
                return true;
            });
        }
    }
});
