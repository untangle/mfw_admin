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
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/api/settings/dashboard/widgets',
            update: window.location.origin + '/api/settings/dashboard/widgets'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: false, // wrap single record in array
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: DashboardUtil.sanitize,
                scope: this
            }
        }
    }
});
