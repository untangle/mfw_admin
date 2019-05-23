Ext.define('Mfw.settings.Conditions', {
    alternateClassName: 'Conditions',
    singleton: true,

    list: [{
        type:'LIMIT_RATE',
        text: 'Limit Rate'.t(),
        operators: ['<', '>'],
        field: {
            xtype: 'numberfield',
        },
        unitField: {
            xtype: 'selectfield',
            temId: 'unitField',
            name: 'rate_unit',
            label: 'Rate Unit',
            labelAlign: 'top',
            placeholder: 'Choose rate unit ...',
            forceSelection: true,
            editable: false,
            // width: 220,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Util.limitRateUnits
        }
    }, {
        type:'IP_PROTOCOL',
        text: 'IP Protocol'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Globals.protocols
        }
    }, {
        type:'SOURCE_INTERFACE_NAME',
        category: 'Source',
        text: 'Source Interface Name'.t(),
        operators: ['==', '!=']
    }, {
        type:'DESTINATION_INTERFACE_NAME',
        category: 'Destination',
        text: 'Destination Interface Name'.t(),
        operators: ['==', '!=']
    }, {
        type:'SOURCE_ADDRESS',
        category: 'Source',
        text: 'Source Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SOURCE_ADDRESS_V6',
        category: 'Source',
        text: 'Source Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'DESTINATION_ADDRESS',
        category: 'Destination',
        text: 'Destination Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'DESTINATION_ADDRESS_V6',
        category: 'Destination',
        text: 'Destination Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SOURCE_ADDRESS_TYPE',
        category: 'Source',
        text: 'Source Address Type'.t(),
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
        type:'DESTINATION_ADDRESS_TYPE',
        category: 'Destination',
        text: 'Destination Address Type'.t(),
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
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
        }
    }, {
        type:'DESTINATION_PORT',
        category: 'Destination',
        text: 'Destination Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'SOURCE_INTERFACE_ZONE',
        category: 'Source',
        text: 'Source Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'DESTINATION_INTERFACE_ZONE',
        category: 'Destination',
        text: 'Destination Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'CLIENT_INTERFACE_ZONE',
        category: 'Client',
        text: 'Client Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'SERVER_INTERFACE_ZONE',
        category: 'Server',
        text: 'Server Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'CLIENT_PORT',
        category: 'Client',
        text: 'Client Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'SERVER_PORT',
        category: 'Server',
        text: 'Server Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'LOCAL_PORT',
        category: 'Local',
        text: 'Local Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'REMOTE_PORT',
        category: 'Remote',
        text: 'Remote Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'CLIENT_ADDRESS',
        category: 'Client',
        text: 'Client Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'CLIENT_ADDRESS_V6',
        category: 'Client',
        text: 'Client Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SERVER_ADDRESS',
        category: 'Server',
        text: 'Server Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SERVER_ADDRESS_V6',
        category: 'Server',
        text: 'Server Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'LOCAL_ADDRESS',
        category: 'Local',
        text: 'Local Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'LOCAL_ADDRESS_V6',
        category: 'Local',
        text: 'Local Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'REMOTE_ADDRESS',
        category: 'Remote',
        text: 'Remote Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'REMOTE_ADDRESS_V6',
        category: 'Remote',
        text: 'Remote Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'CLIENT_HOSTNAME',
        category: 'Client',
        text: 'Client Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'SERVER_HOSTNAME',
        category: 'Server',
        text: 'Server Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'LOCAL_HOSTNAME',
        category: 'Local',
        text: 'Local Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'REMOTE_HOSTNAME',
        category: 'Remote',
        text: 'Remote Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'CLIENT_USERNAME',
        category: 'Client',
        text: 'Client Username'.t(),
        operators: ['==', '!=']
    }, {
        type:'SERVER_USERNAME',
        category: 'Server',
        text: 'Server Username'.t(),
        operators: ['==', '!=']
    }, {
        type:'LOCAL_USERNAME',
        category: 'Local',
        text: 'Local Username'.t(),
        operators: ['==', '!=']
    }, {
        type:'REMOTE_USERNAME',
        category: 'Remote',
        text: 'Remote Username'.t(),
        operators: ['==', '!=']
    }, {
        type: 'CT_STATE',
        text: 'Connection State',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: Util.connectionStates
        }
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
