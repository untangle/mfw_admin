Ext.define('Mfw.settings.firewall.FilterRules', {
    extend: 'Mfw.cmp.grid.Table',
    // extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-firewall-filter-rules',
    title: 'Filter Rules'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/filter-rules',
            update: Util.api + '/settings/firewall/tables/filter-rules'
        }
    },

    // plugins: {
    //     // this is the plugin which enables generic grids data editing
    //     grideditable: true
    // },

    // variableHeights: true,

    columns: [{
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        width: 50,
        align: 'right',
        // hidden: true,
        renderer: function (v) {
            return ( v === 0 ) ? 'new' : '#' + v;
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
                    disabled: '{!selectedChain.editable}'
                }
            }
        }
    }, {
        text: 'Description',
        dataIndex: 'description',
        minWidth: 400
    }, {
        text: 'Conditions'.t(),
        dataIndex: 'conditions()',
        flex: 1,
        cell: {
            userCls: 'ctip',
            bodyStyle: {
                // padding: 0
                padding: '0 16px 0 0'
            },
            encodeHtml: false
        },
        renderer: function (conditions, record) {
            var strArr = [], op;

            record.conditions().each(function (c) {
                if (c.get('op') === "IS") {
                    op = ' &nbsp;<i class="x-fa fa-hand-o-right" style="font-weight: normal;"></i>&nbsp; '
                } else {
                    op = ' &nbsp;<i class="x-fa fa-hand-stop-o" style="color: red; font-weight: normal;"></i>&nbsp; '
                }
                strArr.push('<div class="condition"><span class="eee">' + Ext.getStore('ruleconditions').findRecord('type', c.get('type')).get('name') + '</span>' +
                       op + '<strong>' + c.get('value') + '</strong></div>');
            });
            if (strArr.length > 0) {
                return strArr.join('');
            } else {
                return '<span style="color: #999; font-style: italic; font-size: 11px; padding: 0 10px;">No Conditions!</span>'
            }
        }
    }, {
        text: 'Action'.t(),
        dataIndex: 'action',
        width: 150,
        renderer: function (action, record) {
            if (record.getAction()) {
                return record.getAction().get('type');
            }
            return 'No Action...'
        }
    }],


})
