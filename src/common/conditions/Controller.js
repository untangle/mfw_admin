Ext.define('Mfw.common.conditions.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fields',

    init: function (cmp) {
        var me = this;
        me.mainView = cmp.up('dashboard') || cmp.up('reports');
        me.getViewModel().bind('{route.conditions}', function (conditions) {
            me.generateConditionsButtons(conditions);
        });
    },

    onSheetInitialize: function (sheet) {
        var titleBar = sheet.down('grid').getTitleBar();
        titleBar.setPadding('0 16');
        titleBar.add([{
            xtype: 'button',
            ui: 'round action',
            // text: 'Add'.t(),
            // ui: 'action',
            iconCls: 'x-fa fa-plus',
            align: 'right',
            handler: 'addConditionFromGrid'
        }]);
    },

    generateConditionsButtons: function (conditions) {
        var me = this, buttons = [], columnName, operatorSymbol, vm = me.getViewModel(),
            route = vm.get('route'),
            buttonsCmp = me.mainView.down('#fieldsBtns');

        Ext.Array.each(conditions, function (condition, idx) {
            if (condition === 'time_stamp') { return; }
            columnName = Ext.Array.findBy(Table.allColumns, function (item) { return item.value === condition.column; } ).text;
            operatorSymbol = Ext.Array.findBy(Globals.operators, function (item) { return item.value === condition.operator; } ).symbol;
            buttons.push({
                xtype: 'segmentedbutton',
                margin: '0 5',
                allowToggle: false,
                items: [{
                    text: columnName + ' <span style="color: #999;">[ ' + condition.column + ' ]</span> ' + operatorSymbol + ' ' + condition.value,
                    handler: function () {
                        me.showSheet(1, idx);
                    }
                }, {
                    iconCls: 'x-tool-type-close',
                    fieldIndex: idx,
                    handler: function (btn) {
                        Ext.Array.removeAt(conditions, btn.fieldIndex);
                        route.conditions = conditions;
                        Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
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

        me.sheet.getViewModel().set('conditionIdx', conditionIdx);
        me.sheet.setActiveItem(activeItem);
        me.sheet.show();

        if (activeItem === 0) {
            me.sheet.setUseGrid(true);
        } else {
            if (conditionIdx !== null) {
                // first set the column combo to trigger editor field creation before setting all form values
                me.sheet.down('[name=column]').setValue(me.mainView.getViewModel().get('route.conditions')[conditionIdx].column);
            }

        }

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

        Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
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
        var me = this, form = me.sheet.down('formpanel');
        if (form.getAt(2).getItemId() !== 'sheetActions') {
            form.removeAt(2);
        }
        form.reset(true);
        me.sheet.setUseGrid(false);
    },


    onEditFromGrid: function (grid, location) {
        var me = this, sheet = me.sheet,
            idx = location.recordIndex,
            conditions = me.mainView.getViewModel().get('route.conditions');
        if (location.columnIndex !== 0) { return; }

        sheet.getViewModel().set('conditionIdx', idx);
        // sheet.down('formpanel').setValues(conditions[idx]);
        sheet.down('[name=column]').setValue(conditions[idx].column);
        sheet.setActiveItem(1);
        sheet.setUseGrid(true);
    },

    onRemoveFromGrid: function (grid, location) {
        var me = this, vm = me.getViewModel(),
            idx = grid.getStore().indexOf(location.record),
            route = vm.get('route'),
            conditions = vm.get('route.conditions');
        Ext.Array.removeAt(conditions, idx);

        Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
        // Mfw.app.redirectTo('dashboard?' + DashboardUtil.conditionsToQuery(vm.get('conditions')));
    },

    onColumnChange: function (field, value, oldValue) {
        var me = this, form = me.sheet.down('formpanel'),
            conditionIdx = me.sheet.getViewModel().get('conditionIdx'),
            // fixme for when multiple tables are defined
            column = Ext.Array.findBy(Table.sessions.columns, function (item) {
                return item.dataIndex === value;
            });

        if (!column) {
            // console.warn('Column ' + value + ' not defined!');
            return;
        }

        if (column.editor) {
            form.insert(2, column.editor);
        } else {
            form.insert(2, {
                xtype: 'textfield',
                name: 'value',
                // label: 'Enter value'.t(),
                placeholder: 'Enter value'.t(),
                autoComplete: false,
                required: true
            });
        }

        if (conditionIdx !== null) {
            me.sheet.down('formpanel').setValues(me.mainView.getViewModel().get('route.conditions')[conditionIdx]);
        }
    }

});
