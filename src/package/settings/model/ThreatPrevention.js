Ext.define('Mfw.model.ThreatPreventionPassListItem', {
    extend: 'Ext.data.Model',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'host', type: 'string' },
        { name: 'description', type: 'string' },
    ]
});

Ext.define('Mfw.model.ThreatPrevention', {
    extend: 'Ext.data.Model',

    idProperty: '_id',
    identifier: 'uuid',

    fields: [
        { name: 'enabled', type: 'boolean' },
        { name: 'sensitivity', type: 'string' },
    ],

    hasMany: [{
        model: 'Mfw.model.ThreatPreventionPassListItem',
        name: 'passList',
        associationKey: 'passList'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/tp',
            update: Util.api + '/settings/tp'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    }
});
