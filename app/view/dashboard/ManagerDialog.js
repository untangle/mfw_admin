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
