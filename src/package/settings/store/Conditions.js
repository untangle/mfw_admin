Ext.define('Mfw.settings.Conditions', {
    alternateClassName: 'Conditions',
    singleton: true,

    list: [
    // SOURCE
    {
        type:'SOURCE_ADDRESS',
        category: 'Source',
        text: 'Source Address'.t(),
        description: 'Source Address description ...',
        field: {
            xtype: 'textfield',
            validators: 'ipv4'
        }
    }, {
        type:'SOURCE_ADDRESS_V6',
        category: 'Source',
        text: 'Source Address IPv6'.t(),
        description: 'Source Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6'
        }
    }, {
        type:'SOURCE_ADDRESS_TYPE',
        category: 'Source',
        text: 'Source Address Type'.t(),
        description: 'Source Address Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Util.addressTypes
        }
    }, {
        type:'SOURCE_PORT',
        category: 'Source',
        text: 'Source Port'.t(),
        description: 'Source Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'port'
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
            xtype: 'combobox',
            multiSelect: true,
            editable: false,
            itemTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>',
            valueField: 'interfaceId',
            queryMode: 'local',
            store: {
                type: 'interfaces',
                filters: [{
                    property: 'configType',
                    value: 'ADDRESSED'
                }]
            },
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>'
            }
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
            validators: 'ipv4'
        }
    }, {
        type:'DESTINATION_ADDRESS_V6',
        category: 'Destination',
        text: 'Destination Address IPv6'.t(),
        description: 'Destination Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6'
        }
    }, {
        type:'DESTINATION_ADDRESS_TYPE',
        category: 'Destination',
        text: 'Destination Address Type'.t(),
        description: 'Destination Address Type description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Util.addressTypes
        }
    }, {
        type:'DESTINATION_PORT',
        category: 'Destination',
        text: 'Destination Port'.t(),
        description: 'Destination Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'port'
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
            xtype: 'combobox',
            multiSelect: true,
            editable: false,
            itemTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>',
            valueField: 'interfaceId',
            queryMode: 'local',
            store: {
                type: 'interfaces',
                filters: [{
                    property: 'configType',
                    value: 'ADDRESSED'
                }]
            },
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>'
            }
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
            validators: 'ipv4'
        }
    }, {
        type:'CLIENT_ADDRESS_V6',
        category: 'Client',
        text: 'Client Address IPv6'.t(),
        description: 'Client Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6'
        }
    }, {
        type:'CLIENT_PORT',
        category: 'Client',
        text: 'Client Port'.t(),
        description: 'Client Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'port'
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
            xtype: 'combobox',
            multiSelect: true,
            editable: false,
            itemTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>',
            valueField: 'interfaceId',
            queryMode: 'local',
            store: {
                type: 'interfaces',
                filters: [{
                    property: 'configType',
                    value: 'ADDRESSED'
                }]
            },
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>'
            }
        }
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
            validators: 'ipv4'
        }
    }, {
        type:'SERVER_ADDRESS_V6',
        category: 'Server',
        text: 'Server Address IPv6'.t(),
        description: 'Server Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6'
        }
    }, {
        type:'SERVER_PORT',
        category: 'Server',
        text: 'Server Port'.t(),
        description: 'Server Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'port'
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
            xtype: 'combobox',
            multiSelect: true,
            editable: false,
            itemTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>',
            valueField: 'interfaceId',
            queryMode: 'local',
            store: {
                type: 'interfaces',
                filters: [{
                    property: 'configType',
                    value: 'ADDRESSED'
                }]
            },
            chipView: {
                style: 'background: transparent',
                selectable: false,
                displayTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>'
            }
        }
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
            validators: 'ipv4'
        }
    }, {
        type:'LOCAL_ADDRESS_V6',
        category: 'Local',
        text: 'Local Address IPv6'.t(),
        description: 'Local Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6'
        }
    }, {
        type:'LOCAL_PORT',
        category: 'Local',
        text: 'Local Port'.t(),
        description: 'Local Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'port'
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
            validators: 'ipv4'
        }
    }, {
        type:'REMOTE_ADDRESS_V6',
        category: 'Remote',
        text: 'Remote Address IPv6'.t(),
        description: 'Remote Address V6 description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'ipv6'
        }
    }, {
        type:'REMOTE_PORT',
        category: 'Remote',
        text: 'Remote Port'.t(),
        description: 'Remote Port description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: 'port'
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

    // OTHERS
    {
        type:'IP_PROTOCOL',
        category: 'Others',
        text: 'IP Protocol'.t(),
        description: 'IP Protocol description ...',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Globals.protocols
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
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Util.connectionStates
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
            temId: 'unitField',
            name: 'rate_unit',
            label: 'Rate Unit',
            labelAlign: 'top',
            placeholder: 'Choose rate unit ...',
            forceSelection: true,
            editable: false,
            required: true,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            errorTarget: 'under',
            options: Util.limitRateUnits
        }, {
            xtype: 'selectfield',
            temId: 'groupField',
            name: 'group_selector',
            label: 'Group Selector',
            labelAlign: 'top',
            placeholder: 'Choose group ...',
            forceSelection: true,
            editable: false,
            required: true,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            errorTarget: 'under',
            options: Util.groupSelectors
        }]
    }],

    constructor: function() {
        Ext.Array.each(this.list, function (condition) {
            if (condition.field) {
                Ext.apply(condition.field, {
                    clearable: false,
                    autoComplete: false,
                    placeholder: 'Set value ...'.t(),
                    required: true
                });
            }
        });

        this.initConfig({
            map: Ext.Array.toValueMap(this.list, 'type')
        });
    }
});
