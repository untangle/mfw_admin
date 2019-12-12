Ext.define('Mfw.monitor.view.Sessions', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.monitor-sessions',
    viewModel: {},
    reference: 'list',

    store: {
        model: 'Mfw.model.MonitorSession',
        // groupField: 'application_name',
        sorters: [{
            property: 'byte_rate',
            direction: 'DESC'
        }]
    },

    plugins: {
        gridfilters: true
    },

    selectable: {
        mode: 'single'
    },

    masked: {xtype: 'loadmask'},
    loadingText: '',

    columns: [{
        text: 'Session ID',
        dataIndex: 'session_id',
        width: 130,
        hidden: true
    }, {
        text: 'Conntrack ID',
        dataIndex: 'conntrack_id',
        width: 130,
        hidden: true
    }, {
        text: 'Application Name (Inferred)',
        dataIndex: 'application_name_inferred',
        width: 150,
        hidden: true
    }, {
        text: 'Application Name (Matched)',
        dataIndex: 'application_name',
        minWidth: 150
    }, {
        text: 'Application Category (Inferred)',
        dataIndex: 'application_category_inferred',
        minWidth: 200,
        flex: 1,
        hidden: true
    }, {
        text: 'Application Category (Matched)',
        dataIndex: 'application_category',
        width: 150
    }, {
        text: 'Application ID (Inferred)',
        dataIndex: 'application_id_inferred',
        width: 150,
        hidden: true
    }, {
        text: 'Application ID (Matched)',
        dataIndex: 'application_id',
        width: 150,
        hidden: true
    }, {
        text: 'Application Protochain (Inferred)',
        dataIndex: 'application_protochain_inferred',
        minWidth: 200,
        flex: 1,
        hidden: true
    }, {
        text: 'Application Protochain (Matched)',
        dataIndex: 'application_protochain',
        minWidth: 200,
        flex: 1
    }, {
        text: 'Application Confidence (Inferred)',
        dataIndex: 'application_confidence_inferred',
        width: 100,
        align: 'right',
        hidden: true
    },  {
        text: 'Application Confidence (Matched)',
        dataIndex: 'application_confidence',
        width: 100,
        align: 'right',
        hidden: true
    }, {
        text: 'Application Detail (Matched)',
        dataIndex: 'application_detail',
        width: 150,
        hidden: true
    }, {
        text: 'Application Productivity (Inferred)',
        dataIndex: 'application_productivity_inferred',
        minWidth: 200,
        flex: 1,
        hidden: true
    }, {
        text: 'Application Productivity (Matched)',
        dataIndex: 'application_productivity',
        minWidth: 200,
        flex: 1,
        hidden: true
    }, {
        text: 'Application Risk (Inferred)',
        dataIndex: 'application_risk_inferred',
        minWidth: 200,
        flex: 1,
        hidden: true
    }, {
        text: 'Application Risk (Matched)',
        dataIndex: 'application_risk',
        minWidth: 200,
        flex: 1,
        hidden: true
    }, {
        text: 'Bypass',
        dataIndex: 'bypass_packetd',
        width: 80,
        align: 'center',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.boolean
    }, {
        text: 'Bytes',
        dataIndex: 'bytes',
        width: 100,
        align: 'right',
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRenderer
    }, {
        text: 'Client Bytes',
        dataIndex: 'client_bytes',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRenderer
    }, {
        text: 'Server Bytes',
        dataIndex: 'server_bytes',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRenderer
    }, {
        text: 'Byte Rate',
        dataIndex: 'byte_rate',
        width: 100,
        align: 'right',
        cell: { encodeHtml: false },
        renderer: Renderer.bytesSecRenderer
    }, {
        text: 'Client Byte Rate',
        dataIndex: 'client_byte_rate',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.bytesSecRenderer
    }, {
        text: 'Server Byte Rate',
        dataIndex: 'server_byte_rate',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.bytesSecRenderer
    }, {
        text: 'Packets',
        dataIndex: 'packets',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.packetsRenderer
    }, {
        text: 'Client Packets',
        dataIndex: 'client_packets',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.packetsRenderer
    }, {
        text: 'Server Packets',
        dataIndex: 'server_packets',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.packetsRenderer
    }, {
        text: 'Packet Rate',
        dataIndex: 'packet_rate',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.packetsSecRenderer
    }, {
        text: 'Client Packet Rate',
        dataIndex: 'client_packet_rate',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.packetsSecRenderer
    }, {
        text: 'Server Packet Rate',
        dataIndex: 'server_packet_rate',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.packetsSecRenderer
    }, {
        text: 'Family',
        dataIndex: 'family',
        width: 100,
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.familyRenderer
    }, {
        text: 'IP Protocol',
        dataIndex: 'ip_protocol',
        width: 100,
        cell: { encodeHtml: false },
        renderer: Renderer.ipProtocol
    }, {
        text: 'Mark',
        dataIndex: 'mark',
        width: 100,
        hidden: true,
        renderer: Renderer.hex
    }, {
        text: 'Priority',
        dataIndex: 'priority',
        width: 100,
        align: 'right',
        hidden: true
    }, {
        text: 'TCP State',
        dataIndex: 'tcp_state',
        width: 100,
        align: 'right',
        cell: { encodeHtml: false },
        renderer: Renderer.tcpStateRenderer,
        hidden: true
    }, {
        text: 'Age',
        dataIndex: 'age_milliseconds',
        width: 100,
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.timeRangeMilliseconds
    }, {
        text: 'Timeout',
        dataIndex: 'timeout_seconds',
        width: 100,
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.timeRangeSeconds
    }, {
        text: 'Local Address',
        dataIndex: 'local_address',
        width: 130,
        hidden: true
    }, {
        text: 'Remote Address',
        dataIndex: 'remote_address',
        width: 130,
        hidden: true
    }, {
        text: 'Client Interface',
        dataIndex: 'client_interface_id',
        width: 100,
        cell: { encodeHtml: false },
        renderer: Renderer.interface
    }, {
        text: 'Client Interface Type',
        dataIndex: 'client_interface_type',
        width: 100,
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.interfaceType
    }, {
        text: 'Client Address',
        dataIndex: 'client_address',
        width: 130
    }, {
        text: 'Client Address New',
        dataIndex: 'client_address_new',
        width: 130,
        hidden: true
    }, {
        text: 'Client Country',
        dataIndex: 'client_country',
        cell: { encodeHtml: false },
        width: 150,
        hidden: true,
        renderer: Renderer.country
    }, {
        text: 'Client Port',
        dataIndex: 'client_port',
        align: 'right',
        width: 100,
        hidden: true
    }, {
        text: 'Client Port New',
        dataIndex: 'client_port_new',
        align: 'right',
        width: 100,
        hidden: true
    }, {
        text: 'Client Reverse DNS',
        dataIndex: 'client_reverse_dns',
        width: 200,
        hidden: true
    }, {
        text: 'Client DNS Hint',
        dataIndex: 'client_dns_hint',
        width: 200,
        hidden: true
    }, {
        text: 'Client Hops',
        dataIndex: 'client_hops',
        width: 100,
        align: 'right',
        hidden: true
    }, {
        text: 'Server Interface',
        dataIndex: 'server_interface_id',
        width: 100,
        cell: { encodeHtml: false },
        renderer: Renderer.interface
    }, {
        text: 'Server Interface Type',
        dataIndex: 'server_interface_type',
        width: 100,
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.interfaceType
    }, {
        text: 'Server Address',
        dataIndex: 'server_address',
        width: 130
    }, {
        text: 'Server Address New',
        dataIndex: 'server_address_new',
        width: 130,
        hidden: true
    }, {
        text: 'Server Country',
        dataIndex: 'server_country',
        cell: { encodeHtml: false },
        width: 150,
        hidden: true,
        renderer: Renderer.country
    }, {
        text: 'Server Port',
        dataIndex: 'server_port',
        align: 'right',
        width: 100,
        hidden: true
    }, {
        text: 'Server Port New',
        dataIndex: 'server_port_new',
        align: 'right',
        width: 100,
        hidden: true
    }, {
        text: 'Server Reverse DNS',
        dataIndex: 'server_reverse_dns',
        width: 200,
        hidden: true
    }, {
        text: 'Server DNS Hint',
        dataIndex: 'server_dns_hint',
        width: 200,
        hidden: true
    }, {
        text: 'Server Hops',
        dataIndex: 'server_hops',
        width: 100,
        align: 'right',
        hidden: true
    }, {
        text: 'Cert. Issuer C',
        dataIndex: 'certificate_issuer_c',
        width: 130,
        align: 'right',
        hidden: true
    }, {
        text: 'Cert. Issuer CN',
        dataIndex: 'certificate_issuer_cn',
        width: 130,
        hidden: true
    }, {
        text: 'Cert. Issuer O',
        dataIndex: 'certificate_issuer_o',
        width: 130,
        hidden: true
    }, {
        text: 'Cert. Subject C',
        dataIndex: 'certificate_subject_c',
        width: 130,
        align: 'right',
        hidden: true
    }, {
        text: 'Cert. Subject CN',
        dataIndex: 'certificate_subject_cn',
        width: 130,
        hidden: true
    }, {
        text: 'Cert. Subject L',
        dataIndex: 'certificate_subject_l',
        width: 130,
        hidden: true
    }, {
        text: 'Cert. Subject O',
        dataIndex: 'certificate_subject_o',
        width: 130,
        hidden: true
    }, {
        text: 'Cert. Subject P',
        dataIndex: 'certificate_subject_p',
        width: 130,
        hidden: true
    }, {
        text: 'Cert. Subject SAN',
        dataIndex: 'certificate_subject_san',
        width: 130,
        hidden: true
    }, {
        text: 'SSL SNI',
        dataIndex: 'ssl_sni',
        width: 130,
        hidden: true
    }, {
        text: 'WAN Rule Chain',
        dataIndex: 'wan_rule_chain',
        width: 130,
        hidden: true
    }, {
        text: 'WAN Rule ID',
        dataIndex: 'wan_rule_id',
        width: 130,
        hidden: true
    }, {
        text: 'WAN Policy ID',
        dataIndex: 'wan_policy_id',
        width: 130,
        hidden: true
    }, {
        text: 'WAN Policy',
        dataIndex: 'wan_policy',
        width: 135,
        hidden: true
    }],

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            xtype: 'component',
            html: 'Sessions',
            bind: {
                html: 'Sessions ({count})'
            }
        }, '->', {
            xtype: 'checkbox',
            itemId: 'autoRefresh',
            boxLabel: 'Auto Refresh (5 sec)',
            margin: '0 16 0 0',
            listeners: {
                change: 'setAutoRefresh'
            }
        }, {
            text: 'Refresh',
            ui: 'action',
            handler: 'load'
        }]
    }, {
        xtype: 'panel',
        docked: 'right',
        width: 450,
        minWidth: 300,
        maxWidth: 500,
        resizable: {
            split: true,
            edges: 'west'
        },
        layout: 'fit',
        items: [{
            xtype: 'session-details',
            monitor: true
        }]
    }],

    listeners: {
        activate: 'onActivate',
        // deactivate: 'onDeactivate'
    },

    controller: {
        load: function () {
            var me = this,
                grid = me.getView(),
                arCk = me.getView().down('#autoRefresh'),
                vm = me.getViewModel();

            if (me.tout) { clearTimeout(me.tout); }

            grid.mask();
            grid.getStore().load(function () {
                grid.getSelectable().select(grid.getStore().first());
                vm.set('count', grid.getStore().count());

                if (arCk.isChecked()) {
                    me.tout = setTimeout(function () {
                        me.load();
                    }, 5000);
                }
            });
        },

        setAutoRefresh: function (ck, checked) {
            var me = this;
            if (checked) {
                me.load();
            } else {
                if (me.tout) {
                    clearTimeout(me.tout);
                }
            }
        },

        onActivate: function () {
            this.load();
        },

        onDeactivate: function (grid) {
            grid.getStore().loadData([]);
            grid.down('monitor-session-details').collapseAll();
            if (this.tout) {
                clearTimeout(this.tout);
            }
        }
    }
});
