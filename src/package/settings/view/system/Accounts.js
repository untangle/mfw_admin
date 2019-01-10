Ext.define('Mfw.settings.system.Accounts', {

    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-system-accounts',

    title: 'Acounts'.t(),

    config: {
        enableManualSort: false,
        recordModel: 'Mfw.model.Account',
        disableDeleteCondition: '{record.username === "admin"}'
    },

    plugins: {
        mastergrideditable: true
    },

    sortable: false,

    scrollable: true,
    store: {
        model: 'Mfw.model.Account'
    },

    columns: [{
        text: 'Username',
        dataIndex: 'username',
        flex: 1,
        editable: true
    }, {
        text: 'Email',
        dataIndex: 'email',
        flex: 1,
        editable: true,
        editor: {
            xtype: 'emailfield',
            validators: [ { type: 'email'} ]
        }
    }, {
        text: 'MD5',
        width: 400,
        dataIndex: 'passwordHashMD5'
    }, {
        text: 'SHA256',
        width: 300,
        dataIndex: 'passwordHashSHA256'
    }, {
        text: 'SHA512',
        width: 300,
        dataIndex: 'passwordHashSHA512'
    }, {
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
