Ext.define('Mfw.settings.network.Interfaces', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-network-interfaces',

    title: 'Interfaces',

    store: 'interfaces',

    columns: [{
        text: 'Name'.t(),
        dataIndex: 'name'
    }]

});
