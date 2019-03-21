Ext.define('Mfw.Table', {
    alternateClassName: 'Table',
    singleton: true,

    sessions: {
        columns: [{
            text: 'Session ID',
            dataIndex: 'session_id',
            hidden: true,
            width: 150
        }, {
            text: 'Time Stamp',
            dataIndex: 'time_stamp',
            renderer: Renderer.timeStamp,
            width: 180,
            cell: { encodeHtml: false }
        }, {
            text: 'End Time',
            dataIndex: 'end_time',
            hidden: true
        }, {
            text: 'Family',
            dataIndex: 'family',
            hidden: true
        }, {
            text: 'IP Protocol',
            dataIndex: 'ip_protocol',
            width: 150,
            renderer: Renderer.ipProtocol,
            cell: { encodeHtml: false }
        }, {
            text: 'Host Name',
            dataIndex: 'hostname',
            hidden: true
        }, {
            text: 'User Name',
            dataIndex: 'username',
            hidden: true
        }, {
            text: 'Client Interface',
            dataIndex: 'client_interface_id',
            renderer: Renderer.interface,
            cell: { encodeHtml: false }
        }, {
            text: 'Server Interface',
            dataIndex: 'server_interface_id',
            renderer: Renderer.interface,
            cell: { encodeHtml: false }
        }, {
            text: 'Client Interface Type',
            dataIndex: 'client_interface_type',
            cell: { encodeHtml: false },
            renderer: Renderer.interfaceType
        }, {
            text: 'Server Interface Type',
            dataIndex: 'server_interface_type',
            cell: { encodeHtml: false },
            renderer: Renderer.interfaceType
        }, {
            text: 'Local Address',
            dataIndex: 'local_address',
            width: 120
        }, {
            text: 'Remote Address',
            dataIndex: 'remote_address',
            width: 120
        }, {
            text: 'Client Address',
            dataIndex: 'client_address',
            width: 120
        }, {
            text: 'Server Address',
            dataIndex: 'server_address',
            width: 120
        }, {
            text: 'Client Port',
            dataIndex: 'client_port',
            width: 100
        }, {
            text: 'Server Port',
            dataIndex: 'server_port',
            width: 100
        }, {
            text: 'New Client Address',
            dataIndex: 'client_address_new',
            width: 120
        }, {
            text: 'New Server Address',
            dataIndex: 'server_address_new',
            width: 120
        }, {
            text: 'New Client Port',
            dataIndex: 'client_port_new',
            width: 100
        }, {
            text: 'New Server Port',
            dataIndex: 'server_port_new',
            width: 100
        }, {
            text: 'Client Country',
            dataIndex: 'client_country'
        }, {
            text: 'Client Latitude',
            dataIndex: 'client_latitude'
        }, {
            text: 'Client Longitude',
            dataIndex: 'client_longitude'
        }, {
            text: 'Server Country',
            dataIndex: 'server_country'
        }, {
            text: 'Server Latitude',
            dataIndex: 'server_latitude'
        }, {
            text: 'Server Longitude',
            dataIndex: 'server_longitude'
        }, {
            text: 'Application ID',
            dataIndex: 'application_id'
        }, {
            text: 'Application Name',
            dataIndex: 'application_name',
            width: 160,
            renderer: function (name) {
                return name || 'Unknown';
            }
        }, {
            text: 'Application Protochain',
            dataIndex: 'application_protochain'
        }, {
            text: 'Application Category',
            dataIndex: 'application_category'
        }, {
            text: 'Application Blocked',
            dataIndex: 'application_blocked'
        }, {
            text: 'Application Flagged',
            dataIndex: 'application_flagged'
        }, {
            text: 'Application Confidence',
            dataIndex: 'application_confidence'
        }, {
            text: 'Application Detail',
            dataIndex: 'application_detail'
        }, {
            text: 'Certificate Subject CN',
            dataIndex: 'certificate_subject_cn'
        }, {
            text: 'Certificate Subject O',
            dataIndex: 'certificate_subject_o'
        }, {
            text: 'SNL SNI',
            dataIndex: 'ssl_sni'
        }, {
            text: 'Client DNS Hint',
            dataIndex: 'client_dns_hint'
        }, {
            text: 'Server DNS Hint',
            dataIndex: 'server_dns_hint'
        }],
    },

    session_stats: {
        columns: [{
            text: 'Session Id',
            dataIndex: 'session_id'
        }, {
            text: 'Time Stamp',
            dataIndex: 'time_stamp'
        }, {
            text: 'Bytes',
            dataIndex: 'bytes'
        }, {
            text: 'Client Bytes',
            dataIndex: 'client_bytes'
        }, {
            text: 'Server Bytes',
            dataIndex: 'server_bytes'
        }, {
            text: 'Byte Rate',
            dataIndex: 'byte_rate'
        }, {
            text: 'Client Byte Rate',
            dataIndex: 'client_byte_rate'
        }, {
            text: 'Server Byte Rate',
            dataIndex: 'server_byte_rate'
        }, {
            text: 'Packets',
            dataIndex: 'packets'
        }, {
            text: 'Client Packets',
            dataIndex: 'client_packets'
        }, {
            text: 'Server Packets',
            dataIndex: 'server_packets'
        }, {
            text: 'Packet Rate',
            dataIndex: 'packet_rate'
        }, {
            text: 'Client Packet Rate',
            dataIndex: 'client_packet_rate'
        }, {
            text: 'Server Packet Rate',
            dataIndex: 'server_packet_rate'
        }]
    },

    interface_stats: {
        columns: [
            { text: 'Time Stamp', dataIndex: 'time_stamp' },
            { text: 'Interface Id', dataIndex: 'interface_id' },
            { text: 'Device Name', dataIndex: 'device_name' },
            { text: 'Latency 1', dataIndex: 'latency_1' },
            { text: 'Latency 5', dataIndex: 'latency_5' },
            { text: 'Latency 15', dataIndex: 'latency_15' },
            { text: 'Latency Variance', dataIndex: 'latency_variance' },
            { text: 'Passive Latency 1', dataIndex: 'passive_latency_1' },
            { text: 'Passive Latency 5', dataIndex: 'passive_latency_5' },
            { text: 'Passive Latency 15', dataIndex: 'passive_latency_15' },
            { text: 'Passive Latency Variance', dataIndex: 'passive_latency_variance' },
            { text: 'Active Latency 1', dataIndex: 'active_latency_1' },
            { text: 'Active Latency 5', dataIndex: 'active_latency_5' },
            { text: 'Active Latency 15', dataIndex: 'active_latency_15' },
            { text: 'Active Latency Variance', dataIndex: 'active_latency_variance' },
            { text: 'Ping Timeout', dataIndex: 'ping_timeout' },
            { text: 'Ping Timeout Rate', dataIndex: 'ping_timeout_rate' },
            { text: 'RX Bytes', dataIndex: 'rx_bytes' },
            { text: 'RX Bytes Rate', dataIndex: 'rx_bytes_rate' },
            { text: 'RX Packets', dataIndex: 'rx_packets' },
            { text: 'RX Packets Rate', dataIndex: 'rx_packets_rate' },
            { text: 'RX Errors', dataIndex: 'rx_errs' },
            { text: 'RX Errors Rate', dataIndex: 'rx_errs_rate' },
            { text: 'RX Drop', dataIndex: 'rx_drop' },
            { text: 'RX Drop Rate', dataIndex: 'rx_drop_rate' },
            { text: 'RX Fifo', dataIndex: 'rx_fifo' },
            { text: 'RX Fifo Rate', dataIndex: 'rx_fifo_rate' },
            { text: 'RX Frame', dataIndex: 'rx_frame' },
            { text: 'RX Frame Rate', dataIndex: 'rx_frame_rate' },
            { text: 'RX Compressed', dataIndex: 'rx_compressed' },
            { text: 'RX Compressed Rate', dataIndex: 'rx_compressed_rate' },
            { text: 'RX Multicast', dataIndex: 'rx_multicast' },
            { text: 'RX Multicast Rate', dataIndex: 'rx_multicast_rate' },
            { text: 'TX Bytes', dataIndex: 'tx_bytes' },
            { text: 'TX Bytes Rate', dataIndex: 'tx_bytes_rate' },
            { text: 'TX Packets', dataIndex: 'tx_packets' },
            { text: 'TX Packets Rate', dataIndex: 'tx_packets_rate' },
            { text: 'TX Errors', dataIndex: 'tx_errs' },
            { text: 'TX Errors Rate', dataIndex: 'tx_errs_rate' },
            { text: 'TX Drop', dataIndex: 'tx_drop' },
            { text: 'TX Drop Rate', dataIndex: 'tx_drop_rate' },
            { text: 'TX Fifo', dataIndex: 'tx_fifo' },
            { text: 'TX Fifo Rate', dataIndex: 'tx_fifo_rate' },
            { text: 'TX Colls', dataIndex: 'tx_colls' },
            { text: 'TX Colls Rate', dataIndex: 'tx_colls_rate' },
            { text: 'TX Carrier', dataIndex: 'tx_carrier' },
            { text: 'TX Carrier Rate', dataIndex: 'tx_carrier_rate' },
            { text: 'TX Compressed', dataIndex: 'tx_compressed' },
            { text: 'TX Compressed Rate', dataIndex: 'tx_compressed_rate' }
        ]
    },


    createColumnField: function (columnName) {
        var field = null;
        switch(columnName) {
            case 'ip_protocol':
                field = {
                    xtype: 'selectfield',
                    placeholder: 'Choose protocol ...'.t(),
                    editable: false,
                    displayTpl: '{text} [ {value} ]',
                    itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                    options: Globals.protocols
                }; break;
            case 'client_interface_id':
            case 'server_interface_id':
                field = {
                    xtype: 'selectfield',
                    placeholder: 'Choose interface ...'.t(),
                    editable: false,
                    valueField: 'interfaceId',
                    displayTpl: '{name} [ {interfaceId} ]',
                    itemTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>',
                    options: Globals.interfaces
                }; break;
            case 'client_interface_type':
            case 'server_interface_type':
                field = {
                    xtype: 'selectfield',
                    placeholder: 'Choose type ...'.t(),
                    editable: false,
                    displayTpl: '{text} [ {value} ]',
                    itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                    options: [
                        { text: 'WAN', value: 1 },
                        { text: 'LAN', value: 2 },
                        { text: 'unused', value: 3 },
                        { text: 'unset', value: 0 }
                    ]
                }; break;
            case 'client_country':
            case 'server_country':
                field = {
                    xtype: 'selectfield',
                    placeholder: 'Choose country ...'.t(),
                    editable: false,
                    displayTpl: '{text} [ {value} ]',
                    itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                    options: Globals.countries
                }; break;
            case 'local_address':
            case 'remote_address':
            case 'client_address':
            case 'server_address':
            case 'client_address_new':
            case 'server_address_new':
                field = {
                    xtype: 'textfield',
                    placeholder: 'Enter address ...'.t(),
                    validators: ['ipaddress']
                }; break;
            case 'client_port':
            case 'server_port':
                field = {
                    xtype: 'numberfield',
                    decimals: 0,
                    placeholder: 'Enter port ...'.t()
                    // validators: [{
                    //     type: 'format',
                    //     matcher: new RegExp('^[1-9]\d*$')
                    // }]
                }; break;
            case 'application_blocked':
            case 'application_flagged':
            field = {
                xtype: 'togglefield',
                boxLabel: 'Yes',
                bodyAlign: 'start'
            }; break;

            default: break;
        }
        if (field) {
            Ext.apply(field, {
                columnName: columnName,
                name: 'value',
                label: 'Value'.t(),
                labelAlign: 'top',
                flex: 1,
                clearable: false,
                autoComplete: false
            });
        }
        return field;
    },

    constructor: function() {
        var allColumns = [];

        Ext.Array.each(this.sessions.columns, function (column) {
            allColumns.push({
                text: column.text,
                value: column.dataIndex
            });
        });

        this.initConfig({
            allColumns: allColumns,
            allColumnsMap: Ext.Array.toValueMap(allColumns, 'value')
        });
    }


});
