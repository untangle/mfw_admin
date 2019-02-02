Ext.define('Mfw.monitor.view.Sessions', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.monitor-sessions',
    viewModel: {},
    reference: 'list',

    store: {
        model: 'Mfw.model.MonitorSession',
        // groupField: 'application_name',
        sorters: [{
            property: 'bytes',
            direction: 'DESC'
        }]
    },

    selectable: {
        mode: 'single'
    },

    columns: [{
        text: 'Session ID',
        dataIndex: 'session_id',
        width: 130,
        hidden: true
    }, {
        text: 'Application Name',
        dataIndex: 'application_name',
        minWidth: 150
    }, {
        text: 'Application Id',
        dataIndex: 'application_id',
        width: 150,
        hidden: true
    }, {
        text: 'Application Category',
        dataIndex: 'application_category',
        width: 150
    }, {
        text: 'Application Detail',
        dataIndex: 'application_detail',
        width: 150,
        hidden: true
    }, {
        text: 'Application Confidence',
        dataIndex: 'application_confidence',
        width: 100,
        align: 'right',
        hidden: true
    }, {
        text: 'Application Protochain',
        dataIndex: 'application_protochain',
        width: 150,
        flex: 1
    }, {
        text: 'Connection State',
        dataIndex: 'connection_state',
        width: 130
    }, {
        text: 'Bypass',
        dataIndex: 'bypass_packetd',
        width: 80,
        align: 'center',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.boolean
    }, {
        text: 'Assured',
        dataIndex: 'assured_flag',
        width: 80,
        align: 'center',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.boolean
    }, {
        text: 'Timeout',
        dataIndex: 'timeout_seconds',
        width: 100,
        align: 'right',
        hidden: true,
        renderer: Renderer.timeout_seconds
    }, {
        text: 'Bytes',
        dataIndex: 'bytes',
        width: 100,
        align: 'right',
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRenderer
    }, {
        text: 'Rate',
        dataIndex: 'bytes_per_sec_total_1min',
        width: 100,
        align: 'right',
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRendererSec
    }, {
        text: 'Client Rate',
        dataIndex: 'bytes_per_sec_c2s_1min',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRendererSec
    }, {
        text: 'Server Rate',
        dataIndex: 'bytes_per_sec_s2c_1min',
        width: 100,
        align: 'right',
        hidden: true,
        cell: { encodeHtml: false },
        renderer: Renderer.bytesRendererSec
    }, {
        text: 'IP Protocol',
        dataIndex: 'ip_protocol',
        width: 100,
        cell: { encodeHtml: false },
        renderer: Renderer.ip_protocol
    }, {
        text: 'Mark',
        dataIndex: 'mark',
        width: 100,
        hidden: true
    }, {
        text: 'Priority',
        dataIndex: 'priority',
        width: 100,
        align: 'right',
        hidden: true
    }, {
        text: 'Local Address',
        dataIndex: 'local_address',
        width: 130
    }, {
        text: 'Remote Address',
        dataIndex: 'remote_address',
        width: 130
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
        hidden: true
    }, {
        text: 'Client Address',
        dataIndex: 'client_address',
        width: 130,
        hidden: true
    }, {
        text: 'Client Address New',
        dataIndex: 'client_address_new',
        width: 130,
        hidden: true
    }, {
        text: 'Client Country',
        dataIndex: 'client_country',
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
        text: 'Server Interface',
        dataIndex: 'server_interface_id',
        width: 100,
        cell: { encodeHtml: false },
        renderer: Renderer.interface
    }, {
        text: 'Server Interface Type',
        dataIndex: 'server_interface_type',
        width: 100,
        hidden: true
    }, {
        text: 'Server Address',
        dataIndex: 'server_address',
        width: 130,
        hidden: true
    }, {
        text: 'Server Address New',
        dataIndex: 'server_address_new',
        width: 130,
        hidden: true
    }, {
        text: 'Server Country',
        dataIndex: 'server_country',
        width: 100,
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
            text: 'Reload',
            ui: 'action',
            handler: 'reload'
        }]
    }, {
        xtype: 'monitor-session-details',
        docked: 'right',
        width: 450
        // hidden: true,
        // bind: {
        //     hidden: '{!list.selection}'
        // }
    }],

    listeners: {
        activate: 'onActivate',
        deactivate: 'onDeactivate'
    },

    controller: {
        init: function (grid) {
            var vm = grid.getViewModel();
            grid.getStore().on('load', function (store) {
                grid.getSelectable().select(store.first());
                vm.set('count', store.count());
            });
        },


        onActivate: function (grid) {
            grid.getStore().load();
        },

        onDeactivate: function (grid) {
            grid.getStore().loadData([]);
        },

        reload: function () {
            this.getView().getStore().reload();
        }
    }

});
