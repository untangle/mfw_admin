Ext.define('Mfw.model.DnsStaticEntry', {
    extend: 'Ext.data.Model',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'description', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'address', type: 'string' }
    ]
});

Ext.define('Mfw.model.DnsLocalServer', {
    extend: 'Ext.data.Model',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'string', allowNull: true }
    ],

});

Ext.define('Mfw.model.Dns', {
    extend: 'Ext.data.Model',

    idProperty: '_id',
    identifier: 'uuid',

    hasMany: [{
        model: 'Mfw.model.DnsStaticEntry',
        name: 'staticEntries',
        associationKey: 'staticEntries'
    }, {
        model: 'Mfw.model.DnsLocalServer',
        name: 'localServers',
        associationKey: 'localServers'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/dns',
            update: Util.api + '/settings/dns'
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
