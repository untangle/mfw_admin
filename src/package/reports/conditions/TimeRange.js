Ext.define('Mfw.reports.TimeRange', {
    extend: 'Ext.Button',
    alias: 'widget.time-range',

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
            { text: 'Custom Range ...'.t(), value: 'range' }
        ]
    },

    // iconCls: 'x-fa fa-clock-o',

    controller: {
        init: function (btn) {
            var me = this, vm = me.getViewModel(), btnText, route, startTime, endTime;

            // watch since condition change and update button text
            vm.bind('{route}', function (route) {
                if (!route.psince && !route.since) {
                    btnText = 'Today';
                }
                if (route.psince) {
                    btn.getMenu().getItems().each(function (item) {
                        if (item.value === route.psince && item.isXType('menuitem')) {
                            btnText = item.getText();
                        }
                    });
                }

                if (route.since) {
                    startTime = new Date(route.since);
                    btnText = (!route.until ? 'Since ' : '') + Ext.Date.format(startTime, 'Y-m-d H:i A');
                }

                if (route.until) {
                    endTime = new Date(route.until);
                    btnText += ' &nbsp;<i class="x-fa fa-arrow-right"></i>&nbsp; ' + Ext.Date.format(endTime, 'Y-m-d H:i A');
                }
                btn.setText(btnText);
            }, me, { deep: true });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                route = vm.get('route');

                menu.hide();

                if (item.value === 'range') {
                    me.showTimeRangeDialog();
                    return;
                }

                if (item.value === 'today') {
                    route.psince = null;
                } else {
                    route.psince = item.value;
                }
                route.since = null;
                route.until = null;
                Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
            });
        },

        showTimeRangeDialog: function () {
            var me = this, reportsView = me.getView().up('reports');
            if (!me.timeRangeDialog) {
                me.timeRangeDialog = Ext.create({
                    xtype: 'timerange-dialog',
                    buttons: {
                        ok: {
                            handler: me.onDialogOk,
                            scope: me
                        },
                        cancel: {
                            handler: function () {
                                me.timeRangeDialog.hide();
                            }
                        }
                    },
                    ownerCmp: reportsView
                });
                me.timeRangeDialog.on({
                    show: me.onDialogShow,
                    scope: me
                });
            }
            // reportsView.timeRangeDialog.on('show', me.onDialogShow);
            // me.dialog.getViewModel().set('record', condition);
            me.timeRangeDialog.show();
        },

        onDialogShow: function (dialog) {
            var me = this,
                conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())), // today
                viewModel = me.getViewModel(),
                route = viewModel.get('route'),
                currentDate = Util.serverToClientDate(new Date());

            if (route.psince && !route.since) {
                switch (route.psince) {
                    case '1h': conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1); break;
                    case '6h': conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6); break;
                    // case 'today': conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); break;
                    case 'yesterday': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1); break;
                    case 'thisweek': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()); break;
                    case 'lastweek': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7); break;
                    case 'month': conditionSince = Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())); break;
                    default: conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); // today
                    }
            }
            if (route.since) {
                conditionSince = route.since;
            }

            dialog.since = new Date(conditionSince);

            if (route.until) {
                dialog.until = new Date(route.until);
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
            var me = this, viewModel = me.getViewModel(),
                route = viewModel.get('route');

            if (!me.timeRangeDialog.down('formpanel').validate()) {
                return;
            }

            route.psince = null;
            route.since = me.timeRangeDialog.since.getTime();

            if (me.timeRangeDialog.down('togglefield').getValue()) {
                route.until =  me.timeRangeDialog.until.getTime();
            } else {
                route.until = null;
            }

            Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
            me.timeRangeDialog.hide();
        },

        onDialogCancel: function () {
            var me = this; me.dialog.hide();
        },

        onDialogHide: function (dialog) {
            dialog.down('togglefield').setValue(false);
        },
    }
});
