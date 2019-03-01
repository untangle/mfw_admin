Ext.define('Mfw.model.v4Alias', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'v4Address', type: 'string' },
        { name: 'v4Prefix',  type: 'integer' }
    ]
});

Ext.define('Mfw.model.v6Alias', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'v6Address', type: 'string' },
        { name: 'v6Prefix',  type: 'integer' }
    ]
});

Ext.define('Mfw.model.DhcpOptions', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'enabled',     type: 'boolean' },
        { name: 'description', type: 'string' },
        { name: 'value',       type: 'string' }
    ]
});

Ext.define('Mfw.model.OpenVpnConfFile', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'encoding', type: 'string' },
        { name: 'contents', type: 'string' }
    ]
});

Ext.define('Mfw.model.WireguardPeer', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'publicKey',       type: 'string' },
        { name: 'allowedIps',      type: 'auto' },
        { name: 'host',            type: 'string' },
        { name: 'port',            type: 'integer' },
        { name: 'presharedKey',    type: 'string' },
        { name: 'keepalive',       type: 'integer' }, // seconds
        { name: 'routeAllowedIps', type: 'boolean' }
    ]
});


// Ext.define('Mfw.model.VrrpV4Alias', {
//     extend: 'Ext.data.Model',
//     idProperty: '_id',
//     identifier: 'uuid',
//     fields: [
//         { name: 'enabled', type: 'boolean' },
//         { name: 'description', type: 'string' },
//         { name: 'value', type: 'string' }
//     ]
// });

Ext.define('Mfw.model.Interface', {
    extend: 'Ext.data.Model',
    alias: 'model.interface',
    idProperty: 'interfaceId',
    // identifier: {
    //     type: 'sequential',
    //     seed: 0
    // },
    fields: [
        { name: 'interfaceId', type: 'integer' },
        { name: 'name',        type: 'string', allowNull: false, allowBlank: false },
        { name: 'device',      type: 'string', allowNull: true },
        { name: 'wan',         type: 'boolean', allowNull: true },
        { name: 'hidden',      type: 'boolean', defaultValue: false },
        { name: 'type',        type: 'string' }, // ["NIC","VLAN","WIFI","OPENVPN"]
        { name: 'configType',  type: 'string' }, // ["ADDRESSED","BRIDGED","DISABLED"]

        { name: 'natEgress',  type: 'boolean', allowNull: true },
        { name: 'natIngress', type: 'boolean', allowNull: true },

        // IPv4
        { name: 'v4ConfigType',    type: 'string', allowNull: true }, // ["STATIC","DHCP","PPPOE","DISABLED"]
        { name: 'v4StaticAddress', type: 'string', allowNull: true },
        { name: 'v4StaticPrefix',  type: 'integer', allowNull: true }, // 1 - 32
        { name: 'v4StaticGateway', type: 'string', allowNull: true },
        { name: 'v4StaticDNS1',    type: 'string', allowNull: true },
        { name: 'v4StaticDNS2',    type: 'string', allowNull: true },

        // IPv4 DHCP overrides
        { name: 'v4DhcpAddressOverride', type: 'string', allowNull: true },
        { name: 'v4DhcpPrefixOverride',  type: 'auto', allowNull: true }, // 1 - 32
        { name: 'v4DhcpGatewayOverride', type: 'string', allowNull: true },
        { name: 'v4DhcpDNS1Override',    type: 'string', allowNull: true },
        { name: 'v4DhcpDNS2Override',    type: 'string', allowNull: true },

        // PPPoE
        { name: 'v4PPPoEUsername',     type: 'string', allowNull: true },
        { name: 'v4PPPoEPassword',     type: 'string', allowNull: true },
        { name: 'v4PPPoEUsePeerDNS',   type: 'boolean', allowNull: true },
        { name: 'v4PPPoEOverrideDNS1', type: 'string', allowNull: true },
        { name: 'v4PPPoEOverrideDNS2', type: 'string', allowNull: true },
        { name: 'v4DhcpDNS2Override',  type: 'string', allowNull: true },

        // hasMany v4Aliases

        // IPv6
        { name: 'v6ConfigType',       type: 'string', allowNull: true }, // ["DHCP","SLAAC","ASSIGN","STATIC","DISABLED"]
        { name: 'v6StaticAddress',    type: 'string', allowNull: true },
        { name: 'v6StaticPrefix',     type: 'integer', allowNull: true }, // 1 - 128
        { name: 'v6StaticGateway',    type: 'string', allowNull: true },
        { name: 'v6StaticDNS1',       type: 'string', allowNull: true },
        { name: 'v6StaticDNS2',       type: 'string', allowNull: true },
        { name: 'v6DhcpDNS1Override', type: 'string', allowNull: true },
        { name: 'v6DhcpDNS2Override', type: 'string', allowNull: true },

        // IPv6 Assign
        { name: 'v6AssignHint',   type: 'string', allowNull: true },
        { name: 'v6AssignPrefix', type: 'integer', allowNull: true }, // 1 -128

        // hasMany v6Aliases

        { name: 'routerAdvertisements', type: 'boolean', allowNull: true },
        { name: 'bridgedTo',            type: 'integer', allowNull: true },
        { name: 'downloadKbps',         type: 'integer', allowNull: true },
        { name: 'uploadKbps',           type: 'integer', allowNull: true },
        { name: 'macaddr',              type: 'string', allowNull: true },

        // DHCP serving
        { name: 'dhcpEnabled',         type: 'boolean', allowNull: true },
        { name: 'dhcpRangeStart',      type: 'string', allowNull: true },
        { name: 'dhcpRangeEnd',        type: 'string', allowNull: true },
        { name: 'dhcpLeaseDuration',   type: 'integer', allowNull: true },
        { name: 'dhcpGatewayOverride', type: 'string', allowNull: true },
        { name: 'dhcpPrefixOverride',  type: 'integer', allowNull: true }, // 1 - 32
        { name: 'dhcpDNSOverride',     type: 'string', allowNull: true },

        // hasMany dhcpOptions

        // VRRP
        { name: 'vrrpEnabled',  type: 'boolean', allowNull: true },
        { name: 'vrrpID',       type: 'integer', allowNull: true }, // 1 - 255
        { name: 'vrrpPriority', type: 'integer', allowNull: true }, // 1 - 255

        // hasMany vrrpV4Aliases

        // Wireless
        { name: 'wirelessSsid',       type: 'string', allowNull: true },
        { name: 'wirelessEncryption', type: 'string', allowNull: true }, // ["NONE", "WPA1", "WPA12", "WPA2"]
        { name: 'wirelessMode',       type: 'string', allowNull: true }, // ["AP", "CLIENT"]
        { name: 'wirelessPassword',   type: 'string', allowNull: true },
        { name: 'wirelessChannel',    type: 'integer', allowNull: true },

        // OPENVPN

        // wireguard
        { name: 'wireguardPrivateKey', type: 'string', allowNull: true },
        { name: 'wireguardAddresses',  type: 'auto', allowNull: true },
        { name: 'wireguardPort',       type: 'integer', allowNull: true },

        // hasMany wireguardPeers

    ],

    hasMany: [{
        model: 'Mfw.model.v4Alias',
        name: 'v4Aliases',
        associationKey: 'v4Aliases'
    }, {
        model: 'Mfw.model.v6Alias',
        name: 'v6Aliases',
        associationKey: 'v6Aliases'
    }, {
        model: 'Mfw.model.DhcpOptions',
        name: 'dhcpOptions',
        associationKey: 'dhcpOptions'
    }, {
        model: 'Mfw.model.v4Alias',
        name: 'vrrpV4Aliases',
        associationKey: 'vrrpV4Aliases'
    }, {
        model: 'Mfw.model.wireguardPeer',
        name: 'wireguardPeers',
        associationKey: 'wireguardPeers'
    }],

    hasOne: [{
        model: 'Mfw.model.OpenVpnConfFile',
        name: 'openvpnConfFile',
        associationKey: 'openvpnConfFile'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/network/interfaces',
            update: Util.api + '/settings/network/interfaces'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: false, // wrap single record in array
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    }
});

