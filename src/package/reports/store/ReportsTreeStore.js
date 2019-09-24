/**
 * Helper class to set EVENTS reports details view
 */
Ext.define('Mfw.reports.ReportsTreeStore', {
    alternateClassName: 'ReportsTreeStore',
    singleton: true,

    table: {
        sessions: [
            {
                key: 'application',
                text: '<strong>Application</strong>',
                children: [
                    { key: 'application_name', text: 'Name' },
                    { key: 'application_name_inferred', text: 'Name (Inferred)' },
                    { key: 'application_category', text: 'Category' },
                    { key: 'application_category_inferred', text: 'Category (Inferred)' },
                    { key: 'application_id', text: 'ID' },
                    { key: 'application_id_inferred', text: 'ID (Inferred)' },
                    { key: 'application_protochain', text: 'Protochain' },
                    { key: 'application_protochain_inferred', text: 'Protochain (Inferred)' },
                    { key: 'application_confidence', text: 'Confidence' },
                    { key: 'application_confidence_inferred', text: 'Confidence' },
                    { key: 'application_productivity', text: 'Productivity' },
                    { key: 'application_productivity_inferred', text: 'Productivity (Inferred)' },
                    { key: 'application_risk', text: 'Risk' },
                    { key: 'application_risk_inferred', text: 'Risk (Inferred)' },
                    { key: 'application_detail', text: 'Detail (Matched)' },
                    { key: 'application_blocked', text: 'Blocked', renderer: Renderer.boolean },
                    { key: 'application_flagged', text: 'Flagged', renderer: Renderer.boolean }
                ]
            },
            {
                key: 'client',
                text: '<strong>Client</strong>',
                children: [
                    { key: 'client_address', text: 'Address' },
                    { key: 'client_address_new', text: 'Address New' },
                    { key: 'client_interface_id', text: 'Interface', renderer: Renderer.interface },
                    { key: 'client_interface_type', text: 'Interface Type', renderer: Renderer.interfaceType },
                    { key: 'client_port', text: 'Port' },
                    { key: 'client_port_new', text: 'Port New' },
                    { key: 'client_dns_hint', text: 'DNS Hint' },
                    { key: 'client_hops', text: 'Hops' },
                    { key: 'client_country', text: 'Country', renderer: Renderer.country },
                    { key: 'client_latitude', text: 'Latitude' },
                    { key: 'client_longitude', text: 'Longitude' }
                ]
            }, {
                key: 'server',
                text: '<strong>Server</strong>',
                children: [
                    { key: 'server_address', text: 'Address' },
                    { key: 'server_address_new', text: 'Address New' },
                    { key: 'server_interface_id', text: 'Interface', renderer: Renderer.interface },
                    { key: 'server_interface_type', text: 'Interface Type', renderer: Renderer.interfaceType },
                    { key: 'server_port', text: 'Port' },
                    { key: 'server_port_new', text: 'Port New' },
                    { key: 'server_dns_hint', text: 'DNS Hint' },
                    { key: 'server_hops', text: 'Hops' },
                    { key: 'server_country', text: 'Country', renderer: Renderer.country },
                    { key: 'server_latitude', text: 'Latitude' },
                    { key: 'server_longitude', text: 'Longitude' }
                ]
            },
            {
                key: 'certificate',
                text: '<strong>Certificate</strong>',
                children: [
                    { key: 'certificate_subject_cn', text: 'Subject: Common Name' },
                    { key: 'certificate_subject_o', text: 'Subject: Organization' },
                    { key: 'ssl_sni', text: 'SSL SNI' },
                    { key: 'wan_rule_chain', text: 'WAN Rule Chain' },
                    { key: 'wan_rule_id', text: 'WAN Rule ID', renderer: Renderer.wanRule },
                    { key: 'wan_policy_id', text: 'WAN Policy ID', renderer: Renderer.wanPolicy }
                ]
            },
            { key: 'session_id', text: 'Session ID' },
            { key: 'time_stamp', text: 'Timestamp' },
            { key: 'end_time', text: 'End Time' },
            { key: 'hostname', text: 'Hostname' },
            { key: 'ip_protocol', text: 'IP Protocol', renderer: Renderer.ipProtocol },
            { key: 'family', text: 'Family', renderer: Renderer.familyRenderer },
            { key: 'local_address', text: 'Local Address' },
            { key: 'remote_address', text: 'Remote Address' },
            { key: 'username', text: 'Username' }
        ],

        session_stats: [
            {
                key: 'session_stats',
                text: '<strong>Session Stats</strong>',
                expanded: true,
                children: [
                    // session_is ommited
                    // time_stamp ommited
                    { key: 'bytes', text: 'Bytes', renderer: Renderer.bytesRenderer },
                    { key: 'byte_rate', text: 'Byte Rate', renderer: Renderer.bytesSecRenderer },
                    { key: 'client_bytes', text: 'Client Bytes', renderer: Renderer.bytesRenderer },
                    { key: 'client_byte_rate', text: 'Client Byte Rate', renderer: Renderer.bytesSecRenderer },
                    { key: 'server_bytes', text: 'Server Bytes', renderer: Renderer.bytesRenderer },
                    { key: 'server_byte_rate', text: 'Server Byte Rate', renderer: Renderer.bytesSecRenderer },
                    { key: 'packets', text: 'Packets', renderer: Renderer.packetsRenderer },
                    { key: 'packet_rate', text: 'Packet Rate', renderer: Renderer.packetsSecRenderer },
                    { key: 'client_packets', text: 'Client Packets', renderer: Renderer.packetsRenderer },
                    { key: 'client_packet_rate', text: 'Client Packet Rate', renderer: Renderer.packetsSecRenderer },
                    { key: 'server_packets', text: 'Server Packets', renderer: Renderer.packetsRenderer },
                    { key: 'server_packet_rate', text: 'Server Packet Rate', renderer: Renderer.packetsSecRenderer }
                ]
            }
        ],


        /**
         * doesn't seem to be used in any EVENTS reports yet
         * listing cols as found in packetd reports
         */
        interface_stats: [
            {
                key: 'interface_stats',
                text: '<strong>Interface Stats</strong>',
                expanded: true,
                children: [
                    // time_stamp ommited
                    { key: 'interface_id', text: 'Interface', renderer: Renderer.interface },
                    { key: 'device_name', text: 'Device Name' },
                    { key: 'latency_1', text: 'Latency 1m' },
                    { key: 'latency_5', text: 'Latency 5m' },
                    { key: 'latency_15', text: 'Latency 15m' },
                    { key: 'latency_variance', text: 'Latency Variance' },
                    { key: 'passive_latency_1', text: 'Passive Latency 1m' },
                    { key: 'passive_latency_5', text: 'Passive Latency 5m' },
                    { key: 'passive_latency_15', text: 'Passive Latency 15m' },
                    { key: 'passive_latency_variance', text: 'Passive Latency Variance' },
                    { key: 'active_latency_1', text: 'Active Latency 1m' },
                    { key: 'active_latency_5', text: 'Active Latency 5m' },
                    { key: 'active_latency_15', text: 'Active Latency 15m' },
                    { key: 'active_latency_variance', text: 'Active Latency Variance' },
                    { key: 'jitter_1', text: 'Jitter 1m' },
                    { key: 'jitter_5', text: 'Jitter 5m' },
                    { key: 'jitter_15', text: 'Jitter 15m' },
                    { key: 'jitter_variance', text: 'Jitter Variance' },

                    { key: 'ping_timeout', text: 'Ping Timeout' },
                    { key: 'ping_timeout_rate', text: 'Ping Timeout Rate' },

                    { key: 'rx_bytes', text: 'RX Bytes' },
                    { key: 'rx_bytes_rate', text: 'RX Byte Rate' },
                    { key: 'rx_packets', text: 'RX Packets' },
                    { key: 'rx_packets_rate', text: 'RX Packet Rate' },
                    { key: 'rx_errs', text: 'RX Errors' },
                    { key: 'rx_errs_rate', text: 'RX Error Rate' },
                    { key: 'rx_drop', text: 'RX Drop' },
                    { key: 'rx_drop_rate', text: 'RX Drop Rate' },
                    { key: 'rx_fifo', text: 'RX Fifo' },
                    { key: 'rx_fifo_rate', text: 'RX Fifo Rate' },
                    { key: 'rx_frame', text: 'RX Frame' },
                    { key: 'rx_frame_rate', text: 'RX Frame Rate' },
                    { key: 'rx_compressed', text: 'RX Compressed' },
                    { key: 'rx_compressed_rate', text: 'RX Compressed Rate' },
                    { key: 'rx_multicast', text: 'RX Multicast' },
                    { key: 'rx_multicast_rate', text: 'RX Multicast Rate' },

                    { key: 'tx_bytes', text: 'TX Bytes' },
                    { key: 'tx_bytes_rate', text: 'TX Byte Rate' },
                    { key: 'tx_packets', text: 'TX Packets' },
                    { key: 'tx_packets_rate', text: 'TX Packet Rate' },
                    { key: 'tx_errs', text: 'TX Errors' },
                    { key: 'tx_errs_rate', text: 'TX Error Rate' },
                    { key: 'tx_drop', text: 'TX Drop' },
                    { key: 'tx_drop_rate', text: 'TX Drop Rate' },
                    { key: 'tx_fifo', text: 'TX Fifo' },
                    { key: 'tx_fifo_rate', text: 'TX Fifo Rate' },
                    { key: 'tx_colls', text: 'TX Collisions' },
                    { key: 'tx_colls_rate', text: 'TX Collision Rate' },
                    { key: 'tx_carrier', text: 'TX Carrier' },
                    { key: 'tx_carrier_rate', text: 'TX Carrier Rate' },
                    { key: 'tx_compressed', text: 'TX Compressed' },
                    { key: 'tx_compressed_rate', text: 'TX Compressed Rate' }
                ]
            }
        ]
    },

    create: function (report) {
        var me = this,
            // a array with a single table or multiple tables joined
            tables = report.get('tables') || [report.get('table')],
            children = [], // root children to be set on the store
            renames, // any renamed columns
            idx; // where to insert a non-leaf child

        if (report.getRendering()) {
            renames = report.getRendering().get('columnRenames');
        }

        Ext.Array.each(tables, function (table) {
            Ext.Array.each(me.table[table], function (child) {
                // set different name for the keys if defined so in report rendering
                if (renames) {
                    if (renames[child.key]) {
                        child.text = '<strong>' + renames[child.key] + '</strong>';
                    }
                }

                // first level child without other children

                if (!child.children) {
                    child.leaf = true;
                    children.push(child);
                    return;
                }

                // first level child with children

                Ext.Array.each(child.children, function (c) {
                    c.leaf = true;
                    // set different name for the leaf key if defined
                    if (renames) {
                        if (renames[c.key]) {
                            c.text = '<strong>' + renames[c.key] + '</strong>';
                        }
                    }
                });

                // if child has children insert it above firts level leafs
                idx = Ext.Array.indexOf(children,
                    Ext.Array.findBy(children, function (c) {
                        return !c.children;
                    })
                );
                if (idx >= 1) {
                    Ext.Array.insert(children, idx, [child]);
                } else {
                    children.push(child);
                }
            });
        });


        return Ext.create('Ext.data.TreeStore', {
            rootVisible: false,
            root: {
                expanded: true,
                children: children
            }
        });
    }
});
