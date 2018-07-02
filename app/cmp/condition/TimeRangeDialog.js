Ext.define('Mfw.cmp.condition.TimeRangeDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.timerange-dialog',

    title: 'Select Date/Time Range'.t(),

    closable: true,
    draggable: false,
    maskTapHandler: 'onDialogCancel',

    layout: 'vbox',

    since: '',
    until: '',

    items: [{
        xtype: 'formpanel',
        padding: 0,
        items: [{
            xtype: 'containerfield',
            label: 'From'.t(),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'checkbox',
                hidden: true,
                hideMode: 'visibility'
            }, {
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
            xtype: 'containerfield',
            label: 'To'.t(),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'checkbox',
                itemId: 'untilck',
                reference: 'untilCk',
                listeners: {
                    change: function (el, newValue) {
                        if (!newValue) {
                            el.up('dialog').until = null;
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                itemId: 'endDate',
                flex: 1,
                width: 120,
                margin: '0 10',
                disabled: true,
                editable: false,
                required: false,
                bind: {
                    disabled: '{!untilCk.checked}',
                    required: '{untilCk.checked}'
                },
                listeners: {
                    change: function (el, newDate) {
                        el.up('dialog').until.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                        // if (!el.getDisabled() && el.up('dialog').until) {
                        //     el.up('dialog').until.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                        // } else {
                        //     el.up('dialog').until = null;
                        // }
                    }
                }
            }, {
                xtype: 'timefield',
                itemId: 'endTime',
                width: 120,
                // disabled: true,
                editable: false,
                required: false,
                bind: {
                    // disabled: '{!untilCk.checked}',
                    required: '{untilCk.checked}'
                },
                listeners: {
                    change: function (el, newDate) {
                        el.up('dialog').until.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
                        // if (!el.getDisabled() && el.up('dialog').until) {
                        //     // el.up('dialog').until.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0);
                        // } else {
                        //     // el.up('dialog').until = null;
                        // }
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
        show: 'onDialogShow'
    }
});
