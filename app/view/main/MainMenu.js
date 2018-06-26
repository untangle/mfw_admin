Ext.define('Mfw.view.main.MainMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.mfw-mainmenu',

    padding: 0,
    width: 200,
    defaults: {
        // minHeight: 48
    },
    layout: {
        type: 'vbox',
        align: 'left'
    },
    items: [{
        xtype: 'component',
        margin: '20',
        html: '<img src="' + 'res/untangle-logo.png" style="height: 30px;"/>'
    }, {
        text: 'Dashboard'.t(),
        iconCls: 'x-fa fa-home',
        handler: function () { Mfw.app.redirectTo('#'); }
    }, {
        text: 'Reports'.t(),
        iconCls: 'x-fa fa-area-chart',
        handler: function () { Mfw.app.redirectTo('#reports'); }
    }, {
        text: 'Settings'.t(),
        iconCls: 'x-fa fa-cog',
        handler: function () { Mfw.app.redirectTo('#settings'); }
    }, {
        xtype: 'menuseparator'
    }, {
        text: 'Sessions'.t(),
        iconCls: 'icon-monitor sessions'
    }, {
        text: 'Hosts'.t(),
        iconCls: 'icon-monitor hosts',
        // handler: function () { Ung.app.redirectTo('#apps'); }
    }, {
        text: 'Devices'.t(),
        iconCls: 'icon-monitor devices',
        // handler: function () { Ung.app.redirectTo('#apps'); }
    }, {
        text: 'Users'.t(),
        iconCls: 'icon-monitor users',
        // handler: function () { Ung.app.redirectTo('#apps'); }
    }]
});
