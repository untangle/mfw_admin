Ext.define('Mfw.settings.network.Dns', {

    extend: 'Mfw.cmp.panel.MasterPanel',
    alias: 'widget.mfw-settings-network-dns',

    title: 'DNS'.t(),

    config: {
        recordModel: new Mfw.model.Dns()
    },

    layout: 'fit',

    items: [{
        xtype: 'tabpanel',
        layout: {
            type: 'card',
            animation: false
        },
        tabBar: {
            ui: 'light',
            animateIndicator: false,
            layout: {
                type: 'hbox',
                pack: 'start'
            },
        },
        items: [{
            xtype: 'panel',
            title: 'Static Entries',
            layout: 'fit',
            items: [{
                xtype: 'mastergrid',
                // controller: 'dhcpstaticentries',

                title: '&nbsp;',

                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },

                enableSave: false,
                enableReload: true,
                enableReset: false,
                enableCopy: false,

                flex: 1,

                bind: '{rec.staticEntries}',

                columns: [{
                    text: 'Name'.t(),
                    dataIndex: 'name',
                    flex: 1,
                    editable: true
                } , {
                    text: 'Address'.t(),
                    dataIndex: 'address',
                    flex: 1,
                    editable: true
                }]
            }]
        }, {
            xtype: 'panel',
            title: 'Local Servers',
            layout: 'fit',
            items: [{
                xtype: 'mastergrid',
                title: '&nbsp;',

                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },

                enableSave: false,
                enableReload: true,
                enableReset: false,
                enableCopy: false,

                flex: 1,

                bind: '{rec.localServers}',

                columns: [{
                    text: 'Name'.t(),
                    dataIndex: 'name',
                    flex: 1,
                    editable: true
                } , {
                    text: 'Address'.t(),
                    dataIndex: 'address',
                    flex: 1,
                    editable: true
                }]
            }]
        }]
    }],
});
