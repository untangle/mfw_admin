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
            read: Util.api + '/settings/accounts/credentials',
            update: Util.api + '/settings/accounts/credentials'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: false, // wrap single record in array
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    }
});
