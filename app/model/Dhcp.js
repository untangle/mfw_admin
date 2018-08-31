Ext.define('Mfw.model.Dhcp', {
    extend: 'Ext.data.Model',
    alias: 'model.dhcp',

    fields: [
        { name: 'dhcpAuthoritative', type: 'boolean' },
        { name: 'staticDhcpEntries', type: 'auto' }
    ],

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
            }
        }
    }
});
