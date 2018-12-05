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
            var me = this, vm = me.getViewModel(), route;

            // watch since condition change and update button text
            vm.bind('{route}', function (route) {
                var sinceDate = new Date(route.predefinedSince),
                    untilDate, btnText = '';

                if (sinceDate.getTime() > 0) {
                    // btnText += Ext.Date.format(sinceDate, 'Y-m-d H:i A');
                    btnText += (!route.until ? 'Since'.t() : '') + ' ' + Ext.Date.format(sinceDate, 'M j') + ', <strong>' + Ext.Date.format(sinceDate, 'H:i A') + '</strong>';
                } else {
                    btn.getMenu().getItems().each(function (item) {
                        if (item.value === route.predefinedSince && item.isXType('menuitem')) {
                            btnText += item.getText();
                        }
                    });
                }

                if (route.until) {
                    untilDate = new Date(route.until);
                    if (untilDate.getTime() > 0) {
                        // btnText += ' - ' + Ext.Date.format(untilDate, 'Y-m-d H:i A');
                        btnText += ' - ' + Ext.Date.format(untilDate, 'M j') + ', <strong>' + Ext.Date.format(untilDate, 'H:i A') + '</strong>';
                    }
                }
                btn.setText(btnText);
            }, me, { deep: true });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                route = vm.get('route');
                if (item.value !== 'range') {
                    var since, predefSince = item.value, sinceDate = new Date(parseInt(item.value, 10));

                    switch (item.value) {
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
                    route.predefinedSince = predefSince;
                    route.since = since.getTime();
                    Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
                    // vm.set('route', route);
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
            var me = this, vm = me.getViewModel();

            if (!me.dialog.down('formpanel').validate()) {
                return;
            }

            vm.set('conditions.predefinedSince', me.dialog.since.getTime());
            vm.set('conditions.since', me.dialog.since.getTime());

            if (me.dialog.down('togglefield').getValue()) {
                vm.set('conditions.until', me.dialog.until.getTime());
            } else {
                vm.set('conditions.until', null);
            }

            Mfw.app.redirectTo('reports?' + ReportsUtil.conditionsToQuery(vm.get('conditions')));
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
