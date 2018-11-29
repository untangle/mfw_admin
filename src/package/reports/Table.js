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
            renderer: Renderer.ip_protocol
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
        this.initConfig({
            // operatorsMap: Ext.Array.toValueMap(this.operators, 'id'),
            // prefixesMap: Ext.Array.toValueMap(this.prefixes, 'value')
            // columns: columns
        });
    }


});
