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
            // text: 'Add',
            // ui: 'action',
            iconCls: 'x-fa fa-plus',
            align: 'right',
            handler: 'addConditionFromGrid'
        }]);
    },

    generateConditionsButtons: function (conditions) {
        var me = this, buttons = [], columnName, operatorSymbol, valueRenderer, vm = me.getViewModel(),
            route = vm.get('route'),
            buttonsCmp = me.mainView.down('#fieldsBtns');

        Ext.Array.each(conditions, function (condition, idx) {
            if (condition === 'time_stamp') { return; }
            columnName = Ext.Array.findBy(Table.allColumns, function (item) { return item.dataIndex === condition.column; } ).text;
            operatorSymbol = Ext.Array.findBy(Map.options.routeOps, function (item) { return item.value === condition.operator; } ).symbol;

            switch (condition.column) {
                case 'ip_protocol': valueRenderer = Renderer.ipProtocol(condition.value); break;
                case 'client_interface_id':
                case 'server_interface_id':
                    valueRenderer = Renderer.interface(condition.value); break;
                case 'client_interface_type':
                case 'server_interface_type':
                    valueRenderer = Renderer.interfaceType(parseInt(condition.value, 10)); break;
                case 'client_country':
                case 'server_country':
                    valueRenderer = Renderer.country(condition.value); break;
                case 'application_blocked':
                case 'application_flagged':
                    condition.value = JSON.parse(condition.value); // parse string value to boolean
                    valueRenderer = Renderer.boolean(condition.value); break;
                default: valueRenderer = condition.value; break;
            }

            buttons.push({
                xtype: 'segmentedbutton',
                margin: '0 5',
                allowToggle: false,
                items: [{
                    conditionIdx: idx,
                    // text: columnName + ' <span style="color: #999;">[ ' + condition.column + ' ]</span> ' + operatorSymbol + ' ' + condition.value,
                    text: columnName + ' ' + operatorSymbol + ' ' + valueRenderer,
                    handler: 'conditionsDialog'
                }, {
                    iconCls: 'x-tool-type-close',
                    conditionIdx: idx,
                    handler: function (btn) {
                        Ext.Array.removeAt(conditions, btn.conditionIdx);
                        route.conditions = conditions;
                        if (me.mainView.isXType('dashboard')) {
                            Mfw.app.redirectTo(DashboardUtil.routeToQuery(route));
                        } else {
                            Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
                        }
                    }
                }]
            });
        });
        buttonsCmp.removeAll();
        buttonsCmp.add(buttons);
    },

    conditionsDialog: function (btn) {
        var me = this;
        Ext.Viewport.add({
            xtype: 'conditions-dialog',
            ownerCmp: me.mainView,
            conditionIdx: btn.conditionIdx
        }).show();
    }
});
