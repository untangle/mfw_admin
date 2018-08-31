Ext.define('Mfw.model.DhcpEntry', {
    extend: 'Ext.data.Model',
    alias: 'model.dhcpentry',

    fields: [
        { name: 'address', type: 'string' },
        { name: 'macAddress', type: 'string' }
    ],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        }
    }

    // proxy: {
    //     type: 'ajax',
    //     api: {
    //         read: Util.api + '/settings/dhcp',
    //         update: Util.api + '/settings/dhcp'
    //     },
    //     reader: {
    //         type: 'json'
    //     },
    //     writer: {
    //         type: 'json',
    //         writeAllFields: true,
    //         writeRecordId: false,
    //         allDataOptions: {
    //             associated: true,
    //             persist: true
    //         }
    //     }
    // }
});
