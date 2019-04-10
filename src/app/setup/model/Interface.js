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

        // IPv6
        { name: 'v6ConfigType',    type: 'string', allowNull: true }, // ["DHCP","SLAAC","ASSIGN","STATIC","DISABLED"]
        { name: 'v6StaticAddress', type: 'string', allowNull: true },
        { name: 'v6StaticPrefix',  type: 'integer', allowNull: true }, // 1 - 128
        { name: 'v6StaticGateway', type: 'string', allowNull: true },
        { name: 'v6StaticDNS1',    type: 'string', allowNull: true },
        { name: 'v6StaticDNS2',    type: 'string', allowNull: true },
        { name: 'v6DhcpDNS1Override', type: 'string', allowNull: true },
        { name: 'v6DhcpDNS2Override', type: 'string', allowNull: true },

        // IPv6 Assign
        { name: 'v6AssignHint',   type: 'string', allowNull: true },
        { name: 'v6AssignPrefix', type: 'integer', allowNull: true }, // 1 -128

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

        // { name: 'dhcpOptions', type: 'auto' },

        // VRRP
        { name: 'vrrpEnabled',  type: 'boolean', allowNull: true },
        { name: 'vrrpID',       type: 'integer', allowNull: true }, // 1 - 255
        { name: 'vrrpPriority', type: 'integer', allowNull: true }, // 1 - 255

        // { name: 'vrrpV4Aliases', type: 'auto' },

        // Wireless
        { name: 'wirelessSsid',  type: 'string', allowNull: true },
        { name: 'wirelessEncryption', type: 'string', allowNull: true }, // ["NONE", "WPA1", "WPA12", "WPA2"]
        { name: 'wirelessMode', type: 'string', allowNull: true }, // ["AP", "CLIENT"]
        { name: 'wirelessPassword', type: 'string', allowNull: true },
        { name: 'wirelessChannel', type: 'integer', allowNull: true },

        // OpenVPN
        { name: 'openvpnUsernamePasswordEnabled', type: 'boolean', allowNull: true },
        { name: 'openvpnUsername',                type: 'string',  allowNull: true },
        { name: 'openvpnPasswordBase64',          type: 'string',  allowNull: true },

        // wireguard
        { name: 'wireguardPrivateKey', type: 'string', allowNull: true },
        { name: 'wireguardAddresses',  type: 'auto', allowNull: true },
        { name: 'wireguardPort',       type: 'integer', allowNull: true }

    ],

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

