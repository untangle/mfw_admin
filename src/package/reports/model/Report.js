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
        { name: 'type', type: 'string' }, // ["TEXT","EVENTS","CATEGORIES","SERIES","CATEGORIES_SERIES"],
        { name: 'table', type: 'string' },
        // { name: '', type: 'string' },

        // helper fields
        {
            name: '_route',
            calculate: function (data) {
                var categorySlug = data.category.toLowerCase().replace(/ /g, '-');
                return 'cat=' + categorySlug + '&rep=' + data.name.toLowerCase().replace(/ /g, '-');
            }
        }
    ],

    hasMany: [{
        model: 'Mfw.model.ReportCondition',
        name: 'conditions',
        associationKey: 'conditions'
    }, {
        model: 'Mfw.model.ReportCondition',
        name: 'userConditions',
        associationKey: 'userConditions'
    }],

    hasOne: [{
        model: 'Mfw.model.ReportQueryCategory',
        name: 'queryCategories',
        associationKey: 'queryCategories'
    }, {
        model: 'Mfw.model.ReportQueryText',
        name: 'queryText',
        associationKey: 'queryText'
    }, {
        model: 'Mfw.model.ReportQuerySeries',
        name: 'querySeries',
        associationKey: 'querySeries'
    }, {
        model: 'Mfw.model.ReportRender',
        name: 'rendering',
        associationKey: 'rendering'
    }]
});
