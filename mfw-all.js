Ext.define('Mfw.util.ArrayStore', {
    alternateClassName: 'ArrayStore',
    singleton: true,

    netmask: [
        { value: 32, text: '/32 - 255.255.255.255' },
        { value: 31, text: '/31 - 255.255.255.254' },
        { value: 30, text: '/30 - 255.255.255.252' },
        { value: 29, text: '/29 - 255.255.255.248' },
        { value: 28, text: '/28 - 255.255.255.240' },
        { value: 27, text: '/27 - 255.255.255.224' },
        { value: 26, text: '/26 - 255.255.255.192' },
        { value: 25, text: '/25 - 255.255.255.128' },
        { value: 24, text: '/24 - 255.255.255.0' },
        { value: 23, text: '/23 - 255.255.254.0' },
        { value: 22, text: '/22 - 255.255.252.0' },
        { value: 21, text: '/21 - 255.255.248.0' },
        { value: 20, text: '/20 - 255.255.240.0' },
        { value: 19, text: '/19 - 255.255.224.0' },
        { value: 18, text: '/18 - 255.255.192.0' },
        { value: 17, text: '/17 - 255.255.128.0' },
        { value: 16, text: '/16 - 255.255.0.0' },
        { value: 15, text: '/15 - 255.254.0.0' },
        { value: 14, text: '/14 - 255.252.0.0' },
        { value: 13, text: '/13 - 255.248.0.0' },
        { value: 12, text: '/12 - 255.240.0.0' },
        { value: 11, text: '/11 - 255.224.0.0' },
        { value: 10, text: '/10 - 255.192.0.0' },
        { value: 9, text: '/9 - 255.128.0.0' },
        { value: 8, text: '/8 - 255.0.0.0' },
        { value: 7, text: '/7 - 254.0.0.0' },
        { value: 6, text: '/6 - 252.0.0.0' },
        { value: 5, text: '/5 - 248.0.0.0' },
        { value: 4, text: '/4 - 240.0.0.0' },
        { value: 3, text: '/3 - 224.0.0.0' },
        { value: 2, text: '/2 - 192.0.0.0' },
        { value: 1, text: '/1 - 128.0.0.0' },
        { value: 0, text: '/0 - 0.0.0.0' }
    ]
});

Ext.define('Mfw.util.Field', {
    alternateClassName: 'Field',
    singleton: true,

    postNatServer: {
        name: 'Post-Nat Server'.t(),
        type: 'string',
        validators: ['email']
    }

});


Ext.define('Ext.grid.plugin.RowSort', {
    extend: 'Ext.plugin.Abstract',
    alias: [
        'plugin.rowsort',
    ],

    alternateClassName: 'Ext.grid.plugin.RowSort',

    config: {
        operation: {
            lazy: true,
            $value: {
                xtype: 'button',
                ui: 'alt decline',
                align: 'right',
                handler: 'me.onOperationTap',
                margin: '0 0 0 10'
            }
        },

        /**
         * @cfg {Object/Ext.Button} selectButton
         * This config drives the "Select" button added to the grid's title bar. This
         * button's handler is provided by the plugin and toggles the visibility of the
         * `operation` button.
         * @since 6.5.0
         */
        selectButton: {
            lazy: true,
            $value: {
                xtype: 'button',
                ui: 'alt',
                align: 'right',
                margin: '0 0 0 10'
            }
        },

        /**
         * @cfg {Object} selectionColumn
         * The default settings for the selection column. Used as a config object for the
         * {@link Ext.grid.selection.Model#checkbox}. You may provide a value for this
         * config in order to:
         *
         * + Change column width
         * + Show the selectionColumn by default
         * + Change the default cls or cellCls
         * + Etc.
         */
        selectionColumn: {
            sortable: false
        },

        /**
         * @cfg {Boolean} useTriggerButton
         * Determines whether or not the trigger button is show when the grid is loaded.
         * This most commonly be set to false if you wanted to have the selectionColumn
         * shown 100% of the time instead of hidden by default. You could show the {@link #selectionColumn}
         * by modifying its hidden value to be false.
         */
        useTriggerButton: true,

        /**
         * @cfg {String} triggerText
         * The text of the button used to display the `operation` and the `selectionColumn`.
         */
        triggerText: 'Select',

        /**
         * @cfg {String} cancelText
         * The text of the button used to hide the `operation` and the `selectionColumn`.
         */
        cancelText: 'Done',

        /**
         * @cfg {String} deleteText
         * The text of the button used to delete selected rows.
         */
        deleteText: 'Delete',

        /**
         * @cfg {Boolean} disableSelection
         * Set to `true` to disable selection styling on the owning grid when not in
         * selection mode.
         * @since 6.5.0
         */
        disableSelection: true,

        /**
         * @cfg {Boolean} selecting
         * Setting this config to `true` will show the `operation` and `selectionColumn`
         * while settings it `false` will hide them.
         * @private
         * @since 6.5.0
         */
        selecting: null
    },

    init: function (grid) {
        if (!this.useSelectButton()) {
            this.setSelecting(true);
        }

        if (this.getDisableSelection()) {
            grid.setDisableSelection(true);
        }
    },

    destroy: function () {
        this.setOperation(null);
        this.setSelectButton(null);

        this.callParent();
    },

    getRecords: function () {
        var grid = this.cmp;

        return grid.getSelections();
    },

    onOperationTap: function () {
        this.deleteSelectedRecords();
    },

    onTriggerTap: function() {
        this.setSelecting(!this.getSelecting());
    },

    // operation

    applyOperation: function (config, button) {
        return Ext.updateWidget(button, config, this, 'createOperation');
    },

    createOperation: function (config) {
        var me = this,
            ret = Ext.apply({
                text: me.getDeleteText()
            }, config);

        ret.plugin = me;

        if (ret.handler === 'me.onOperationTap') {
            ret.handler = 'onOperationTap';
            ret.scope = me;
        }

        return ret;
    },

    updateOperation: function (operation) {
        if (operation) {
            var selectButton = this.useSelectButton(),
                titleBar = this.cmp.getTitleBar(),
                container;

            if (titleBar) {
                if (selectButton) {
                    container = selectButton.getParent();

                    titleBar.insert(container.indexOf(selectButton), operation);
                }
                else {
                    titleBar.add(operation);
                }
            }
        }
    },

    // selectButton

    applySelectButton: function (config, button) {
        return Ext.updateWidget(button, config, this, 'createSelectButton');
    },

    createSelectButton: function (config) {
        var me = this,
            ret = Ext.apply({
                text: me.getTriggerText()
            }, config);

        ret.handler = 'onTriggerTap';
        ret.scope = me;

        return ret;
    },

    updateSelectButton: function (selectButton) {
        if (selectButton) {
            this.cmp.getTitleBar().add(selectButton);
        }
    },

    updateSelecting: function (selecting) {
        var me = this,
            grid = me.cmp,
            disableSelection = me.getDisableSelection(),
            operation = me.getOperation(),
            selectButton = me.useSelectButton(),
            selectionModel = grid.getSelectable();

        if (operation) {
            operation.setHidden(!selecting);
        }

        if (selectButton) {
            selectButton.setText(selecting ? me.getCancelText() : me.getTriggerText());
        }

        if (disableSelection) {
            grid.setDisableSelection(!selecting);
        }

        selectionModel.setCheckbox(selecting && me.getSelectionColumn());
        selectionModel.setMode(selecting ? 'multi' : 'single');

        if (disableSelection || !selecting) {
            selectionModel.deselectAll();
        }
    },

    privates: {
        deleteSelectedRecords: function () {
            var records = this.getRecords(),
                store = this.cmp.getStore();

            store.remove(records);
        },

        useSelectButton: function () {
            var me = this,
                titleBar = me.cmp.getTitleBar();

            return me.getUseTriggerButton() && titleBar && titleBar.getTitle() &&
                me.getSelectButton();
        }
    }
});

Ext.define('Mfw.util.Util', {
    alternateClassName: 'Util',
    singleton: true,

    tmpColumns: [
        { name: 'Protocol'.t(),    field: 'protocol' },
        { name: 'Username'.t(),    field: 'username' },
        { name: 'Hostname'.t(),    field: 'hostname' },
        { name: 'Client'.t(),      field: 'c_client_addr' },
        { name: 'Server'.t(),      field: 's_server_addr' },
        { name: 'Server Port'.t(), field: 's_server_port' },
    ],

    fieldOperators: [
        { name: 'equals [=]'.t(),            value: '=' },
        { name: 'not equals [!=]'.t(),       value: '!=' },
        { name: 'greater than [>]'.t(),      value: '>' },
        { name: 'less than [<]'.t(),         value: '<' },
        { name: 'greater or equal [>=]'.t(), value: '>=' },
        { name: 'less or equal [<=]'.t(),    value: '<='},
        { name: 'like'.t(),                  value: 'like' },
        { name: 'not like'.t(),              value: 'not like' },
        { name: 'is'.t(),                    value: 'is' },
        { name: 'is not'.t(),                value: 'is not' },
        { name: 'in'.t(),                    value: 'in' },
        { name: 'not in'.t(),                value: 'not in' }
    ],

    // adds timezone computation to ensure dates showing in UI are showing actual server date
    serverToClientDate: function (serverDate) {
        if (!serverDate) { return null; }
        return Ext.Date.add(serverDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    },

    // extracts the timezone computation from UI dates before requesting new data from server
    clientToServerDate: function (clientDate) {
        if (!clientDate) { return null; }
        return Ext.Date.subtract(clientDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    }

});


Ext.util.Format.dateFormatter = function (value, format) {
    if (!value) {
        return '';
    }

    if (!Ext.isDate(value)) {
        value = new Date(value);
    }
    return Ext.Date.dateFormat(value, format || 'Y-m-d H:i A');
};

Ext.define('Mfw.cmp.condition.ConditionDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.field-dialog',
    title: 'Condition'.t(),

    closable: true,
    closeAction: 'hide',
    draggable: false,
    maskTapHandler: 'onDialogCancel',
    layout: 'fit',
    alwaysOnTop: true, // important

    maximized: false,
    maximizeAnimation: null,

    bind: {
        maximized: '{smallScreen}'
    },

    // bodyPadding: '0 16',

    config: {
        addAction: false // if condition is added or edited
    },

    viewModel: {
        data: {
            record: {
                column: '',
                operator: '',
                value: '',
                autoFormatValue: true
            }
        }
    },

    items: [{
        xtype: 'formpanel',
        padding: 0,
        defaults: {
            errorTarget: 'side',
            margin: '20 0'
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
            forceSelection: true,
            displayField: 'name',
            valueField: 'field',
            store: Util.tmpColumns,
            bind: '{record.column}'
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
            store: Util.fieldOperators,
            bind: '{record.operator}'
        }, {
            xtype: 'textfield',
            name: 'value',
            // label: 'Enter value'.t(),
            placeholder: 'Enter value'.t(),
            autoComplete: false,
            required: true,
            bind: '{record.value}'
        }, {
            xtype: 'checkbox',
            name: 'autoFormatValue',
            boxLabel: 'Auto Format Value',
            bind: '{record.autoFormatValue}'
        }]
    }],
    buttons: {
        ok: 'onDialogOk',
        cancel: 'onDialogCancel'
    }
});

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

Ext.define('Mfw.cmp.condition.Dashboard', {
    extend: 'Ext.Container',
    alias: 'widget.dashboard-conditions',

    controller: 'conditions',

    layout: 'hbox',

    viewModel: {
        formulas: {
            conditionsBtnTxt: function (get) {
                return get('dashboardConditions.fields').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        bind: { text: 'Conditions'.t() + ' ({conditionsBtnTxt})' },
        handler: 'showFieldsSheet',
    }, {
        xtype: 'container',
        itemId: 'fieldsBtns',
        layout: 'hbox',
        defaults: {
            margin: '0 5'
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }, {
        xtype: 'button',
        // ui: 'action',
        // text: 'Add'.t(),
        iconCls: 'x-fa fa-plus',
        handler: 'addCondition',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }],

    listeners: {
        initialize: 'onInitializeDashboard'
    }
});

Ext.define('Mfw.cmp.condition.Reports', {
    extend: 'Ext.Container',
    alias: 'widget.reports-conditions',

    controller: 'conditions',

    layout: 'hbox',

    viewModel: {
        formulas: {
            conditionsBtnTxt: function (get) {
                return get('reportsConditions.fields').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        bind: { text: 'Conditions'.t() + ' ({conditionsBtnTxt})' },
        handler: 'showFieldsSheet',
    }, {
        xtype: 'container',
        itemId: 'fieldsBtns',
        layout: 'hbox',
        defaults: {
            margin: '0 5'
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }, {
        xtype: 'button',
        // ui: 'action',
        // text: 'Add'.t(),
        iconCls: 'x-fa fa-plus',
        handler: 'addCondition',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }],

    listeners: {
        initialize: 'onInitializeReports'
    }
});

Ext.define('Mfw.cmp.condition.ConditionsSheet', {
    extend: 'Ext.Sheet',
    alias: 'widget.fields-sheet',

    title: 'Conditions'.t(),
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
        handler: 'addCondition'
        // type: 'plus'
    }],

    viewModel: {
        formulas: {
            data: function (get) {
                return get('currentView') === 'mfw-dashboard' ? get('dashboardConditions.fields') : get('reportsConditions.fields');
            }
        },
        stores: {
            conds: {
                data: '{data}'
            }
        }
    },

    items: [{
        xtype: 'grid',
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
                    close: 'onSheetRemoveCondition'
                }
            }
        }],
        listeners: {
            childtap: 'onSheetEditCondition'
        }
    }],

    listeners: {
        show: 'onSheetShow',
    }
});

Ext.define('Mfw.cmp.condition.TimeRangeDashboardBtn', {
    extend: 'Ext.Button',
    alias: 'widget.dashboard-timerange-btn',

    arrow: false,

    menu: {
        indented: false,
        mouseLeaveDelay: 0,
        minWidth: 150,
        items: [
            { text: '1 hour'.t(), value: 1 },
            { text: '3 hours'.t(), value: 3 },
            { text: '6 hours'.t(), value: 6 },
            { text: '12 hours'.t(), value: 12 },
            { text: '24 hours'.t(), value: 24 }
        ]
    },

    // iconCls: 'x-fa fa-clock-o',

    listeners: {
        initialize: function (btn) {
            var gvm = Ext.Viewport.getViewModel();
            // watch since condition change and update button text
            gvm.bind('{dashboardConditions.since}', function (since) {
                btn.setText(since + ' hour(s)');
            });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                gvm.set('dashboardConditions.since', item.value);
                Mfw.app.updateQuery();
                menu.hide();
            });
        }
    },
});

Ext.define('Mfw.cmp.condition.TimeRangeDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.timerange-dialog',

    title: 'Select Date/Time Range'.t(),

    closable: true,
    draggable: false,
    maskTapHandler: 'onDialogCancel',

    layout: {
        type: 'vbox',
        // align: 'stretch'
    },

    since: '',
    until: '',
    untilEnabled: false,

    items: [{
        xtype: 'formpanel',
        padding: 0,
        items: [{
            xtype: 'component',
            html: 'Since'.t()
        }, {
            xtype: 'containerfield',
            // label: 'From'.t(),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'datefield',
                itemId: 'startDate',
                // floatedPicker: {
                //     maxDate: new Date()
                // },
                flex: 1,
                width: 120,
                margin: '0 10',
                editable: false,
                required: true,
                listeners: {
                    change: function (el, newDate) {
                        el.up('dialog').since.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                    }
                }
            }, {
                xtype: 'timefield',
                itemId: 'startTime',
                width: 120,
                // increment: 10,
                editable: false,
                required: true,
                listeners: {
                    change: function (el, newDate) {
                        el.up('dialog').since.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
                    }
                }
            }]
        }, {
            xtype: 'togglefield',
            boxLabel: 'Until'.t(),
            boxLabelAlign: 'before',
            reference: 'untilTgl'
        }, {
            xtype: 'containerfield',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            hideMode: 'visibility',
            hidden: true,
            bind: {
                hidden: '{!untilTgl.value}'
            },
            items: [{
                xtype: 'datefield',
                itemId: 'endDate',
                flex: 1,
                width: 120,
                margin: '0 10',
                editable: false,
                required: false,
                bind: {
                    required: '{untilTgl.value}'
                },
                listeners: {
                    change: function (el, newDate) {
                        el.up('dialog').until.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                    }
                }
            }, {
                xtype: 'timefield',
                itemId: 'endTime',
                width: 120,
                editable: false,
                required: false,
                bind: {
                    required: '{untilCk.checked}'
                },
                listeners: {
                    change: function (el, newDate) {
                        el.up('dialog').until.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
                    }
                }
            }]
        }],
    }],
    buttons: {
        ok: 'onDialogOk',
        cancel: 'onDialogCancel'
    },
    listeners: {
        show: 'onDialogShow',
        hide: 'onDialogHide'
    }
});

Ext.define('Mfw.cmp.condition.TimeRangeReportsBtn', {
    extend: 'Ext.Button',
    alias: 'widget.reports-timerange-btn',

    menu: {
        indented: false,
        mouseLeaveDelay: 0,
        minWidth: 150,
        items: [
            { text: '1 Hour ago'.t(), value: '1h' },
            { text: '6 Hours ago'.t(), value: '6h' },
            { text: 'Today'.t(), value: 'today' },
            { text: 'Yesterday'.t(), value: 'yesterday' },
            { text: 'This Week'.t(), value: 'thisweek' },
            { text: 'Last Week'.t(), value: 'lastweek' },
            { text: 'This Month'.t(), value: 'month' },
            { xtype: 'menuseparator' },
            { text: 'Time Range ...'.t(), value: 'range' }
        ]
    },

    // iconCls: 'x-fa fa-clock-o',

    listeners: {
        initialize: 'onInitialize'
    },

    controller: {
        onInitialize: function (btn) {
            var me = this, gvm = Ext.Viewport.getViewModel(), btnText;

            // watch since condition change and update button text
            gvm.bind('{reportsConditions}', function (conditions) {
                var sinceDate = new Date(conditions.predefinedSince),
                    untilDate, btnText = '';

                if (sinceDate.getTime() > 0) {
                    btnText += Ext.Date.format(sinceDate, 'Y-m-d H:i A');
                } else {
                    btn.getMenu().getItems().each(function (item) {
                        if (item.value === conditions.predefinedSince) {
                            btnText += item.getText();
                        }
                    });
                }

                if (conditions.until) {
                    untilDate = new Date(conditions.until);
                    if (untilDate.getTime() > 0) {
                        btnText += ' <br/> ' + Ext.Date.format(untilDate, 'Y-m-d H:i A');
                    }
                }
                btn.setText(btnText);
            });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                if (item.value !== 'range') {
                    gvm.set('reportsConditions.predefinedSince', item.value);
                    gvm.set('reportsConditions.until', null);
                    Mfw.app.updateQuery();
                } else {
                    me.showTimeRangeDialog();
                }
                menu.hide();

            });
        },

        showTimeRangeDialog: function () {
            var me = this;
            if (!me.dialog) {
                me.dialog = Ext.Viewport.add({
                    xtype: 'timerange-dialog',
                    ownerCmp: me.getView()
                });
            }
            // me.dialog.getViewModel().set('record', condition);
            me.dialog.show();
        },

        onDialogShow: function (dialog) {
            var gvm = Ext.Viewport.getViewModel(),
                currentDate = Util.serverToClientDate(new Date());

            dialog.since = new Date(gvm.get('reportsConditions.since'));

            if (gvm.get('reportsConditions.until')) {
                dialog.until = new Date(gvm.get('reportsConditions.until'));
                dialog.down('togglefield').setValue(true);
            } else {
                dialog.down('togglefield').setValue(false);
                dialog.until = Util.serverToClientDate(new Date());
                dialog.until.setMinutes(Math.floor(currentDate.getMinutes()/10) * 10, 0, 0);
            }

            dialog.down('#startDate').setValue(dialog.since);
            dialog.down('#startTime').setValue(dialog.since);
            dialog.down('#endDate').setValue(dialog.until);
            dialog.down('#endTime').setValue(dialog.until);
            dialog.down('formpanel').validate();
        },

        onDialogOk: function () {
            var me = this, gvm = Ext.Viewport.getViewModel();

            if (!me.dialog.down('formpanel').validate()) {
                return;
            }

            gvm.set('reportsConditions.predefinedSince', me.dialog.since.getTime());
            gvm.set('reportsConditions.since', me.dialog.since.getTime());

            if (me.dialog.down('togglefield').getValue()) {
                gvm.set('reportsConditions.until', me.dialog.until.getTime());
            } else {
                gvm.set('reportsConditions.until', null);
            }

            Mfw.app.updateQuery();
            me.dialog.hide();
        },

        onDialogCancel: function () {
            var me = this; me.dialog.hide();
        },

        onDialogHide: function (dialog) {
            dialog.down('togglefield').setValue(false);
        },
    }
});

Ext.define('Mfw.cmp.dialog.MasterDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.masterdialog',
    controller: 'masterdialog',
    viewModel: {},

    title: 'MasterDialog',

    showAnimation: null,
    hideAnimation: null,

    scrollable: true,
    closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel',
    layout: 'fit',
    // alwaysOnTop: true, // important
    maximized: false,
    maximizeAnimation: null,

    padding: 0,

    height: 500,
    bind: {
        maximized: '{smallScreen}',
        minWidth: '{!smallScreen ? 320 : null}',
        maxHeight: '{!smallScreen ? 600 : null}',
    },
    // bodyPadding: '0 16',

    items: [],

    listeners: {
        initialize: 'onInitialize'
    },

    buttons: {
        ok: 'onOk',
        cancel: 'onCancel'
    }
});

/**
 * MasterDialog controller
 * Methods can be overridden by child controllers extending this
 */
Ext.define('Mfw.cmp.dialog.MasterDialogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.masterdialog',

    onInitialize: function (g) {
        // var titleBar = g.getTitleBar();
        console.log(g.getHeader());
    },

    onOk: function (btn) {
        btn.up('dialog').hide();
    },

    onCancel: function (btn) {
        btn.up('dialog').hide();
    }

});

/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.cmp.grid.MasterGrid', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mastergrid',

    viewModel: {},

    controller: 'mastergrid',

    store: {
        // listeners: {
        //     beforesync: 'onBeforeSync'
        // }
    },

    config: {
        /**
         * @cfg {Boolean} enableAdd
         * `true` to allow user to add new records
         */
        enableAdd: true,

        /**
         * @cfg {Boolean} enableEdit
         * `true` to allow user to edit any record, `false` to disable record editing
         */
        enableEdit: true,

        /**
         * @cfg {Boolean/String} enableDelete
         * `true` to allow user to remove any record, `false` to disable removal
         * or a binding expression string to allow removal only for specific records (e.g. `{record.wan}`)
         */
        enableDelete: true,

        /**
         * @cfg {Boolean} enableCopy
         * `true` to allow user to copy/duplicate a record
         */
        enableCopy: true,

        /**
         * @cfg {Boolean} enableReload
         * `true` to allow user to reload/refetch data from server
         * any changes made to the grid will be lost/reset
         */
        enableReload: true,

        /**
         * @cfg {Boolean} enableImport
         * `true` to allow user to import data from a file
         */
        enableImport: true,

        /**
         * @cfg {Boolean} enableExport
         * `true` to allow user to export data to a file
         */
        enableExport: true,


        /**
         * @cfg {Boolean} enableManualSort
         * `true` to allow user to sort records manually only
         * any other type of sorting shoul be disabled
         */
        enableManualSort: true,

        /**
         * @cfg {String} editorDialog
         * the dialog component alias used for editing grid records
         * e.g. `interface-dialog`
         */
        editorDialog: null,

        /**
         * @cfg {String} newRecordModel
         * the dta model for the new record to be created
         * e.g. `interface`
         */
        newRecordModel: null
    },

    scrollable: true,

    selectable: {
        mode: 'multi',
        // mode: 'single',
        cells: false,
        // checkbox: true,
        allowDeselect: true,
        drag: true
    },

    bind: {
        hideHeaders: '{smallScreen}'
    },

    itemConfig: {
        viewModel: true,
    },

    listeners: {
        initialize: 'onInitialize',
        select: 'onSelect'
    }
});

/**
 * MasterGrid controller
 * Methods can be overridden by child controllers extending this
 */
Ext.define('Mfw.cmp.grid.MasterGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mastergrid',

    onInitialize: function (g) {
        var titleBar = g.getTitleBar(),
            toolbarActions = [],
            actionsColumn;

        // add status column
        g.insertColumn(0, {
            width: 5,
            minWidth: 5,
            sortable: false,
            hideable: false,
            menuDisabled: true,
            cell: {
                userCls: 'x-statuscolumn'
            },
            renderer: function (value, record, dataIndex, cell) {
                cell.setUserCls('');
                if (record.isDirty()) {
                    cell.setUserCls('status-dirty');
                }
                if (record.get('_deleteSchedule')) {
                    cell.setUserCls('status-delete');
                }
                if (record.phantom) {
                    cell.setUserCls('status-phantom');
                }
            }
        });

        if (g.getEnableCopy() || g.getEnableEdit() || g.getEnableDelete()) {
            actionsColumn = {
                text: 'Actions'.t(),
                align: 'center',
                sortable: false,
                hideable: false,
                cell: {
                    xtype: 'widgetcell',
                    widget: {
                        xtype: 'container',
                        items: [],
                        bind: {
                            record: '{record}'
                        }
                    },
                }
            };

            if (g.getEnableCopy()) {
                actionsColumn.cell.widget.items.push({
                    xtype: 'tool',
                    margin: '0 5',
                    iconCls: 'x-fa fa-files-o',
                    handler: 'onCopyRecord',
                    hidden: true,
                    bind: { hidden: '{record._deleteSchedule}' }
                })
            }

            if (g.getEnableEdit()) {
                actionsColumn.cell.widget.items.push({
                    xtype: 'tool',
                    margin: '0 5',
                    iconCls: 'x-fa fa-pencil',
                    handler: 'onEditRecord',
                    hidden: true,
                    bind: { hidden: '{record._deleteSchedule}' }
                })
            }

            if (g.getEnableDelete()) {
                actionsColumn.cell.widget.items.push({
                    xtype: 'tool',
                    margin: '0 5',
                    iconCls: 'x-fa fa-trash',
                    handler: function (cmp) {
                        if (cmp.getRecord().phantom) {
                            cmp.getRecord().drop();
                            return;
                        }
                        cmp.getRecord().set('_deleteSchedule', true);
                        // cmp.up('gridrow').setUserCls('x-removed');
                    },
                    hidden: true,
                    bind: {
                        hidden: '{record._deleteSchedule}',
                        disabled: Ext.isString(g.getEnableDelete()) ? g.getEnableDelete() : false
                    }
                });
                actionsColumn.cell.widget.items.push({
                    xtype: 'button',
                    text: 'Undo'.t(),
                    iconCls: 'x-fa fa-trash',
                    iconAlign: 'right',
                    handler: function (btn) {
                        btn.up('container').getRecord().set('_deleteSchedule', false);
                        // tn.up('gridrow').setUserCls('');
                    },
                    hidden: true,
                    bind: { hidden: '{!record._deleteSchedule}' }
                });
            }
            g.addColumn(actionsColumn);
        }


        if (g.getEnableManualSort()) {
            // g.setSortable(false);
            toolbarActions.push({
                xtype: 'segmentedbutton',
                allowToggle: false,
                align: 'right',
                hidden: true,
                bind: {
                    hidden: '{selcount !== 1}'
                },
                defaults: {
                    // ui: 'default',
                    handler: 'onSort',
                },
                items: [{
                    iconCls: 'x-fa fa-angle-double-up',
                    tooltip: 'Move First'.t(),
                    pos: 'first'
                }, {
                    iconCls: 'x-fa fa-angle-up',
                    tooltip: 'Move Up'.t(),
                    pos: 'up'
                }, {
                    iconCls: 'x-fa fa-angle-down',
                    tooltip: 'Move Down'.t(),
                    pos: 'down'
                }, {
                    iconCls: 'x-fa fa-angle-double-down',
                    tooltip: 'Move Last'.t(),
                    pos: 'last'
                }]
            })
        }

        if (g.getEnableAdd()) {
            toolbarActions.push({
                // text: 'Add'.t(),
                iconCls: 'x-fa fa-plus-circle',
                align: 'right',
                tooltip: 'Some test',
                handler: 'onAddRecord'
            })
        }

        if (g.getEnableImport()) {
            toolbarActions.push({
                // text: 'Import'.t(),
                iconCls: 'x-fa fa-download',
                align: 'right',
                handler: 'onImport'
            })
        }

        if (g.getEnableExport()) {
            toolbarActions.push({
                // text: 'Export'.t(),
                iconCls: 'x-fa fa-upload',
                align: 'right',
                handler: 'onExport'
            })
        }

        if (g.getEnableReload()) {
            toolbarActions.push({
                // text: 'Reload'.t(),
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                handler: 'onLoad'
            })
        }

        toolbarActions.push({
            text: 'Save'.t(),
            iconCls: 'x-fa fa-floppy-o',
            align: 'right',
            handler: 'onSync'
        })

        if (toolbarActions.length > 0) {
            titleBar.add(toolbarActions);
        }

        this.onLoad();
    },

    onLoad: function () {
        this.getView().getStore().load({
            success: function () {
                console.log('success');
            },
            failure: function () {}
        });
    },

    onSync: function () {
        this.getView().getStore().each(function (record) {
            if (record.get('_deleteSchedule')) {
                record.drop();
            }
            record.dirty = true; // to push all non-dropped records
            record.phantom = false; // to push new records
        });
        this.getView().getStore().sync({
            success: function () {
                Ext.toast('Settings saved!');
            }
        });
    },

    onAddRecord: function () {
        var me = this,
            newRecord = Ext.create(me.getView().getNewRecordModel());
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: me.getView().getEditorDialog(),
                isNewRecord: true,
                ownerCmp: me.getView()
            });
        }
        // info.record.getValidation()
        me.dialog.isNewRecord = true;
        me.dialog.getViewModel().set('rec', newRecord);
        me.dialog.show();
    },

    onEditRecord: function (cmp) {
        var me = this;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: me.getView().getEditorDialog(),
                // xtype: 'masterdialog',
                isNewRecord: false,
                ownerCmp: me.getView()
            });
        }
        // info.record.getValidation()
        me.dialog.isNewRecord = false;
        me.dialog.getViewModel().set('rec', cmp.getRecord());
        me.dialog.show();
    },

    onCopyRecord: function (cmp) {
        var me = this,
            copiedRecord = cmp.getRecord().clone();

        copiedRecord.phantom = true;
        copiedRecord.dirty = false;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: me.getView().getEditorDialog(),
                // xtype: 'masterdialog',
                isNewRecord: true,
                ownerCmp: me.getView()
            });
        }
        me.dialog.isNewRecord = true;
        me.dialog.getViewModel().set('rec', copiedRecord);
        me.dialog.show();
    },

    onSelect: function (grid, selected) {
        grid.getViewModel().set('selcount', selected.length);
    },

    onSort: function (btn) {
        // var grid = this;
        var store = this.getView().getStore(),
        record = this.getView().getSelection(),
        oldIndex = store.indexOf(record),
        newIndex, pos;
        switch (btn.pos) {
            case 'first': newIndex = 0; break;
            case 'up':    newIndex = oldIndex > 0 ? (oldIndex - 1) : oldIndex; break;
            case 'down':  newIndex = oldIndex < store.getCount() ? (oldIndex + 1) : oldIndex; break;
            case 'last':  newIndex = store.getCount(); break;
            default: break;
        }
        store.removeAt(oldIndex);
        store.insert(newIndex, record);
        store.sync();

        if (store.indexOf(record) === 0) { pos = 'first'; }
        if (store.indexOf(record) === store.getCount() - 1) { pos = 'last'; }

        this.getView().setSelection(record);
        this.getViewModel().set('pos', pos);
    },

    onImport: function () {
        Ext.toast('open import dialog');
    },

    onExport: function () {
        Ext.toast('open export dialog');
    }

});

Ext.define('Mfw.cmp.grid.RuleCondition', {
    extend: 'Ext.form.Panel',
    alias: 'widget.rule-condition',

    tbar: [{
        xtype: 'component',
        bind: {
            html: '{action === "add" ? "Add" : "Edit"} Rule Condition'.t(),
        }
    }, '->', {
        iconCls: 'x-fa fa-trash',
        handler: 'onDeleteCondition',
        hidden: true,
        bind: { hidden : '{action === "add"}'}
    }],

    padding: 16,

    layout: 'vbox',

    items: [{
        xtype: 'combobox',
        label: 'Choose condition'.t(),
        // placeholder: 'Choose field'.t(),
        editable: false,
        queryMode: 'local',
        required: true,
        forceSelection: true,
        displayField: 'name',
        valueField: 'value',
        store: 'ruleconditions',
        // store: {
        //     data: [
        //         { value: 'DST_ADDR', name: 'Destination Address'.t() },
        //         { value: 'DST_PORT', name: 'Destination Port'.t() },
        //         { value: 'SRC_ADDR', name: 'Source Address'.t(), editorType: 'textfield' },
        //         { value: 'SRC_PORT', name: 'Source Port'.t(), editorType: 'textfield' }
        //     ]
        // },
        bind: '{condition.conditionType}'
    }, {
        xtype: 'togglefield',
        bind: {
            value: '{condition.invert}',
            boxLabel: '{condition.invert ? "is not" : "is"}'
        }

    }, {
        xtype: 'textfield',
        label: 'Value'.t(),
        required: true,
        bind: '{condition.value}'
    }],
    bbar: ['->', {
        text: 'Cancel'.t(),
        handler: 'onConditionCancel'
    }, {
        bind: {
            text: '{action === "add" ? "Add" : "Update"}'.t(),
        },
        handler: 'onConditionDone'
    }]
});

Ext.define('Mfw.cmp.grid.RuleDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.rule-dialog',
    // title: 'Rule'.t(),

    // closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onDialogCancel',
    layout: 'fit',
    alwaysOnTop: true, // important

    showAnimation: null,
    hideAnimation: null,
    maximized: false,
    maximizeAnimation: null,

    width: 300,
    // minHeight: 600,

    viewModel: {
        data: {
            activeCard: 0,
            condition: null,
            action: null
        }
    },

    bind: {
        maximized: '{smallScreen}',
        minHeight: '{smallScreen ? null : 550}'
    },

    bodyPadding: '0',

    config: {
        addAction: false // if condition is added or edited
    },

    items: [{
        xtype: 'container',
        layout: {
            type: 'card',
            // deferRender: false, // important so the validation works if card not yet visible
            animation: {
                duration: 150,
                type: 'slide',
                direction: 'horizontal'
            },
        },
        bind: {
            activeItem: '{activeCard}'
        },
        scrollable: 'y',
        padding: 0,
        margin: 0,

        // defaults: {
        //     margin: '8 0'
        // },

        items: [{
            xtype: 'panel',
            layout: 'vbox',
            scrollable: true,
            bodyPadding: '0 0 20 0',
            tbar: [{
                xtype: 'component',
                html: 'Edit Rule'.t()
            }, '->', {
                xtype: 'togglefield',
                labelAlign: 'left',
                labelTextAlign: 'right',
                bind: {
                    value: '{record.enabled}',
                    label: '{record.enabled ? "Enabled" : "Disabled"}'
                }
            }],
            items: [{
                xtype: 'textfield',
                margin: 16,
                label: 'Description'.t(),
                // labelAlign: 'left',
                bind: '{record.description}'
            }, {
                xtype: 'toolbar',
                shadow: false,
                // padding: 0,
                items: [{
                    xtype: 'component',
                    html: 'Conditions'.t()
                }, '->', {
                    iconCls: 'x-fa fa-plus',
                    itemId: 'conditionAddBtn',
                    handler: 'onCondition'
                }]
            }, {
                xtype: 'list',
                margin: '0 5 16 5',
                reference: 'conditions',
                emptyText: 'No Conditions...',
                minHeight: 44,
                // itemTpl: '',
                itemTpl: new Ext.XTemplate('{[this.condName(values.conditionType)]} <span style="text-decoration: padding: 0 2px;"><tpl if="invert">IS NOT<tpl else>IS</tpl></span> <strong>{value}</strong>',  {
                    condName: function (conditionType) {
                        var r = Ext.getStore('ruleconditions').findRecord('value', conditionType);
                        return r.get('name');
                    }}),
                bind: {
                    store: {
                        data: '{record.conditions}'
                    }
                },
                onItemDisclosure: function () {},
                listeners: {
                    select: 'onCondition'
                }
            }, {
                xtype: 'toolbar',
                shadow: false,
                // padding: 0,
                items: [{
                    xtype: 'component',
                    html: 'Actions'.t()
                }]
            }, {
                xtype: 'textfield',
                margin: '0 16',
                required: true,
                label: 'New Destination'.t(),
                // labelAlign: 'left',
                // labelTextAlign: 'right',
                bind: '{record.newDestination}'
            }, {
                xtype: 'numberfield',
                margin: '0 16',
                required: true,
                label: 'New Port'.t(),
                // labelAlign: 'left',
                // labelTextAlign: 'right',
                bind: '{record.newPort}'
            }],
            bbar: ['->', {
                text: 'Cancel'.t(),
                handler: 'onDialogCancel'
            }, {
                text: 'OK'.t(),
                handler: 'onDialogOk'
            }]
            // buttons: {
            //     cancel: 'onDialogCancel',
            //     ok: 'onDialogOk'
            // }
        }, {
            xtype: 'rule-condition',
            itemId: 'condition'
        }],
    }],

    controller: {
        // onCondition: function () {
        //     var me = this;
        //     // me.getViewModel().set('activeCard', 1);
        //     me.getView().down('formpanel').setActiveItem(1);
        // },
        // onActiveItemChange: function (cmp, newcard, oldcard) {
        //     var me = this;
        //     me.getViewModel().set('activeCard', newcard.getItemId() === 'condition' ? 1 : 0);
        //     // this.getViewModel()
        // },

        onCondition: function (cmp, record) {
            // console.log(cmp);
            var me = this, vm = me.getViewModel();
            me.getView().down('container').setActiveItem(1);
            if (cmp.getItemId() === 'conditionAddBtn') {
                vm.set({
                    action: 'add',
                    condition: {
                        conditionType: '',
                        invert: false,
                        value: ''
                    }
                });
            } else {
                vm.set({
                    action: 'edit',
                    condition: record
                });
            }
        },


        onDeleteCondition: function () {
            var me = this,
            rec = me.lookup('conditions').getSelection();

            if (rec) {
                rec.drop();
            }
            me.getView().down('container').setActiveItem(0);
        },

        onDialogOk: function () {
            var me = this;
            // console.log(me.getViewModel().get('record'));
            me.getViewModel().get('record').set('conditions', Ext.Array.pluck(me.getView().down('list').getStore().getRange(), 'data'))
            me.getView().hide();
        },
        onDialogCancel: function () {
            var me = this;
            me.getView().hide();
        },


        onConditionCancel: function () {
            var me = this, rec = me.getViewModel().get('condition'), list = me.getView().down('list');

            if (rec && Ext.isFunction(rec.reject)) {
                rec.reject();
            }
            list.setSelection(null);
            me.getViewModel().set({
                condition: null,
                action: null
            })
            me.getView().down('container').setActiveItem(0);
        },


        onConditionDone: function (btn) {
            var me = this, vm = me.getViewModel(), list = me.getView().down('list');
            if (!btn.up('formpanel').validate()) {
                return;
            }

            if (vm.get('action') === 'add') {
                list.getStore().add(vm.get('condition'));
            }
            list.setSelection(null);
            vm.set({
                condition: null,
                action: null
            })
            // console.log(vm.get('conditions.selection'));
            me.getView().down('container').setActiveItem(0);
        },
    }

});

Ext.define('Mfw.cmp.nav.MainHeader', {
    extend: 'Ext.Toolbar',
    alias: 'widget.mfw-header',
    cls: 'nav',
    docked: 'top',
    zIndex: 999,
    padding: '0 16 0 16',

    items: [{
        xtype: 'component',
        // padding: '0 10',
        html: '<img src="' + 'res/untangle-logo.png" style="height: 30px;"/>',
        plugins: 'responsive',
        responsiveConfig: { large: { margin: '5 26 0 10', }, small: { margin: '5 26 0 0', } }
    }, {
        xtype: 'component',
        margin: '5 0 0 0',
        style: {
            color: '#777'
        },
        bind: {
            html: '{currentViewTitle}'
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
    }, {
        xtype: 'container',
        flex: 1,
        layout: 'hbox',
        defaultType: 'button',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        items: [{
            text: 'Dashboard'.t(),
            // iconCls: 'x-fa fa-home',
            iconCls: 'x-material x-dashboard',
            handler: function () { Mfw.app.redirectTo(''); },
            bind: {
                pressed: '{currentView === "mfw-dashboard"}'
            }
        }, {
            text: 'Reports'.t(),
            // iconCls: 'x-fa fa-area-chart',
            iconCls: 'x-material x-show_chart',
            handler: function () { Mfw.app.redirectTo('reports'); },
            bind: {
                pressed: '{currentView === "mfw-reports"}'
            }
        }, {
            text: 'Settings'.t(),
            // iconCls: 'x-fa fa-cog',
            iconCls: 'x-material x-settings',
            handler: function () { Mfw.app.redirectTo('settings'); },
            bind: {
                pressed: '{currentView === "mfw-settings"}'
            }
        }, {
            text: 'Monitor'.t(),
            // iconCls: 'x-fa fa-desktop',
            iconCls: 'x-material x-computer',
            menu: [{
                text: 'Sessions'.t(),
                iconCls: 'icon-monitor sessions',
                handler: function (item) { Mfw.app.redirectTo('monitor/sessions'); item.up('menu').hide(); }
            }, {
                text: 'Hosts'.t(),
                iconCls: 'icon-monitor hosts',
                handler: function (item) { Mfw.app.redirectTo('monitor/hosts'); item.up('menu').hide(); }
            }, {
                text: 'Devices'.t(),
                iconCls: 'icon-monitor devices',
                handler: function (item) { Mfw.app.redirectTo('monitor/devices'); item.up('menu').hide(); }
            }, {
                text: 'Users'.t(),
                iconCls: 'icon-monitor users',
                handler: function (item) { Mfw.app.redirectTo('monitor/users'); item.up('menu').hide(); }
            }]
        }]
    }, '->', {
        xtype: 'button',
        text: 'Reset Settings'.t(),//
        handler: function () {
            var originalServerData = {"dhcp":{"dhcpAuthoritative":true,"staticDhcpEntries":[]},"dns":{"localServers":[],"staticEntries":[]},"firewall":{"variables":[{"key":"HTTP_PORT","value":"80"},{"key":"HTTPS_PORT","value":"443"}]},"network":{"devices":[{"duplex":"AUTO","mtu":null,"name":"eth0"},{"duplex":"AUTO","mtu":null,"name":"eth1"}],"interfaces":[{"configType":"ADDRESSED","device":"eth0","dhcpEnabled":true,"dhcpLeaseDuration":3600,"dhcpRangeEnd":"192.168.1.200","dhcpRangeStart":"192.168.1.100","interfaceId":1,"name":"internal","type":"NIC","v4ConfigType":"STATIC","v4StaticAddress":"192.168.1.1","v4StaticPrefix":24,"v6AssignHint":"1234","v6AssignPrefix":64,"v6ConfigType":"ASSIGN","wan":false},{"configType":"ADDRESSED","device":"eth1","interfaceId":2,"name":"external","natEgress":true,"type":"NIC","v4ConfigType":"DHCP","v6ConfigType":"DISABLED","wan":true}],"switches":[]},"system":{"domainName":"example.com","hostName":"mfw"},"version":1}
            Ext.Ajax.request({
                url: window.location.origin + '/settings/set_settings',
                method: 'POST',
                params: Ext.JSON.encode(originalServerData),
                success: function() {
                    Ext.toast('Settings saved!');
                    window.location.reload(true);
                },
                failure: function(response) {
                    Ext.toast('Error while saving settings!');
                    console.log('server-side failure with status code ' + response.status);
                }
            })
        }
    }, {
        // text: 'Account',
        iconCls: 'x-fa fa-user-circle fa-3x',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }, {
        iconCls: 'x-fa fa-bars',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
        handler: function () {
            // Mfw.app.mainMenu.show();

            var me = this;
            if (!me.menu) {
                me.menu = Ext.Viewport.add({
                    xtype: 'menu-sheet',
                    // ownerCmp: me.getView()
                });
            }
            me.menu.show();

        }
    }]
});

Ext.define('Mfw.cmp.nav.MainMenu', {
    extend: 'Ext.Sheet',
    alias: 'widget.menu-sheet',

    padding: 10,
    // width: 200,
    defaults: {
        width: 200,
        xtype: 'button',
        textAlign: 'left',
    },

    side: 'right',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    items: [{
        xtype: 'component',
        width: 100,
        margin: 10,
        html: '<img src="' + 'res/untangle-logo.png" style="height: 30px;"/>'
    }, {
        text: 'Dashboard'.t(),
        iconCls: 'x-fa fa-home',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo(''); }
    }, {
        text: 'Reports'.t(),
        iconCls: 'x-fa fa-area-chart',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('reports'); }
    }, {
        text: 'Settings'.t(),
        iconCls: 'x-fa fa-cog',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('settings'); }
    }, {
        xtype: 'menuseparator'
    }, {
        text: 'Sessions'.t(),
        iconCls: 'icon-monitor sessions'
    }, {
        text: 'Hosts'.t(),
        iconCls: 'icon-monitor hosts',
        // handler: function () { Ung.app.redirectTo('#apps'); }
    }, {
        text: 'Devices'.t(),
        iconCls: 'icon-monitor devices',
        // handler: function () { Ung.app.redirectTo('#apps'); }
    }, {
        text: 'Users'.t(),
        iconCls: 'icon-monitor users',
        // handler: function () { Ung.app.redirectTo('#apps'); }
    }]
});

Ext.define('Mfw.model.Interface', {
    extend: 'Ext.data.Model',
    alias: 'model.interface',
    idProperty: 'interfaceId',
    fields: [
        { name: 'interfaceId', type: 'integer' },
        { name: 'name',        type: 'string', allowNull: false, allowBlank: false },
        { name: 'device',      type: 'string' },
        { name: 'wan',         type: 'boolean' },
        { name: 'type',        type: 'string' },
        { name: 'configType',  type: 'string' },

        { name: 'natEgress',  type: 'boolean' },
        { name: 'natIngress', type: 'boolean' },

        // IPv4
        { name: 'v4ConfigType',    type: 'string' }, // ["STATIC","DHCP","DISABLED"]
        { name: 'v4StaticAddress', type: 'string' },
        { name: 'v4StaticPrefix',  type: 'integer' }, // 1 - 32
        // { name: 'v4StaticGateway', type: 'string', allowBlank: true, validators: [{ type: 'fields', conditions: { wan: false }}, 'ipaddress'] },

        { name: 'v4StaticGateway', type: 'string' },

        { name: 'v4StaticDNS1',    type: 'string' },
        { name: 'v4StaticDNS2',    type: 'string' },

        // IPv4 DHCP overrides
        { name: 'v4DhcpAddressOverride', type: 'string' },
        { name: 'v4DhcpPrefixOverride',  type: 'integer' }, // 1 - 32
        { name: 'v4DhcpGatewayOverride', type: 'string' },
        { name: 'v4DhcpDNS1Override',    type: 'string' },
        { name: 'v4DhcpDNS2Override',    type: 'string' },

        // PPPoE
        { name: 'v4PPPoEUsername',     type: 'string' },
        { name: 'v4PPPoEPassword',     type: 'string' },
        { name: 'v4PPPoEUsePeerDNS',   type: 'boolean' },
        { name: 'v4PPPoEOverrideDNS1', type: 'string' },
        { name: 'v4PPPoEOverrideDNS2', type: 'string' },

        { name: 'v4Aliases', type: 'auto' },

        // IPv6
        { name: 'v6ConfigType',    type: 'string' }, // ["DHCP","SLAAC","ASSIGN","STATIC","DISABLED"]
        { name: 'v6StaticAddress', type: 'string' },
        { name: 'v6StaticPrefix',  type: 'integer' }, // 1 - 128
        { name: 'v6StaticGateway', type: 'string' },
        { name: 'v6StaticDNS1',    type: 'string' },
        { name: 'v6StaticDNS2',    type: 'string' },

        // IPv6 Assign
        { name: 'v6AssignHint',   type: 'string' },
        { name: 'v6AssignPrefix', type: 'integer', defaultValue: 128 }, // 1 -128

        { name: 'v6Aliases', type: 'auto' },

        { name: 'routerAdvertisements', type: 'boolean' },
        { name: 'downloadKbps',         type: 'integer' },
        { name: 'uploadKbps',           type: 'integer' },

        // DHCP serving
        { name: 'dhcpEnabled',         type: 'boolean' },
        { name: 'dhcpRangeStart',      type: 'string' },
        { name: 'dhcpRangeEnd',        type: 'string' },
        { name: 'dhcpLeaseDuration',   type: 'integer' },
        { name: 'dhcpGatewayOverride', type: 'string' },
        { name: 'dhcpPrefixOverride',  type: 'integer' }, // 1 - 32
        { name: 'dhcpDNSOverride',     type: 'string' },

        { name: 'dhcpOptions', type: 'auto' },

        // VRRP
        { name: 'vrrpEnabled',  type: 'boolean' },
        { name: 'vrrpID',       type: 'integer' }, // 1 - 255
        { name: 'vrrpPriority', type: 'integer' }, // 1 - 255

        { name: 'vrrpV4Aliases', type: 'auto' },

        // Wireless
        { name: 'wirelessSsid',  type: 'string' },
        { name: 'wirelessEncryption',       type: 'string' }, // ["NONE", "WPA1", "WPA12", "WPA2"]
        { name: 'wirelessMode', type: 'string' }, // ["AP", "CLIENT"]
        { name: 'wirelessPassword', type: 'string' },
        { name: 'wirelessChannel', type: 'integer' }
    ],

    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/settings/get_settings/network/interfaces',
            update: window.location.origin + '/settings/set_settings/network/interfaces'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                serialize: true
                // changes: false,
                // persist: false
            }
        }
    }
});

Ext.define('Mfw.model.Device', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'duplex', type: 'string' },
        { name: 'mtu',    type: 'auto' },
        { name: 'name',   type: 'string' }
    ]
});


/**
 * A superclass for inclusion/exclusion validators.
 * @abstract
 */
Ext.define('Ext.data.validator.fields', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.fields',

    type: 'fields',

    config: {
        // conditions which will skip field from validation, return true
        conditions: null,
        message: 'some test',
    },


    constructor: function() {
        this.callParent(arguments);
        if (!this.getConditions()) {
            Ext.raise('validator.Fields requires an object with fields conditions');
        }
    },

    validate: function(value, record) {
        console.log(record);
        var skip = false;
        Ext.Object.each(this.getConditions(), function (field, value) {
            if (record.get(field) === value) {
                skip = true;
            }
        });

        // if (!skip && value)
        return skip || this.getMessage();
    }
});

Ext.define('Mfw.model.Network', {
    extend: 'Ext.data.Model',
    alias: 'model.network',

    hasMany: {
        model: 'Mfw.model.Interface',
        name: 'interfaces',
        associationKey: 'interfaces'
    },

    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/settings/get_settings/network',
            update: window.location.origin + '/settings/set_settings/network'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                associated: true,
                persist: true
            }
        }
    }
});


Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',

    trackRemoved: false, // important so no need to post dropped records
    autoSort: false, // important so store is not sorted on record add
});

Ext.define('Mfw.store.NetMask', {
    extend: 'Ext.data.Store',
    storeId: 'netmask',
    alias: 'store.netmask',

    data: [
        { value: 32, text: '/32 - 255.255.255.255' },
        { value: 31, text: '/31 - 255.255.255.254' },
        { value: 30, text: '/30 - 255.255.255.252' },
        { value: 29, text: '/29 - 255.255.255.248' },
        { value: 28, text: '/28 - 255.255.255.240' },
        { value: 27, text: '/27 - 255.255.255.224' },
        { value: 26, text: '/26 - 255.255.255.192' },
        { value: 25, text: '/25 - 255.255.255.128' },
        { value: 24, text: '/24 - 255.255.255.0' },
        { value: 23, text: '/23 - 255.255.254.0' },
        { value: 22, text: '/22 - 255.255.252.0' },
        { value: 21, text: '/21 - 255.255.248.0' },
        { value: 20, text: '/20 - 255.255.240.0' },
        { value: 19, text: '/19 - 255.255.224.0' },
        { value: 18, text: '/18 - 255.255.192.0' },
        { value: 17, text: '/17 - 255.255.128.0' },
        { value: 16, text: '/16 - 255.255.0.0' },
        { value: 15, text: '/15 - 255.254.0.0' },
        { value: 14, text: '/14 - 255.252.0.0' },
        { value: 13, text: '/13 - 255.248.0.0' },
        { value: 12, text: '/12 - 255.240.0.0' },
        { value: 11, text: '/11 - 255.224.0.0' },
        { value: 10, text: '/10 - 255.192.0.0' },
        { value: 9, text: '/9 - 255.128.0.0' },
        { value: 8, text: '/8 - 255.0.0.0' },
        { value: 7, text: '/7 - 254.0.0.0' },
        { value: 6, text: '/6 - 252.0.0.0' },
        { value: 5, text: '/5 - 248.0.0.0' },
        { value: 4, text: '/4 - 240.0.0.0' },
        { value: 3, text: '/3 - 224.0.0.0' },
        { value: 2, text: '/2 - 192.0.0.0' },
        { value: 1, text: '/1 - 128.0.0.0' },
        { value: 0, text: '/0 - 0.0.0.0' }
    ]
});

Ext.define('Mfw.store.RuleConditions', {
    extend: 'Ext.data.Store',
    storeId: 'ruleconditions',
    alias: 'store.ruleconditions',

    // fields: ['name', 'displayName', 'type'],
    data: [
        { value:'DST_ADDR', name: 'Destination Address'.t(), editorType: 'textfield', vtype:'ipall', visible: true },
        { value:'DST_PORT', name: 'Destination Port'.t(), editorType: 'textfield', vtype:'port', visible: true },
        { value:'DST_INTF', name: 'Destination Interface'.t(), editorType: 'checkboxgroup', /*values: Util.getInterfaceList(true, false),*/ visible: true},
        { value:'SRC_ADDR', name: 'Source Address'.t(), editorType: 'textfield', visible: true, vtype:'ipall'},
        { value:'SRC_PORT', name: 'Source Port'.t(), editorType: 'textfield', vtype:'portMatcher'},
        { value:'SRC_INTF', name: 'Source Interface'.t(), editorType: 'checkboxgroup', /*values: Util.getInterfaceList(true, false),*/ visible: true},
        { value:'PROTOCOL', name: 'Protocol'.t(), editorType: 'checkboxgroup', values: [['TCP','TCP'],['UDP','UDP'],['any','any']], visible: true},
        { value:'USERNAME', name: 'Username'.t(), editorType: 'userselection', /*editor: Ext.create('Ung.UserEditorWindow',{}),*/ visible: true},
        { value:'TAGGED', name: 'Tagged'.t(), editorType: 'textfield', visible: true},
        { value:'HOST_HOSTNAME', name: 'Host Hostname'.t(), editorType: 'textfield', visible: true},
        { value:'CLIENT_HOSTNAME', name: 'Client Hostname'.t(), editorType: 'textfield', visible: false},
        { value:'SERVER_HOSTNAME', name: 'Server Hostname'.t(), editorType: 'textfield', visible: false},
        { value:'HOST_MAC',  name: 'Host MAC Address'.t(), editorType: 'textfield', visible: true },
        { value:'SRC_MAC',  name: 'Client MAC Address'.t(), editorType: 'textfield', visible: true },
        { value:'DST_MAC',  name: 'Server MAC Address'.t(), editorType: 'textfield', visible: true },
        { value:'HOST_MAC_VENDOR', name: 'Host MAC Vendor'.t(), editorType: 'textfield', visible: true},
        { value:'CLIENT_MAC_VENDOR', name: 'Client MAC Vendor'.t(), editorType: 'textfield', visible: false},
        { value:'SERVER_MAC_VENDOR', name: 'Server MAC Vendor'.t(), editorType: 'textfield', visible: false},
        { value:'HOST_IN_PENALTY_BOX', name: 'Host in Penalty Box'.t(), editorType: 'boolean', visible: false},
        { value:'CLIENT_IN_PENALTY_BOX', name: 'Client in Penalty Box'.t(), editorType: 'boolean', visible: false},
        { value:'SERVER_IN_PENALTY_BOX', name: 'Server in Penalty Box'.t(), editorType: 'boolean', visible: false},
        { value:'HOST_HAS_NO_QUOTA', name: 'Host has no Quota'.t(), editorType: 'boolean', visible: true},
        { value:'USER_HAS_NO_QUOTA', name: 'User has no Quota'.t(), editorType: 'boolean', visible: true},
        { value:'CLIENT_HAS_NO_QUOTA', name: 'Client has no Quota'.t(), editorType: 'boolean', visible: false},
        { value:'SERVER_HAS_NO_QUOTA', name: 'Server has no Quota'.t(), editorType: 'boolean', visible: false},
        { value:'HOST_QUOTA_EXCEEDED', name: 'Host has exceeded Quota'.t(), editorType: 'boolean', visible: true},
        { value:'USER_QUOTA_EXCEEDED', name: 'User has exceeded Quota'.t(), editorType: 'boolean', visible: true},
        { value:'CLIENT_QUOTA_EXCEEDED', name: 'Client has exceeded Quota'.t(), editorType: 'boolean', visible: false},
        { value:'SERVER_QUOTA_EXCEEDED', name: 'Server has exceeded Quota'.t(), editorType: 'boolean', visible: false},
        { value:'HOST_QUOTA_ATTAINMENT', name: 'Host Quota Attainment'.t(), editorType: 'textfield', visible: true},
        { value:'USER_QUOTA_ATTAINMENT', name: 'User Quota Attainment'.t(), editorType: 'textfield', visible: true},
        { value:'CLIENT_QUOTA_ATTAINMENT', name: 'Client Quota Attainment'.t(), editorType: 'textfield', visible: false},
        { value:'SERVER_QUOTA_ATTAINMENT', name: 'Server Quota Attainment'.t(), editorType: 'textfield', visible: false},
        { value:'HTTP_HOST', name: 'HTTP: Hostname'.t(), editorType: 'textfield', visible: true},
        { value:'HTTP_REFERER', name: 'HTTP: Referer'.t(), editorType: 'textfield', visible: true},
        { value:'HTTP_URI', name: 'HTTP: URI'.t(), editorType: 'textfield', visible: true},
        { value:'HTTP_URL', name: 'HTTP: URL'.t(), editorType: 'textfield', visible: true},
        { value:'HTTP_CONTENT_TYPE', name: 'HTTP: Content Type'.t(), editorType: 'textfield', visible: true},
        { value:'HTTP_CONTENT_LENGTH', name: 'HTTP: Content Length'.t(), editorType: 'textfield', visible: true},
        { value:"HTTP_REQUEST_METHOD", name: 'HTTP: Request Method'.t(), type: 'textfield', visible: true},
    ]


});

Ext.define('Mfw.store.Sessions', {
    extend: 'Ext.data.Store',
    storeId: 'sessions',
    alias: 'store.sessions',

    data: [{
        "attachments":null,
        "creationTime":null,
        "javaClass": "com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":27955,"serverCountry":null,
        "sessionId":null,
        "priority":0,
        "clientLatitude":null,
        "postNatClientPort":27955,
        "clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,
        "qosPriority":0,
        "bypassed":true,
        "serverKBps":null,
        "mark":16777216,
        "tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,
        "preNatClientPort":62629,
        "serverCountry":null,

        "sessionId":null,

        "priority":0,"clientLatitude":null,
        "postNatClientPort":62629,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
        {
            "attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.209.170",
        "clientLongitude":null,
        "totalKBps":0.102199994,"preNatServer":"216.58.209.170",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":0.018133333,"portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7122,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7122,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.08406667,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.225",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.225",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4502,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4502,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.65",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.65",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":8926,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":8926,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.66",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.66",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4782,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4782,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7656,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7656,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":46255,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":46255,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7686,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7686,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.233",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.233",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":6790,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":6790,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":1856,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":1856,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"224.0.0.251",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"224.0.0.251",
        "natted":false,"hostname":"192.0.2.200",
        "postNatServerPort":5353,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":5353,"localAddr":"192.0.2.200",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"192.0.2.200",
        "serverIntf":-1,"preNatClientPort":5353,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5353,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0026500002,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0010166666,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":15913,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":15913,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0016333333,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":43329,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":43329,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.98",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.98",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":3640,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":3640,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":55609,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":55609,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0022333334,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":9.833333E-4,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":41723,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":41723,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.00125,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":57630,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":57630,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0030999999,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0010833334,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":26490,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":26490,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0020166666,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":63113,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":63113,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0029666666,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.00105,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":43545,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":43545,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0019166666,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.118",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.118",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4816,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4816,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":25681,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":25681,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.97",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.97",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5494,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5494,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.230",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.230",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7732,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7732,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7704,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7704,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.110",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.110",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5520,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5520,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":19330,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":19330,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4130,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4130,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.110",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.110",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5540,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5540,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.78",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.78",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4288,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4288,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":27920,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":27920,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.238",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.238",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7340,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7340,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":24952,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":24952,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0026833334,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":9.666666E-4,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":44307,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":44307,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0017166667,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.238",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.238",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7306,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7306,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7732,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7732,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.65",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.65",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":8930,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":8930,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.98",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.98",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":3570,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":3570,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.225",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.225",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4496,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4496,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.206",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.206",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":3452,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":3452,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0026,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0011666666,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":62389,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":62389,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0014333333,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.66",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.66",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4684,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4684,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7644,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7644,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":38237,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":38237,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":11288,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":11288,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7658,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7658,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7706,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7706,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.227",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.227",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7640,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7640,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":1933,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":1933,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":31045,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":31045,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0023,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0010166666,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":10023,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":10023,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0012833333,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":2294,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":2294,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"224.0.0.251",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"224.0.0.251",
        "natted":false,"hostname":"224.0.0.251",
        "postNatServerPort":5353,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":5353,"serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "remoteAddr":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5353,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5353,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777217,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"224.0.0.251",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"224.0.0.251",
        "natted":false,"hostname":"192.0.2.1",
        "postNatServerPort":5353,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":5353,"localAddr":"192.0.2.1",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"192.0.2.1",
        "serverIntf":-1,"preNatClientPort":5353,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5353,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":2,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":83886082,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.195",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.195",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":8526,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":8526,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.66",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.66",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4778,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4778,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"224.0.0.251",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"224.0.0.251",
        "natted":false,"hostname":"2.3.4.5",
        "postNatServerPort":5353,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":5353,"localAddr":"2.3.4.5",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"2.3.4.5",
        "serverIntf":-1,"preNatClientPort":5353,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5353,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":100,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777316,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":6196,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":6196,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":63797,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":63797,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.212.163",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.212.163",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7588,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7588,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.97",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.97",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5490,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5490,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.65",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.65",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":8936,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":8936,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.78",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.78",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4336,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4336,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":48157,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":48157,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.205",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.205",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4816,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4816,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"224.0.0.251",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"224.0.0.251",
        "natted":false,"hostname":"1.2.3.6",
        "postNatServerPort":5353,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":5353,"localAddr":"1.2.3.6",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"1.2.3.6",
        "serverIntf":-1,"preNatClientPort":5353,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5353,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":2,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777218,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.238",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.238",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7304,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7304,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.202",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.202",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":6270,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":6270,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0030666667,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0011,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":39933,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":39933,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0019666667,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.209.193",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.209.193",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4032,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4032,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0038,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0010166666,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":61642,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":61642,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0027833334,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.23.225",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.23.225",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7466,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7466,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":41760,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":41760,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.74",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.74",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5320,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5320,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":26766,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":26766,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":24247,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":24247,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.209.161",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.209.161",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5908,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5908,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.78",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.78",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4338,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4338,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":0.0023,"preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":0.0010166666,"portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":54633,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":54633,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":0.0012833333,"mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.195",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.195",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":8522,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":8522,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.195",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.195",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":8568,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":8568,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":64031,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":64031,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.206",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.206",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":3488,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":3488,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":51636,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":51636,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.205",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.205",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4814,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4814,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":60478,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":60478,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":20876,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":20876,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":20909,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":20909,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.18.78",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.18.78",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":4278,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":4278,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"10.0.2.15",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"10.0.2.15",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":22,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":22,"serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.2",
        "remoteAddr":"10.0.2.2",
        "serverIntf":-1,"preNatClientPort":53930,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":53930,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777217,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.68",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.68",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7576,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7576,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.230",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.230",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7730,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7730,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":54811,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":54811,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.214.238",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.214.238",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7308,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7308,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.68",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.68",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7462,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7462,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":2708,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":2708,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":62603,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":62603,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.23.225",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.23.225",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7464,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7464,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"172.217.16.110",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"172.217.16.110",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":5476,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":5476,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"216.58.212.163",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"216.58.212.163",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":443,"protocol":"TCP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":443,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":7560,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":7560,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":2587,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":2587,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null},
    {"attachments":null,
        "creationTime":null,
        "javaClass":"com.untangle.uvm.SessionMonitorEntry",
        "postNatServer":"192.168.0.1",
        "clientLongitude":null,
        "totalKBps":null,
        "preNatServer":"192.168.0.1",
        "natted":false,"hostname":"10.0.2.15",
        "postNatServerPort":53,"protocol":"UDP",
        "clientKBps":null,
        "portForwarded":false,"state":null,
        "preNatServerPort":53,"localAddr":"10.0.2.15",
        "serverLatitude":null,
        "policy":"",
        "postNatClient":"10.0.2.15",
        "serverIntf":-1,"preNatClientPort":64984,"serverCountry":null,
        "sessionId":null,
        "priority":0,"clientLatitude":null,
        "postNatClientPort":64984,"clientCountry":null,
        "tags":null,
        "pipeline":null,
        "serverLongitude":null,
        "clientIntf":-1,"qosPriority":0,"bypassed":true,"serverKBps":null,
        "mark":16777216,"tagsString":null,
        "username":null}]

});

Ext.define('Mfw.view.Error404', {
    extend: 'Ext.Container',
    alias: 'widget.mfw-404',

    padding: 20,

    layout: 'center',

    html: '<h1 style="font-weight: 100;">Errorrrrr 404! <br/> Wrong route!</h1>'

});

Ext.define('Mfw.view.dashboard.Dashboard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-dashboard',
    controller: 'dashboard',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             since: 1
    //         }
    //     }
    // },

    items: [{
        xtype: 'toolbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        dock: 'top',
        items: [{
            xtype: 'dashboard-timerange-btn'
        }, {
            xtype: 'dashboard-conditions'
        }, '->', {
            xtype: 'button',
            iconCls: 'x-fa fa-bars',
            arrow: false,
            menu: {
                items: [{
                    text: 'Manage'.t(),
                    iconCls: 'x-fa fa-cog',
                    handler: 'showSettings'
                }, {
                    text: 'Add'.t(),
                    iconCls: 'x-fa fa-plus',
                    menu: {
                        items: [
                            { text: 'Information'.t() },
                            { text: 'Resources'.t() },
                            { text: 'CPU Load'.t() },
                            { text: 'Network Information'.t() },
                            { text: 'Network Layout'.t() },
                            { text: 'Map Distribution'.t() },
                            { text: 'Notifications'.t() },
                            '-',
                            { text: 'More widgets...'.t(), handler: 'onMoreWidgetsInfo' }
                        ]
                    }
                }, '-', {
                    text: 'Import'.t(),
                    iconCls: 'x-fa fa-download'
                }, {
                    text: 'Export'.t(),
                    iconCls: 'x-fa fa-upload'
                }, '-', {
                    text: 'Reset'.t(),
                    iconCls: 'x-fa fa-rotate-left'
                }]
            }
        }]
    }, {
        xtype: 'container',
        padding: 20,
        items: [{
            xtype: 'component',
            bind: {
                html: 'Dashboard View since <strong>{dashboardConditions.since} hour(s)</strong> <br/><br/>'
            }
        }, {
            xtype: 'dataview',
            disableSelection: true,
            bind: {
                store: {
                    data: '{dashboardConditions.fields}'
                }
            },
            itemTpl: '<div>{column} {operator} {value} (autoformat: {autoFormatValue})</div>'
        }]
    }],

    listeners: {
        activate: function() {
            // Mfw.app.redirect('dashboard');
        }
    }
});

Ext.define('Mfw.view.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.dashboard',

    sortContextMenu: {
        xtype: 'menu',
        anchor: true,
        // padding: 10,
        // minWidth: 300,
        viewModel: {
            data: {
                pos: null
            }
        },
        defaults: {
            disabled: true
        },
        items: [{
            text: 'First'.t(),
            iconCls: 'x-fa fa-angle-double-up',
            pos: 'first',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "first"}' }
        }, {
            text: 'Up'.t(),
            iconCls: 'x-fa fa-angle-up',
            pos: 'up',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "first"}' }
        }, {
            text: 'Down'.t(),
            iconCls: 'x-fa fa-angle-down',
            pos: 'down',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "last"}' }
        }, {
            text: 'Last'.t(),
            iconCls: 'x-fa fa-angle-double-down',
            pos: 'last',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "last"}' }
        }]
    },

    showSettings: function () {
        var me = this;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: 'dashboard-manager-dialog',
                ownerCmp: me.getView()
            });
        }
        me.dialog.show();
    },

    onWidgetSort: function (grid, context) {
        if (!this.sortMenu) {
            this.sortMenu = Ext.create(Ext.apply({
                ownerCmp: grid
            }, this.sortContextMenu));
        }

        var pos = null;
        if (grid.getStore().indexOf(context.record) === 0) { pos = 'first'; }
        if (grid.getStore().indexOf(context.record) === grid.getStore().getCount() - 1) { pos = 'last'; }

        this.sortMenu.record = context.record;
        this.sortMenu.getViewModel().set('pos', pos);
        this.sortMenu.showBy(context.tool.el, 'r-l');
    },

    onWidgetRemove: function (grid, context) {
        grid.getStore().remove(context.record);
        // Ext.Msg.confirm('')
    },

    onWidgetMove: function (menuItem) {
        var me = this, store = me.dialog.down('grid').getStore(),
            record = menuItem.up('menu').record,
            oldIndex = store.indexOf(record),
            newIndex;
        switch (menuItem.pos) {
            case 'first': newIndex = 0; break;
            case 'up':    newIndex = oldIndex - 1; break;
            case 'down':  newIndex = oldIndex + 1; break;
            case 'last':  newIndex = store.getCount(); break;
            default: break;
        }
        store.removeAt(oldIndex);
        store.insert(newIndex, record);
        // console.log(oldIndex, newIndex);
    },

    onMoreWidgetsInfo: function () {
        Ext.Msg.show({
            title: 'Add more widgets',
            message: 'To add more custom widgets, go to <strong>Reports</strong> and add any specific report as a widget on Dashboard!',
            width: 300,
            showAnimation: null,
            hideAnimation: null,
            // closeAction: 'destroy',
            buttons: [{
                text: 'Cancel',
                handler: function () { this.up('messagebox').hide(); }
            }, {
                text: 'Go to Reports',
                handler: function () {
                    this.up('messagebox').hide();
                    Mfw.app.redirectTo('reports');
                }
            }]
        });
    },

    onDialogOk: function () {
        var me = this
        me.dialog.hide();
    },
    onDialogCancel: function () {
        var me = this;
        me.dialog.hide();
    },

});

Ext.define('Mfw.view.dashboard.ManagerDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.dashboard-manager-dialog',
    title: 'Widgets'.t(),

    closable: true,
    draggable: false,
    // maskTapHandler: 'onDialogCancel',
    layout: 'fit',
    alwaysOnTop: true, // important
    hideHeaders: true,

    maximized: false,
    maximizeAnimation: null,

    bind: {
        maximized: '{smallScreen}'
    },

    bodyPadding: '0',

    height: 500,
    width: 300,

    items: [{
        xtype: 'grid',
        padding: 0,
        markDirty: true,
        plugins: {
            gridcellediting: {
                selectOnEdit: true
            }
        },
        store: {
            data: [
                { name: 'Some name' },
                { name: 'Nedw Name' },
                { name: 'Widget 3' },
                { name: 'Widget 4' },
                { name: 'Widget 5' },
                { name: 'Widget 6' },
                { name: 'Widget 7' },
                { name: 'Widget 8' },
                { name: 'Widget 9' }
            ]
        },
        columns: [{
            text: 'Name'.t(),
            dataIndex: 'name',
            flex: 1,
            cell: {
                tools: [{
                    iconCls: 'x-fa fa-sort',
                    handler: 'onWidgetSort'
                }, {
                    iconCls: 'x-fa fa-trash',
                    zone: 'end',
                    handler: 'onWidgetRemove'
                }]
            }
        }],
        listeners: {
            painted: function (grid) {
                grid.setHideHeaders(true);
            }
        }
    }],
    buttons: {
        ok: 'onDialogOk',
        cancel: 'onDialogCancel'
    }
});

Ext.define('Mfw.view.monitor.Devices', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-monitor-devices',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             since: 1
    //         }
    //     }
    // },

    items: [{
        xtype: 'container',
        padding: 20,
        html: 'devices'
    }],

    // listeners: {
    //     deactivate: function (view) {
    //         console.log(view);
    //     }
    // }
});

Ext.define('Mfw.view.monitor.Hosts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-monitor-hosts',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             since: 1
    //         }
    //     }
    // },

    items: [{
        xtype: 'container',
        padding: 20,
        html: 'Hosts'
    }],

    // listeners: {
    //     deactivate: function (view) {
    //         console.log(view);
    //     }
    // }
});

Ext.define('Mfw.view.monitor.Sessions', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-monitor-sessions',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        shadow: false,
        items: [{
            xtype: 'component',
            html: 'Sessions'
        }, {
            xtype: 'searchfield',
            ui: 'faded',
            margin: '0 16',
            placeholder: 'Filter...'.t()
        }, {
            text: 'Show up to 100'.t(),
            // iconCls: 'x-fa fa-list-ol',
            menu: {
                items: [{
                    text: '100'.t()
                }, {
                    text: '500'.t()
                }, {
                    text: '1000'.t()
                }]
            }
        }, '->', {
            text: 'Refresh'.t(),
            iconCls: 'x-fa fa-refresh'
        }]
    }],

    store: 'sessions',

    columns: [{
        text: 'Creation Time'.t(),
        dataIndex: 'creationTime',
        hidden: true,
        // renderer: Renderer.timestamp,
        // filter: Renderer.timestampFilter
    }, {
        text: 'Session ID'.t(),
        dataIndex: 'sessionId',
        hidden: true,
        // filter: Renderer.numericFilter
    }, {
        text: 'Mark'.t(),
        dataIndex: 'mark',
        hidden: true,
        // filter: Renderer.numericFilter,
        // renderer: function(value) {
        //     if (value)
        //         return "0x" + value.toString(16);
        //     else
        //         return "";
        // }
    }, {
        text: 'Protocol'.t(),
        dataIndex: 'protocol',
        // filter: Renderer.stringFilter
    }, {
        text: 'Bypassed'.t(),
        dataIndex: 'bypassed',
        // width: Renderer.booleanWidth,
        // filter: Renderer.booleanFilter,
        // renderer: Renderer.boolean
    }, {
        text: 'Hostname'.t(),
        dataIndex: 'hostname',
        // width: Renderer.hostnameWidth,
        // filter: Renderer.stringFilter
    }, {
        text: 'Username'.t(),
        dataIndex: 'username',
        // width: Renderer.usernameWidth,
        // filter: Renderer.stringFilter
    }, {
        text: 'NATd'.t(),
        dataIndex: 'natted',
        // width: Renderer.booleanWidth,
        // filter: Renderer.booleanFilter,
        hidden: true
    }, {
        text: 'Port Forwarded'.t(),
        dataIndex: 'portForwarded',
        // width: Renderer.booleanWidth,
        // filter: Renderer.booleanFilter,
        hidden: true
    }, {
        hidden: true,
        text: 'Local Address'.t(),
        dataIndex: "localAddr",
        // width: Renderer.ipWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'Remote Address'.t(),
        dataIndex: "remoteAddr",
        // width: Renderer.ipWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'Bandwidth Control ' + 'Priority'.t(),
        dataIndex: "priority",
        // width: Renderer.messageWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'QoS ' + 'Priority'.t(),
        dataIndex: "qosPriority",
        // width: Renderer.messageWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'Pipeline'.t(),
        dataIndex: "pipeline",
        // width: Renderer.messageWidth,
        // filter: Renderer.stringFilter
    }, {
        text: 'Client'.t(),
        columns: [{
            text: 'Interface'.t(),
            dataIndex: 'clientIntf',
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        }, {
            text: 'Address'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatClient',
            // width: Renderer.ipWidth,
            // filter: Renderer.stringFilter,
        }, {
            text: 'Port'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatClientPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter
        }, {
            text: 'Address'.t() + ' (' + 'Post-NAT'.t() + ')',
            dataIndex: 'postNatClient',
            // width: Renderer.ipWidth,
            // filter: Renderer.stringFilter,
            hidden: true
        }, {
            text: 'Port'.t() + ' (' + 'Post-NAT'.t() + ')',
            dataIndex: 'postNatClientPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Country'.t(),
            dataIndex: 'clientCountry',
            // width: Renderer.booleanWidth,
            // filter: Renderer.stringFilter,
            hidden: true
        }, {
            text: 'Latitude'.t(),
            dataIndex: 'clientLatitude',
            // width: Renderer.locationWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Longitude'.t(),
            dataIndex: 'clientLongitude',
            // filter: Renderer.numericFilter,
            hidden: true
        }]
    }, {
        text: 'Server'.t(),
        columns: [{
            text: 'Interface'.t(),
            dataIndex: 'serverIntf',
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        }, {
            text: 'Address'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatServer',
            // width: Renderer.ipWidth,
            // filter: Renderer.stringFilter,
            hidden: true
        }, {
            text: 'Port'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatServerPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Address'.t() + ' (' + 'Post-NAT'.t() + ')',
            // width: Renderer.ipWidth,
            dataIndex: 'postNatServer',
            // filter: Renderer.stringFilter
        }, {
            text: 'Port'.t() + ' (' + 'Post-NAT'.t() + ')',
            dataIndex: 'postNatServerPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter
        }, {
            text: 'Country'.t(),
            dataIndex: 'serverCountry',
            // width: Renderer.booleanWidth,
            // filter: Renderer.stringFilter
        }, {
            text: 'Latitude'.t(),
            dataIndex: 'serverLatitude',
            // width: Renderer.locationWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Longitude'.t(),
            dataIndex: 'serverLongitude',
            // width: Renderer.locationWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }]
    }, {
        text: 'Speed (KB/s)'.t(),
        columns: [{
            text: 'Client'.t(),
            dataIndex: 'clientKBps',
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter,
            align: 'right'
        }, {
            text: 'Server'.t(),
            dataIndex: 'serverKBps',
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter,
            align: 'right'
        }, {
            text: 'Total'.t(),
            dataIndex: 'totalKBps',
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter,
            align: 'right'
        }]
    }, {
        text: 'Application Control Lite',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Protocol'.t(),
            dataIndex: "application-control-lite-protocol",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category'.t(),
            dataIndex: "application-control-lite-category",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Description'.t(),
            dataIndex: "application-control-lite-description",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Matched?'.t(),
            dataIndex: "application-control-lite-matched",
            // width: Renderer.messageWidth,
            // filter: Renderer.booleanFilter
        }]
    }, {
        text: 'Application Control',
        columns: [{
            text: 'Protochain'.t(),
            dataIndex: "application-control-protochain",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            text: 'Application'.t(),
            dataIndex: "application-control-application",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category'.t(),
            dataIndex: "application-control-category",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Detail'.t(),
            dataIndex: "application-control-detail",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Confidence'.t(),
            dataIndex: "application-control-confidence",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Productivity'.t(),
            dataIndex: "application-control-productivity",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Risk'.t(),
            dataIndex: "application-control-risk",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        }]
    }, {
        text: 'Web Filter',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Category Name'.t(),
            dataIndex: "web-filter-best-category-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category Description'.t(),
            dataIndex: "web-filter-best-category-description",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category Flagged'.t(),
            dataIndex: "web-filter-best-category-flagged",
            // width: Renderer.messageWidth,
            // filter: Renderer.booleanFilter
        },{
            hidden: true,
            text: 'Category Blocked'.t(),
            dataIndex: "web-filter-best-category-blocked",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter,
        },{
            hidden: true,
            text: 'Flagged'.t(),
            dataIndex: "web-filter-flagged",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter,
        }]
    }, {
        text: 'HTTP',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Hostname'.t(),
            dataIndex: "http-hostname",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'URL'.t(),
            dataIndex: "http-url",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'User Agent'.t(),
            dataIndex: "http-user-agent",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'URI'.t(),
            dataIndex: "http-uri",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request Method'.t(),
            dataIndex: "http-request-method",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request File Name'.t(),
            dataIndex: "http-request-file-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request File Extension'.t(),
            dataIndex: "http-request-file-extension",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request File Path'.t(),
            dataIndex: "http-request-file-path",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Response File Name'.t(),
            dataIndex: "http-response-file-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Response File Extension'.t(),
            dataIndex: "http-response-file-extension",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Content Type'.t(),
            dataIndex: "http-content-type",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Referer'.t(),
            dataIndex: "http-referer",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Content Length'.t(),
            dataIndex: "http-content-length",
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter
        }]
    }, {
        text: 'SSL',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Subject DN'.t(),
            dataIndex: "ssl-subject-dn",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Issuer DN'.t(),
            dataIndex: "ssl-issuer-dn",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Inspected'.t(),
            dataIndex: "ssl-session-inspect",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter
        },{
            hidden: true,
            text: 'SNI Hostname'.t(),
            dataIndex: "ssl-sni-host",
            // width: Renderer.hostnameWidth,
            // filter: Renderer.stringFilter
        }]
    }, {
        text: 'FTP',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Filename'.t(),
            dataIndex: "ftp-file-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Data Session'.t(),
            dataIndex: "ftp-data-session",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter,
        }]
    }, {
        text: 'Tags'.t(),
        dataIndex: 'tags',
        // width: Renderer.tagsWidth,
        // renderer: Renderer.tags
    }]

});

Ext.define('Mfw.view.monitor.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-monitor-users',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             since: 1
    //         }
    //     }
    // },

    items: [{
        xtype: 'container',
        padding: 20,
        html: 'users'
    }],

    // listeners: {
    //     deactivate: function (view) {
    //         console.log(view);
    //     }
    // }
});

Ext.define('Mfw.view.reports.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-reports',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             range: '1h'
    //         }
    //     }
    // },

    // viewModel: {},

    items: [{
        xtype: 'toolbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        dock: 'top',
        items: [{
            xtype: 'reports-conditions'
        }, '->', {
            xtype: 'reports-timerange-btn'
        }]
    }, {
        xtype: 'container',
        padding: 20,
        items: [{
            xtype: 'component',
            bind: {
                html: 'Since: <br/>{reportsConditions.since} / {reportsConditions.since:dateFormatter}<br/><br/> Until: {reportsConditions.until || "none" } / {reportsConditions.until:dateFormatter}<br/><br/>'
            }
        }, {
            xtype: 'dataview',
            disableSelection: true,
            bind: {
                store: {
                    data: '{reportsConditions.fields}'
                }
            },
            itemTpl: '<div>{column} {operator} {value} (autoformat: {autoFormatValue})</div>'
        }]
    }]
});

Ext.define('Mfw.view.settings.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings',

    viewModel: {
        data: {
            currentView: false
        }
    },

    controller: 'settings',

    layout: 'fit',

    // tbar: {
    //     padding: 8,
    //     hidden: true,
    //     bind: { hidden: '{!currentView}' },
    //     shadow: false,
    //     items: [{
    //         xtype: 'button',
    //         iconCls: 'x-fa fa-arrow-left',
    //         handler: function () { Ext.util.History.back(); },
    //         margin: '0 8 0 0',
    //         plugins: 'responsive',
    //         responsiveConfig: { large: { hidden: true }, small: { hidden: false } },
    //     }, {
    //         xtype: 'component',
    //         margin: '0 0 0 8',
    //         style: 'color: #777; font-size: 18px; font-weight: normal;',
    //         bind: {
    //             html: '{title}<br/><span style="font-size: 12px; color: #333; font-weight: bold;">Firewall</span>',
    //         }
    //     }]
    // },

    listeners: {
        deactivate: 'onDeactivate',
        add: function (cmp, view) {
            cmp.getViewModel().set({
                currentView: true,
                title: view.viewTitle
            });
        },
        remove: function (cmp) {
            cmp.getViewModel().set({
                currentView: false,
                title: null
            });
        }
    },

    items: [{
        layout: 'fit',
        xtype: 'panel',
        shadow: false,
        zIndex: 999,
        style: {
            background: '#EEE'
        },

        bind: {
            docked: '{(!smallScreen) ? "left" : null }',
            width: '{(!smallScreen) ? 320 : null }',
            hidden: '{ smallScreen && currentView }',
        },

        // hidden: true,

        // plugins: 'responsive',
        // responsiveConfig: {
        //     large: { docked: 'left', width: 320 },
        //     small: { docked: null }
        //     // formula: { width: 500 }
        // },

        // bind: {
        //     // docked: '{ screen === "WIDE" ? "left" : null }',
        //     width: '{ screen === "WIDE" ? 320 : null }',
        //     // hidden: '{params && screen !== "WIDE" }',
        //     // resizable: {
        //     //     split: '{ screen === "WIDE" }',
        //     //     direction: 'left',
        //     //     edges: 'east'
        //     // }
        // },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'searchfield',
                ui: 'faded',
                flex: 1,
                placeholder: 'Find settings...'.t(),
                listeners: {
                    change: 'filterSettings'
                }
            }]
        },

        items: [{
            xtype: 'treelist',
            scrollable: true,
            userCls: 'config-menu',
            ui: 'nav',
            style: {
                background: '#f5f5f5'
            },
            // micro: true,
            // selectable: {
            //     mode: 'single'
            // },

            animation: {
                duration: 150,
                easing: 'ease'
            },
            singleExpand: true,
            expanderFirst: false,
            expanderOnly: false,
            selectOnExpander: true,
            highlightPath: false,
            store: {
                type: 'tree',
                rootVisible: false,
                filterer: 'bottomup',
                root: {
                    expanded: true,
                    children: [{
                        text: '<strong>' + 'Network'.t() + '</strong>',
                        iconCls: 'tree network',
                        href: 'settings/network',
                        children: [
                            { text: 'Interfaces'.t(), leaf: true, href: 'settings/network/interfaces' },
                            { text: 'Interfaces Alt'.t(), leaf: true, href: 'settings/network/interfaces-alt' }
                        ]
                    }, {
                        text: '<strong>' + 'Firewall'.t() + '</strong>',
                        iconCls: 'tree administration',
                        href: 'settings/firewall',
                        children: [
                            { text: 'Port Forward Rules'.t(), leaf: true, href: 'settings/firewall/portforwardrules' },
                        ]
                    }, {
                        text: '<strong>' + 'System'.t() + '</strong>',
                        iconCls: 'tree system',
                        href: 'settings/system',
                        children: [
                            { text: 'Host/Domain'.t(), leaf: true, href: 'settings/system/host' }
                        ]
                    }, {
                        text: '<strong>' + 'Administration'.t() + '</strong>',
                        iconCls: 'tree administration',
                        href: 'settings/administration',
                        children: [
                            { text: 'Some Setting title'.t(), leaf: true }
                        ]
                    }]
                }
            },
            listeners: {
                selectionchange: function (el, record) {
                    // console.log(record);
                    if (!record || !record.get('href')) { return; }
                    Mfw.app.redirectTo(record.get('href'));
                }
            }
        }]
    },
    {
        xtype: 'mfw-settings-select',
        hidden: true,
        bind: {
            hidden: '{smallScreen || currentView}'
        }
    }
    ]
});

Ext.define('Mfw.view.settings.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.settings',

    filterSettings: function (field, value) {
        var me = this, tree = me.getView().up('panel').down('treelist');
        if (!value) {
            tree.getStore().clearFilter();

            tree.getStore().each(function (node) {
                if (!node.isLeaf()) {
                    node.collapse();
                }
            }, this, { filtered: true, collapsed: true });

            var node = tree.getStore().findNode('href', window.location.hash);
            Ext.defer(function () {
                tree.setSelection(node);
            }, 2000);

            tree.setSingleExpand(true);
            // tree.collapseAll();
            // field.getTrigger('clear').hide();
            return;
        }

        tree.setSingleExpand(false);

        tree.getStore().each(function (node) {
            if (!node.isLeaf()) {
                node.expand();
            }
        }, this, { filtered: true, collapsed: true });

        tree.getStore().getFilters().replaceAll({
            property: 'text',
            value: new RegExp(Ext.String.escape(value), 'i')
        });
        // tree.expandAll();
        // field.getTrigger('clear').show();
    },

    // onSelect: function (el, sel) {
    //     // console.log(selected);
    //     sel.selected = true;
    // },


    // onLoadConfig: function (configName, configTab) {
    //     var view = this.getView();
    //     if (!configName) {
    //         view.setActiveItem(1);
    //         return;
    //     }

    //     if (view.down('#configCard')) {
    //         view.down('#configCard').destroy();
    //     }

    //     var cfgName = configName.charAt(0).toUpperCase() + configName.slice(1).toLowerCase();

    //     console.log(cfgName);

    //     view.down('#subNav').getStore().each(function (item) {
    //         if (item.get('url') === configName) {
    //             item.set('selected', 'x-item-selected');
    //         } else {
    //             item.set('selected', '');
    //         }
    //     });


    //     view.setLoading('Loading ' + cfgName.t() + '...');
    //     console.log(cfgName);
    //     Ext.require('Ung.view.config.' + cfgName.toLowerCase() + '.' + cfgName, function () {
    //         view.down('#configWrapper').add({
    //             xtype: 'ung.config.' + cfgName.toLowerCase(),
    //             region: 'center',
    //             itemId: 'configCard'
    //         });
    //         view.setLoading(false);
    //         view.setActiveItem(2);
    //         console.log(configTab);
    //         if (configTab) {
    //             view.down('#configCard').setActiveItem(configTab);
    //         }
    //         // view.getViewModel().set('currentView', cfgName.toLowerCase());
    //         // console.log(view.down('#subNav'));
    //     });
    // },

    onDeactivate: function (view) {
        var list = view.down('treelist'),
            store = list.getStore();

        store.each(function (node) {
            if (!node.isLeaf()) {
                list.getItem(node).collapse();
            }
        });
        list.setSelection(null);
    }


});

Ext.define('Ung.view.settings.Select', {
    extend: 'Ext.Container',
    alias: 'widget.mfw-settings-select',

    layout: 'center',

    items: [{
        html: '<h1 style="font-weight: 100; color: #777;">Please select a Category/Setting!</h1>'
    }]
});

Ext.define('Mfw.settings.network.interface.Dhcp', {
    extend: 'Ext.Container',
    alias: 'widget.interface-dhcp',
    itemId: 'dhcp',

    headerTitle: 'DHCP'.t(),

    layout: 'fit',

    items: [{
        xtype: 'container',
        layout: 'center',
        html: 'DHCP Serving is Disabled'.t(),
        hidden: true,
        bind: { hidden: '{rec.dhcpEnabled}' }
    }, {
        xtype: 'container',
        padding: 8,
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right'
        },
        defaultType: 'textfield',
        hidden: true,
        bind: { hidden: '{!rec.dhcpEnabled}' },
        items: [{
            label: 'Range Start'.t(),
            name: 'dhcpRangeStart',
            bind: '{rec.dhcpRangeStart}'
        }, {
            label: 'Range End'.t(),
            name: 'dhcpRangeEnd',
            bind: '{rec.dhcpRangeEnd}'
        }, {
            xtype: 'numberfield',
            name: 'dhcpLeaseDuration',
            label: 'Lease Duration'.t(),
            bind: '{rec.dhcpLeaseDuration}'
        }, {
            label: 'Gateway Override'.t(),
            name: 'dhcpGatewayOverride',
            bind: '{rec.dhcpGatewayOverride}'
        }, {
            xtype: 'combobox',
            name: 'dhcpPrefixOverride',
            label: 'Netmask Override'.t(),
            bind: '{rec.dhcpPrefixOverride}'
        }, {
            label: 'DNS Override'.t(),
            name: 'dhcpDNSOverride',
            bind: '{rec.dhcpDNSOverride}'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{!rec.dhcpEnabled}' },
        items: ['->', {
            xtype: 'button',
            text: 'DHCP Options'.t(),
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#dhcp-options');
            }
        }]
    }]
});

Ext.define('Mfw.settings.network.interface.DhcpOptions', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-dhcp-options',
    itemId: 'dhcp-options',

    headerTitle: 'DHCP Options'.t(),

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    // plugins: {
    //     gridcellediting: true
    // },

    store: {
        data: [
            { enabled: true, description: 'aaaaa', value: 'bbbbb' }
        ]
    },

    columns: [{
        xtype: 'checkcolumn',
        width: 44,
        dataIndex: 'enabled'
    }, {
        text: 'Description'.t(),
        dataIndex: 'description',
        editable: true,
        flex: 1
    }, {
        text: 'Value'.t(),
        dataIndex: 'value',
        editable: true
    }, {
        width: 44,
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'delete',
                iconCls: 'x-fa fa-times'
            }]
        }
    }]

});

Ext.define('Mfw.settings.network.interface.Dialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',
    controller: 'settings-interface-dialog',
    viewModel: 'settings-interface-viewmodel',
    // title: 'Edit Interface'.t(),

    showAnimation: null,
    hideAnimation: null,

    scrollable: true,
    // closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel',
    layout: 'fit',
    // alwaysOnTop: true, // important
    maximized: false,
    maximizeAnimation: null,

    padding: 0,

    height: 500,
    bind: {
        maximized: '{smallScreen}',
        minWidth: '{!smallScreen ? 320 : null}',
        maxHeight: '{!smallScreen ? 600 : null}',
    },
    // bodyPadding: '0 16',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        // padding: '10 8',
        shadow: false,
        style: { background: 'transparent' },
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-left',
            margin: '0 8 0 0',
            hidden: true,
            bind: { hidden: '{isMainCard}' },
            handler: 'onBack'
        }, {
            xtype: 'component',
            bind: { html: '{title} / <span style="font-size: smaller; font-weight: 100;">{rec.device}, {rec.wan ? "WAN" : "nonWAN"}</span>' }
            // html: 'Edit Interface'.t()
        }, '->',
        // {
        //     xtype: 'togglefield',
        //     hidden: true,
        //     bind: {
        //         hidden: '{!enableIpv6Toggle}',
        //         value: '{rec.v6ConfigType !== "DISABLED"}'
        //     }
        // },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            ui: 'action round',
            hidden: true,
            bind: { hidden: '{!addGridItemsBtn}' },
            handler: 'addGridItem'
        }, {
            xtype: 'togglefield',
            hidden: true,
            bind: {
                hidden: '{!enableDhcpToggle}',
                value: '{rec.dhcpEnabled}'
            }
        }, {
            xtype: 'togglefield',
            hidden: true,
            bind: {
                hidden: '{!enableVrrpToggle}',
                value: '{rec.vrrpEnabled}'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        defaultType: 'button',
        ui: 'footer',
        hidden: true,
        bind: { hidden: '{!isMainCard}' },
        items: [
            '->',
            { text: 'Cancel'.t(), handler: 'onCancel' },
            { text: 'Apply'.t(), handler: 'onApply' }
            // '->',
        ]
    }, {
        xtype: 'formpanel',
        reference: 'form',
        // modelValidation: true,
        layout: {
            type: 'card',
            deferRender: false, // important so the validation works if card not yet visible
            animation: {
                duration: 150,
                type: 'slide',
                direction: 'horizontal'
            },
        },
        scrollable: 'y',
        padding: 0,
        margin: 0,

        // defaults: {
        //     margin: '8 0'
        // },

        items: [
            { xtype: 'interface-main' },
            { xtype: 'interface-ipv4' },
            { xtype: 'interface-ipv4-aliases' },
            { xtype: 'interface-ipv6' },
            { xtype: 'interface-ipv6-aliases' },
            { xtype: 'interface-dhcp' },
            { xtype: 'interface-dhcp-options' },
            { xtype: 'interface-vrrp' },
            { xtype: 'interface-vrrp-aliases' }
        ],

        listeners: {
            activeItemchange: 'onActiveItemChange'
        }

    }],
    listeners: {
        initialize: 'onInitialize'
    }
});

Ext.define('Mfw.settings.network.interface.DialogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings-interface-dialog',

    onInitialize: function () {
        var me = this, vm = me.getViewModel();
        vm.bind('{rec.wan}', function (wan) {
            if (!wan) {
                vm.set('rec.v4ConfigType', 'STATIC');
                vm.set('rec.v6ConfigType', 'STATIC');
            }
        });
    },


    /**
     * updates card layout animation based if it's main card or subcards
     */
    onActiveItemChange: function (cnt, card, oldValue) {
        var me = this, vm = me.getViewModel();
        // console.log(value.getItemId());
        // console.log(value.title);
        vm.set({
            title: card.headerTitle,
            cardId: card.getItemId(),
            isMainCard: card.getItemId() === 'main'
        });
        // if (cnt.getActiveItem().getItemId() === 'maincard') {
        // }
    },

    onApply: function (btn) {
        var me = this, vm = me.getViewModel(),
            dialog = me.getView(),
            grid = dialog.up('grid'),
            form = dialog.down('formpanel');
        // // console.log(vm.get('rec').isValid());
        var invalidFields = '';

        Ext.Object.each(form.getFields(), function(key, field) {
            if (field.validate()) { return; }
            invalidFields += '<strong>' + (field.errorLabel || field.getLabel()) + '</strong>: <span style="color: red;">' + field.getErrorMessage() + '</span><br/>';
        })
        if (invalidFields.length > 0) {
            Ext.Msg.alert('Invalid fields'.t(), 'Please correct the following: <br/>' + invalidFields);
            return;
        }

        if (dialog.isNewRecord) {
            grid.getStore().add(vm.get('rec'));
        }

        // Ext.Msg.confirm('<span class="x-fa fa-cogs"></span> Apply Changes?'.t(),
        //     '<p><strong>It might take a while for the changes to take effect!</strong></p>' +
        //     '<p>If you want to make additional changes, do them before saving!</p>',
        //     function (answer) {
        //         if (answer === 'no') {
        //             return;
        //         }
        //         btn.up('dialog').hide();
        //     });

        btn.up('dialog').hide();

    },
    onCancel: function (btn) {
        btn.up('dialog').hide();
    },

    onBack: function () {
        var me = this, formpanel = me.getView().down('formpanel');
        switch (formpanel.getActiveItem().getItemId()) {
            case 'ipv4-aliases': formpanel.setActiveItem('#ipv4'); break;
            case 'ipv6-aliases': formpanel.setActiveItem('#ipv6'); break;
            case 'vrrp-aliases': formpanel.setActiveItem('#vrrp'); break;
            case 'dhcp-options': formpanel.setActiveItem('#dhcp'); break;
            default: formpanel.setActiveItem(0); break;
        }
    },

    addGridItem: function () {
        var me = this, grid = me.getView().down('formpanel').getActiveItem();

        grid.getStore().add(
            { v4Address: '12345', v4Prefix: '10' }
        );
    }

});

Ext.define('Mfw.settings.network.interface.DialogModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.settings-interface-viewmodel',

    data: {
        rec: null,
        title: 'Edit Interface'.t(),
        cardId: 'main',
        isMainCard: true
    },
    formulas: {
        availableSettings: function (get) {
            var settings = [], v4ConfigType, v6ConfigType;

            switch (get('rec.v4ConfigType')) {
                case 'DHCP': v4ConfigType = 'DHCP'.t(); break;
                case 'STATIC': v4ConfigType = 'Static'.t(); break;
                case 'PPPOE': v4ConfigType = 'PPPoE'.t(); break;
                default:
            }

            switch (get('rec.v6ConfigType')) {
                case 'DHCP': v6ConfigType = 'DHCP'.t(); break;
                case 'SLAAC': v6ConfigType = 'SLAAC'.t(); break;
                case 'ASSIGN': v6ConfigType = 'Assign'.t(); break;
                case 'STATIC': v6ConfigType = 'Static'.t(); break;
                case 'DISABLED': v6ConfigType = 'Disabled'.t(); break;
                default:
            }

            if (get('rec.configType') === 'ADDRESSED') {
                settings.push({ text: 'IPv4'.t(), status: v4ConfigType, card: 'ipv4' });
                settings.push({ text: 'IPv6'.t(), status: v6ConfigType, card: 'ipv6' });
                if (!get('rec.wan')) {
                    settings.push({ text: 'DHCP'.t(), status: get('rec.dhcpEnabled') ? 'Enabled'.t() : 'Disabled'.t(), card: 'dhcp' });
                }
                settings.push({ text: 'VRRP (Redundancy)'.t(), status: get('rec.vrrpEnabled') ? 'Enabled'.t() : 'Disabled'.t(), card: 'vrrp' });
            }
            return settings;
        },

        enableIpv6Toggle: function (get) {
            return get('rec.wan') && get('cardId') === 'ipv6';
        },

        enableDhcpToggle: function (get) {
            return !get('rec.wan') && get('cardId') === 'dhcp';
        },

        enableVrrpToggle: function (get) {
            return get('cardId') === 'vrrp';
        },

        addGridItemsBtn: function (get) {
            return Ext.Array.contains(['ipv4-aliases', 'ipv6-aliases', 'vrrp-aliases', 'dhcp-options'], get('cardId'));
        },
    }

});

Ext.define('Mfw.settings.network.interface.Ipv4', {
    extend: 'Ext.Container',
    alias: 'widget.interface-ipv4',
    itemId: 'ipv4',

    headerTitle: 'IPv4'.t(),

    layout: 'vbox',

    scrollable: 'y',

    items: [{
        xtype: 'combobox',
        name: 'v4ConfigType',
        reference: 'v4Config',
        label: 'Config Type'.t(),
        labelAlign: 'left',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        margin: '0 16',
        disabled: true,
        bind: {
            value: '{rec.v4ConfigType}',
            disabled: '{!rec.wan}'
        },
        store: [
            { name: 'Auto (DHCP)'.t(), value: 'DHCP' },
            { name: 'Static'.t(),   value: 'STATIC' },
            { name: 'PPPoE'.t(),  value: 'PPPOE' }
        ],
    }, {
        xtype: 'togglefield',
        name: 'overrideDefaults',
        boxLabel: 'Override defaults'.t(),
        reference: 'override',
        margin: '0 16',
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "DHCP"}' }
    }, {
        xtype: 'container',
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "DHCP"}' },
        items: [{
            xtype: 'container',
            padding: 8,
            layout: {
                type: 'form',
                itemSpacing: 8
            },
            defaults: {
                labelTextAlign: 'right',
                labelWidth: 100,
                disabled: true,
                hidden: true,
                bind: {
                    disabled: '{!override.value}',
                    hidden: '{!override.value}'
                }
            },
            items: [{
                xtype: 'textfield',
                name: 'v4DhcpAddressOverride',
                label: 'Address'.t(),
                bind: {
                    value: '{rec.v4DhcpAddressOverride}',
                    placeholder: '{rec.v4StaticAddress}'
                }
            }, {
                xtype: 'combobox',
                name: 'v4DhcpPrefixOverride',
                label: 'Netmask'.t(),
                queryMode: 'local',
                displayField: 'text',
                valueField: 'value',
                editable: false,
                clearable: true,
                bind: {
                    value: '{rec.v4DhcpPrefixOverride}',
                    placeholder: '{rec.v4StaticPrefix}'
                },
                store: ArrayStore.netmask
            }, {
                xtype: 'textfield',
                name: 'v4DhcpGatewayOverride',
                label: 'Gateway'.t(),
                bind: {
                    value: '{rec.v4DhcpGatewayOverride}',
                    placeholder: '{rec.v4StaticGateway}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS1Override',
                label: 'Primary DNS'.t(),
                bind: {
                    value: '{rec.v4DhcpDNS1Override}',
                    placeholder: '{rec.v4StaticDNS1}'
                }
            }, {
                xtype: 'textfield',
                name: 'v4DhcpDNS2Override',
                label: 'Secondary DNS'.t(),
                bind: {
                    value: '{rec.v4DhcpDNS2Override}',
                    placeholder: '{rec.v4StaticDNS2}'
                }
            }]
        }]
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "STATIC"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
            disabled: true
        },
        items: [{
            xtype: 'textfield',
            name: 'v4StaticAddress',
            label: 'Addres'.t(),
            errorLabel: 'IPv4 Static Address'.t(),
            required: false,
            bind: {
                value: '{rec.v4StaticAddress}',
                required: '{rec.v4ConfigType === "STATIC"}'
            },
            validators: ['ipaddress']
        }, {
            xtype: 'combobox',
            name: 'v4StaticPrefix',
            label: 'Netmask'.t(),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            // clearable: true,
            required: false,
            bind: {
                value: '{rec.v4StaticPrefix}',
                required: '{rec.v4ConfigType === "STATIC"}'
            },
            store: ArrayStore.netmask
        }, {
            xtype: 'textfield',
            name: 'v4StaticGateway',
            label: 'Gateway'.t(),
            errorLabel: 'IPv4 Static Gateway'.t(),
            hidden: true,
            required: false,
            bind: {
                value: '{rec.v4StaticGateway}',
                hidden: '{!rec.wan}',
                required: '{rec.wan && rec.v4ConfigType === "STATIC"}'
            },
            validators: ['presence', 'ipaddress']
        }, {
            xtype: 'textfield',
            name: 'v4StaticDNS1',
            label: 'Primary DNS'.t(),
            hidden: true,
            bind: {
                value: '{rec.v4StaticDNS1}',
                hidden: '{!rec.wan}'
            }
        }, {
            xtype: 'textfield',
            name: 'v4StaticDNS2',
            label: 'Secondary DNS'.t(),
            hidden: true,
            bind: {
                value: '{rec.v4StaticDNS2}',
                hidden: '{!rec.wan}'
            }
        }]
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v4ConfigType !== "PPPOE"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaultType: 'textfield',
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        items: [{
            label: 'Username'.t(),
            name: 'v4PPoEUsername',
            required: false,
            bind: {
                value: '{rec.v4PPoEUsername}',
                required: '{rec.v4ConfigType === "PPPOE"}'
            }
        }, {
            inputType: 'password',
            name: 'v4PPoEPassword',
            label: 'Password'.t(),
            required: false,
            bind: {
                value: '{rec.v4PPoEPassword}',
                required: '{rec.v4ConfigType === "PPPOE"}'
            }
        }, {
            xtype: 'checkbox',
            name: 'v4PPPoEUsePeerDNS',
            label: 'Use Peer DNS'.t(),
            bind: '{rec.v4PPPoEUsePeerDNS}'
        }, {
            label: 'Primary DNS'.t(),
            name: 'v4PPPoEOverrideDNS1',
            disabled: true,
            bind: {
                value: '{rec.v4PPPoEOverrideDNS1}',
                disabled: '{rec.v4PPPoEUsePeerDNS}'
            }
        }, {
            label: 'Secondary DNS'.t(),
            name: 'v4PPPoEOverrideDNS2',
            disabled: true,
            bind: {
                value: '{rec.v4PPPoEOverrideDNS2}',
                disabled: '{rec.v4PPPoEUsePeerDNS}'
            }
        }]
    }, {
        xtype: 'togglefield',
        name: 'natEgress',
        boxLabel: 'NAT traffic exiting this interface<br/>(and bridged peers)'.t(),
        margin: '0 16',
        hidden: true,
        bind: {
            value: '{rec.natEgress}',
            hidden: '{!rec.wan}'
        }
    }, {
        xtype: 'togglefield',
        name: 'natIngress',
        boxLabel: 'NAT traffic coming from this interface<br/>(and bridged peers)'.t(),
        margin: '0 16',
        hidden: true,
        bind: {
            value: '{rec.natIngress}',
            hidden: '{rec.wan}'
        }
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            xtype: 'button',
            text: 'IPv4 Aliases',
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#ipv4-aliases');
            }
        }]
    }]
});

Ext.define('Mfw.settings.network.interface.Ipv4Aliases', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-ipv4-aliases',
    itemId: 'ipv4-aliases',

    headerTitle: 'IPv4 Aliases'.t(),

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    // plugins: {
    //     gridcellediting: true
    // },

    store: {
        data: [
            { v4Address: '1.2.3.4', v4Prefix: '8' }
        ]
    },

    columns: [{
        text: 'Address'.t(),
        dataIndex: 'v4Address',
        editable: true
    }, {
        text: 'Netmask/Prefix'.t(),
        dataIndex: 'v4Prefix',
        editable: true,
        flex: 1
    }, {
        width: 44,
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'delete',
                iconCls: 'x-fa fa-times'
            }]
        }
    }]

});

Ext.define('Mfw.settings.network.interface.Ipv6', {
    extend: 'Ext.Container',
    alias: 'widget.interface-ipv6',
    itemId: 'ipv6',

    headerTitle: 'IPv6'.t(),

    layout: 'vbox',

    scrollable: 'y',

    items: [{
        xtype: 'combobox',
        name: 'v6ConfigType',
        reference: 'v4Config',
        label: 'Config Type'.t(),
        labelAlign: 'left',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        margin: '0 16',
        disabled: true,
        bind: {
            value: '{rec.v6ConfigType}',
            disabled: '{!rec.wan}'
        },
        store: [
            { name: 'Auto (DHCP)'.t(), value: 'DHCP' },
            { name: 'SLAAC'.t(), value: 'SLAAC' },
            { name: 'Assign'.t(), value: 'ASSIGN' },
            { name: 'Static'.t(),   value: 'STATIC' },
            { name: 'Disabled'.t(),  value: 'DISABLED' }
        ]
    }, {
        xtype: 'container',
        padding: 16,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "DHCP"}' },
        html: 'DHCP conf'
    }, {
        xtype: 'container',
        padding: 16,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "SLAAC"}' },
        html: 'SLAAC conf'
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "ASSIGN"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        items: [{
            xtype: 'textfield',
            name: 'v6AssignHint',
            label: 'Assign Hint'.t(),
            errorLabel: 'IPv6 Assign Hint'.t(),
            required: false,
            bind: {
                value: '{rec.v6AssignHint}',
                required: '{rec.v6ConfigType === "ASSIGN"}'
            }
        }, {
            xtype: 'numberfield',
            name: 'v6AssignPrefix',
            label: 'Assign Prefix'.t(),
            errorLabel: 'IPv6 Assign Prefix'.t(),
            placeholder: 'Integer between 1 and 128',
            decimals: 0,
            minValue: 1,
            maxValue: 128,
            required: false,
            allowBlank: true,
            bind: {
                value: '{rec.v6AssignPrefix}',
                required: '{rec.v6ConfigType === "ASSIGN"}'
            }
        }]
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "STATIC"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        defaultType: 'textfield',
        items: [{
            label: 'Address'.t(),
            name: 'v6StaticAddress',
            bind: '{rec.v6StaticAddress}'
        }, {
            xtype: 'numberfield',
            name: 'v6StaticPrefix',
            label: 'Prefix Length'.t(),
            bind: '{rec.v6StaticPrefix}',
        }, {
            label: 'Gateway'.t(),
            name: 'v6StaticGateway',
            hidden: true,
            bind: {
                value: '{rec.v6StaticGateway}',
                hidden: '{!rec.wan}'
            }
        }, {
            label: 'Primary DNS'.t(),
            name: 'v6StaticDNS1',
            hidden: true,
            bind: {
                value: '{rec.v6StaticDNS1}',
                hidden: '{!rec.wan}'
            }
        }, {
            label: 'Secondary DNS'.t(),
            name: 'v6StaticDNS2',
            hidden: true,
            bind: {
                value: '{rec.v6StaticDNS2}',
                hidden: '{!rec.wan}'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType === "DISABLED"}' },
        items: ['->', {
            xtype: 'button',
            text: 'IPv6 Aliases',
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#ipv6-aliases');
            }
        }]
    }]
});

Ext.define('Mfw.settings.network.interface.Ipv6Aliases', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-ipv6-aliases',
    itemId: 'ipv6-aliases',

    headerTitle: 'IPv6 Aliases'.t(),

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    // plugins: {
    //     gridcellediting: true
    // },

    store: {
        data: [
            { v6Address: '12345', v6Prefix: '10' }
        ]
    },

    columns: [{
        text: 'Address'.t(),
        dataIndex: 'v6Address',
        editable: true
    }, {
        text: 'Netmask/Prefix'.t(),
        dataIndex: 'v6Prefix',
        editable: true,
        flex: 1
    }, {
        width: 44,
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'delete',
                iconCls: 'x-fa fa-times'
            }]
        }
    }]

});

Ext.define('Mfw.settings.network.interface.Main', {
    extend: 'Ext.Container',
    alias: 'widget.interface-main',

    headerTitle: 'Edit Interface'.t(),

    itemId: 'main',
    scrollable: true,
    padding: '0',
    layout: {
        type: 'vbox'
    },
    defaults: {
        labelAlign: 'left',
        labelWidth: 80,
        // margin: '0'
        // labelTextAlign: 'right'
    },
    items: [{
        xtype: 'container',
        padding: '0 16 16 16',
        layout: {
            type: 'vbox',
            // itemSpacing: 8,
        },
        defaults: {
            labelWidth: 80,
            padding: 0,
            margin: 0,
            labelAlign: 'left',
            labelTextAlign: 'right'
        },
        items: [{
            xtype: 'textfield',
            name: 'name',
            label: 'Name'.t(),
            autoComplete: false,
            errorLabel: 'Interface Name'.t(),
            required: true,
            bind: '{rec.name}'
        }, {
            xtype: 'combobox',
            name: 'configType',
            label: 'Type'.t(),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            required: true,
            bind: '{rec.configType}',
            store: [
                { name: 'Addressed'.t(), value: 'ADDRESSED' },
                { name: 'Bridged'.t(),   value: 'BRIDGED' },
                { name: 'Disabled'.t(),  value: 'DISABLED' }
            ]
        }, {
            xtype: 'combobox',
            name: 'bridgedTo',
            label: 'Bridged To'.t(),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            required: false,
            forceSelection: true,
            hidden: true,
            bind: {
                hidden: '{rec.configType !== "BRIDGED"}',
                required: '{rec.configType === "BRIDGED"}'
            },
            store: [
                { name: 'Intf 1'.t(), value: '1' },
                { name: 'Intf 2'.t(),   value: '2' }
            ]
        }, {
            xtype: 'togglefield',
            name: 'wan',
            // margin: '0 16',
            label: 'Is WAN'.t(),
            required: true,
            hidden: true,
            bind: {
                value: '{rec.wan}',
                hidden: '{rec.configType !== "ADDRESSED"}'
            }
        }, {
            xtype: 'numberfield',
            name: 'interfaceId',
            label: 'Interface ID'.t(),
            required: true,
            bind: '{rec.interfaceId}'
        }]
    }, {
        xtype: 'component',
        height: 3,
        style: 'background: #EEE',
        html: '',
    },
        {
        xtype: 'list',
        disableSelection: true,
        // userCls: 'config-menu',
        // ui: 'nav',
        margin: 4,
        itemTpl: '<strong>{text}</strong> / {status}',
        onItemDisclosure: Ext.emptyFn,
        bind: {
            store: {
                data: '{availableSettings}'
            }
        },
        listeners: {
            childtap: function (list, location) {
                list.up('formpanel').setActiveItem('#' + location.record.get('card'));
            }
        }
    }]
});

Ext.define('Mfw.settings.network.interface.Vrrp', {
    extend: 'Ext.Container',
    alias: 'widget.interface-vrrp',
    itemId: 'vrrp',

    headerTitle: 'VRRP'.t(),

    layout: 'fit',

    items: [{
        xtype: 'container',
        layout: 'center',
        html: 'Redundancy (VRRP) is Disabled'.t(),
        hidden: true,
        bind: { hidden: '{rec.vrrpEnabled}' }
    }, {
        xtype: 'container',
        padding: 16,
        layout: {
            type: 'vbox',
            // itemSpacing: 8
        },
        hidden: true,
        bind: { hidden: '{!rec.vrrpEnabled}' },
        defaultType: 'numberfield',
        defaults: {
            margin: 0,
            labelAlign: 'left',
            labelWidth: 100,
            // labelTextAlign: 'right',
            inputType: 'number',
            errorTarget: 'qtip',
            // required: true,
            // decimals: 0,
            // minValue: 1,
            // maxValue: 255,
            // minValueText: 'Should be 1 - 255'
        },
        items: [{
            label: 'VRRP ID'.t(),
            name: 'vrrpID',
            required: false,
            bind: {
                value: '{rec.vrrpID}',
                required: '{rec.vrrpEnabled}'
            }
        }, {
            label: 'VRRP Priority'.t(),
            name: 'vrrpPriority',
            required: false,
            bind: {
                value: '{rec.vrrpPriority}',
                required: '{rec.vrrpEnabled}'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{!rec.vrrpEnabled}' },
        items: ['->', {
            xtype: 'button',
            text: 'VRRP Aliases',
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#vrrp-aliases');
            }
        }]
    }]
});

Ext.define('Mfw.settings.network.interface.VrrpAliases', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-vrrp-aliases',
    itemId: 'vrrp-aliases',

    headerTitle: 'VRRP Aliases'.t(),

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    // plugins: {
    //     gridcellediting: true
    // },

    store: {
        data: [
            { v4Address: '12345', v4Prefix: '10' }
        ]
    },

    columns: [{
        text: 'Address'.t(),
        dataIndex: 'v4Address',
        editable: true
    }, {
        text: 'Netmask/Prefix'.t(),
        dataIndex: 'v4Prefix',
        editable: true,
        flex: 1
    }, {
        width: 44,
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'delete',
                iconCls: 'x-fa fa-times'
            }]
        }
    }]

});

Ext.define('Mfw.settings.firewall.PortForwardRules', {
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-firewall-portforwardrules',

    title: 'Port Forward Rules'.t(),
    // viewTitle: 'Port Forward Rules'.t(),
    // title: 'Port Forward Rules'.t() + '<br/><span style="font-size: 12px;">Firewall</span>',
    // items: [{
    //     xtype: 'toolbar',
    //     docked: 'top',
    //     items: [{
    //         xtype: 'component',
    //         style: 'color: #777; font-size: 18px; font-weight: normal;',
    //         html: 'Port Forward Rules'.t() + '<br/><span style="font-size: 12px;">Firewall</span>'
    //     }]
    //     // margin: '0 0 0 8',
    // }],

    config: {
    },

    scrollable: true,
    store: {
        data: [
            {
                ruleId: 1,
                enabled: true,
                description: 'Some desc',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }, {
                    conditionType: 'PROTOCOL',
                    invert: false,
                    value: '80'
                }, {
                    conditionType: 'HTTP_URL',
                    invert: false,
                    value: 'someurl.com'
                }, {
                    conditionType: 'CLIENT_QUOTA_EXCEEDED',
                    invert: false,
                    value: true
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
            {
                ruleId: 2,
                enabled: true,
                description: 'Some desc 2',
                conditions: [],
                newDestination: '1.2.3.5',
                newPort: 90
            },
            {
                ruleId: 3,
                enabled: true,
                description: 'Some desc 3',
                conditions: [],
                newDestination: '1.2.3.8',
                newPort: 90
            },
            {
                ruleId: 4,
                enabled: false,
                description: 'Some desc 4',
                conditions: [],
                newDestination: '123.456.789.12',
                newPort: 100
            },
            {
                ruleId: 5,
                enabled: true,
                description: 'Some desc',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
            {
                ruleId: 6,
                enabled: true,
                description: 'Some more text',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
            {
                ruleId: 7,
                enabled: false,
                description: 'Description Long Text',
                conditions: [{
                    conditionType: 'DST_ADDR',
                    invert: false,
                    value: '1.2.3.4'
                }, {
                    conditionType: 'DST_PORT',
                    invert: true,
                    value: '2345'
                }],
                newDestination: '1.2.3.4',
                newPort: 80
            },
        ]
    },

    // plugins: ['rowexpander'],

    // itemConfig: {
    //     body: {
    //         tpl: new Ext.XTemplate('<tpl if="conditions.length &gt; 0"><tpl for="conditions">' +
    //                 '<span style="font-size: 12px; padding: 0 10px 0 0;"><strong>{[this.condName(values.conditionType)]}</strong> <span style="padding: 0 2px;"><tpl if="invert">IS NOT<tpl else>IS</tpl></span> <strong>{value}</strong></span><br/>' +
    //              '</tpl><tpl else>none</tpl>', {
    //              condName: function (conditionType) {
    //                  var r = Ext.getStore('ruleconditions').findRecord('value', conditionType);
    //                  return r.get('name');
    //              }
    //              })
    //     }
    // },

    columns: [{
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        width: 50,
        align: 'right',
        hidden: true,
        renderer: function (v) {
            return '#' + v;
        }
    }, {
        // text: 'Enabled',
        align: 'center',
        width: 55,
        dataIndex: 'enabled',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'togglefield',
                margin: '0 10',
                disabled: true,
                bind: {
                    disabled: '{record._deleteSchedule}'
                }
            }
        }
    }, {
        text: 'Description',
        dataIndex: 'description',
        minWidth: 300
        // flex: 1
    }, {
        text: 'Conditions'.t(),
        dataIndex: 'conditions',
        flex: 1,
        cell: {
            userCls: 'ctip',
            bodyStyle: {
                padding: 0
            },
            encodeHtml: false
        },
        renderer: function (conditions, meta) {
            var strArr = [];
            Ext.Array.each(conditions, function (c) {
                strArr.push('<div class="condition"><span>' + Ext.getStore('ruleconditions').findRecord('value', c.conditionType).get('name') + '</span>' +
                       (c.invert ? ' &ne; ' : ' = ') + '<strong>' + c.value + '</strong></div>');
            });
            // console.log(value);
            return strArr.join(' <i class="x-fa fa-circle" style="font-size: 8px; color: #999; line-height: 12px;"></i> ');
        }
    }, {
        text: 'New Destination'.t(),
        dataIndex: 'newDestination',
        width: 150
    }, {
        text: 'New Port'.t(),
        dataIndex: 'newPort',
        width: 100
    }],

    // listeners: {
    //     added: function (view) {
    //         console.log(view);
    //         view.tip = Ext.create('Ext.tip.ToolTip', {
    //             // The overall target element.
    //             target: view.getId(),
    //             showDelay: 0,
    //             hideDelay: 0,
    //             align: 'tl-bl',
    //             anchor: true,
    //             anchorToTarget: true,
    //             // Each grid row's name cell causes its own separate show and hide.
    //             delegate: '.ctip',
    //             // Moving within the cell should not hide the tip.
    //             trackMouse: false,
    //             listeners: {
    //                 // Change content dynamically depending on which element triggered the show.
    //                 beforeshow: function updateTipBody(tip, e) {
    //                     console.log(tip.currentTarget.dom);
    //                     // Fetch grid view here, to avoid creating a closure.
    //                     // var tipGridView = tip.target.component;
    //                     // var record = tipGridView.getRecord(tip.triggerElement);

    //                     tip.setHtml('aaaaa doklsfjdksfj sdfk kdjs fkdsjfkdsjfdks j');
    //                 }
    //             }
    //         });
    //     }
    // }
});

Ext.define('Mfw.settings.network.Interfaces', {
    // extend: 'Ext.grid.Grid',
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-network-interfaces',

    controller: 'mfw-settings-network-interfaces',

    title: 'Interfaces'.t(),

    config: {
        enableManualSort: false,
        enableDelete: '{record.wan}',
        editorDialog: 'interface-dialog',
        newRecordModel: 'Mfw.model.Interface'
    },

    sortable: false,

    scrollable: true,
    store: {
        type: 'interfaces'
    },

    // plugins: ['rowexpander'],

    // itemConfig: {
    //     body: {
    //         tpl: '<tpl if="dhcpEnabled === true">' +
    //                 '<div><strong>DHCP</strong>: enabled, <strong>Range</strong>: {dhcpRangeStart} - {dhcpRangeEnd}, <strong>Lease Duration</strong>: {dhcpLeaseDuration/60}</div>' +
    //              '</tpl>' +
    //              '<div><strong>IPv4</strong>: {v4ConfigType}, {v4StaticAddress} / {v4StaticPrefix}</div>' +
    //              '<div><strong>IPv6</strong>: {v6ConfigType}</div>'
    //     }
    // },

    bind: {
        hideHeaders: '{smallScreen}'
    },

    columns: [{
        text: 'Name'.t(),
        dataIndex: 'name',
        flex: 1,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Device'.t(),
        dataIndex: 'device',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Config Type'.t(),
        dataIndex: 'configType',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Is WAN',
        dataIndex: 'wan',
        align: 'center',
        menuDisabled: true,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="x-fa fa-check">' : '';
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
    }]
});

Ext.define('Mfw.settings.network.InterfacesAlt', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-network-interfaces-alt',

    viewTitle: 'Interfaces Alt'.t(),

    scrollable: true,
    store: 'interfaces',

    plugins: ['rowexpander'],

    itemConfig: {
        body: {
            tpl: '<tpl if="dhcpEnabled === true">' +
                    '<div><strong>DHCP</strong>: enabled, <strong>Range</strong>: {dhcpRangeStart} - {dhcpRangeEnd}, <strong>Lease Duration</strong>: {dhcpLeaseDuration/60}</div>' +
                 '</tpl>' +
                 '<div><strong>IPv4</strong>: {v4ConfigType}, {v4StaticAddress} / {v4StaticPrefix}</div>' +
                 '<div><strong>IPv6</strong>: {v6ConfigType}</div>'
        }
    },

    selectable: false,

    columns: [{
        text: 'Name'.t(),
        dataIndex: 'name',
        minWidth: 150,
        flex: 1
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
    }, {
        text: 'Device'.t(),
        dataIndex: 'device'
    }, {
        text: 'Config Type'.t(),
        dataIndex: 'configType'
    }, {
        text: 'Is WAN',
        dataIndex: 'wan',
        align: 'center',
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="x-fa fa-check">' : '';
        }
    }, {
        text: 'Edit',
        width: 'auto',
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'edit',
                iconCls: 'x-fa fa-pencil',
                handler: 'onEdit'
            }]
        }
    }],


    controller: {
        onEdit: function (grid, info) {
            var me = this;
            if (!me.dialog) {
                me.dialog = Ext.Viewport.add({
                    xtype: 'interface-dialog',
                    // ownerCmp: grid
                });
            }
            me.dialog.getViewModel().set('rec', info.record);
            me.dialog.show();
        }
    }

});

Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    // onEditRecord: function (cmp, info) {
    //     console.log(cmp.getRecord());
    //     var me = this;
    //     if (!me.dialog) {
    //         me.dialog = Ext.Viewport.add({
    //             xtype: 'interface-dialog',
    //             // ownerCmp: grid
    //         });
    //     }
    //     // info.record.getValidation()

    //     me.dialog.getViewModel().set('rec', cmp.getRecord());
    //     me.dialog.show();
    // },

    // onSave: function () {
    //     var me = this,
    //         data = Ext.Array.pluck(me.getView().getStore().getRange(), 'data');

    //     // var original = [{"configType":"ADDRESSED","device":"eth0","dhcpEnabled":true,"dhcpLeaseDuration":3600,"dhcpRangeEnd":"192.168.1.200","dhcpRangeStart":"192.168.1.100","interfaceId":1,"name":"internal","type":"NIC","v4ConfigType":"STATIC","v4StaticAddress":"192.168.1.1","v4StaticPrefix":24,"v6AssignHint":"1234","v6AssignPrefix":64,"v6ConfigType":"ASSIGN","wan":false},{"configType":"ADDRESSED","device":"eth1","interfaceId":2,"name":"external","natEgress":true,"type":"NIC","v4ConfigType":"DHCP","v6ConfigType":"DISABLED","wan":true}];
    //     // use a simple AJAX post to push all the grid data for now
    //     me.getView().mask();
    //     Ext.Ajax.request({
    //         url: window.location.origin + '/settings/set_settings/network/interfaces',
    //         method: 'POST',
    //         params: Ext.JSON.encode(data),
    //         success: function(response, opts) {
    //             var obj = Ext.decode(response.responseText);
    //             me.getView().unmask();
    //             Ext.toast('Settings saved!');
    //             console.dir(obj);
    //         },

    //         failure: function(response, opts) {
    //             me.getView().mask();
    //             Ext.toast('Error while saving settings!');
    //             console.log('server-side failure with status code ' + response.status);
    //         }
    //     });

    //     // this will be used when full REST features will be supported
    //     // me.getView().getStore().sync();
    // },

    onAdd: function () {
        var me = this, store = me.getView().getStore();
        var rec = Ext.create('Mfw.model.Interface', {
            name: 'new interface',
            // interfaceId: 0
        });
        store.add(rec);
    }
});

Ext.define('Mfw.settings.system.Host', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-host',

    viewTitle: 'Host/Domain'.t(),
    header: false,

    padding: 16,


    // layout: "form",
    // bind: {
    //     layout: '{!smallScreen ? "form" : "vbox"}',
    // },

    // defaults: {
    //     labelAlign: 'right'
    // },

    items: [{
        xtype: 'textfield',
        label: 'Host Name'.t(),
        labelAlign: 'top'
    }, {
        xtype: 'textfield',
        label: 'Domain Name'.t(),
        labelAlign: 'top'
    }],

    buttons: {
        save: {
            text: 'Save'.t(),
            ui: 'action'
        }
    }

});

Ext.define('Mfw.controller.MfwController', {
    extend: 'Ext.app.Controller',
    namespace: 'Mfw',
    // stores: [
    //     'Interfaces'
    // ],
    config: {
        refs: {
            // mainView: 'mfw-main',
            // dashboardView: '#dashboard',
            // appsView: '#apps',
            // reportsView: '#reports',
            // configView: '#config',
        },

        routes: {
            // '*': 'onRoute',
            '': { action: 'onHome', conditions: { ':query' : '(.*)' } },
            'dashboard:query': { action: 'onDashboard', conditions: { ':query' : '(.*)' } },
            'reports:query': { action: 'onReports', conditions: { ':query' : '(.*)' } },
            'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } },
            'monitor/:param': { action: 'onMonitor', conditions: { ':param' : '(.*)' } },
            '404': { action: 'onUnmatchedRoute' }
        },
    },

    // onRoute: function (params) {
    //     console.log(params);
    //     // var loadingCard = Mfw.app.getMainView().down('#loadingCard');
    //     // if (loadingCard) {
    //     //     Mfw.app.getMainView().remove(loadingCard, true);
    //     // }

    // },

    onHome: function () {
        Mfw.app.redirectTo('dashboard');
    },

    onDashboard: function (query) {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-dashboard',
            currentViewTitle: 'Dashboard'.t()
        });
        Mfw.app.updateQuery(query);
    },

    onReports: function (query) {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-reports',
            currentViewTitle: 'Reports'.t()
        });
        Mfw.app.updateQuery(query);
    },

    onSettings: function (route) {
        var mainSettingsView = Ext.Viewport.down('mfw-settings'), xtype;
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-settings',
            currentViewTitle: 'Settings'.t()
        });
        if (mainSettingsView.down('#currentSettings')) {
            mainSettingsView.remove('currentSettings');
        }

        if (route) {
            xtype = 'mfw-settings' + route.replace(/\//g, '-');

            if (Ext.ClassManager.getByAlias('widget.' + xtype)) {
                Ext.Viewport.down('mfw-settings').add({
                    xtype: xtype,
                    itemId: 'currentSettings'
                });
            } else {
                // console.log('not exists');
            }
        }

        // console.log(route);
        var tree = mainSettingsView.down('treelist');
        var node = tree.getStore().findNode('href', 'settings' + route);
        tree.setSelection(node);
        // console.log(tree.getStore());
        // console.log(node);

    },

    onMonitor: function (view) {
        console.log(view);
        if (!Ext.Array.contains(['sessions', 'hosts', 'devices', 'users'], view)) {
            Mfw.app.redirectTo('404');
            return;
        }
        if (!Ext.Viewport.down('mfw-monitor-' + view)) {
            Ext.Viewport.add([
                { xtype: 'mfw-monitor-' + view }
            ]);
        }
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-monitor-' + view,
            // currentViewTitle: 'Dashboard'.t()
        });
    },

    onUnmatchedRoute: function () {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-404',
            currentViewTitle: ''
        });
    }
});

Ext.define('Mfw.App', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    // profiles: [
    //     'App.profile.Desktop',
    //     'App.profile.Mobile'
    // ],

    controllers: ['Mfw.controller.MfwController'],

    // // namespace: 'Mfw',
    // controllers: ['Mfw.controller.MfwController'],
    defaultToken: '',

    stores: ['Interfaces', 'Sessions', 'RuleConditions'],

    viewport: {
        viewModel: {
            data: {
                smallScreen: true,
                currentView: '',
                dashboardConditions: {
                    since: 1,
                    fields: []
                },
                reportsConditions: {
                    predefinedSince: 'today',
                    since: '',
                    until: '',
                    fields: []
                }
            }
        },
        bind: {
            activeItem: '{currentView}'
        },

        plugins: 'responsive',
        responsiveFormulas: {
            small: 'width < 1000',
            large: 'width >= 1000'
        },
        listeners: {
            resize: function (el, width) {
                el.getViewModel().set({
                    smallScreen: width < 1000
                });
            }
        }
    },

    listen : {
        global : {
            unmatchedroute : 'onUnmatchedRoute'
        }
    },

    launch: function () {
        console.log('launched');
        // add main views to the viewport
        Ext.Viewport.add([
            // header
            { xtype: 'mfw-header' },
            // views
            { xtype: 'component', html: '' }, // empty component to avoid flicker from dashboard to the specified route
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-reports' },
            { xtype: 'mfw-settings' },
            // 404 view
            { xtype: 'mfw-404' }
        ]);

        // this is necessary to determine initial viewport size after launch
        Ext.Viewport.getViewModel().set({
            smallScreen: Ext.Viewport.getSize().width < 1000
        });
    },

    onUnmatchedRoute: function () {
        Mfw.app.redirectTo('404');
    },

    /**
     * Global method to update route/query based on conditions for dashboard and reports
     */
    updateQuery: function (query) {
        var conditions = { fields: [] } , newQuery = '',
            gvm = Ext.Viewport.getViewModel(), view = gvm.get('currentView');

        // if no route query, build the route from existing viewmodel conditions if any, then redirect to new generated query
        if (!query) {
            if (view === 'mfw-dashboard') {
                conditions = gvm.get('dashboardConditions');
                newQuery += 'dashboard?since=' + (conditions.since || 1);
            }
            if (view === 'mfw-reports') {
                conditions = gvm.get('reportsConditions');
                newQuery += 'reports?since=' + (conditions.predefinedSince || 'today');
                if (conditions.until) {
                    newQuery += '&until=' + conditions.until;
                }
            }
            Ext.Array.each(conditions.fields, function(field) {
                newQuery += '&' + field.column + ':' + encodeURIComponent(field.operator) + ':' + encodeURIComponent(field.value) + ':' + (field.autoFormatValue === true ? 1 : 0);
            });
            Mfw.app.redirectTo(newQuery);
        } else {
        // if route query is defined, then update the viewmodel based on this query params
            var decodedPart, parts, key, val;
            Ext.Array.each(query.replace('?', '').split('&'), function (part) {
                decodedPart = decodeURIComponent(part);

                // if it's a field condition
                if (decodedPart.indexOf(':') > 0) {
                    parts = decodedPart.split(':');
                    conditions.fields.push({
                        column: parts[0],
                        operator: parts[1],
                        value: parts[2],
                        autoFormatValue: parseInt(parts[3], 10) === 1 ? true : false,
                    });
                } else {
                // if it's normal parameter like since, until
                    parts = decodedPart.split('=');
                    key = parts[0];
                    val = parts[1];

                    // in reports case need to process the since/until params
                    if (view === 'mfw-reports') {
                        if (key === 'since') {
                            var since, predefSince = val, sinceDate = new Date(parseInt(val, 10));
                            switch (val) {
                                case '1h': since = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1); break;
                                case '6h': since = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6); break;
                                case 'today': since = Ext.Date.clearTime(Util.serverToClientDate(new Date())); break;
                                case 'yesterday': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1); break;
                                case 'thisweek': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()); break;
                                case 'lastweek': since = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7); break;
                                case 'month': since = Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())); break;
                                default:
                                    if (sinceDate.getTime() > 0 && Ext.Date.diff(sinceDate, new Date(), Ext.Date.YEAR) < 1) {
                                        since = sinceDate;
                                        predefSince = sinceDate.getTime();
                                    } else {
                                        since = Ext.Date.clearTime(Util.serverToClientDate(new Date()));
                                        predefSince = 'today';
                                    }
                                    break;

                            }
                            conditions.predefinedSince = predefSince;
                            conditions.since = since.getTime();
                        }

                        if (key === 'until') {
                            // remove until in case of predefined since
                            if (Ext.Array.contains(['1h', '6h', 'today', 'yesterday', 'thisweek', 'lastweek', 'month'], conditions.predefinedSince)) {
                                conditions.until = null;
                            } else {
                                var until, untilDate = new Date(parseInt(val, 10));
                                if (untilDate.getTime() > 0) {
                                    until = untilDate.getTime();
                                } else {
                                    until = null;
                                }
                                conditions.until = until;
                            }
                        }
                    } else {
                        conditions[key] = val;
                    }
                }
            });

            if (view === 'mfw-dashboard') {
                gvm.set('dashboardConditions', conditions);
            }

            if (view === 'mfw-reports') {
                gvm.set('reportsConditions', conditions);
            }
        }
    }
});
