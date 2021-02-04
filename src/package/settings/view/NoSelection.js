Ext.define('Mfw.settings.NoSelection', {
    extend: 'Ext.Panel',
    alias: 'widget.noselection-settings',

    viewModel: {},

    margin: '36 0 0 0',

    layout: {
        type: 'hbox',
        pack: 'center'
    },

    defaults: {
        xtype: 'container',
        layout: 'vbox',
        width: 150,
        margin: 16
    },

    items: [{
        xtype: 'component',
        docked: 'top',
        width: 'auto',
        style: 'text-align: center;',
        html: '<h1 style="font-weight: 100; font-size: 32px;">Select settings</h1><br/><hr style="width: 800px;"/>'
    }, {
        items: [{
            xtype: 'component',
            style: 'margin: 0 0 24px 12px;',
            html: '<h1 style="font-weight: 100;">Network</h1>'
        }, {
            xtype: 'list',
            cls: 'pointer-list',
            itemTpl: '<span style="font-size: 16px;">{text}</span>',
            data: [
                { text: 'Interfaces', href: 'settings/network/interfaces' },
                { text: 'DHCP', href: 'settings/network/dhcp' },
                { text: 'DNS', href: 'settings/network/dns' }
            ],
            listeners: {
                childtap: function (el, location) {
                    Mfw.app.redirectTo(location.record.get('href'));
                }
            }
        }]
    }, {
        items: [{
            xtype: 'component',
            style: 'margin: 0 0 24px 12px;',
            html: '<h1 style="font-weight: 100;">Routing</h1>'
        }, {
            xtype: 'list',
            cls: 'pointer-list',
            itemTpl: '<span style="font-size: 16px;">{text}</span>',
            data: [
                { text: 'WAN Policies'.t(), href: 'settings/routing/wan-policies' },
                { text: 'WAN Rules'.t(), href: 'settings/routing/wan-rules' }
            ],
            listeners: {
                childtap: function (el, location) {
                    Mfw.app.redirectTo(location.record.get('href'));
                }
            }
        }]
    }, {
        items: [{
            xtype: 'component',
            style: 'margin: 0 0 24px 12px;',
            html: '<h1 style="font-weight: 100;">Firewall</h1>'
        }, {
            xtype: 'list',
            cls: 'pointer-list',
            itemTpl: '<span style="font-size: 16px;">{text}</span>',
            data: [
                { text: 'Filter'.t(), href: 'settings/firewall/filter' },
                { text: 'Access'.t(), href: 'settings/firewall/access' },
                { text: 'NAT'.t(), href: 'settings/firewall/nat' },
                { text: 'Shaping'.t(), href: 'settings/firewall/shaping' },
                { text: 'Port Forward'.t(), href: 'settings/firewall/port-forward' },
            ],
            listeners: {
                childtap: function (el, location) {
                    Mfw.app.redirectTo(location.record.get('href'));
                }
            }
        }]
    }, {
        items: [{
            xtype: 'component',
            style: 'margin: 0 0 24px 12px;',
            html: '<h1 style="font-weight: 100;">Applications</h1>'
        }, {
            xtype: 'list',
            cls: 'pointer-list',
            itemTpl: '<span style="font-size: 16px;">{text}</span>',
            data: [
                { text: 'Threat Prevention'.t(), href: 'settings/applications/threat-prevention' },
            ],
            listeners: {
                childtap: function (el, location) {
                    Mfw.app.redirectTo(location.record.get('href'));
                }
            }
        }]
    }, {
        items: [{
            xtype: 'component',
            style: 'margin: 0 0 24px 12px;',
            html: '<h1 style="font-weight: 100;">System</h1>'
        }, {
            xtype: 'list',
            cls: 'pointer-list',
            itemTpl: '<span style="font-size: 16px;">{text}</span>',
            data: [
                { text: 'Settings'.t(), href: 'settings/system/settings' },
                { text: 'Upgrade'.t(), href: 'settings/system/upgrade' },
                { text: 'Logging'.t(), href: 'system/system/logging' },
                { text: 'License'.t(), href: 'system/system/license' },
                { text: 'About'.t(), href: 'settings/system/about' }
            ],
            listeners: {
                childtap: function (el, location) {
                    Mfw.app.redirectTo(location.record.get('href'));
                }
            }
        }]
    }]
});
