Ext.define('Mfw.settings.Conditions', {
    alternateClassName: 'Conditions',
    singleton: true,

    list: [
    // APPLICATION
    {

        type:'APPLICATION_NAME_INFERRED',
        category: 'Application',
        text: 'Application Name (Inferred)'.t(),
        description: 'Application Name (Inferred) description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'combobox',
            placeholder: 'Select or type a value ...',
            editable: true,
            typeAhead: true,
            anyMatch: true,
            store: 'applicationNames',
            queryMode: 'local',
            valueField: 'value',
            displayField: 'text'
        }
    }, {
        type:'APPLICATION_NAME',
        category: 'Application',
        text: 'Application Name (Matched)'.t(),
        description: 'Application name samples:<br/><em>"Google"</em>, <em>"Facebook"</em>, <em>"DNS"</em>, <em>"SSL"</em> ...',
        disableOnFirstPacket: true,
        operators: ['==', '!='],
        field: {
            xtype: 'combobox',
            placeholder: 'Select or type a value ...',
            editable: true,
            typeAhead: true,
            anyMatch: true,
            store: 'applicationNames',
            queryMode: 'local',
            valueField: 'value',
            displayField: 'text'
        }
    }, {
        type:'APPLICATION_CATEGORY_INFERRED',
        category: 'Application',
        text: 'Application Category (Inferred)'.t(),
        description: 'Application Category (Inferred) description ...',
        operators: ['==', '!=']
    }, {
        type:'APPLICATION_CATEGORY',
        category: 'Application',
        text: 'Application Category (Matched)'.t(),
        description: 'Application category samples:<br/><em>"Messaging"</em>, <em>"Networking"</em>, <em>"Web Services"</em> ...',
        disableOnFirstPacket: true,
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            placeholder: 'Select or type a value ...',
            editable: true,
            options: [
                { text: 'Collaboration', value: 'Collaboration' },
                { text: 'Database', value: 'Database' },
                { text: 'File Transfer', value: 'File Transfer' },
                { text: 'Games', value: 'Games' },
                { text: 'Mail', value: 'Mail' },
                { text: 'Messaging', value: 'Messaging' },
                { text: 'Network Monitoring', value: 'Network Monitoring' },
                { text: 'Networking', value: 'Networking' },
                { text: 'Proxy', value: 'Proxy' },
                { text: 'Remote Access', value: 'Remote Access' },
                { text: 'Social Networking', value: 'Social Networking' },
                { text: 'Streaming Media', value: 'Streaming Media' },
                { text: 'VPN and Tunneling', value: 'VPN and Tunneling' },
                { text: 'Web Services', value: 'Web Services' }
            ]
        }
    }, {
        type:'APPLICATION_DETAIL',
        category: 'Application',
        text: 'Application Detail'.t(),
        description: 'Application Detail description ...',
        operators: ['==', '!='],
        disableOnFirstPacket: true
    }, {
        type:'APPLICATION_ID_INFERRED',
        category: 'Application',
        text: 'Application ID (Inferred)'.t(),
        description: 'Application ID (Inferred) description ...',
        operators: ['==', '!=']
    }, {
        type:'APPLICATION_ID',
        category: 'Application',
        text: 'Application ID (Matched)'.t(),
        description: 'Application ID description ...',
        operators: ['==', '!='],
        disableOnFirstPacket: true
    }, {
        type:'APPLICATION_PROTOCHAIN_INFERRED',
        category: 'Application',
        text: 'Application Protochain (Inferred)'.t(),
        description: 'Application Protochain (Inferred) description ...',
        operators: ['==', '!=']
    }, {
        type:'APPLICATION_ID_INFERRED',
        category: 'Application',
        text: 'Application Protochain (Matched)'.t(),
        description: 'Application Protochain description ...',
        operators: ['==', '!='],
        disableOnFirstPacket: true
    },  {
        type:'APPLICATION_CONFIDENCE_INFERRED',
        category: 'Application',
        text: 'Application Confidence (Inferred)'.t(),
        description: 'Application Confidence (Inferred) description ...',
        operators: ['==', '!=', '>', '>=', '<', '<=']
    },  {
        type:'APPLICATION_CONFIDENCE',
        category: 'Application',
        text: 'Application Confidence (Matched)'.t(),
        description: 'Application Confidence (Matched) description ...',
        operators: ['==', '!=', '>', '>=', '<', '<='],
        disableOnFirstPacket: true,
    },  {
        type:'APPLICATION_PRODUCTIVITY_INFERRED',
        category: 'Application',
        text: 'Application Productivity (Inferred)'.t(),
        description: 'Application Productivity (Inferred) description ...',
        operators: ['==', '!=']
    },  {
        type:'APPLICATION_PRODUCTIVITY',
        category: 'Application',
        text: 'Application Productivity (Matched)'.t(),
        description: 'Application Productivity (Matched) description ...',
        operators: ['==', '!='],
        disableOnFirstPacket: true,
    }, {
        type:'APPLICATION_RISK_INFERRED',
        category: 'Application',
        text: 'Application Risk (Inferred)'.t(),
        description: 'Application Risk (Inferred) description ...',
        operators: ['==', '!=']
    }, {
        type:'APPLICATION_RISK',
        category: 'Application',
        text: 'Application Risk (Matched)'.t(),
        description: 'Application Risk (Matched) description ...',
        operators: ['==', '!='],
        disableOnFirstPacket: true,
    },

    // SOURCE
    {
        type:'SOURCE_ADDRESS',
        category: 'Source',
        text: 'Source Address'.t(),
        description: 'Source Address description ...',
        field: {
            xtype: 'textfield',
            validators: 'ipv4expression'
        }
    }, {
        type:'SOURCE_ADDRESS_V6',
        category: 'Source',
        text: 'Source Address IPv6'.t(),
        description: 'Source Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6expression'
        }
    }, {
        type:'SOURCE_ADDRESS_TYPE',
        category: 'Source',
        text: 'Source Address Type'.t(),
        description: 'Source Address Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            autoSelect: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.addressTypes
        }
    }, {
        type:'SOURCE_PORT',
        category: 'Source',
        text: 'Source Port'.t(),
        description: 'Source Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'portexpression'
        }
    }, {
        type:'SOURCE_INTERFACE_NAME',
        category: 'Source',
        text: 'Source Interface Name'.t(),
        description: 'Source Interface Name description ...',
        operators: ['==', '!=']
    }, {
        type:'SOURCE_INTERFACE_ZONE',
        category: 'Source',
        text: 'Source Interface Zone'.t(),
        description: 'Source Interface Zone description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            multiSelect: true,
            editable: false,
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{text} <span style="color: #999">[ {value} ]</span>'
            }
        }
    }, {
        type:'SOURCE_INTERFACE_TYPE',
        category: 'Source',
        text: 'Source Interface Type'.t(),
        description: 'Source Interface Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            autoSelect: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.interfaceTypes
        }
    },

    // DESTINATION
    {
        type:'DESTINATION_ADDRESS',
        category: 'Destination',
        text: 'Destination Address'.t(),
        description: 'Destination Address description ...',
        field: {
            xtype: 'textfield',
            validators: 'ipv4expression'
        }
    }, {
        type:'DESTINATION_ADDRESS_V6',
        category: 'Destination',
        text: 'Destination Address IPv6'.t(),
        description: 'Destination Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6expression'
        }
    }, {
        type:'DESTINATION_ADDRESS_TYPE',
        category: 'Destination',
        text: 'Destination Address Type'.t(),
        description: 'Destination Address Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            autoSelect: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.addressTypes
        }
    }, {
        type:'DESTINATION_PORT',
        category: 'Destination',
        text: 'Destination Port'.t(),
        description: 'Destination Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'portexpression'
        }
    }, {
        type:'DESTINATION_INTERFACE_NAME',
        category: 'Destination',
        text: 'Destination Interface Name'.t(),
        description: 'Destination Interface Name description ...',
        operators: ['==', '!=']
    }, {
        type:'DESTINATION_INTERFACE_ZONE',
        category: 'Destination',
        text: 'Destination Interface Zone'.t(),
        description: 'Destination Interface Zone description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            multiSelect: true,
            editable: false,
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{text} <span style="color: #999">[ {value} ]</span>'
            }
        }
    }, {
        type:'DESTINATION_INTERFACE_TYPE',
        category: 'Destination',
        text: 'Destination Interface Type'.t(),
        description: 'Destination Interface Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            autoSelect: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.interfaceTypes
        }
    },

    // CLIENT
    {
        type:'CLIENT_ADDRESS',
        category: 'Client',
        text: 'Client Address'.t(),
        description: 'Client Address description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv4expression'
        }
    }, {
        type:'CLIENT_ADDRESS_V6',
        category: 'Client',
        text: 'Client Address IPv6'.t(),
        description: 'Client Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6expression'
        }
    }, {
        type:'CLIENT_PORT',
        category: 'Client',
        text: 'Client Port'.t(),
        description: 'Client Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'portexpression'
        }
    }, {
        type:'CLIENT_HOSTNAME',
        category: 'Client',
        text: 'Client Hostname'.t(),
        description: 'Client Hostname description ...',
        operators: ['==', '!=']
    }, {
        type:'CLIENT_USERNAME',
        category: 'Client',
        text: 'Client Username'.t(),
        description: 'Client Username description ...',
        operators: ['==', '!=']
    }, {
        type:'CLIENT_INTERFACE_ZONE',
        category: 'Client',
        text: 'Client Interface Zone'.t(),
        description: 'Client Interface Zone description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            multiSelect: true,
            editable: false,
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{text} <span style="color: #999">[ {value} ]</span>'
            }
        }
    }, {
        type:'CLIENT_INTERFACE_TYPE',
        category: 'Client',
        text: 'Client Interface Type'.t(),
        description: 'Client Interface Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            autoSelect: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.interfaceTypes
        }
    }, {
        type:'CLIENT_REVERSE_DNS',
        category: 'Client',
        text: 'Client Reverse DNS'.t(),
        description: 'Client Reverse DNS description ...',
        operators: ['==', '!=']
    }, {
        type:'CLIENT_DNS_HINT',
        category: 'Client',
        text: 'Client DNS Hint'.t(),
        description: 'Client DNS Hint description ...',
        operators: ['==', '!=']
    },

    // SERVER
    {
        type:'SERVER_ADDRESS',
        category: 'Server',
        text: 'Server Address'.t(),
        description: 'Server Address description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv4expression'
        }
    }, {
        type:'SERVER_ADDRESS_V6',
        category: 'Server',
        text: 'Server Address IPv6'.t(),
        description: 'Server Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6expression'
        }
    }, {
        type:'SERVER_PORT',
        category: 'Server',
        text: 'Server Port'.t(),
        description: 'Server Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'portexpression'
        }
    }, {
        type:'SERVER_HOSTNAME',
        category: 'Server',
        text: 'Server Hostname'.t(),
        description: 'Server Hostname description ...',
        operators: ['==', '!=']
    }, {
        type:'SERVER_USERNAME',
        category: 'Server',
        text: 'Server Username'.t(),
        description: 'Server Username description ...',
        operators: ['==', '!=']
    }, {
        type:'SERVER_INTERFACE_ZONE',
        category: 'Server',
        text: 'Server Interface Zone'.t(),
        description: 'Server Interface Zone description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            multiSelect: true,
            editable: false,
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{text} <span style="color: #999">[ {value} ]</span>'
            }
        }
    }, {
        type:'SERVER_INTERFACE_TYPE',
        category: 'Server',
        text: 'Server Interface Type'.t(),
        description: 'Server Interface Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            autoSelect: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.interfaceTypes
        }
    }, {
        type:'SERVER_REVERSE_DNS',
        category: 'Server',
        text: 'Server Reverse DNS'.t(),
        description: 'Server Reverse DNS description ...',
        operators: ['==', '!=']
    }, {
        type:'SERVER_DNS_HINT',
        category: 'Server',
        text: 'Server DNS Hint'.t(),
        description: 'Server DNS Hint description ...',
        operators: ['==', '!=']
    },

    // LOCAL
    {
        type:'LOCAL_ADDRESS',
        category: 'Local',
        text: 'Local Address'.t(),
        description: 'Local Address description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv4expression'
        }
    }, {
        type:'LOCAL_ADDRESS_V6',
        category: 'Local',
        text: 'Local Address IPv6'.t(),
        description: 'Local Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6expression'
        }
    }, {
        type:'LOCAL_PORT',
        category: 'Local',
        text: 'Local Port'.t(),
        description: 'Local Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'portexpression'
        }
    }, {
        type:'LOCAL_HOSTNAME',
        category: 'Local',
        text: 'Local Hostname'.t(),
        description: 'Local Hostname description ...',
        operators: ['==', '!=']
    }, {
        type:'LOCAL_USERNAME',
        category: 'Local',
        text: 'Local Username'.t(),
        description: 'Local Username description ...',
        operators: ['==', '!=']
    },

    // REMOTE
    {
        type:'REMOTE_ADDRESS',
        category: 'Remote',
        text: 'Remote Address'.t(),
        description: 'Remote Address description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv4expression'
        }
    }, {
        type:'REMOTE_ADDRESS_V6',
        category: 'Remote',
        text: 'Remote Address IPv6'.t(),
        description: 'Remote Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6expression'
        }
    }, {
        type:'REMOTE_PORT',
        category: 'Remote',
        text: 'Remote Port'.t(),
        description: 'Remote Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'portexpression'
        }
    }, {
        type:'REMOTE_HOSTNAME',
        category: 'Remote',
        text: 'Remote Hostname'.t(),
        description: 'Remote Hostname description ...',
        operators: ['==', '!=']
    }, {
        type:'REMOTE_USERNAME',
        category: 'Remote',
        text: 'Remote Username'.t(),
        description: 'Remote Username description ...',
        operators: ['==', '!=']
    },

    // CERTIFICATE ISSUER
    {
        type:'CERT_ISSUER_CN',
        category: 'Certificate Issuer',
        text: 'Common Name'.t(),
        description: 'Common Name description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_SN',
        category: 'Certificate Issuer',
        text: 'Serial Number'.t(),
        description: 'Serial Number description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_C',
        category: 'Certificate Issuer',
        text: 'Country'.t(),
        description: 'Country description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_O',
        category: 'Certificate Issuer',
        text: 'Organization'.t(),
        description: 'Organication description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_OU',
        category: 'Certificate Issuer',
        text: 'Organizational Unit'.t(),
        description: 'Organizational Unit description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_L',
        category: 'Certificate Issuer',
        text: 'Locality'.t(),
        description: 'Locality description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_P',
        category: 'Certificate Issuer',
        text: 'Province'.t(),
        description: 'Province description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_SA',
        category: 'Certificate Issuer',
        text: 'Street Address'.t(),
        description: 'Street Address description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_ISSUER_PC',
        category: 'Certificate Issuer',
        text: 'Postal Code'.t(),
        description: 'Postal Code description ...',
        operators: ['==', '!=']
    },

    // CERTIFICATE SUBJECT
    {
        type:'CERT_SUBJECT_CN',
        category: 'Certificate Subject',
        text: 'Common Name'.t(),
        description: 'Common Name description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_SN',
        category: 'Certificate Subject',
        text: 'Serial Number'.t(),
        description: 'Serial Number description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_C',
        category: 'Certificate Subject',
        text: 'Country'.t(),
        description: 'Country description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_O',
        category: 'Certificate Subject',
        text: 'Organization'.t(),
        description: 'Organication description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_OU',
        category: 'Certificate Subject',
        text: 'Organizational Unit'.t(),
        description: 'Organizational Unit description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_L',
        category: 'Certificate Subject',
        text: 'Locality'.t(),
        description: 'Locality description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_P',
        category: 'Certificate Subject',
        text: 'Province'.t(),
        description: 'Province description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_SA',
        category: 'Certificate Subject',
        text: 'Street Address'.t(),
        description: 'Street Address description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_PC',
        category: 'Certificate Subject',
        text: 'Postal Code'.t(),
        description: 'Postal Code description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_SAN',
        category: 'Certificate Subject',
        text: 'Subject Alternative Name'.t(),
        description: 'Subject Alternative Name description ...',
        operators: ['==', '!=']
    }, {
        type:'CERT_SUBJECT_DNS',
        category: 'Certificate Subject',
        text: 'All DNS Names'.t(),
        description: 'All DNS Names description ...',
        operators: ['==', '!=']
    },

    // OTHERS
    {
        type:'IP_PROTOCOL',
        category: 'Others',
        text: 'IP Protocol'.t(),
        description: 'IP Protocol description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            multiSelect: false,
            editable: false,
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.protocols,
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{text} <span style="color: #999">[ {value} ]</span>'
            }
        }
    }, {
        type: 'CT_STATE',
        category: 'Others',
        text: 'Connection State',
        description: 'Connection State description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            editable: false,
            autoSelect: true,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Map.options.connStates
        }
    }, {
        type:'LIMIT_RATE',
        category: 'Others',
        text: 'Limit Rate'.t(),
        description: 'Limit Rate description ...',
        operators: ['<', '>'],
        field: {
            xtype: 'numberfield',
        },
        extraFields: [{
            xtype: 'selectfield',
            name: 'rate_unit',
            label: 'Rate Unit',
            labelAlign: 'top',
            placeholder: 'Choose rate unit ...',
            autoSelect: true,
            editable: false,
            required: true,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            errorTarget: 'under',
            options: Map.options.rateUnits
        }, {
            xtype: 'selectfield',
            name: 'group_selector',
            label: 'Group Selector',
            labelAlign: 'top',
            autoSelect: true,
            placeholder: 'Choose group ...',
            forceSelection: true,
            editable: false,
            // required: true,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            errorTarget: 'under',
            options: Map.options.groupSelectors
        }]
    }],

    constructor: function() {
        Ext.Array.each(this.list, function (condition) {
            if (condition.field) {
                Ext.apply(condition.field, {
                    clearable: false,
                    autoComplete: false,
                    required: true
                });
            }
        });

        this.initConfig({
            map: Ext.Array.toValueMap(this.list, 'type')
        });
    }
});
