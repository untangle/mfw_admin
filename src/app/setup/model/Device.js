Ext.define('Mfw.model.Device', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'name',   type: 'string' },
        { name: 'duplex', type: 'string' }, // ["AUTO", "10000_FULL_DUPLEX","10000_HALF_DUPLEX", "1000_FULL_DUPLEX", "1000_HALF_DUPLEX", "100_FULL_DUPLEX", "100_HALF_DUPLEX", "10_FULL_DUPLEX", "10_HALF_DUPLEX"]
        { name: 'mtu',    type: 'integer', allowNull: true }
    ],
    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/api/settings/network/devices',
            update: window.location.origin + '/api/settings/network/devices'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                serialize: true
                // changes: false,
                // persist: false
            }
        }
    }
});
