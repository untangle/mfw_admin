Ext.define('Mfw.cmp.condition.FieldsConditions', {
    extend: 'Ext.Container',
    alternateClassName: 'FieldConditions',
    alias: 'widget.fields-conditions',

    layout: 'hbox',

    viewModel: {
        formulas: {
            conditionsBtnTxt: function (get) {
                return get('dashboardConditions.fields').length;
            }
        }
    },

    defaults: {
        margin: '0 5',
    },

    items: [{
        xtype: 'segmentedbutton',
        allowToggle: false,
        defaults: {
            ui: 'default',
        },
        items: [{
            bind: {
                text: 'Conditions'.t() + ' ({conditionsBtnTxt})',
            },
            handler: 'showFieldsSheet',
        }, {
            iconCls: 'x-fa fa-plus-circle',
            handler: 'showFieldDialog'
        }]
        // xtype: 'splitbutton',
        // text: 'Conditions'.t(),
        // // iconCls: 'x-fa fa-filter',
        // handler: 'showFieldsSheet',
        // menu: [{
        //     text: 'Add Condition',
        //     handler: 'showFieldDialog'
        // }]
    }, {
        xtype: 'container',
        itemId: 'fieldsBtns',
        layout: 'hbox',
        defaults: {
            margin: '0 5'
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }],

    listeners: {
        initialize: 'onInitialize'
    },

    controller: {
        onInitialize: function (cmp) {
            var me = this, gvm = Ext.Viewport.getViewModel();
            // watch since condition change and update button text
            gvm.bind('{dashboardConditions.fields}', function (fields) {
                console.log('CHANGED', fields);
                cmp.down('#fieldsBtns').removeAll();
                var buttons = [], fieldName;
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
                            // field: field,
                            index: idx,
                            handler: function () {
                                FieldConditions.show();
                            }
                        }, {
                            iconCls: 'x-fa fa-times',
                            fieldIndex: idx,
                            handler: function (btn) {
                                Ext.Array.removeAt(fields, btn.fieldIndex);
                                Mfw.app.redirect('dashboard');
                            }
                        }]
                    });
                });
                cmp.down('#fieldsBtns').add(buttons);
            });
        },


        showFieldsSheet: function () {
            if (!Ext.Viewport.fieldsSheet) {
                Ext.Viewport.fieldsSheet = Ext.Viewport.add({
                    xtype: 'fields-sheet'
                });
            }
            Ext.Viewport.fieldsSheet.show();
        },
        showFieldDialog: function (btn) {
            var me = this, gvm = Ext.Viewport.getViewModel(), record = undefined;

            record = gvm.get('dashboardConditions.fields')[btn.index];
            console.log(record);
            // Ext.Array.each(gvm.get('dashboardConditions.fields'), function (f) {
            //     if (Ext.Object.equals(f, btn.field)) {
            //         record = f;
            //     }
            // });


            if (!Ext.Viewport.fieldDialog) {
                Ext.Viewport.fieldDialog = Ext.Viewport.add({
                    xtype: 'field-dialog'
                });
            }
            // console.log(btn.field);
            // Ext.Viewport.fieldDialog.setField(btn.field);
            Ext.Viewport.fieldDialog.getViewModel().set('record', record);
            Ext.Viewport.fieldDialog.show();
        },

        removeField: function () {
            // Ext.Array.removeAt(query.conditions, el.condIndex);
        }
    }

    // listeners: {
    //     tap: function (btn) {
    //         console.log('onclick');
    //         if (!btn.menu) {
    //             btn.menu = Ext.Viewport.add({
    //                 xtype: 'sql-conditions-sheet'
    //             });
    //         }
    //         btn.menu.show();
    //     }
    //     // initialize: function (btn) {
    //     //     var gvm = Ext.Viewport.getViewModel();
    //     //     // watch since condition change and update button text
    //     //     gvm.bind('{dashboardConditions.since}', function (since) {
    //     //         btn.setText(since + ' hour(s) ago');
    //     //     });

    //     //     // when selecting a new since, redirect
    //     //     btn.getMenu().on('click', function (menu, item) {
    //     //         menu.hide();
    //     //         Mfw.app.redirectTo('dashboard?since=' + item.value);
    //     //     });
    //     // }
    // },
    // openConditionDialog: function () {
    //     console.log('open');
    // },
    // controller: {

    // }


    // /** Updates the since/until dates and publishes into viewmodel */
    // setRange: function (range) {
    //     this.range = range;
    //     this.publishState();
    // },

    // getRange: function () {
    //     return this.range;
    // },

    // // menu: {
    // //     // indented: false,
    // //     // minWidth: 200,

    // // },



    // // viewModel: {
    // //     data: {

    // //     }
    // // },

    // timeRangeDialog: {
    //     xtype: 'dialog',
    //     title: 'Select Date/Time Range'.t(),

    //     closable: true,
    //     draggable: false,
    //     maskTapHandler: 'onCancel',

    //     layout: 'vbox',

    //     items: [{
    //         xtype: 'formpanel',
    //         padding: 0,
    //         items: [{
    //             xtype: 'containerfield',
    //             label: 'From'.t(),
    //             layout: {
    //                 type: 'hbox',
    //                 align: 'stretch'
    //             },
    //             items: [{
    //                 xtype: 'checkbox',
    //                 hidden: true,
    //                 hideMode: 'visibility'
    //             }, {
    //                 xtype: 'datefield',
    //                 itemId: 'startDate',
    //                 // floatedPicker: {
    //                 //     maxDate: new Date()
    //                 // },
    //                 flex: 1,
    //                 width: 120,
    //                 margin: '0 10',
    //                 editable: false,
    //                 required: true,
    //                 listeners: {
    //                     change: function (el, newDate) {
    //                         el.up('dialog').newRange.since.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    //                     }
    //                 }
    //             }, {
    //                 xtype: 'timefield',
    //                 itemId: 'startTime',
    //                 width: 120,
    //                 // increment: 10,
    //                 editable: false,
    //                 required: true,
    //                 listeners: {
    //                     change: function (el, newDate) {
    //                         console.log(newDate);
    //                         el.up('dialog').newRange.since.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
    //                     }
    //                 }
    //             }]
    //         }, {
    //             xtype: 'containerfield',
    //             label: 'To'.t(),
    //             layout: {
    //                 type: 'hbox',
    //                 align: 'stretch'
    //             },
    //             items: [{
    //                 xtype: 'checkbox',
    //                 itemId: 'untilck',
    //                 reference: 'until',
    //                 listeners: {
    //                     change: function (el, newValue) {
    //                         if (!newValue) {
    //                             el.up('dialog').newRange.until = null;
    //                         }
    //                     }
    //                 }
    //             }, {
    //                 xtype: 'datefield',
    //                 itemId: 'endDate',
    //                 flex: 1,
    //                 width: 120,
    //                 margin: '0 10',
    //                 disabled: true,
    //                 editable: false,
    //                 required: false,
    //                 bind: {
    //                     disabled: '{!until.checked}',
    //                     required: '{until.checked}'
    //                 },
    //                 listeners: {
    //                     change: function (el, newDate) {
    //                         if (!el.getDisabled() && el.up('dialog').newRange.until) {
    //                             el.up('dialog').newRange.until.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    //                         } else {
    //                             el.up('dialog').newRange.until = null;
    //                         }
    //                     }
    //                 }
    //             }, {
    //                 xtype: 'timefield',
    //                 itemId: 'endTime',
    //                 width: 120,
    //                 disabled: true,
    //                 editable: false,
    //                 required: false,
    //                 bind: {
    //                     disabled: '{!until.checked}',
    //                     required: '{until.checked}'
    //                 },
    //                 listeners: {
    //                     change: function (el, newDate) {
    //                         if (!el.getDisabled() && el.up('dialog').newRange.until) {
    //                             el.up('dialog').newRange.until.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
    //                         } else {
    //                             el.up('dialog').newRange.until = null;
    //                         }
    //                     }
    //                 }
    //             }]
    //         }],
    //     }],
    //     buttons: {
    //         ok: 'onOk',
    //         cancel: 'onCancel'
    //     },
    //     listeners: {
    //         show: 'onShow'
    //     }
    // },

    // controller: {
    //     onMenuClick: function (menu, item) {
    //         var me = this, btn = me.getView();
    //         menu.hide();
    //         if (item.value !== 'range') {
    //             btn.setValue(item.value);
    //         } else {
    //             me.showRangeSelector();
    //         }
    //     },

    //     showRangeSelector: function () {
    //         var view = this.getView(),
    //         dialog = this.dialog;
    //         if (!dialog) {
    //             dialog = Ext.apply({
    //                 ownerCmp: view
    //             }, view.timeRangeDialog);

    //             this.dialog = dialog = Ext.create(dialog);
    //         }

    //         dialog.show();
    //     },

    //     onShow: function (dialog) {
    //         var me = this,
    //             currentRange = this.getView().getRange(),
    //             currentDate = Util.serverToClientDate(new Date());

    //         currentDate.setMinutes(Math.floor(currentDate.getMinutes()/10) * 10, 0, 0); // round new date to 10 mminutes interval

    //         dialog.newRange = {
    //             since: Ext.Date.clone(currentRange.since),
    //             until: currentRange.until ? Ext.Date.clone(currentRange.until) : currentDate // until needs to be a date in this range picker
    //         };

    //         dialog.down('#startDate').setValue(dialog.newRange.since);
    //         dialog.down('#startTime').setValue(dialog.newRange.since);
    //         dialog.down('#endDate').setValue(dialog.newRange.until);
    //         dialog.down('#endTime').setValue(dialog.newRange.until);
    //         dialog.down('formpanel').validate();
    //     },


    //     onOk: function (button) {
    //         // console.log(this.dialog);
    //         var newRange, btnText = '';
    //         if (!this.dialog.down('formpanel').validate()) {
    //             return;
    //         }
    //         newRange = button.up('dialog').newRange;

    //         console.log(newRange);
    //         // newRange = {
    //         //     since: this.dialog.down('#startDate').getValue(),
    //         //     until: this.dialog.down('#untilck').getChecked() ? this.dialog.down('#endDate').getValue() : null
    //         // };
    //         if (!newRange.until) {
    //             btnText += 'Since'.t() + ' ' + Ext.Date.format(newRange.since, 'd.m.y H:i');
    //         } else {
    //             btnText += Ext.Date.format(newRange.since, 'd.m.y H:i') + ' - ' + Ext.Date.format(newRange.until, 'd.m.y H:i');
    //         }

    //         this.getView().setRange(newRange);
    //         this.getView().setText(btnText);

    //         this.dialog.hide();
    //     },


    //     onCancel: function (button) {
    //         this.dialog.hide();
    //     },
    // }
});
