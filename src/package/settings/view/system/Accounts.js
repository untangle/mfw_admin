Ext.define('Mfw.settings.system.Accounts', {

    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-system-accounts',

    // controller: 'mfw-settings-network-interfaces',

    title: 'Acounts'.t(),

    config: {
        enableManualSort: false,
        recordModel: 'Mfw.model.Account'
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
    }]
});
