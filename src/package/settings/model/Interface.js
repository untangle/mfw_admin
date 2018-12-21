Ext.define('Mfw.model.v4Alias', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'v4Address', type: 'string' },
        { name: 'v4Prefix', type: 'integer' }
    ]
});

Ext.define('Mfw.model.v6Alias', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'v6Address', type: 'string' },
        { name: 'v6Prefix', type: 'integer' }
    ]
});

Ext.define('Mfw.model.DhcpOptions', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'enabled', type: 'boolean' },
        { name: 'description', type: 'string' },
        { name: 'value', type: 'string' }
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
        { name: 'device',      type: 'string' },
        { name: 'wan',         type: 'boolean' },
        { name: 'wanWeight',   type: 'integer' },
        { name: 'hidden',      type: 'boolean', defaultValue: false },
        { name: 'type',        type: 'string' }, // ["NIC","VLAN","WIFI","OPENVPN"]
        { name: 'configType',  type: 'string' }, // ["ADDRESSED","BRIDGED","DISABLED"]

        { name: 'natEgress',  type: 'boolean' },
        { name: 'natIngress', type: 'boolean' },

        // IPv4
        { name: 'v4ConfigType',    type: 'string' }, // ["STATIC","DHCP","PPPOE","DISABLED"]
        { name: 'v4StaticAddress', type: 'string' },
        { name: 'v4StaticPrefix',  type: 'integer' }, // 1 - 32
        { name: 'v4StaticGateway', type: 'string' },
        { name: 'v4StaticDNS1',    type: 'string' },
        { name: 'v4StaticDNS2',    type: 'string' },

        // IPv4 DHCP overrides
        { name: 'v4DhcpAddressOverride', type: 'string' },
        { name: 'v4DhcpPrefixOverride',  type: 'integer', defaultValue: 24 }, // 1 - 32
        { name: 'v4DhcpGatewayOverride', type: 'string' },
        { name: 'v4DhcpDNS1Override',    type: 'string' },
        { name: 'v4DhcpDNS2Override',    type: 'string' },

        // PPPoE
        { name: 'v4PPPoEUsername',     type: 'string' },
        { name: 'v4PPPoEPassword',     type: 'string' },
        { name: 'v4PPPoEUsePeerDNS',   type: 'boolean' },
        { name: 'v4PPPoEOverrideDNS1', type: 'string' },
        { name: 'v4PPPoEOverrideDNS2', type: 'string' },

        { name: 'v4Aliases', type: 'auto' },

        // IPv6
        { name: 'v6ConfigType',    type: 'string' }, // ["DHCP","SLAAC","ASSIGN","STATIC","DISABLED"]
        { name: 'v6StaticAddress', type: 'string' },
        { name: 'v6StaticPrefix',  type: 'integer' }, // 1 - 128
        { name: 'v6StaticGateway', type: 'string' },
        { name: 'v6StaticDNS1',    type: 'string' },
        { name: 'v6StaticDNS2',    type: 'string' },

        // IPv6 Assign
        { name: 'v6AssignHint',   type: 'string' },
        { name: 'v6AssignPrefix', type: 'integer', defaultValue: 128 }, // 1 -128

        { name: 'v6Aliases', type: 'auto' },

        { name: 'routerAdvertisements', type: 'boolean' },
        { name: 'downloadKbps',         type: 'integer' },
        { name: 'uploadKbps',           type: 'integer' },
        { name: 'macaddr',              type: 'string' },

        // DHCP serving
        { name: 'dhcpEnabled',         type: 'boolean' },
        { name: 'dhcpRangeStart',      type: 'string' },
        { name: 'dhcpRangeEnd',        type: 'string' },
        { name: 'dhcpLeaseDuration',   type: 'integer' },
        { name: 'dhcpGatewayOverride', type: 'string' },
        { name: 'dhcpPrefixOverride',  type: 'integer' }, // 1 - 32
        { name: 'dhcpDNSOverride',     type: 'string' },

        // { name: 'dhcpOptions', type: 'auto' },

        // VRRP
        { name: 'vrrpEnabled',  type: 'boolean' },
        { name: 'vrrpID',       type: 'integer' }, // 1 - 255
        { name: 'vrrpPriority', type: 'integer' }, // 1 - 255

        // { name: 'vrrpV4Aliases', type: 'auto' },

        // Wireless
        { name: 'wirelessSsid',  type: 'string' },
        { name: 'wirelessEncryption',       type: 'string' }, // ["NONE", "WPA1", "WPA12", "WPA2"]
        { name: 'wirelessMode', type: 'string' }, // ["AP", "CLIENT"]
        { name: 'wirelessPassword', type: 'string' },
        { name: 'wirelessChannel', type: 'integer' }
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
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/api/settings/network/interfaces',
            update: window.location.origin + '/api/settings/network/interfaces'
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

