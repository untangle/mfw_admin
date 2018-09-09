Ext.define('Mfw.model.Chain', {
    extend: 'Ext.data.Model',
    alias: 'model.chain',

    fields: [
        { name: 'base',        type: 'boolean' },
        { name: 'default',     type: 'boolean' },
        { name: 'description', type: 'string' },
        { name: 'editable',    type: 'boolean', defaultValue: true },
        { name: 'hook',        type: 'string' },
        { name: 'name',        type: 'string' },
        { name: 'priority',    type: 'integer' },
        { name: 'type',        type: 'string' }
    ],

    hasMany: {
        model: 'Mfw.model.Rule',
        name: 'rules',
        associationKey: 'rules'
    },

    proxy: {
        type: 'ajax',
        // api: {
        //     read: Util.api + '/settings/network',
        //     update: Util.api + '/settings/network'
        // },
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
