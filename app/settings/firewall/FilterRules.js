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

    plugins: {
        // this is the plugin which enables generic grids data editing
        grideditable: true
    },

    columns: [{
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        width: 50,
        align: 'right',
        // hidden: true,
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
                    disabled: '{!selectedChain.editable}'
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
        minWidth: 400,
        editable: true
        // flex: 1
    }, {
        text: 'Conditions'.t(),
        dataIndex: 'conditions()',
        flex: 1,
        cell: {
            userCls: 'ctip',
            bodyStyle: {
                padding: 0
            },
            encodeHtml: false
        },
        renderer: function (conditions, record) {
            var strArr = [];
            record.conditions().each(function (c) {
                strArr.push('<div class="condition"><span>' + Ext.getStore('ruleconditions').findRecord('type', c.get('type')).get('name') + '</span>' +
                       (c.get('op') === "IS" ? ' = ' : ' &ne; ') + '<strong>' + c.get('value') + '</strong></div>');
            });
            if (strArr.length > 0) {
                return strArr.join(' <i class="x-fa fa-circle fa-small" style="font-size: 10px; color: #999; line-height: 12px;"></i> ');
            } else {
                return '<span style="color: #999; font-style: italic; font-size: 11px; padding: 0 10px;">No Conditions!</span>'
            }
        },
        // editable: true,
        // editor: 'collection'
    }],


})
