Ext.define('Mfw.common.conditions.Sheet', {
    extend: 'Ext.Sheet',
    alias: 'widget.fields-sheet',

    // title: 'Conditions'.t(),
    width: 350,
    // closable: true,
    // closeAction: 'hide',
    // centered: true,
    cover: true,
    side: 'left',

    layout: {
        type: 'card',
        deferRender: false, // important so the validation works if card not yet visible
        animation: {
            duration: 150,
            type: 'slide',
            direction: 'horizontal'
        },
    },

    config: {
        useGrid: false
    },

    viewModel: {},

    items: [{
        xtype: 'grid',
        userCls: 'c-noheaders',
        title: 'Conditions'.t(),
        // bind: '{conds}',
        bind: {
            store: {
                data: '{route.conditions}'
            }
        },
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
                var columnName = Ext.Array.findBy(Table.allColumns, function (item) { return item.value === value; } ).text,
                    operatorSymbol = Ext.Array.findBy(Globals.operators, function (item) { return item.value === record.get('operator'); } ).symbol;
                return '<strong>' + columnName + ' ' + operatorSymbol + ' ' + record.get('value') + '</strong>';
            }
        }, {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            width: 44,
            cell: {
                align: 'center',
                tools: {
                    close: 'onRemoveFromGrid'
                }
            }
        }],
        listeners: {
            childtap: 'onEditFromGrid'
        }
    }, {
        xtype: 'formpanel',
        bind: {
            title: '{conditionIdx === null ? "Add Condition" : "Edit Condition"}'
        },
        // layout: 'form',
        defaults: {
            margin: '20 0',
            // plugins: 'responsive',
            // responsiveConfig: { large: { margin: '20 0' }, small: { margin: 0 } }
        },
        items: [{
            xtype: 'selectfield',
            name: 'column',
            // label: 'Choose field'.t(),
            placeholder: 'Choose field'.t(),
            required: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            forceSelection: true,
            options: Table.allColumns,
            listeners: {
                change: 'onColumnChange'
            }
        }, {
            xtype: 'selectfield',
            name: 'operator',
            // label: 'Choose operator'.t(),
            placeholder: 'Choose operator'.t(),
            required: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            value: 'EQ',
            options: Globals.operators
        }, {
            xtype: 'container',
            itemId: 'sheetActions',
            defaults: {
                xtype: 'button'
            },
            layout: {
                type: 'hbox',
                pack: 'right'
            },
            items: [{
                text: 'Cancel'.t(),
                margin: '0 8 0 0',
                handler: 'onCancelCondition'
            }, {
                ui: 'action',
                bind: {
                    text: '{conditionIdx === null ? "Add" : "Update"}'
                },
                handler: 'onDoneCondition'
            }]
        }],
        listeners: {
            hide: function (form) {
                form.reset(true);
            }
        }
    }],

    listeners: {
        initialize: 'onSheetInitialize',
        hide: 'onSheetHide'
    }
});
