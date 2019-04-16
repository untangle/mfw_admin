Ext.define('Mfw.cmp.nav.MainMenu', {
    extend: 'Ext.Sheet',
    alias: 'widget.mfw-menu',

    bodyStyle: 'background: #333',

    cls: 'nav',

    padding: 10,
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
        html: '<img src="' + '/static/res/untangle-logo-w.png" style="height: 30px;"/>'
    }, {
        text: 'DASHBOARD'.t(),
        // iconCls: 'x-fa fa-home',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo(''); }
    }, {
        text: 'REPORTS'.t(),
        // iconCls: 'x-fa fa-area-chart',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('reports'); }
    }, {
        text: 'SETTINGS'.t(),
        // iconCls: 'x-fa fa-cog',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('settings'); }
    }, {
        xtype: 'menuseparator'
    }, {
        text: 'SESSIONS'.t(),
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('monitor/sessions'); }
        // iconCls: 'icon-monitor sessions'
    }, {
        text: 'HOSTS'.t(),
        // iconCls: 'icon-monitor hosts',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('monitor/hosts'); }
    }, {
        text: 'DEVICES'.t(),
        // iconCls: 'icon-monitor devices',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('monitor/devices'); }
    }, {
        text: 'USERS'.t(),
        // iconCls: 'icon-monitor users',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('monitor/users'); }
    }]
});
