Ext.define('Mfw.model.DhcpStaticEntry', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'description', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'macAddress', type: 'string', allowNull: true }
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/dhcp/staticDhcpEntries',
            update: Util.api + '/settings/dhcp/staticDhcpEntries'
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

Ext.define('Mfw.model.Dhcp', {
    extend: 'Ext.data.Model',
    // alias: 'model.table-action',

    idProperty: '_id',
    identifier: 'uuid',

    fields: [
        { name: 'dhcpAuthoritative', type: 'boolean' }
    ],

    hasMany: [{
        model: 'Mfw.model.DhcpStaticEntry',
        name: 'staticDhcpEntries',
        associationKey: 'staticDhcpEntries'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/dhcp',
            update: Util.api + '/settings/dhcp'
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
