Ext.define('Mfw.model.table.Condition', {
    extend: 'Ext.data.Model',
    alias: 'model.table-condition',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type',  type: 'string' },
        { name: 'op',    type: 'string' },
        { name: 'value', type: 'auto' }
    ]
});
