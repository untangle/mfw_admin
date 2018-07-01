Ext.define('Mfw.cmp.condition.ConditionsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.conditions',

    onInitializeDashboard: function (cmp) {
        var me = this, gvm = Ext.Viewport.getViewModel();
        // watch since condition change and update button text
        gvm.bind('{dashboardConditions.fields}', function (fields) {
            cmp.down('#fieldsBtns').removeAll();
            cmp.down('#fieldsBtns').add(me.generateConditionsButtons(fields));
        });
    },

    onInitializeReports: function (cmp) {
        var me = this, gvm = Ext.Viewport.getViewModel();
        gvm.bind('{reportsConditions.fields}', function (fields) {
            cmp.down('#fieldsBtns').removeAll();
            cmp.down('#fieldsBtns').add(me.generateConditionsButtons(fields));
        });
    },

    generateConditionsButtons: function (fields) {
        var me = this, buttons = [], fieldName;
        Ext.Array.each(fields, function (field, idx) {
            fieldName = Ext.Array.findBy(Util.tmpColumns, function (item) { return item.field === field.column; } ).name;
            buttons.push({
                xtype: 'segmentedbutton',
                allowToggle: false,
                // defaults: {
                //     ui: 'default'
                // },
                items: [{
                    text: fieldName + ' ' + field.operator + ' ' + field.value,
                    handler: function (btn) {
                        me.showFieldDialog(field);
                    }
                }, {
                    // iconCls: 'x-fa fa-times',
                    iconCls: 'x-tool-type-close',
                    fieldIndex: idx,
                    handler: function (btn) {
                        Ext.Array.removeAt(fields, btn.fieldIndex);
                        Mfw.app.updateQuery();
                    }
                }]
            });
        });
        return buttons;
    },


    addCondition: function () {
        var me = this; me.showFieldDialog(null);
    },

    showFieldDialog: function (condition) {
        var me = this;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: 'field-dialog',
                ownerCmp: me.getView()
            });
        }
        me.dialog.setAddAction(!condition);
        me.dialog.getViewModel().set('record', condition);
        me.dialog.show();
    },

    showFieldsSheet: function () {
        var me = this;
        if (!me.sheet) {
            me.sheet = Ext.Viewport.add({
                xtype: 'fields-sheet',
                ownerCmp: me.getView()
            });
        }
        me.sheet.show();
    },

    onDialogOk: function () {
        var me = this, fields,
            form = me.dialog.down('formpanel'),
            gvm = Ext.Viewport.getViewModel();

        if (!form.validate()) { return; }

        if (gvm.get('currentView') === 'mfw-dashboard') {
            fields = gvm.get('dashboardConditions.fields');
        }
        if (gvm.get('currentView') === 'mfw-reports') {
            fields = gvm.get('reportsConditions.fields');
        }

        if (me.dialog.getAddAction()) {
            fields.push(form.getValues());
        }

        Mfw.app.updateQuery();
        me.dialog.hide();
    },
    onDialogCancel: function () {
        var me = this, rec = me.dialog.getViewModel().get('record');
        if (rec && Ext.isFunction(rec.reject)) { rec.reject(); }
        me.dialog.hide();
    },




    onSheetShow: function () {
        var me = this;
        me.sheet.down('grid').setHideHeaders(true);
    },

    onSheetEditCondition: function (grid, location) {
        var me = this;
        if (location.columnIndex === 0) {
            me.showFieldDialog(location.record);
        }
    },

    onSheetRemoveCondition: function (grid, info) {
        var gvm = Ext.Viewport.getViewModel(), fields;
        if (gvm.get('currentView') === 'mfw-dashboard') {
            fields = gvm.get('dashboardConditions.fields');
        }
        if (gvm.get('currentView') === 'mfw-reports') {
            fields = gvm.get('reportsConditions.fields');
        }

        Ext.Array.removeAt(fields, grid.getStore().indexOf(info.record));
        Mfw.app.updateQuery();
    }

});
