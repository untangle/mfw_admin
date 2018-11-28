Ext.define('Mfw.model.ReportQueryCategory', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'groupColumn', type: 'string' },
        { name: 'aggregationFunction', type: 'string' },
        { name: 'aggregationValue', type: 'string' },
        { name: 'limit', type: 'integer' },
        { name: 'orderByColumn', type: 'integer' }, // 1 or 2
        { name: 'orderAsc', type: 'boolean' }
    ]
});
