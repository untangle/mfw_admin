Ext.define('Mfw.reports.GridSelectionDetails', {
    extend: 'Ext.Panel',
    alias: 'widget.grid-selection-details',
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
            flex: 1
        }]
    }],

    controller: {
        init: function (panel) {
            panel.getViewModel().bind('{list.selection}', function (selection) {
                if (!selection) { return; }
                console.log(selection.getData());
                var data = [];

                Ext.Object.each(selection.getData(), function (key, val) {
                    data.push({
                        key: key,
                        val: val
                    });
                });

                console.log(data);
                panel.down('grid').getStore().setData(data);

            });
        }
    }

});
