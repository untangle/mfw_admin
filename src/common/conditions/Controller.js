Ext.define('Mfw.common.conditions.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fields',

    init: function (cmp) {
        var me = this;
        me.mainView = cmp.up('dashboard') || cmp.up('reports');
        me.getViewModel().bind('{route.conditions}', function (conditions) {
            me.generateColumnsButtons(conditions);
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

    generateColumnsButtons: function (conditions) {
        var me = this, buttons = [], columnName, operatorSymbol, vm = me.getViewModel(),
            route = vm.get('route'),
            buttonsCmp = me.mainView.down('#fieldsBtns');

        Ext.Array.each(conditions, function (condition, idx) {
            columnName = Ext.Array.findBy(Globals.conditionFields, function (item) { return item.value === condition.column; } ).text;
            operatorSymbol = Ext.Array.findBy(Globals.operators, function (item) { return item.value === condition.operator; } ).symbol;
            buttons.push({
                xtype: 'segmentedbutton',
                margin: '0 5',
                allowToggle: false,
                items: [{
                    text: columnName + ' ' + operatorSymbol + ' ' + condition.value,
                    handler: function () {
                        me.showSheet(1, idx);
                    }
                }, {
                    iconCls: 'x-tool-type-close',
                    fieldIndex: idx,
                    handler: function (btn) {
                        Ext.Array.removeAt(conditions, btn.fieldIndex);
                        route.conditions = conditions;
                        vm.set('route', route);
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
        var me = this, conditions,
            vm = me.getViewModel(),
            form = me.sheet.down('formpanel'),
            route = vm.get('route'),
            idx = me.sheet.getViewModel().get('conditionIdx');

        if (!form.validate()) { return; }

        conditions = vm.get('route.conditions');

        if (idx === null) {
            conditions.push(form.getValues());
        } else {
            conditions[idx] = form.getValues();
        }

        if (me.sheet.getUseGrid()) {
            me.sheet.setActiveItem(0);
        } else {
            me.sheet.hide();
        }

        route.conditions = conditions;

        // need to set full conditions not just the fields so the binding to fire
        vm.set('route', route);
        // if (me.mainView.isXType('dashboard')) {
        //     Mfw.app.redirectTo('dashboard?' + DashboardUtil.conditionsToQuery(vm.get('conditions')));
        // }
        // if (me.mainView.isXType('reports')) {
        //     Mfw.app.redirectTo('reports?' + ReportsUtil.conditionsToQuery(vm.get('conditions')));
        // }

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
            fields = me.getViewModel().get('conditions.fields');
        if (location.columnIndex !== 0) { return; }

        sheet.getViewModel().set('conditionIdx', idx);
        sheet.down('formpanel').setValues(fields[idx]);
        sheet.setActiveItem(1);
        sheet.setUseGrid(true);
    },

    onRemoveFromGrid: function (grid, location) {
        var me = this, vm = me.getViewModel(),
            idx = grid.getStore().indexOf(location.record),
            fields = vm.get('conditions.fields');
        Ext.Array.removeAt(fields, idx);
        Mfw.app.redirectTo('dashboard?' + DashboardUtil.conditionsToQuery(vm.get('conditions')));
    }

});
