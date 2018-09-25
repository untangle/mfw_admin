Ext.define('Mfw.cmp.conditions.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.conditions',

    onInitialize: function (cmp) {
        var me = this, mainView;
        me.mainView = mainView = cmp.up('mfw-dashboard') || cmp.up('mfw-reports');
        mainView.getViewModel().bind('{conditions.fields}', function (fields) {
            me.generateConditionsButtons(fields)
        });
    },

    generateConditionsButtons: function (fields) {
        var me = this, buttons = [], fieldName,
            buttonsCmp = me.mainView.down('#fieldsBtns');

        Ext.Array.each(fields, function (field, idx) {
            fieldName = Ext.Array.findBy(Util.tmpColumns, function (item) { return item.field === field.column; } ).name;
            buttons.push({
                xtype: 'segmentedbutton',
                margin: '0 5',
                allowToggle: false,
                items: [{
                    text: fieldName + ' ' + field.operator + ' ' + field.value,
                    handler: function () {
                        me.showFieldDialog(field);
                    }
                }, {
                    iconCls: 'x-tool-type-close',
                    fieldIndex: idx,
                    handler: function (btn) {
                        Ext.Array.removeAt(fields, btn.fieldIndex);
                        Mfw.app.redirect(me.mainView);
                    }
                }]
            });
        });
        buttonsCmp.removeAll();
        buttonsCmp.add(buttons);
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
            vm = me.mainView.getViewModel();

        if (!form.validate()) { return; }

        fields = vm.get('conditions.fields')

        if (me.dialog.getAddAction()) {
            fields.push(form.getValues());
        }
        Mfw.app.redirect(me.mainView);
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
        Mfw.app.redirect();
    }

});
