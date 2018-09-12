Ext.define('Mfw.settings.network.Dhcp', {
    // extend: 'Ext.grid.Grid',
    extend: 'Mfw.cmp.panel.MasterPanel',
    alias: 'widget.mfw-settings-network-dhcp',

    viewModel: {
        data: {
            rec: null
        }
    },

    title: 'DHCP'.t(),

    layout: 'vbox',

    config: {
        // recordModel: new Mfw.network.model.Dhcp()
    },

    items: [{
        xtype: 'togglefield',
        margin: 16,
        boxLabel: 'DHCP Authoritative'.t(),
        bind: '{rec.dhcpAuthoritative}'
    }, {
        xtype: 'mastergrid',
        controller: 'dhcpstaticentries',
        title: 'Static Entries',

        plugins: {
            mastergrideditable: true
        },

        enableSave: false,
        enableReload: true,
        enableReset: false,

        // enableCopy: false,

        flex: 1,

        bind: '{rec.staticDhcpEntries}',
        // bind: {
        //     store: {
        //         model: 'Mfw.network.model.DhcpEntry',
        //         data: '{rec.staticDhcpEntries}'
        //     }
        // },

        columns: [{
            text: 'Mac Address'.t(),
            dataIndex: 'macAddress',
            flex: 1,
            editable: true
        } , {
            text: 'Address'.t(),
            dataIndex: 'address',
            flex: 1,
            editable: true
        }]
    }],

    listeners: {
        initialize: 'onInitialize'
    },

    // controller: {
    //     onInitialize: function (panel) {
    //         this.onLoad();
    //     },

    //     onLoad: function () {
    //         var me = this;
    //         me.dhcp = new Mfw.network.model.Dhcp();
    //         me.dhcp.load({
    //             success: function (rec) {
    //                 me.getViewModel().set('rec', rec);
    //             }
    //         });
    //     },

    //     onSave: function () {
    //         var me = this;
    //         // var entry = Ext.create('Mfw.model.DhcpEntry', {
    //         //     address: '1.2.3.4',
    //         //     macAddress: 'somestring'
    //         // })

    //         // me.dhcp.staticDhcpEntries().add(entry);

    //         me.dhcp.save({
    //             success: function () {
    //                 Ext.toast('DHCP saved!');
    //             }
    //         })
    //     },

    //     onReset: function () {
    //         // Ext.toast('On Reset not implemented!');
    //         var me = this,
    //             api = me.dhcp.getProxy().getApi();
    //         Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
    //             'All existing <strong>' + this.getView().getTitle() + '</strong> settings will be replace with defauts.<br/>Do you want to continue?',
    //             function (answer) {
    //                 if (answer === 'yes') {
    //                     // update proxy api to support reset
    //                     me.dhcp.getProxy().setApi({ read: api.read.replace('/settings/', '/defaults/') });
    //                     // revert api to it's default values
    //                     me.dhcp.load({
    //                         callback: function () {
    //                             me.dhcp.getProxy().setApi(api);
    //                         }
    //                     });
    //                 }
    //             });
    //     }

    // }

});


Ext.define('Mfw.settings.network.DhcpEntriesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.dhcpstaticentries',


    // onAddRecord: function () {
    //     var me = this;

    //     var rec = Ext.create('Mfw.model.DhcpEntry', {
    //         address: '1.2.3.4',
    //         macAddress: 'somestring'
    //     })
    //     me.getView().getStore().add(rec);
    //     console.log('on add');
    // }

});

