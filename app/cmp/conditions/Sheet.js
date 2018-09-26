Ext.define('Mfw.cmp.conditions.Sheet', {
    extend: 'Ext.Sheet',
    alias: 'widget.fields-sheet',

    // title: 'Conditions'.t(),
    width: 300,
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

    viewModel: {
        formulas: {
            fields: function (get) {
                return get('conditions.fields');
            }
        },
        stores: {
            conds: {
                data: '{fields}'
            }
        }
    },

    items: [{
        xtype: 'grid',
        userCls: 'c-noheaders',
        title: 'Conditions'.t(),
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
            xtype: 'combobox',
            name: 'column',
            // label: 'Choose field'.t(),
            placeholder: 'Choose field'.t(),
            queryMode: 'local',
            required: true,
            editable: false,
            forceSelection: true,
            displayField: 'name',
            valueField: 'field',
            store: Util.tmpColumns
        }, {
            xtype: 'combobox',
            name: 'operator',
            // label: 'Choose operator'.t(),
            placeholder: 'Choose operator'.t(),
            queryMode: 'local',
            required: true,
            editable: false,
            displayField: 'name',
            valueField: 'value',
            store: Util.fieldOperators
        }, {
            xtype: 'textfield',
            name: 'value',
            // label: 'Enter value'.t(),
            placeholder: 'Enter value'.t(),
            autoComplete: false,
            required: true
        }, {
            xtype: 'checkbox',
            name: 'autoFormatValue',
            boxLabel: 'Auto Format Value'
        }, {
            xtype: 'container',
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
