Ext.define('Mfw.cmp.nav.MainHeader', {
    extend: 'Ext.Toolbar',
    alias: 'widget.mfw-header',
    cls: 'nav',
    docked: 'top',
    zIndex: 999,
    padding: '0 16 0 16',

    items: [{
        xtype: 'component',
        // padding: '0 10',
        html: '<img src="' + 'res/untangle-logo.png" style="height: 30px;"/>',
        plugins: 'responsive',
        responsiveConfig: { large: { margin: '5 26 0 10', }, small: { margin: '5 26 0 0', } }
    }, {
        xtype: 'component',
        margin: '5 0 0 0',
        style: {
            color: '#777'
        },
        bind: {
            html: '{currentViewTitle}'
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
    }, {
        xtype: 'container',
        flex: 1,
        layout: 'hbox',
        defaultType: 'button',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        items: [{
            text: 'Dashboard'.t(),
            // iconCls: 'x-fa fa-home',
            iconCls: 'x-material x-dashboard',
            handler: function () { Mfw.app.redirectTo(''); },
            bind: {
                pressed: '{currentView === "mfw-dashboard"}'
            }
        }, {
            text: 'Reports'.t(),
            // iconCls: 'x-fa fa-area-chart',
            iconCls: 'x-material x-show_chart',
            handler: function () { Mfw.app.redirectTo('reports'); },
            bind: {
                pressed: '{currentView === "mfw-reports"}'
            }
        }, {
            text: 'Settings'.t(),
            // iconCls: 'x-fa fa-cog',
            iconCls: 'x-material x-settings',
            handler: function () { Mfw.app.redirectTo('settings'); },
            bind: {
                pressed: '{currentView === "mfw-settings"}'
            }
        }, {
            text: 'Monitor'.t(),
            // iconCls: 'x-fa fa-desktop',
            iconCls: 'x-material x-computer',
            menu: [{
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
        }]
    }, '->', {
        // text: 'Account',
        iconCls: 'x-fa fa-user-circle fa-3x',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }, {
        iconCls: 'x-fa fa-bars',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
        handler: function () {
            // Mfw.app.mainMenu.show();

            var me = this;
            if (!me.menu) {
                me.menu = Ext.Viewport.add({
                    xtype: 'menu-sheet',
                    // ownerCmp: me.getView()
                });
            }
            me.menu.show();

        }
    }]
});
