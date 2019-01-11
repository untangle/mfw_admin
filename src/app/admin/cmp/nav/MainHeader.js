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
        margin: '0 16 0 0',
        html: '<a href="#dashboard"><img src="/static/res/untangle-logo.png" style="height: 30px;"/></a>',
        // plugins: 'responsive',
        // responsiveConfig: { large: { margin: '5 26 0 10', }, small: { margin: '5 26 0 0', } }
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
            text: 'SETTINGS'.t(),
            ripple: false,
            // iconCls: 'x-fa fa-cog',
            // iconCls: 'md-icon-settings',
            handler: function () { Mfw.app.redirectTo('settings'); },
            bind: {
                pressed: '{currentView === "settings"}'
            }
        }, {
            text: 'MONITOR'.t(),
            ripple: false,
            // iconCls: 'x-fa fa-desktop',
            // iconCls: 'md-icon-computer',
            menu: [{
                text: 'Sessions'.t(),
                iconCls: 'icon-monitor sessions',
                handler: function (item) { Mfw.app.redirectTo('monitor/sessions'); item.up('menu').hide(); }
            }, {
                text: 'Hosts'.t(),
                iconCls: 'icon-monitor hosts',
                handler: function (item) { Mfw.app.redirectTo('monitor/hosts'); item.up('menu').hide(); }
            }, {
                text: 'Devices'.t(),
                iconCls: 'icon-monitor devices',
                handler: function (item) { Mfw.app.redirectTo('monitor/devices'); item.up('menu').hide(); }
            }, {
                text: 'Users'.t(),
                iconCls: 'icon-monitor users',
                handler: function (item) { Mfw.app.redirectTo('monitor/users'); item.up('menu').hide(); }
            }]
        }]
    }, '->',
    //     {
    //     /**
    //      * Temporary usage to reset the setting to their initial state when the machine was installed
    //      */
    //     xtype: 'button',
    //     text: 'Reset Settings'.t(),//
    //     handler: function () {
    //         var originalServerData = {"dhcp":{"dhcpAuthoritative":true,"staticDhcpEntries":[]},"dns":{"localServers":[],"staticEntries":[]},"firewall":{"variables":[{"key":"HTTP_PORT","value":"80"},{"key":"HTTPS_PORT","value":"443"}]},"network":{"devices":[{"duplex":"AUTO","mtu":null,"name":"eth0"},{"duplex":"AUTO","mtu":null,"name":"eth1"}],"interfaces":[{"configType":"ADDRESSED","device":"eth0","dhcpEnabled":true,"dhcpLeaseDuration":3600,"dhcpRangeEnd":"192.168.1.200","dhcpRangeStart":"192.168.1.100","interfaceId":1,"name":"internal","type":"NIC","v4ConfigType":"STATIC","v4StaticAddress":"192.168.1.1","v4StaticPrefix":24,"v6AssignHint":"1234","v6AssignPrefix":64,"v6ConfigType":"ASSIGN","wan":false},{"configType":"ADDRESSED","device":"eth1","interfaceId":2,"name":"external","natEgress":true,"type":"NIC","v4ConfigType":"DHCP","v6ConfigType":"DISABLED","wan":true}],"switches":[]},"system":{"domainName":"example.com","hostName":"mfw"},"version":1}
    //         Ext.Ajax.request({
    //             url: Util.api + '/settings',
    //             method: 'POST',
    //             params: Ext.JSON.encode(originalServerData),
    //             success: function() {
    //                 Ext.toast('Settings saved!');
    //                 window.location.reload(true);
    //             },
    //             failure: function(response) {
    //                 Ext.toast('Error while saving settings!');
    //                 console.log('server-side failure with status code ' + response.status);
    //             }
    //         })
    //     }
    // },
    {
        text: 'Reset Wizard',
        handler: function () {
            Ext.Ajax.request({
                url: window.location.origin + '/api/settings/system/setupWizard',
                method: 'POST',
                params: Ext.JSON.encode({
                    completed: false
                }),
                success: function() {
                    Ext.Ajax.request({
                        url: '/account/logout',
                        callback: function () {
                            Mfw.app.setAccount(null);
                            window.location.href = '/setup';
                        }
                    });

                }
            });
        }
    },
    {
        bind: {
            text: '{account.username}'
        },
        iconCls: 'x-fa fa-user-circle fa-3x',
        iconAlign: 'right',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        arrow: false,
        menu: {
            anchor: false,
            items: [{
                text: 'Logout',
                iconCls: 'x-fa fa-sign-out',
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
    },
    // {
    //     iconCls: 'x-fa fa-bars',
    //     plugins: 'responsive',
    //     responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
    //     handler: function () {
    //         // Mfw.app.mainMenu.show();

    //         var me = this;
    //         if (!me.menu) {
    //             me.menu = Ext.Viewport.add({
    //                 xtype: 'menu-sheet',
    //                 // ownerCmp: me.getView()
    //             });
    //         }
    //         me.menu.show();

    //     }
    // }
    ]
});
