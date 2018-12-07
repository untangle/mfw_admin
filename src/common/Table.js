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
            renderer: Renderer.time_stamp,
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
            renderer: Renderer.ip_protocol,
            cell: {
                encodeHtml: false
            },
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
            dataIndex: 'client_interface'
        }, {
            text: 'Server Interface',
            dataIndex: 'server_interface'
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
        }],
    },


    constructor: function() {
        var allColumns = [];

        Ext.Array.each(this.sessions.columns, function (column) {
            allColumns.push({
                text: column.text,
                value: column.dataIndex
            })
        });

        this.initConfig({
            allColumns: allColumns
            // operatorsMap: Ext.Array.toValueMap(this.operators, 'id'),
            // prefixesMap: Ext.Array.toValueMap(this.prefixes, 'value')
            // columns: columns
        });
    }


});
