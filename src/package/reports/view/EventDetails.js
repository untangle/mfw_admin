Ext.define('Mfw.reports.EventDetails', {
    extend: 'Ext.grid.Tree',
    alias: 'widget.event-details',
    viewModel: {},
    expanderOnly: false,
    userCls: 'events-tree',
    selectable: false,

    columns: [{
        xtype: 'treecolumn',
        text: 'Key',
        dataIndex: 'text',
        width: 250,
        cell: {
            cellCls: 'event-key',
            encodeHtml: false
        }
    }, {
        xtype: 'column',
        text: 'Value',
        dataIndex: 'val',
        flex: 1,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            if (record.get('renderer')) {
                return record.get('renderer')(value, record);
            }
            return value;
        }

    }],

    controller: {
        init: function (tree) {
            // tree.getStore().create();

            /**
             * when report binds set the Event Details key/value pairs tree
             * based on report table or joined tables
             * because tree store setRootNode() method is failing (ExtJS known issue)
             * ther store is being re-created each time an EVENT report is selected
             */
            tree.getViewModel().bind('{record}', function (record) {
                if (!record) { return; }
                tree.setStore(ReportsTreeStore.create(record));
            });

            tree.getViewModel().bind('{list.selection}', function (selection) {
                if (!selection) {
                    return;
                }

                var rootNode = tree.getRootNode();

                Ext.Object.each(selection.getData(), function (key, val) {
                    var node, expandKey;
                    switch (key) {
                        case 'application_name': expandKey = 'application'; break;
                        case 'client_address': expandKey = 'client'; break;
                        case 'server_address': expandKey = 'server'; break;
                        case 'certificate_subject_cn': expandKey = 'certificate'; break;
                        default: break;
                    }
                    if (expandKey) {
                        node = rootNode.findChild('key', expandKey, true);
                        if (node) { node.set('val', val); }
                    }
                    node = rootNode.findChild('key', key, true);
                    if (node) { node.set('val', val); }
                });
            });
        }
    }

});
