Ext.define('Mfw.cmp.condition.ConditionsSheet', {
    extend: 'Ext.Sheet',
    alias: 'widget.fields-sheet',

    title: 'Conditions'.t(),
    height: '50%',
    closable: true,
    closeAction: 'hide',
    centered: true,
    cover: true,
    side: 'bottom',
    layout: 'fit',

    tools: [{
        xtype: 'button',
        ui: 'action',
        text: 'Add',
        iconCls: 'x-fa fa-plus',
        margin: '0 16 0 0',
        handler: 'addCondition'
        // type: 'plus'
    }],

    viewModel: {
        formulas: {
            data: function (get) {
                return get('currentView') === 'mfw-dashboard' ? get('dashboardConditions.fields') : get('reportsConditions.fields');
            }
        },
        stores: {
            conds: {
                data: '{data}'
            }
        }
    },

    items: [{
        xtype: 'grid',
        bind: '{conds}',
        emptyText: 'No conditions'.t(),
        // hideHeaders: true,
        selectable: false,
        columns: [{
            dataIndex: 'column',
            menuDisabled: true,
            sortable: false,
            resizable: false,
            cell: {
                encodeHtml: false,
            },
            flex: 1,
            renderer: function (value, record) {
                var fieldName = Ext.Array.findBy(Util.tmpColumns, function (item) { return item.field === value; } ).name;
                return '<strong>' + fieldName + ' ' + record.get('operator') + ' ' + record.get('value') + '</strong>';
            }
        }, {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            width: 44,
            cell: {
                align: 'center',
                tools: {
                    close: 'onSheetRemoveCondition'
                }
            }
        }],
        listeners: {
            childtap: 'onSheetEditCondition'
        }
    }],

    listeners: {
        show: 'onSheetShow',
    }
});
