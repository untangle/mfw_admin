Ext.define('Mfw.settings.network.Dhcp', {
    // extend: 'Ext.grid.Grid',
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-dhcp',

    viewModel: {
        data: {
            rec: null
        }
    },

    title: 'DHCP'.t(),

    // tools: [{
    //     type: 'minimize',
    //     text: 'aaa',
    // }],
    header: {
        items: [{
            xtype: 'button',
            ui: 'action',
            iconCls: 'x-fa fa-floppy-o',
            text: 'Save',
            handler: 'onSave'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-ellipsis-v',
            arrow: false,
            ui: 'action',
            menu: {
                items: [
                    { text: 'Reload'.t(), iconCls: 'x-fa fa-undo', handler: 'onLoad' },
                    { text: 'Reset'.t(), iconCls: 'x-fa fa-refresh', handler: 'onReset' }
                ]
            }
        }]
    },

    bodyPadding: 16,

    items: [{
        xtype: 'togglefield',
        boxLabel: 'DHCP Authoritative'.t(),
        bind: '{rec.dhcpAuthoritative}'
    }],

    listeners: {
        initialize: 'onInitialize'
    },

    controller: {
        onInitialize: function () {
            this.onLoad();
        },

        onLoad: function () {
            var me = this;
            me.dhcp = new Mfw.model.Dhcp();
            me.dhcp.load({
                success: function (rec) {
                    me.getViewModel().set('rec', rec);
                }
            });
        },

        onSave: function () {
            var me = this;
            me.dhcp.save({
                success: function () {
                    Ext.toast('DHCP saved!');
                }
            })
        },

        onReset: function () {
            Ext.toast('On Reset not implemented!');
        }
    }

});
