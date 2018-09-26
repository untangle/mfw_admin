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

    onSheetInitialize: function (sheet) {
        var titleBar = sheet.down('grid').getTitleBar();
        titleBar.setPadding('0 8 0 16');
        titleBar.add([{
            xtype: 'button',
            text: 'Add'.t(),
            iconCls: 'md-icon-add',
            align: 'right',
            handler: 'addConditionFromGrid'
        }, {
            xtype: 'button',
            iconCls: 'md-icon-close',
            align: 'right',
            handler: function () {
                sheet.hide();
            }
        }]);
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
                        me.showSheet(1, idx);
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

    addConditionFromToolbar: function () { this.showSheet(1, null); },

    addConditionFromGrid: function () {
        var me = this;
        me.sheet.getViewModel().set('conditionIdx', null);
        me.sheet.setActiveItem(1);
    },

    showSheetGrid: function () {this.showSheet(0); },

    showSheet: function (activeItem, conditionIdx) {
        var me = this;

        if (!me.sheet) {
            me.sheet = Ext.Viewport.add({
                xtype: 'fields-sheet',
                ownerCmp: me.getView()
            });
        }

        if (activeItem === 0) {
            me.sheet.setUseGrid(true);
        } else {
            if (conditionIdx !== null) {
                me.sheet.down('formpanel').setValues(me.mainView.getViewModel().get('conditions.fields')[conditionIdx]);
            }
            me.sheet.getViewModel().set('conditionIdx', conditionIdx);
        }
        me.sheet.setActiveItem(activeItem);
        me.sheet.show();
    },


    onDoneCondition: function () {
        var me = this, fields,
            form = me.sheet.down('formpanel'),
            idx = me.sheet.getViewModel().get('conditionIdx'),
            vm = me.mainView.getViewModel();

        if (!form.validate()) { return; }

        fields = vm.get('conditions.fields');

        if (idx === null) {
            fields.push(form.getValues());
        } else {
            fields[idx] = form.getValues();
        }

        if (me.sheet.getUseGrid()) {
            me.sheet.setActiveItem(0);
        } else {
            me.sheet.hide();
        }
        Mfw.app.redirect(me.mainView);
    },

    onCancelCondition: function () {
        var me = this;
        if (me.sheet.getUseGrid()) {
            me.sheet.setActiveItem(0);
        } else {
            me.sheet.hide();
        }
    },


    onSheetHide: function (sheet) {
        sheet.down('formpanel').reset(true);
        sheet.setUseGrid(false);
    },


    onEditFromGrid: function (grid, location) {
        var me = this, sheet = me.sheet,
            idx = location.recordIndex,
            fields = me.mainView.getViewModel().get('conditions.fields');
        if (location.columnIndex !== 0) { return; }

        sheet.getViewModel().set('conditionIdx', idx);
        sheet.down('formpanel').setValues(fields[idx]);
        sheet.setActiveItem(1);
        sheet.setUseGrid(true);
    },

    onRemoveFromGrid: function (grid, location) {
        var me = this,
            idx = grid.getStore().indexOf(location.record),
            fields = me.mainView.getViewModel().get('conditions.fields');
        Ext.Array.removeAt(fields, idx);
        Mfw.app.redirect(me.mainView);
    }

});
