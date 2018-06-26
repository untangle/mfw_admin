Ext.define('Mfw.cmp.condition.DashboardTimeRangeBtn', {
    extend: 'Ext.Button',
    alias: 'widget.dashboard-timerange-btn',

    // reportsMenuItems: [
    //     { text: '1 Hour ago'.t(), value: '1h' },
    //     { text: '6 Hours ago'.t(), value: '6h' },
    //     { text: 'Today'.t(), value: 'today' },
    //     { text: 'Yesterday'.t(), value: 'yesterday' },
    //     { text: 'This Week'.t(), value: 'week' },
    //     { text: 'Last Week'.t(), value: 'lastweek' },
    //     { text: 'This Month'.t(), value: 'month' },
    //     { xtype: 'menuseparator' },
    //     { text: 'Time Range ...'.t(), value: 'range' }
    // ],

    menu: {
        indented: false,
        mouseLeaveDelay: 0,
        minWidth: 150,
        items: [
            { text: '1 Hour'.t(), value: 1 },
            { text: '3 Hours'.t(), value: 3 },
            { text: '6 Hours'.t(), value: 6 },
            { text: '12 Hours'.t(), value: 12 },
            { text: '24 Hours'.t(), value: 24 }
        ]
    },

    iconCls: 'x-fa fa-clock-o',

    listeners: {
        initialize: function (btn) {
            var gvm = Ext.Viewport.getViewModel();
            // watch since condition change and update button text
            gvm.bind('{dashboardConditions.since}', function (since) {
                btn.setText(since + ' hour(s) ago');
            });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                // var since = gvm.get('dashboardConditions.since');
                // since = item.value;
                gvm.set('dashboardConditions.since', item.value);
                Mfw.app.redirect('dashboard');
                menu.hide();
            });
        }
    },

    // setValue: function (val) {
    //     var me = this, range;

    //     this.getMenu().getItems().each(function (item) {
    //         if (item.value === val) {
    //             me.setText(item.getText());
    //         }
    //     });
    //     switch (val) {
    //         case '1h': range = { since: Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1), until: null }; break;
    //         case '6h': range = { since: Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6), until: null }; break;
    //         case 'today': range = { since: Ext.Date.clearTime(Util.serverToClientDate(new Date())), until: null }; break;
    //         case 'yesterday': range = { since: Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1), until: null }; break;
    //         case 'week': range = { since: Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()), until: null }; break;
    //         case 'lastweek': range = { since: Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7), until: null }; break;
    //         case 'month': range = { since: Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())), until: null }; break;
    //     }

    //     // this.range = range;
    //     this.setRange(range);
    // },

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
