Ext.define('Mfw.model.ReportQuerySeries', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'columns', type: 'auto' }, // array
        { name: 'timeIntervalSeconds', type: 'integer' } // min 1
    ]
});
