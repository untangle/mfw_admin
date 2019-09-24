Ext.define('Mfw.SessionDetailsTree', {
    extend: 'Ext.grid.Tree',
    alias: 'widget.session-details',
    viewModel: {},
    expanderOnly: false,
    userCls: 'c-noheaders events-tree',
    selectable: false,

    hideHeaders: true,

    items: [{
        xtype: 'component',
        docked: 'top',
        padding: '0 16',
        margin: '0 0 8 0',
        style: 'line-height: 40px; font-size: 16px; border-bottom: 1px #EEE solid;',
        html: 'Session Details'
    }],

    columns: [{
        xtype: 'treecolumn',
        text: 'Key',
        dataIndex: 'text',
        width: 250,
        cell: {
            cellCls: 'event-key',
            encodeHtml: false
        },
        renderer: function (value, record) {
            return record.get('altText') || value;
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
            if (tree.monitor) {
                tree.setStore(SessionDetails.create());
            }

            /**
             * when report binds set the Event Details key/value pairs tree
             * based on report table or joined tables
             * because tree store setRootNode() method is failing (ExtJS known issue)
             * ther store is being re-created each time an EVENT report is selected
             */
            tree.getViewModel().bind('{record}', function (record) {
                if (!record) { return; }
                tree.setStore(SessionDetails.create(record));
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
