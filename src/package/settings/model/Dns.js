Ext.define('Mfw.model.DnsStaticEntry', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'string', allowNull: true }
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/dns/staticEntries',
            update: Util.api + '/settings/dns/staticEntries'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            writeRecordId: false,
            allDataOptions: {
                serialize: true
                // changes: false,
                // persist: false
            }
        }
    }
});

Ext.define('Mfw.model.DnsLocalServer', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'string', allowNull: true }
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/dns/localServers',
            update: Util.api + '/settings/dns/localServers'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            writeRecordId: false,
            allDataOptions: {
                serialize: true
                // changes: false,
                // persist: false
            }
        }
    }
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
