Ext.define('Mfw.model.Widget', {
    extend: 'Ext.data.Model',
    alias: 'model.widget',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'name', type: 'string' },
        {
            name: '_identifier',
            calculate: function (data) {
                return data.name.toLowerCase().replace(/ /g, '-');
            }
        }
    ]
});
