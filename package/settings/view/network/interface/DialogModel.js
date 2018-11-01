Ext.define('Mfw.settings.network.interface.DialogModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.settings-interface-viewmodel',

    data: {
        rec: null,
        title: 'Edit Interface'.t(),
        cardId: 'main',
        isMainCard: true
    },
    formulas: {
        availableSettings: function (get) {
            var settings = [], v4ConfigType, v6ConfigType;

            switch (get('rec.v4ConfigType')) {
                case 'DHCP': v4ConfigType = 'DHCP'.t(); break;
                case 'STATIC': v4ConfigType = 'Static'.t(); break;
                case 'PPPOE': v4ConfigType = 'PPPoE'.t(); break;
                default:
            }

            switch (get('rec.v6ConfigType')) {
                case 'DHCP': v6ConfigType = 'DHCP'.t(); break;
                case 'SLAAC': v6ConfigType = 'SLAAC'.t(); break;
                case 'ASSIGN': v6ConfigType = 'Assign'.t(); break;
                case 'STATIC': v6ConfigType = 'Static'.t(); break;
                case 'DISABLED': v6ConfigType = 'Disabled'.t(); break;
                default:
            }

            if (get('rec.configType') === 'ADDRESSED') {
                settings.push({ text: 'IPv4'.t(), status: v4ConfigType, card: 'ipv4' });
                settings.push({ text: 'IPv6'.t(), status: v6ConfigType, card: 'ipv6' });
                if (!get('rec.wan')) {
                    settings.push({ text: 'DHCP'.t(), status: get('rec.dhcpEnabled') ? 'Enabled'.t() : 'Disabled'.t(), card: 'dhcp' });
                }
                settings.push({ text: 'VRRP (Redundancy)'.t(), status: get('rec.vrrpEnabled') ? 'Enabled'.t() : 'Disabled'.t(), card: 'vrrp' });
            }
            return settings;
        },

        enableIpv6Toggle: function (get) {
            return get('rec.wan') && get('cardId') === 'ipv6';
        },

        enableDhcpToggle: function (get) {
            return !get('rec.wan') && get('cardId') === 'dhcp';
        },

        enableVrrpToggle: function (get) {
            return get('cardId') === 'vrrp';
        },

        addGridItemsBtn: function (get) {
            return Ext.Array.contains(['ipv4-aliases', 'ipv6-aliases', 'vrrp-aliases', 'dhcp-options'], get('cardId'));
        },
    }

});
