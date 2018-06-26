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

    viewModel: {
        stores: {
            conds: {
                data: '{dashboardConditions.fields}'
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            ui: 'action',
            text: 'Add Condition'.t(),
            handler: 'openFieldDialog'
        }]
    }, {
        xtype: 'list',
        selectable: false,
        itemTpl: '{column} {operator} {value}',
        bind: '{conds}',
        listeners: {
            childtap: function (el, location) {
                console.log(location.record);
            }
        }


        // xtype: 'grid',
        // bind: '{conds}',
        // // store: {
        // //     data: [],
        // // },
        // emptyText: 'No conditions'.t(),
        // columns: [{
        //     text: 'Field'.t(),
        //     dataIndex: 'column',
        //     flex: 1
        // }, {
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
        // }]
    }],

    listeners: {
        // show: 'onShow',
    },

    controller: {
        initialize: function (cmp) {
            var gvm = Ext.Viewport.getViewModel();
        },

        openFieldDialog: function () {
            if (!Ext.Viewport.fieldDialog) {
                Ext.Viewport.fieldDialog = Ext.Viewport.add({
                    xtype: 'field-dialog'
                });
            }
            Ext.Viewport.fieldDialog.show();
        },

        // onShow: function (sheet) {
        //     var gvm = Ext.Viewport.getViewModel();
        //     gvm.get('dashboardConditions.fields');
        //     sheet.down('grid').getStore().loadData(gvm.get('dashboardConditions.fields'));
        // }
    }
});
