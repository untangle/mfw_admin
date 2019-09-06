Ext.define('Mfw.settings.Nav', {
    extend: 'Ext.Toolbar',
    alias: 'widget.mfw-nav',
    cls: 'nav',
    docked: 'top',
    zIndex: 999,
    padding: '0 0 0 16',

    // layout: {
    //     type: 'hbox',
    //     align: 'middle'
    // },

    items: [{
        xtype: 'component',
        margin: '2 16 0 0',
        html: '<a href="#network"><img src="/static/res/untangle-logo-w.svg" style="height: 36px;"/></a>',
    }, {
        xtype: 'component',
        style: { color: '#777' },
        html: 'SETTINGS'
    }, '->', {
        iconCls: 'x-fa fa-user-circle fa-3x',
        arrow: false,
        menu: {
            anchor: true,
            items: [{
                text: 'Logout',
                iconCls: 'x-fa fa-sign-out-alt',
                handler: function () {
                    Ext.Ajax.request({
                        url: '/account/logout',
                        callback: function () {
                            Mfw.app.setAccount(null);
                            Mfw.app.redirectTo('auth');
                            document.location.reload();
                        }
                    });
                }
            }]
        }
    }]
});
