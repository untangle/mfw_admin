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

    layout: 'hbox',

    items: [{
        xtype: 'formpanel',
        reference: 'staticentryform',
        itemId: 'staticentryform',
        docked: 'top',
        shadow: true,
        // style: 'box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2)',
        padding: '0 16 16 16',
        zIndex: 1,
        layout: {
            type: 'hbox',
            align: 'bottom'
        },
        hidden: true,
        bind: {
            hidden: '{!visibleAdd}'
        },
        defaults: {
            labelAlign: 'top',
            autoComplete: false,
            required: true,
            clearable: false,
            keyMapEnabled: true,
            keyMap: {
                enter: {
                    key: Ext.event.Event.ENTER,
                    handler: 'addStaticEntryKeyEvt'
                }
            }
        },
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            shadow: false,
            style: 'background: transparent',
            items: [{
                xtype: 'component',
                style: 'font-weight: 100; font-size: 14px;',
                html: 'Add Account',
            }, '->', {
                xtype: 'button',
                iconCls: 'md-icon-close',
                handler: 'onAddRecord'
            }]
        }, {
            xtype: 'textfield',
            name: 'username',
            width: 200,
            label: 'Username'.t(),
            placeholder: 'Enter username ...'
        }, {
            xtype: 'passwordfield',
            name: 'passwordCleartext',
            label: 'Password',
            margin: '0 8 0 16',
            width: 200,
            placeholder: 'Enter password ...'
        }, {
            xtype: 'passwordfield',
            name: 'confirm',
            label: 'Confirm Password',
            margin: '0 8 0 8',
            width: 200,
            placeholder: 'Re-type password ...',
        }, {
            xtype: 'emailfield',
            name: 'email',
            label: 'Email',
            margin: '0 8 0 8',
            width: 200,
            required: false,
            placeholder: 'Enter email ...'
        }, {
            xtype: 'button',
            text: 'Add',
            ui: 'action',
            margin: '0 0 0 16',
            handler: 'doAddBtn'
        }],
        listeners: {
            show: function (form) {
                form.getFields('username').focus();
            },
            hide: function (form) {
                form.reset(true);
            }
        }
    }],

    columns: [{
        text: 'Username',
        dataIndex: 'username',
        width: 250,
        minWidth: 250,
        editable: true,
        cell: {
            tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
        }
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
    },
    // {
    //     text: 'MD5',
    //     width: 400,
    //     dataIndex: 'passwordHashMD5'
    // }, {
    //     text: 'SHA256',
    //     width: 300,
    //     dataIndex: 'passwordHashSHA256'
    // }, {
    //     text: 'SHA512',
    //     width: 300,
    //     dataIndex: 'passwordHashSHA512'
    // },
    {
        // added just to be available in editor form
        hidden: true,
        dataIndex: 'passwordCleartext',
        editable: true,
        text: 'Set new password',
        editor: {
            xtype: 'passwordfield',
            required: true
        }
    }]
});

Ext.define('Mfw.settings.system.AccountDialog', {

});

Ext.define('Mfw.settings.system.AccountsController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-system-accounts_controller',

    onAddRecord: function (btn) {
        var me = this,
        vm = me.getViewModel(),
        visible = vm.get('visibleAdd');
        vm.set('visibleAdd', !visible);
    },

    doAddBtn: function (btn) {
        var me = this, form = btn.up('formpanel');
        if (!form.validate()) { return; }

        me.getView().getStore().add(form.getValues());
        form.getFields('username').focus();
        form.reset(true);
    }
});
