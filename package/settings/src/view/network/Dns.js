Ext.define('Mfw.settings.network.Dns', {
    // extend: 'Ext.grid.Grid',
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-dns',

    viewModel: {
        data: {
            rec: null
        }
    },

    title: 'DNS'.t(),

    header: {
        items: [{
            xtype: 'button',
            ui: 'action',
            iconCls: 'x-fa fa-floppy-o',
            text: 'Save',
            // handler: 'onSave'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-ellipsis-v',
            arrow: false,
            ui: 'action',
            menu: {
                items: [
                    { text: 'Reload'.t(), iconCls: 'x-fa fa-undo' },
                    { text: 'Reset'.t(), iconCls: 'x-fa fa-refresh' }
                ]
            }
        }]
    },

    bodyPadding: 16,

    html: 'Not implemented yet!'

});
