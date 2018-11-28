Ext.define('Mfw.model.ReportQueryText', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'columns', type: 'auto' } // array of strings
    ]
});
