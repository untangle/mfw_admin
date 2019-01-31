Ext.define('Mfw.monitor.view.SessionDetails', {
    extend: 'Ext.grid.Tree',
    alias: 'widget.monitor-session-details',
    viewModel: {},
    expanderOnly: false,
    userCls: 'events-tree',
    store: {
        type: 'tree',
        rootVisible: false,
        root: {
            expanded: true,
            children: [
                {
                    key: 'Application',
                    text: 'Application',
                    children: [
                        { key: 'application_name', text: 'Name', leaf: true },
                        { key: 'application_id', text: 'ID', leaf: true },
                        { key: 'application_category', text: 'Category', leaf: true },
                        { key: 'application_detail', text: 'Detail', leaf: true },
                        { key: 'application_confidence', text: 'Confidence', leaf: true },
                        { key: 'application_protochain', text: 'Protochain', leaf: true }
                    ]
                },
                {
                    key: 'Client',
                    text: 'Client',
                    children: [
                        { key: 'client_address', text: 'Address', leaf: true },
                        { key: 'client_address_new', text: 'Address New', leaf: true },
                        { key: 'client_country', text: 'Country', leaf: true },
                        { key: 'client_interface_id', text: 'Interface', leaf: true },
                        { key: 'client_interface_type', text: 'Interface Type', leaf: true },
                        { key: 'client_port', text: 'Port', leaf: true },
                        { key: 'client_port_new', text: 'Port New', leaf: true },
                        { key: 'client_reverse_dns', text: 'Reverse DNS', leaf: true }
                    ]
                },
                {
                    key: 'Server',
                    text: 'Server',
                    children: [
                        { key: 'server_address', text: 'Address', leaf: true },
                        { key: 'server_address_new', text: 'Address New', leaf: true },
                        { key: 'server_country', text: 'Country', leaf: true },
                        { key: 'server_interface_id', text: 'Interface', leaf: true },
                        { key: 'server_interface_type', text: 'Interface Type', leaf: true },
                        { key: 'server_port', text: 'Port', leaf: true },
                        { key: 'server_port_new', text: 'Port New', leaf: true },
                        { key: 'server_reverse_dns', text: 'Reverse DNS', leaf: true }
                    ]
                },
                {
                    key: 'Certificate',
                    text: 'Certificate',
                    children: [
                        { key: 'certificate_issuer_c', text: 'Issuer: Country', leaf: true },
                        { key: 'certificate_issuer_cn', text: 'Issuer: Common Name', leaf: true },
                        { key: 'certificate_issuer_o', text: 'Issuer: Organization', leaf: true },
                        { key: 'certificate_subject_c', text: 'Subject: Country', leaf: true },
                        { key: 'certificate_subject_cn', text: 'Subject: Common Name', leaf: true },
                        { key: 'certificate_subject_l', text: 'Subject: Locality', leaf: true },
                        { key: 'certificate_subject_o', text: 'Subject: Organization', leaf: true },
                        { key: 'certificate_subject_p', text: 'Subject: P', leaf: true },
                        { key: 'certificate_subject_san', text: 'Subject: SAN', leaf: true }
                    ]
                },
                { key: 'session_id', text: 'Session ID', leaf: true },
                { key: 'connection_state', text: 'Connection State', leaf: true },
                { key: 'timeout_seconds', text: 'Timeout (s)', leaf: true },
                { key: 'bypass_packetd', text: 'Bypass PacketD', leaf: true },
                { key: 'bytes', text: 'Bytes', leaf: true },
                { key: 'ip_protocol', text: 'IP Protocol', leaf: true },
                { key: 'assured_flag', text: 'Assured', leaf: true },
                { key: 'local_address', text: 'Local Address', leaf: true },
                { key: 'remote_address', text: 'Remote Address', leaf: true },
                { key: 'mark', text: 'Mark', leaf: true },
                { key: 'priority', text: 'Priority', leaf: true },
                { key: 'protocol', text: 'Protocol', leaf: true },
                { key: 'ssl_sni', text: 'SSL SNI', leaf: true }
            ]
        }
    },
    columns: [{
        xtype: 'treecolumn',
        text: 'Key',
        dataIndex: 'text',
        width: 200,
        cell: {
            cellCls: 'event-key'
        }
    }, {
        xtype: 'column',
        text: 'Value',
        dataIndex: 'val',
        flex: 1,
        cell: { encodeHtml: false },
        renderer: 'valueRenderer'
    }],

    controller: {
        init: function (tree) {
            tree.getViewModel().bind('{list.selection}', function (selection) {
                if (!selection) {
                    // Ext.Object.each(selection.getData(), function (key, val) {
                    //     var node = rootNode.findChild('key', key, true);
                    //     if (node) {
                    //         node.set('val', '');
                    //     }
                    // });
                    return;
                }

                var rootNode = tree.getRootNode();

                Ext.Object.each(selection.getData(), function (key, val) {
                    var node = rootNode.findChild('key', key, true);
                    if (node) {
                        node.set('val', val);
                    }

                    if (key === 'application_name') {
                        rootNode.findChild('key', 'Application', true).set('val', val);
                    }

                    if (key === 'client_address') {
                        rootNode.findChild('key', 'Client', true).set('val', val);
                    }

                    if (key === 'server_address') {
                        rootNode.findChild('key', 'Server', true).set('val', val);
                    }

                    if (key === 'certificate_subject_cn') {
                        rootNode.findChild('key', 'Certificate', true).set('val', val);
                    }

                });
            });
        },

        valueRenderer: function (value, record) {
            var key = record.get('key');
            if (key === 'bytes') { return Renderer.bytesRenderer(value); }
            if (key === 'bypass_packetd' || key === 'assured_flag') { return Renderer.boolean(value); }
            if (key === 'timeout_seconds') { return Renderer.timeout_seconds(value); }
            if (key === 'ip_protocol') { return Renderer.ip_protocol(value); }
            if (key === 'client_interface_id' || key === 'server_interface_id') { return Renderer.interface(value); }
            if (key === 'client_country' || key === 'server_country') { return Renderer.country(value); }
            return value;
        }
    }
});
