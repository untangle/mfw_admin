Ext.define('Mfw.cmp.condition.FieldsSheet', {
    extend: 'Ext.Sheet',
    alias: 'widget.fields-sheet',

    title: 'Fields Conditions'.t(),
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
        handler: 'openFieldDialog'
        // type: 'plus'
    }],

    viewModel: {
        stores: {
            conds: {
                data: '{dashboardConditions.fields}'
            }
        }
    },

    items: [{
        // xtype: 'list',
        // selectable: false,
        // itemTpl: '{column} {operator} {value}',
        // bind: '{conds}',
        // onItemDisclosure: true,
        // listeners: {
        //     childtap: function (el, location) {
        //         if (!Ext.Viewport.fieldDialog) {
        //             Ext.Viewport.fieldDialog = Ext.Viewport.add({
        //                 xtype: 'field-dialog'
        //             });
        //         }
        //         Ext.Viewport.fieldDialog.getViewModel().set('record', location.record);
        //         Ext.Viewport.fieldDialog.show();
        //     }
        // }


        xtype: 'grid',
        bind: '{conds}',
        emptyText: 'No conditions'.t(),
        // hideHeaders: true,
        selectable: false,
        columns: [{
            menuDisabled: true,
            sortable: false,
            resizable: false,
            width: 44,
            cell: {
                align: 'right',
                tools: {
                    close: 'onDelete'
                }
            }
        }, {
            text: 'Field Condition'.t(),
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
        }],
        listeners: {
            childtap: 'openFieldDialog'
            // childtap: function (el, location) {
            //     if (location.column.getDataIndex() !== 'column') { return; }
            //     if (!Ext.Viewport.fieldDialog) {
            //         Ext.Viewport.fieldDialog = Ext.Viewport.add({
            //             xtype: 'field-dialog'
            //         });
            //     }
            //     Ext.Viewport.fieldDialog.getViewModel().set('record', location.record);
            //     Ext.Viewport.fieldDialog.show();
            // }
        }
        // {
        //     text: 'Operator'.t(),
        //     dataIndex: 'operator',
        // }, {
        //     text: 'Value'.t(),
        //     dataIndex: 'value',
        //     flex: 1
        // }, {
        //     xtype: 'checkcolumn',
        //     text: 'Auto Format Value',
        //     dataIndex: 'autoFormatValue'
        // }
    }],

    listeners: {
        show: 'onShow',
    },

    controller: {
        onShow: function (sheet) {
            console.log(sheet.down('grid'));
            sheet.down('grid').setHideHeaders(true);
        },


        openFieldDialog: function () {
            if (!Ext.Viewport.fieldDialog) {
                Ext.Viewport.fieldDialog = Ext.Viewport.add({
                    xtype: 'field-dialog'
                });
            }
            Ext.Viewport.fieldDialog.show();
        },

        onDelete: function (grid, info) {
            console.log(info);
            // var gvm = Ext.Viewport.getViewModel(),
            //     fields = gvm.get('dashboardConditions.fields';

            // Ext.Array.removeAt(fields, btn.fieldIndex);
            // Mfw.app.redirect('dashboard');
        }

        // onShow: function (sheet) {
        //     var gvm = Ext.Viewport.getViewModel();
        //     gvm.get('dashboardConditions.fields');
        //     sheet.down('grid').getStore().loadData(gvm.get('dashboardConditions.fields'));
        // }
    }
});
