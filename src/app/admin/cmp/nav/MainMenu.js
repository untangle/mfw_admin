Ext.define('Mfw.cmp.nav.MainMenu', {
    extend: 'Ext.Sheet',
    alias: 'widget.mfw-menu',

    bodyStyle: 'background: #333',

    cls: 'nav',

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
        margin: '10 10 0 20',
        html: '<img src="' + '/static/res/untangle-logo-w.svg" style="height: 36px;"/>'
    }, {
        text: 'DASHBOARD'.t(),
        // iconCls: 'x-fa fa-home',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo(''); }
    }, {
        text: 'REPORTS'.t(),
        // iconCls: 'x-fa fa-area-chart',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('reports'); }
    }, {
        text: 'SESSIONS'.t(),
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('sessions'); }
        // iconCls: 'icon-monitor sessions'
    }, {
        text: 'SETTINGS'.t(),
        // iconCls: 'x-fa fa-cog',
        handler: function (btn) { btn.up('sheet').hide(); Mfw.app.redirectTo('settings'); }
    }, {
        xtype: 'menuseparator',
        style: 'border-color: #555'
    }, {
        text: 'Suggest Idea'.t(),
        iconCls: 'x-fa fa-lightbulb fa-white',
        handler: 'showSuggest'
    }, {
        text: 'Help'.t(),
        iconCls: 'x-fa fa-question-circle fa-white',
        handler: 'showHelp'
    }, {
        text: 'Logout'.t(),
        iconCls: 'x-fa fa-sign-out-alt fa-white',
        handler: 'logout'
    }]
});
