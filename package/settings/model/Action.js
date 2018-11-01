Ext.define('Mfw.model.table.Action', {
    extend: 'Ext.data.Model',
    alias: 'model.table-action',

    fields: [
        { name: 'type', type: 'string' }, // "JUMP","GOTO","ACCEPT","REJECT","DROP","DNAT","SNAT","MASQUERADE","SET_PRIORITY"
        { name: 'chain', type: 'string' },
        { name: 'dnat_address', type: 'string' },
        { name: 'dnat_port', type: 'integer' },
        { name: 'snat_address', type: 'string' },
        { name: 'priority', type: 'integer' }
    ],

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
