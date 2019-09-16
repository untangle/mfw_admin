Ext.define('Mfw.model.Session', {
    extend: 'Ext.data.Model',
    alias: 'model.session',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'session_id', type: 'string' },
        { name: 'time_stamp', type: 'number' },

        { name: 'application_blocked', type: 'boolean', allowNull: true },
        { name: 'application_category', type: 'string' },
        { name: 'application_confidence', type: 'number', allowNull: true },
        { name: 'application_productivity', type: 'number', allowNull: true },
        { name: 'application_risk', type: 'number', allowNull: true },
        { name: 'application_detail', type: 'auto' },
        { name: 'application_flagged', type: 'boolean', allowNull: true },
        { name: 'application_id', type: 'string' },
        { name: 'application_name', type: 'string' },
        { name: 'application_protochain', type: 'string' },

        { name: 'application_id_inferred', type: 'string' },
        { name: 'application_name_inferred', type: 'string' },
        { name: 'application_confidence_inferred', type: 'number', allowNull: true },
        { name: 'application_protochain_inferred', type: 'string' },
        { name: 'application_productivity_inferred', type: 'number', allowNull: true  },
        { name: 'application_risk_inferred', type: 'number', allowNull: true  },
        { name: 'application_category_inferred', type: 'string' },

        { name: 'c2s_bytes', type: 'number', allowNull: true },

        { name: 'certificate_subject_cn', type: 'string' },
        { name: 'certificate_subject_o', type: 'string' },

        { name: 'client_address', type: 'string' },
        { name: 'client_address_new', type: 'string' },
        { name: 'client_country', type: 'string' },
        { name: 'client_dns_hint', type: 'string' },
        { name: 'client_interface_id', type: 'number', allowNull: true },
        { name: 'client_interface_type', type: 'number', allowNull: true },
        { name: 'client_latitude', type: 'number', allowNull: true },
        { name: 'client_longitude', type: 'number', allowNull: true },
        { name: 'client_port', type: 'number', allowNull: true },
        { name: 'client_port_new', type: 'number', allowNull: true },

        { name: 'end_time', type: 'number' },
        { name: 'hostname', type: 'string' },
        { name: 'ip_protocol', type: 'number', allowNull: true },
        { name: 'family', type: 'number', allowNull: true },

        { name: 'local_address', type: 'string' },
        { name: 'remote_address', type: 'string' },

        { name: 's2c_bytes', type: 'number', allowNull: true },

        { name: 'server_address', type: 'string' },
        { name: 'server_address_new', type: 'string' },
        { name: 'server_country', type: 'string' },
        { name: 'server_dns_hint', type: 'string' },
        { name: 'server_interface_id', type: 'number', allowNull: true },
        { name: 'server_interface_type', type: 'number', allowNull: true },
        { name: 'server_latitude', type: 'number', allowNull: true },
        { name: 'server_longitude', type: 'number', allowNull: true },
        { name: 'server_port', type: 'number', allowNull: true },
        { name: 'server_port_new', type: 'number', allowNull: true },

        { name: 'ssl_sni', type: 'auto', allowNull: true },
        { name: 'wan_rule_chain', type: 'auto', allowNull: true },
        { name: 'wan_rule_id', type: 'auto', allowNull: true },
        { name: 'wan_policy_id', type: 'auto', allowNull: true },
        { name: 'username', type: 'string', allowNull: true }
    ]
});
