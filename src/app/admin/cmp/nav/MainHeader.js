Ext.define('Mfw.cmp.nav.MainHeader', {
    extend: 'Ext.Toolbar',
    alias: 'widget.mfw-header',
    cls: 'nav',
    docked: 'top',
    zIndex: 999,
    padding: '0 0 0 16',

    items: [{
        xtype: 'component',
        // padding: '0 10',
        margin: '2 16 0 0',
        html: '<a href="#dashboard"><img src="/static/res/untangle-logo-w.png" style="height: 40px;"/></a>',
        responsiveConfig: { large: { margin: '5 26 0 10', }, small: { margin: '5 26 0 0', } }
    }, {
        xtype: 'container',
        flex: 1,
        layout: 'hbox',
        defaultType: 'button',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        defaults: {
            ripple: false,
            margin: '0 3'
        },
        items: [{
            text: 'DASHBOARD'.t(),
            ripple: false,
            // iconCls: 'x-fa fa-home',
            // iconCls: 'md-icon-dashboard',
            handler: function () { Mfw.app.redirectTo('#dashboard'); },
            bind: {
                pressed: '{currentView === "dashboard"}'
            }
        }, {
            text: 'REPORTS'.t(),
            ripple: false,
            // iconCls: 'x-fa fa-area-chart',
            // iconCls: 'md-icon-show-chart',
            handler: function () { Mfw.app.redirectTo('reports'); },
            bind: {
                pressed: '{currentView === "reports"}'
            }
        }, {
            text: 'MONITOR'.t(),
            ripple: false,
            arrow: false,
            // iconCls: 'x-fa fa-desktop',
            // iconCls: 'md-icon-computer',
            menu: {
                userCls: 'monitor-menu',
                border: false,
                width: 150,
                items: [{
                    text: 'SESSIONS'.t(),
                    iconCls: 'icon-monitor sessions',
                    handler: function (item) { Mfw.app.redirectTo('monitor/sessions'); item.up('menu').hide(); }
                }
                // {
                //     text: 'HOSTS'.t(),
                //     iconCls: 'icon-monitor hosts',
                //     handler: function (item) { Mfw.app.redirectTo('monitor/hosts'); item.up('menu').hide(); }
                // }, {
                //     text: 'DEVICES'.t(),
                //     iconCls: 'icon-monitor devices',
                //     handler: function (item) { Mfw.app.redirectTo('monitor/devices'); item.up('menu').hide(); }
                // }, {
                //     text: 'USERS'.t(),
                //     iconCls: 'icon-monitor users',
                //     handler: function (item) { Mfw.app.redirectTo('monitor/users'); item.up('menu').hide(); }
                // }
                ]
            }
        }, {
            text: 'SETTINGS'.t(),
            ripple: false,
            // iconCls: 'x-fa fa-cog',
            // iconCls: 'md-icon-settings',
            handler: function () { Mfw.app.redirectTo('settings'); },
            bind: {
                pressed: '{currentView === "settings"}'
            }
        }]
    }, '->',
    // {
    //     xtype: 'component',
    //     style: 'color: #91e971; font-size: 12px; font-weight: 400; font-family: "Roboto"',
    //     listeners: {
    //         painted: function (el) {
    //             var location = Mfw.app.tz.displayName;
    //             el.setHtml(location.replace(/_/g, ' ') + ', ' + moment().tz(Mfw.app.tz.displayName).format('hh:mm A'));
    //             setInterval(function () {
    //                 el.setHtml(location.replace(/_/g, ' ') + ', ' + moment().tz(Mfw.app.tz.displayName).format('hh:mm A'));
    //             }, 1000 * 60);
    //         }
    //     }

    // },
    {
        iconCls: 'x-fa fa-question-circle fa-3x',
        tooltip: 'Support',
        hidden: true,
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        handler: 'showSupport'
    },
    {
        bind: {
            text: '{account.username}'
        },
        iconCls: 'x-fa fa-user-circle fa-3x',
        iconAlign: 'right',
        hidden: true,
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        arrow: false,
        menu: {
            anchor: false,
            items: [{
                text: 'Logout',
                iconCls: 'x-fa fa-sign-out',
                handler: 'logout'
            }]
        }
    }, {
        iconCls: 'x-fa fa-bars',
        hidden: true,
        responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
        handler: 'showMenu'
    }],
    listeners: {
        // fire resize event to trigger responsive config for the hamburger menu
        painted: function() {
            Ext.fireEvent('resize');
        }
    },


    controller: {
        logout: function () {
            Ext.Ajax.request({
                url: '/account/logout',
                callback: function () {
                    Mfw.app.setAccount(null);
                    Mfw.app.redirectTo('auth');
                    document.location.reload();
                }
            });
        },

        showMenu: function () {
            var me = this;
            if (!me.menu) {
                me.menu = Ext.Viewport.add({
                    xtype: 'mfw-menu',
                    ownerCmp: me.getView()
                });
            }
            me.menu.show();
        },

        showSupport: function () {
            var hash = window.location.hash;
            window.open(Globals.supportUrl + hash.replace('#', '').replace(/\//g, '+').split('?')[0]);
        }
    }
});
