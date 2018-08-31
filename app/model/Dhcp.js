Ext.define('Mfw.model.Dhcp', {
    extend: 'Ext.data.Model',
    alias: 'model.dhcp',

    fields: [
        { name: 'dhcpAuthoritative', type: 'boolean' }
    ],

    hasMany: {
        model: 'Mfw.model.DhcpEntry',
        name: 'staticDhcpEntries',
        associationKey: 'staticDhcpEntries'
    },

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
            writeRecordId: false,
            allDataOptions: {
                associated: true,
                persist: true
            }
        }
    }
});
