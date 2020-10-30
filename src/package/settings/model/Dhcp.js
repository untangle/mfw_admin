Ext.define('Mfw.model.StaticDhcpEntry', {
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
            allowSingle: false,
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
        model: 'Mfw.model.StaticDhcpEntry',
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


Ext.define('Mfw.model.DhcpLease', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'leaseExpiration',
            type: 'integer',
            /**
             * as leases timestamps are in seconds only
             * convert them to timestamps with millis
             */
            convert: function (value) {
                return !isNaN(value) ? value * 1000 : 0;
            }
        },
        { name: 'ipAddr', type: 'string' },
        { name: 'macAddress', type: 'string' },
        { name: 'hostName', type: 'string' },
        { name: 'clientId', type: 'string' },
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/status/dhcp',
        },
        reader: {
            type: 'json'
        },
    }
});
