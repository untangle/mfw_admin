Ext.define('Mfw.settings.firewall.PortForwardRules', {
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-firewall-portforwardrules',

    title: 'Port Forward Rules'.t(),
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

    config: {
        editor: 'sheet-editor'
    },

    sortable: false,

    scrollable: true,
    store: 'pfr',

    // plugins: ['rowexpander'],

    // itemConfig: {
    //     body: {
    //         tpl: new Ext.XTemplate('<tpl if="conditions.length &gt; 0"><tpl for="conditions">' +
    //                 '<span style="font-size: 12px; padding: 0 10px 0 0;"><strong>{[this.condName(values.conditionType)]}</strong> <span style="padding: 0 2px;"><tpl if="invert">IS NOT<tpl else>IS</tpl></span> <strong>{value}</strong></span><br/>' +
    //              '</tpl><tpl else>none</tpl>', {
    //              condName: function (conditionType) {
    //                  var r = Ext.getStore('ruleconditions').findRecord('value', conditionType);
    //                  return r.get('name');
    //              }
    //              })
    //     }
    // },

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
        text: 'Enabled',
        align: 'center',
        width: 55,
        dataIndex: 'enabled',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'togglefield',
                margin: '0 10',
                disabled: true,
                bind: {
                    disabled: '{record._deleteSchedule}'
                }
            }
        },
        editable: true,
        editor: {
            xtype: 'togglefield',
            // boxLabel: 'Enabled'.t()
        }
    }, {
        text: 'Description',
        dataIndex: 'description',
        minWidth: 300,
        editable: true
        // flex: 1
    }, {
        text: 'Conditions'.t(),
        dataIndex: 'conditions',
        flex: 1,
        cell: {
            userCls: 'ctip',
            bodyStyle: {
                padding: 0
            },
            encodeHtml: false
        },
        renderer: function (conditions, meta) {
            var strArr = [];
            Ext.Array.each(conditions, function (c) {
                strArr.push('<div class="condition"><strong>' + Ext.getStore('ruleconditions').findRecord('value', c.conditionType).get('name') + '</strong>' +
                       (c.invert ? ' &ne; ' : ' = ') + '<strong>' + c.value + '</strong></div>');
            });
            // console.log(value);
            return strArr.join(' <i class="x-fa fa-circle" style="font-size: 8px; color: #999; line-height: 12px;"></i> ');
        },
        editable: true,
        editor: 'collection'
    }, {
        text: 'New Destination'.t(),
        dataIndex: 'newDestination',
        width: 150,
        editable: true
    }, {
        text: 'New Port'.t(),
        dataIndex: 'newPort',
        width: 100,
        editable: true
    }],

    // listeners: {
    //     added: function (view) {
    //         console.log(view);
    //         view.tip = Ext.create('Ext.tip.ToolTip', {
    //             // The overall target element.
    //             target: view.getId(),
    //             showDelay: 0,
    //             hideDelay: 0,
    //             align: 'tl-bl',
    //             anchor: true,
    //             anchorToTarget: true,
    //             // Each grid row's name cell causes its own separate show and hide.
    //             delegate: '.ctip',
    //             // Moving within the cell should not hide the tip.
    //             trackMouse: false,
    //             listeners: {
    //                 // Change content dynamically depending on which element triggered the show.
    //                 beforeshow: function updateTipBody(tip, e) {
    //                     console.log(tip.currentTarget.dom);
    //                     // Fetch grid view here, to avoid creating a closure.
    //                     // var tipGridView = tip.target.component;
    //                     // var record = tipGridView.getRecord(tip.triggerElement);

    //                     tip.setHtml('aaaaa doklsfjdksfj sdfk kdjs fkdsjfkdsjfdks j');
    //                 }
    //             }
    //         });
    //     }
    // }
});
