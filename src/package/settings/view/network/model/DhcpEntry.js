Ext.define('Mfw.network.model.DhcpEntry', {
    extend: 'Ext.data.Model',
    alias: 'model.dhcpentry',

    fields: [
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
        // writer: {
        //     type: 'json',
        //     writeAllFields: true,
        //     writeRecordId: false,
        // }
    }
});
