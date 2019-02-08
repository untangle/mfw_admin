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
            cell: {
                encodeHtml: false
            }
        }, {
            text: 'End Time',
            dataIndex: 'end_time',
            hidden: true
        }, {
            text: 'IP Protocol',
            dataIndex: 'ip_protocol',
            width: 150,
            renderer: Renderer.ipProtocol,
            cell: { encodeHtml: false },
            editor: {
                xtype: 'selectfield',
                name: 'value',
                // label: 'Choose operator'.t(),
                placeholder: 'Choose protocol'.t(),
                required: true,
                editable: false,
                displayTpl: '{text} [ {value} ]',
                itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                options: Globals.protocols
            }
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
            text: 'C2S bytes',
            dataIndex: 'c2s_bytes'
        }, {
            text: 'S2C bytes',
            dataIndex: 's2c_bytes'
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
