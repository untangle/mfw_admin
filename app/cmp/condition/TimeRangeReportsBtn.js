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
                    Mfw.app.redirect();
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

            Mfw.app.redirect();
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
