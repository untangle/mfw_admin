Ext.define('Mfw.network.model.DhcpEntry', {
    extend: 'Ext.data.Model',
    alias: 'model.dhcpentry',

    fields: [
        { name: 'address', type: 'string' },
        { name: 'macAddress', type: 'string' }
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
            writeRecordId: false
        }
    }
});
