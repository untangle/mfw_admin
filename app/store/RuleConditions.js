Ext.define('Mfw.store.RuleConditions', {
    extend: 'Ext.data.Store',
    storeId: 'ruleconditions',
    alias: 'store.ruleconditions',

    // fields: ['name', 'displayName', 'type'],
    data: [{
        type:'IP_PROTOCOL',
        name: 'IP Protocol'.t(),
        operations: ['eq', 'ne'],
        field: {
            xtype: 'combobox',
            forceSelection: true,
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            value: 'TCP', // a default value
            store: Util.protocols
        }
    }, {
        type:'CLIENT_ADDRESS',
        name: 'Client Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SERVER_ADDRESS',
        name: 'Server Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'CLIENT_PORT',
        name: 'Client Port'.t(),
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'SERVER_PORT',
        name: 'Server Port'.t(),
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'CLIENT_INTERFACE_ZONE',
        name: 'Client Interface Zone'.t(),
        operations: ['eq', 'ne']
    }, {
        type:'SERVER_INTERFACE_ZONE',
        name: 'Server Interface Zone'.t(),
        operations: ['eq', 'ne']
    }, {
        type:'SOURCE_ADDRESS',
        name: 'Source Address'.t()
    }, {
        type:'DESTINATION_ADDRESS',
        name: 'Destination Address'.t()
    }, {
        type:'SOURCE_PORT',
        name: 'Source Port'.t()
    }, {
        type:'DESTINATION_PORT',
        name: 'Destination Port'.t()
    }, {
        type:'SOURCE_INTERFACE_ZONE',
        name: 'Source Interface Zone'.t(),
        operations: ['eq', 'ne']
    }, {
        type:'DESTINATION_INTERFACE_ZONE',
        name: 'Destination Interface Zone'.t(),
        operations: ['eq', 'ne']
    }, {
        type:'SOURCE_INTERFACE_NAME',
        name: 'Source Interface Name'.t(),
        operations: ['eq', 'ne']
    }, {
        type:'DESTINATION_INTERFACE_NAME',
        name: 'Destination Interface Name'.t(),
        operations: ['eq', 'ne']
    }, {
        type: 'CT_STATE',
        name: 'What is CT State?',
        operations: ['eq', 'ne'],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            // queryMode: 'local',
            // displayField: 'name',
            // valueField: 'name',
            value: 'TCP', // a default value
            options: [
                { text: 'Established', value: 'established' },
                { text: 'Related', value: 'related' },
                { text: 'Invalid', value: 'invalid' }
            ]
        }
    }
        // { value:'DST_ADDR', name: 'Destination Address'.t(), editorType: 'textfield', vtype:'ipall', visible: true },
        // { value:'DST_PORT', name: 'Destination Port'.t(), editorType: 'textfield', vtype:'port', visible: true },
        // { value:'DST_INTF', name: 'Destination Interface'.t(), editorType: 'checkboxgroup', /*values: Util.getInterfaceList(true, false),*/ visible: true},
        // { value:'SRC_ADDR', name: 'Source Address'.t(), editorType: 'textfield', visible: true, vtype:'ipall'},
        // { value:'SRC_PORT', name: 'Source Port'.t(), editorType: 'textfield', vtype:'portMatcher'},
        // { value:'SRC_INTF', name: 'Source Interface'.t(), editorType: 'checkboxgroup', /*values: Util.getInterfaceList(true, false),*/ visible: true},
        // { value:'PROTOCOL', name: 'Protocol'.t(), editorType: 'checkboxgroup', values: [['TCP','TCP'],['UDP','UDP'],['any','any']], visible: true},
        // { value:'USERNAME', name: 'Username'.t(), editorType: 'userselection', /*editor: Ext.create('Ung.UserEditorWindow',{}),*/ visible: true},
        // { value:'TAGGED', name: 'Tagged'.t(), editorType: 'textfield', visible: true},
        // { value:'HOST_HOSTNAME', name: 'Host Hostname'.t(), editorType: 'textfield', visible: true},
        // { value:'CLIENT_HOSTNAME', name: 'Client Hostname'.t(), editorType: 'textfield', visible: false},
        // { value:'SERVER_HOSTNAME', name: 'Server Hostname'.t(), editorType: 'textfield', visible: false},
        // { value:'HOST_MAC',  name: 'Host MAC Address'.t(), editorType: 'textfield', visible: true },
        // { value:'SRC_MAC',  name: 'Client MAC Address'.t(), editorType: 'textfield', visible: true },
        // { value:'DST_MAC',  name: 'Server MAC Address'.t(), editorType: 'textfield', visible: true },
        // { value:'HOST_MAC_VENDOR', name: 'Host MAC Vendor'.t(), editorType: 'textfield', visible: true},
        // { value:'CLIENT_MAC_VENDOR', name: 'Client MAC Vendor'.t(), editorType: 'textfield', visible: false},
        // { value:'SERVER_MAC_VENDOR', name: 'Server MAC Vendor'.t(), editorType: 'textfield', visible: false},
        // { value:'HOST_IN_PENALTY_BOX', name: 'Host in Penalty Box'.t(), editorType: 'boolean', visible: false},
        // { value:'CLIENT_IN_PENALTY_BOX', name: 'Client in Penalty Box'.t(), editorType: 'boolean', visible: false},
        // { value:'SERVER_IN_PENALTY_BOX', name: 'Server in Penalty Box'.t(), editorType: 'boolean', visible: false},
        // { value:'HOST_HAS_NO_QUOTA', name: 'Host has no Quota'.t(), editorType: 'boolean', visible: true},
        // { value:'USER_HAS_NO_QUOTA', name: 'User has no Quota'.t(), editorType: 'boolean', visible: true},
        // { value:'CLIENT_HAS_NO_QUOTA', name: 'Client has no Quota'.t(), editorType: 'boolean', visible: false},
        // { value:'SERVER_HAS_NO_QUOTA', name: 'Server has no Quota'.t(), editorType: 'boolean', visible: false},
        // { value:'HOST_QUOTA_EXCEEDED', name: 'Host has exceeded Quota'.t(), editorType: 'boolean', visible: true},
        // { value:'USER_QUOTA_EXCEEDED', name: 'User has exceeded Quota'.t(), editorType: 'boolean', visible: true},
        // { value:'CLIENT_QUOTA_EXCEEDED', name: 'Client has exceeded Quota'.t(), editorType: 'boolean', visible: false},
        // { value:'SERVER_QUOTA_EXCEEDED', name: 'Server has exceeded Quota'.t(), editorType: 'boolean', visible: false},
        // { value:'HOST_QUOTA_ATTAINMENT', name: 'Host Quota Attainment'.t(), editorType: 'textfield', visible: true},
        // { value:'USER_QUOTA_ATTAINMENT', name: 'User Quota Attainment'.t(), editorType: 'textfield', visible: true},
        // { value:'CLIENT_QUOTA_ATTAINMENT', name: 'Client Quota Attainment'.t(), editorType: 'textfield', visible: false},
        // { value:'SERVER_QUOTA_ATTAINMENT', name: 'Server Quota Attainment'.t(), editorType: 'textfield', visible: false},
        // { value:'HTTP_HOST', name: 'HTTP: Hostname'.t(), editorType: 'textfield', visible: true},
        // { value:'HTTP_REFERER', name: 'HTTP: Referer'.t(), editorType: 'textfield', visible: true},
        // { value:'HTTP_URI', name: 'HTTP: URI'.t(), editorType: 'textfield', visible: true},
        // { value:'HTTP_URL', name: 'HTTP: URL'.t(), editorType: 'textfield', visible: true},
        // { value:'HTTP_CONTENT_TYPE', name: 'HTTP: Content Type'.t(), editorType: 'textfield', visible: true},
        // { value:'HTTP_CONTENT_LENGTH', name: 'HTTP: Content Length'.t(), editorType: 'textfield', visible: true},
        // { value:"HTTP_REQUEST_METHOD", name: 'HTTP: Request Method'.t(), type: 'textfield', visible: true},
    ]


});
