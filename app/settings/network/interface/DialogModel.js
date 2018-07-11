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
            var settings = [];
            if (get('rec.configType') === 'ADDRESSED') {
                settings.push({ text: 'IPv4 Settings'.t(), status: get('rec.v4ConfigType'), card: 'ipv4' });
                settings.push({ text: 'IPv6 Settings'.t(), status: get('rec.v6ConfigType'), card: 'ipv6' });
                if (!get('rec.wan')) {
                    settings.push({ text: 'DHCP Settings'.t(), status: get('rec.dhcpEnabled') ? 'Enabled'.t() : 'Disabled'.t(), card: 'dhcp' });
                }
                settings.push({ text: 'VRRP Settings'.t(), status: get('rec.vrrpEnabled') ? 'Enabled'.t() : 'Disabled'.t(), card: 'vrrp' });
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
