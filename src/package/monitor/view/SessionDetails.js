Ext.define('Mfw.monitor.view.SessionDetails', {
    extend: 'Ext.grid.Tree',
    alias: 'widget.monitor-session-details',
    viewModel: {},
    expanderOnly: false,
    userCls: 'events-tree',
    selectable: false,
    store: {
        type: 'tree',
        rootVisible: false,
        root: {
            expanded: true,
            children: [
                {
                    key: 'application',
                    text: '<strong>Application</strong>',
                    children: [
                        { key: 'application_name_inferred', text: 'Name (Inferred)', leaf: true },
                        { key: 'application_name', text: 'Name (Matched)', leaf: true },
                        { key: 'application_category_inferred', text: 'Category (Inferred)', leaf: true },
                        { key: 'application_category', text: 'Category (Matched)', leaf: true },
                        { key: 'application_detail', text: 'Detail (Matched)', leaf: true },
                        { key: 'application_id_inferred', text: 'ID (Inferred)', leaf: true },
                        { key: 'application_id', text: 'ID (Matched)', leaf: true },
                        { key: 'application_protochain_inferred', text: 'Protochain (Inferred)', leaf: true },
                        { key: 'application_protochain', text: 'Protochain (Matched)', leaf: true },
                        { key: 'application_confidence_inferred', text: 'Confidence (Inferred)', leaf: true },
                        { key: 'application_confidence', text: 'Confidence (Matched)', leaf: true },
                        { key: 'application_productivity_inferred', text: 'Productivity (Inferred)', leaf: true },
                        { key: 'application_productivity', text: 'Productivity (Matched)', leaf: true },
                        { key: 'application_risk_inferred', text: 'Risk (Inferred)', leaf: true },
                        { key: 'application_risk', text: 'Risk (Matched)', leaf: true },
                    ]
                },
                {
                    key: 'client',
                    text: '<strong>Client</strong>',
                    children: [
                        { key: 'client_address', text: 'Address', leaf: true },
                        { key: 'client_address_new', text: 'Address New', leaf: true },
                        { key: 'client_country', text: 'Country', leaf: true },
                        { key: 'client_interface_id', text: 'Interface', leaf: true },
                        { key: 'client_interface_type', text: 'Interface Type', leaf: true },
                        { key: 'client_port', text: 'Port', leaf: true },
                        { key: 'client_port_new', text: 'Port New', leaf: true },
                        { key: 'client_reverse_dns', text: 'Reverse DNS', leaf: true },
                        { key: 'client_dns_hint', text: 'DNS Hint', leaf: true },
                        { key: 'client_hops', text: 'Hops', leaf: true }
                    ]
                },
                {
                    key: 'server',
                    text: '<strong>Server</strong>',
                    children: [
                        { key: 'server_address', text: 'Address', leaf: true },
                        { key: 'server_address_new', text: 'Address New', leaf: true },
                        { key: 'server_country', text: 'Country', leaf: true },
                        { key: 'server_interface_id', text: 'Interface', leaf: true },
                        { key: 'server_interface_type', text: 'Interface Type', leaf: true },
                        { key: 'server_port', text: 'Port', leaf: true },
                        { key: 'server_port_new', text: 'Port New', leaf: true },
                        { key: 'server_reverse_dns', text: 'Reverse DNS', leaf: true },
                        { key: 'server_dns_hint', text: 'DNS Hint', leaf: true },
                        { key: 'server_hops', text: 'Hops', leaf: true }
                    ]
                },
                {
                    key: 'certificate',
                    text: '<strong>Certificate</strong>',
                    children: [
                        { key: 'certificate_issuer_c', text: 'Issuer: Country', leaf: true },
                        { key: 'certificate_issuer_cn', text: 'Issuer: Common Name', leaf: true },
                        { key: 'certificate_issuer_o', text: 'Issuer: Organization', leaf: true },
                        { key: 'certificate_subject_c', text: 'Subject: Country', leaf: true },
                        { key: 'certificate_subject_cn', text: 'Subject: Common Name', leaf: true },
                        { key: 'certificate_subject_l', text: 'Subject: Locality', leaf: true },
                        { key: 'certificate_subject_o', text: 'Subject: Organization', leaf: true },
                        { key: 'certificate_subject_p', text: 'Subject: P', leaf: true },
                        { key: 'certificate_subject_san', text: 'Subject: SAN', leaf: true },
                        { key: 'ssl_sni', text: 'SSL SNI', leaf: true },
                        { key: 'wan_rule_chain', text: 'WAN Rule Chain', leaf: true },
                        { key: 'wan_rule_id', text: 'WAN Rule ID', leaf: true },
                        { key: 'wan_policy_id', text: 'WAN Policy ID', leaf: true }
                    ]
                },
                {
                    key: 'byte_rate',
                    text: '<strong>Byte Rate</strong>',
                    children: [
                        { key: 'server_byte_rate', text: 'Server', leaf: true },
                        { key: 'client_byte_rate', text: 'Client', leaf: true },
                    ]
                },
                {
                    key: 'bytes',
                    text: '<strong>Bytes</strong>',
                    children: [
                        { key: 'server_bytes', text: 'Server', leaf: true },
                        { key: 'client_bytes', text: 'Client', leaf: true },
                    ]
                },
                {
                    key: 'packet_rate',
                    text: '<strong>Packet Rate</strong>',
                    children: [
                        { key: 'server_packet_rate', text: 'Server', leaf: true },
                        { key: 'client_packet_rate', text: 'Client', leaf: true },
                    ]
                },
                {
                    key: 'packets',
                    text: '<strong>Packets</strong>',
                    children: [
                        { key: 'server_packets', text: 'Server', leaf: true },
                        { key: 'client_packets', text: 'Client', leaf: true },
                    ]
                },
                { key: 'session_id', text: 'Session ID', leaf: true },
                { key: 'conntrack_id', text: 'Conntrack ID', leaf: true },
                { key: 'family', text: 'Family', leaf: true },
                { key: 'ip_protocol', text: 'IP Protocol', leaf: true },
                { key: 'local_address', text: 'Local Address', leaf: true },
                { key: 'remote_address', text: 'Remote Address', leaf: true },
                { key: 'tcp_state', text: 'TCP State', leaf: true },
                { key: 'age_milliseconds', text: 'Age', leaf: true },
                { key: 'timeout_seconds', text: 'Timeout', leaf: true },
                { key: 'priority', text: 'Priority', leaf: true },
                { key: 'mark', text: 'Mark', leaf: true },
                { key: 'bypass_packetd', text: 'Bypass PacketD', leaf: true },
                { key: 'wan_policy', text: 'WAN Policy', leaf: true }
            ]
        }
    },
    columns: [{
        xtype: 'treecolumn',
        text: 'Key',
        dataIndex: 'text',
        width: 200,
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
        renderer: 'valueRenderer'
    }],

    controller: {
        init: function (tree) {
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
        },

        valueRenderer: function (value, record) {
            var key = record.get('key');
            if (key === 'mark') { return Renderer.hex(value); }
            if (key === 'bytes') { return Renderer.bytesRenderer(value); }
            if (key === 'client_bytes') { return Renderer.bytesRenderer(value); }
            if (key === 'server_bytes') { return Renderer.bytesRenderer(value); }
            if (key === 'byte_rate') { return Renderer.bytesSecRenderer(value); }
            if (key === 'client_byte_rate') { return Renderer.bytesSecRenderer(value); }
            if (key === 'server_byte_rate') { return Renderer.bytesSecRenderer(value); }
            if (key === 'packets') { return Renderer.packetsRenderer(value); }
            if (key === 'client_packets') { return Renderer.packetsRenderer(value); }
            if (key === 'server_packets') { return Renderer.packetsRenderer(value); }
            if (key === 'packet_rate') { return Renderer.packetsSecRenderer(value); }
            if (key === 'client_packet_rate') { return Renderer.packetsSecRenderer(value); }
            if (key === 'server_packet_rate') { return Renderer.packetsSecRenderer(value); }
            if (key === 'bypass_packetd') { return Renderer.boolean(value); }
            if (key === 'ip_protocol') { return Renderer.ipProtocol(value); }
            if (key === 'family') { return Renderer.familyRenderer(value); }
            if (key === 'tcp_state') { return Renderer.tcpStateRenderer(value); }
            if (key === 'timeout_seconds') { return Renderer.timeRangeSeconds(value); }
            if (key === 'age_milliseconds') { return Renderer.timeRangeMilliseconds(value); }
            if (key === 'client_interface_id' || key === 'server_interface_id') { return Renderer.interface(value); }
            if (key === 'client_interface_type' || key === 'server_interface_type') { return Renderer.interfaceType(value); }
            if (key === 'client_country' || key === 'server_country') { return Renderer.country(value); }
            return value;
        }
    }
});
