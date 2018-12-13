Ext.define('Mfw.model.Account', {
    extend: 'Ext.data.Model',
    alias: 'model.account',

    idProperty: '_id',
    identifier: 'uuid',

    fields: [
        { name: 'username', type: 'string' }, // "JUMP","GOTO","ACCEPT","REJECT","DROP","DNAT","SNAT","MASQUERADE","SET_PRIORITY"
        { name: 'passwordHashMD5', type: 'string' },
        { name: 'passwordHashSHA256', type: 'string' },
        { name: 'passwordHashSHA512', type: 'string' }
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/admin/credentials',
            update: Util.api + '/settings/admin/credentials'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                associated: true,
                persist: true
            }
        }
    }
});
