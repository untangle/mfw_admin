Ext.define('Mfw.cmp.condition.ReportsTimeRangeBtn', {
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
            gvm.bind('{reportsConditions.predefinedSince}', function (predefinedSince) {
                var sinceDate = new Date(predefinedSince);
                if (sinceDate.getTime() > 0) {
                    btnText = Ext.Date.format(sinceDate, 'Y-m-d H:i A');
                } else {
                    btn.getMenu().getItems().each(function (item) {
                        if (item.value === predefinedSince) {
                            btnText = item.getText();
                        }
                    });
                }
                btn.setText(btnText);
            });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                if (item.value !== 'range') {
                    gvm.set('reportsConditions.predefinedSince', item.value);
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
                dialog.until = new Date(parseInt(gvm.get('reportsConditions.until'), 10));
            } else {
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

            if (me.dialog.until) {
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
    }
});
