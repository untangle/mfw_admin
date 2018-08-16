Ext.define('Mfw.settings.firewall.PortForwardRules', {
    extend: 'Mfw.cmp.MasterGrid',
    alias: 'widget.mfw-settings-firewall-portforwardrules',

    viewTitle: 'Port Forward Rules'.t(),

    scrollable: true,
    store: {
        data: [
            {
                ruleId: 1,
                enabled: true,
                description: 'Some desc',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    value: '1.2.3.4'
                }, {
                    conditionType: 'PORT',
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
            {
                ruleId: 2,
                enabled: true,
                description: 'Some desc 2',
                conditions: [],
                newDestination: '1.2.3.5',
                newPort: 90
            },
            {
                ruleId: 3,
                enabled: true,
                description: 'Some desc 3',
                conditions: [],
                newDestination: '1.2.3.8',
                newPort: 90
            },
            {
                ruleId: 4,
                enabled: false,
                description: 'Some desc 4',
                conditions: [],
                newDestination: '123.456.789.12',
                newPort: 100
            }
        ]
    },

    plugins: ['rowexpander'],

    itemConfig: {
        body: {
            tpl: '<tpl if="conditions.length &gt; 0"><p><tpl for="conditions">' +
                    '<span>{conditionType} => {value}</span>, ' +
                 '</tpl></p></tpl>'
        }
    },



    columns: [{
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        width: 40
    }, {
        text: 'Description',
        dataIndex: 'description',
        minWidth: 200
        // flex: 1
    },
    // {
    //     text: 'Conditions'.t(),
    //     dataIndex: 'conditions'
    // },
    {
        text: 'New Destination'.t(),
        dataIndex: 'newDestination',
        width: 150
    }, {
        text: 'New Port'.t(),
        dataIndex: 'newPort',
        width: 100
    }, {
        xtype: 'checkcolumn',
        text: 'Enabled'.t(),
        dataIndex: 'enabled',
        width: 100
    }]
});
