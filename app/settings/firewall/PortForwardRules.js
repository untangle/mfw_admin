Ext.define('Mfw.settings.firewall.PortForwardRules', {
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-firewall-portforwardrules',

    // viewTitle: 'Port Forward Rules'.t(),

    // title: 'Port Forward Rules'.t() + '<br/><span style="font-size: 12px;">Firewall</span>',
    // items: [{
    //     xtype: 'toolbar',
    //     docked: 'top',
    //     items: [{
    //         xtype: 'component',
    //         style: 'color: #777; font-size: 18px; font-weight: normal;',
    //         html: 'Port Forward Rules'.t() + '<br/><span style="font-size: 12px;">Firewall</span>'
    //     }]
    //     // margin: '0 0 0 8',
    // }],

    scrollable: true,
    store: {
        data: [
            {
                ruleId: 1,
                enabled: true,
                description: 'Some desc',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
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
            },
            {
                ruleId: 5,
                enabled: true,
                description: 'Some desc',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
            {
                ruleId: 6,
                enabled: true,
                description: 'Some more text',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
            {
                ruleId: 7,
                enabled: false,
                description: 'Description Long Text',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
        ]
    },

    plugins: ['rowexpander'],

    itemConfig: {
        body: {
            tpl: new Ext.XTemplate('<tpl if="conditions.length &gt; 0"><tpl for="conditions">' +
                    '<span style="font-size: 12px; padding: 0 10px 0 0;"><strong>{[this.condName(values.conditionType)]}</strong> <span style="padding: 0 2px;"><tpl if="invert">IS NOT<tpl else>IS</tpl></span> <strong>{value}</strong></span><br/>' +
                 '</tpl><tpl else>none</tpl>', {
                 condName: function (conditionType) {
                     var r = Ext.getStore('ruleconditions').findRecord('value', conditionType);
                     return r.get('name');
                 }
                 })
        }
    },



    columns: [{
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        width: 50,
        align: 'right',
        hidden: true,
        renderer: function (v) {
            return '#' + v;
        }
    }, {
        text: 'Description',
        dataIndex: 'description',
        minWidth: 300
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
