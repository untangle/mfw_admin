Ext.define('Mfw.cmp.nav.MainMenu', {
    extend: 'Ext.Sheet',
    alias: 'widget.menu-sheet',

    padding: 10,
    // width: 200,
    defaults: {
        width: 200,
        xtype: 'button',
        textAlign: 'left',
    },

    side: 'right',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    items: [{
        xtype: 'component',
        width: 100,
        margin: 10,
        html: '<img src="' + 'res/untangle-logo.png" style="height: 30px;"/>'
    }, {
        text: 'Dashboard'.t(),
        iconCls: 'x-fa fa-home',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo(''); }
    }, {
        text: 'Reports'.t(),
        iconCls: 'x-fa fa-area-chart',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('reports'); }
    }, {
        text: 'Settings'.t(),
        iconCls: 'x-fa fa-cog',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('settings'); }
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
