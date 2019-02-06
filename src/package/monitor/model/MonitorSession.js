Ext.define('Mfw.model.MonitorSession', {
    extend: 'Ext.data.Model',
    alias: 'model.monitor_session',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'session_id', type: 'number', allowNull: true },
        { name: 'conntrack_id', type: 'number', allowNull: true },

        { name: 'ip_protocol', type: 'number', allowNull: true },
        { name: 'local_address', type: 'string', allowNull: true },
        { name: 'mark', type: 'number', allowNull: true },
        { name: 'priority', type: 'number', allowNull: true },
        { name: 'protocol', type: 'string', allowNull: true },
        { name: 'remote_address', type: 'string', allowNull: true },

        { name: 'application_category', type: 'string' },
        { name: 'application_confidence', type: 'number', allowNull: true },
        { name: 'application_detail', type: 'string' },
        { name: 'application_id', type: 'string' },
        { name: 'application_name', type: 'string' },
        { name: 'application_protochain', type: 'string' },

        { name: 'bypass_packetd', type: 'boolean', allowNull: true },

        { name: 'packets', type: 'number', allowNull: true },
        { name: 'bytes', type: 'number', allowNull: true },
        { name: 's2c_bytes', type: 'number', allowNull: true },
        { name: 'c2s_bytes', type: 'number', allowNull: true },
        { name: 'rate', type: 'number' },
        { name: 's2c_rate', type: 'number' },
        { name: 'c2s_rate', type: 'number' },

        { name: 'certificate_issuer_c', type: 'string' },
        { name: 'certificate_issuer_cn', type: 'string' },
        { name: 'certificate_issuer_o', type: 'string' },
        { name: 'certificate_subject_c', type: 'string' },
        { name: 'certificate_subject_cn', type: 'string' },
        { name: 'certificate_subject_l', type: 'string' },
        { name: 'certificate_subject_o', type: 'string' },
        { name: 'certificate_subject_p', type: 'string' },
        { name: 'certificate_subject_san', type: 'string' },

        { name: 'client_address', type: 'string', allowNull: true },
        { name: 'client_address_new', type: 'string', allowNull: true },
        { name: 'client_country', type: 'string', allowNull: true },
        { name: 'client_interface_id', type: 'number', allowNull: true },
        { name: 'client_interface_type', type: 'number', allowNull: true },
        { name: 'client_port', type: 'number', allowNull: true },
        { name: 'client_port_new', type: 'number', allowNull: true },
        { name: 'client_reverse_dns', type: 'string', allowNull: true },

        { name: 'server_address', type: 'string', allowNull: true },
        { name: 'server_address_new', type: 'string', allowNull: true },
        { name: 'server_country', type: 'string', allowNull: true },
        { name: 'server_interface_id', type: 'number', allowNull: true },
        { name: 'server_interface_type', type: 'number', allowNull: true },
        { name: 'server_port', type: 'number', allowNull: true },
        { name: 'server_port_new', type: 'number', allowNull: true },
        { name: 'server_reverse_dns', type: 'string', allowNull: true },

        { name: 'ssl_sni', type: 'string', allowNull: true }

        // { name: 'connection_state', type: 'string', allowNull: true },
        // { name: 'assured_flag', type: 'boolean', allowNull: true },
        // { name: 'timeout_seconds', type: 'number', allowNull: true }
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/api/status/sessions',
        },
        reader: {
            type: 'json'
        }
        // writer: {
        //     type: 'json',
        //     writeAllFields: true,
        //     allowSingle: false, // wrap single record in array
        //     allDataOptions: {
        //         associated: true,
        //         persist: true
        //     },
        //     transform: {
        //         fn: Util.sanitize,
        //         scope: this
        //     }
        // }
    }


});
