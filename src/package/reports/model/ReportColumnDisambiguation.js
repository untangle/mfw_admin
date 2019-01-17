Ext.define('Mfw.model.ReportColumnDisambiguation', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'columnName', type: 'string' },
        { name: 'newColumnName', type: 'string' }
    ]
});
