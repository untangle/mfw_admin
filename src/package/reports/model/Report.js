Ext.define('Mfw.model.Report', {
    extend: 'Ext.data.Model',
    alias: 'model.report',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'uniqueId', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'displayOrder', type: 'integer' },
        { name: 'readOnly', type: 'boolean' },
        { name: 'type', type: 'string' }, // ["TEXT","PIE_CHART","TIME_CHART","TIME_DYNAMIC_CHART","EVENT_LIST"],

        // helper fields
        {
            name: '_route',
            calculate: function (data) {
                var categorySlug = data.category.toLowerCase().replace(/ /g, '-');
                return 'cat=' + categorySlug + '&rep=' + data.name.toLowerCase().replace(/ /g, '-');
            }
        }
    ],

    hasOne: [{
        model: 'Mfw.model.ReportRender',
        name: 'rendering',
        associationKey: 'rendering'
    }]
});
