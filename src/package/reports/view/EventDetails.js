Ext.define('Mfw.reports.EventDetails', {
    extend: 'Ext.Panel',
    alias: 'widget.event-details',
    viewModel: {},
    layout: 'fit',

    items: [{
        xtype: 'tree',
        expanderOnly: false,
        userCls: 'events-tree',
        store: {
            type: 'tree',
            rootVisible: false,
            root: {
                expanded: true,
                children: [
                    { key: 'session_id', val: '', leaf: true },
                    { key: 'time_stamp', val: '', leaf: true },
                    { key: 'end_time', val: '', leaf: true },
                    { key: 'hostname', val: '', leaf: true },
                    { key: 'ip_protocol', val: '', leaf: true },
                {
                    key: 'Client',
                    children: [
                        { key: 'client_address', val: '', leaf: true },
                        { key: 'client_address_new', val: '', leaf: true },
                        { key: 'client_country', val: '', leaf: true },
                        { key: 'client_dns_hint', val: '', leaf: true },
                        { key: 'client_interface_id', val: '', leaf: true },
                        { key: 'client_interface_type', val: '', leaf: true },
                        { key: 'client_latitude', val: '', leaf: true },
                        { key: 'client_longitude', val: '', leaf: true },
                        { key: 'client_port', val: '', leaf: true },
                        { key: 'client_port_new', val: '', leaf: true }
                    ]
                }, {
                    key: 'Server',
                    children: [
                        { key: 'server_address', val: '', leaf: true },
                        { key: 'server_address_new', val: '', leaf: true },
                        { key: 'server_country', val: '', leaf: true },
                        { key: 'server_dns_hint', val: '', leaf: true },
                        { key: 'server_interface_id', val: '', leaf: true },
                        { key: 'server_interface_type', val: '', leaf: true },
                        { key: 'server_latitude', val: '', leaf: true },
                        { key: 'server_longitude', val: '', leaf: true },
                        { key: 'server_port', val: '', leaf: true },
                        { key: 'server_port_new', val: '', leaf: true }
                    ]
                }, {
                    key: 'Application',
                    children: [
                        { key: 'application_name_inferred', val: '', leaf: true},
                        { key: 'application_name', val: '', leaf: true },
                        { key: 'application_category_inferred', val: '', leaf: true },
                        { key: 'application_category', val: '', leaf: true },
                        { key: 'application_blocked', val: '', leaf: true },
                        { key: 'application_flagged', val: '', leaf: true },
                        { key: 'application_detail', val: '', leaf: true },
                        { key: 'application_id_inferred', val: '', leaf: true},
                        { key: 'application_id', val: '', leaf: true },
                        { key: 'application_protochain_inferred', val: '', leaf: true },
                        { key: 'application_protochain', val: '', leaf: true },
                        { key: 'application_confidence_inferred', val: '', leaf: true },
                        { key: 'application_confidence', val: '', leaf: true },
                        { key: 'application_productivity_inferred', val: '', leaf: true },
                        { key: 'application_productivity', val: '', leaf: true },
                        { key: 'application_risk_inferred', val: '', leaf: true },
                        { key: 'application_risk', val: '', leaf: true }
                    ]
                },
                { key: 'local_address', val: '', leaf: true },
                { key: 'remote_address', val: '', leaf: true },
                { key: 'c2s_bytes', val: '', leaf: true },
                { key: 's2c_bytes', val: '', leaf: true },
                { key: 'certificate_subject_cn', val: '', leaf: true },
                { key: 'certificate_subject_o', val: '', leaf: true },
                { key: 'ssl_sni', val: '', leaf: true },
                { key: 'wan_rule_chain', val: '', leaf: true },
                { key: 'wan_rule_id', val: '', leaf: true },
                { key: 'wan_policy_id', val: '', leaf: true },
                { key: 'username', val: '', leaf: true }
                ]
            }
        },
        columns: [{
            xtype: 'treecolumn',
            text: 'Name',
            dataIndex: 'key',
            width: 200,
            cell: {
                cellCls: 'event-key'
            },
            renderer: function (value) {
                return Table.allColumnsMap[value] ? Table.allColumnsMap[value].text : value;
            }
        }, {
            xtype: 'column',
            text: 'Value',
            dataIndex: 'val',
            flex: 1
        }]
    }],

    // items: [{
    //     xtype: 'grid',
    //     store: {
    //         data: []
    //     },
    //     columns: [{
    //         text: 'Key',
    //         dataIndex: 'key',
    //         width: 200,
    //         renderer: function (value) {
    //             return Table.allColumnsMap[value] ? Table.allColumnsMap[value].text : value;
    //         }
    //     }, {
    //         text: 'Value',
    //         dataIndex: 'val',
    //         flex: 1,
    //         cell: { encodeHtml: false },
    //         renderer: function (value, record) {
    //             var renderer;
    //             switch (record.get('key')) {
    //                 case 'time_stamp': renderer = Renderer.timeStamp; break;
    //                 case 'ip_protocol': renderer = Renderer.ipProtocol; break;
    //                 case 'client_interface_id':
    //                 case 'server_interface_id': renderer = Renderer.interface; break;
    //                 default: renderer = null;
    //             }
    //             return renderer ? renderer(value) : value;
    //         }
    //     }]
    // }],

    controller: {
        init: function (panel) {
            var tree = panel.down('tree');
            panel.getViewModel().bind('{list.selection}', function (selection) {
                if (!selection) { return; }

                var rootNode = tree.getRootNode();

                Ext.Object.each(selection.getData(), function (key, val) {
                    var node = rootNode.findChild('key', key, true);
                    if (node) {
                        node.set('val', val);
                    }
                });
            });
        }
    }

});
