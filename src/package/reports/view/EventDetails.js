Ext.define('Mfw.reports.EventDetails', {
    extend: 'Ext.Panel',
    alias: 'widget.event-details',
    viewModel: {},
    layout: 'fit',

    items: [{
        xtype: 'grid',
        store: {
            data: []
        },
        columns: [{
            text: 'Key',
            dataIndex: 'key',
            width: 200,
            renderer: function (value) {
                return Table.allColumnsMap[value] ? Table.allColumnsMap[value].text : value;
            }
        }, {
            text: 'Value',
            dataIndex: 'val',
            flex: 1,
            cell: { encodeHtml: false },
            renderer: function (value, record) {
                var renderer;
                switch (record.get('key')) {
                    case 'time_stamp': renderer = Renderer.time_stamp; break;
                    case 'ip_protocol': renderer = Renderer.ip_protocol; break;
                    case 'client_interface_id':
                    case 'server_interface_id': renderer = Renderer.interface; break;
                    default: renderer = null;
                }
                return renderer ? renderer(value) : value;
            }
        }]
    }],

    controller: {
        init: function (panel) {
            panel.getViewModel().bind('{list.selection}', function (selection) {
                if (!selection) { return; }
                var data = [];

                Ext.Object.each(selection.getData(), function (key, val) {
                    data.push({
                        key: key,
                        val: val
                    });
                });
                panel.down('grid').getStore().setData(data);
            });
        }
    }

});
