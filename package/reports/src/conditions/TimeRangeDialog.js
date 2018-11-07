Ext.define('Mfw.reports.TimeRangeDialog', {
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
