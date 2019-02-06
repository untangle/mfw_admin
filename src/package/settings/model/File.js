Ext.define('Mfw.model.File', {
    extend: 'Ext.data.Model',

    idProperty: '_id',
    identifier: 'uuid',

    fields: [
        { name: 'path', type: 'string' },
        { name: 'encoding', type: 'string' },
        { name: 'operation', type: 'string' },
        { name: 'contents', type: 'auto' },
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/files',
            update: Util.api + '/settings/files'
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
