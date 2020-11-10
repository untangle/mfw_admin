/**
 * WireGuard interface options
 * shown only if interface type is WIREGUARD
 */
Ext.define('Mfw.settings.interface.WireGuard', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wireguard',

    viewModel: {
        data: {
            activeCard: 'wg-conf',
            // the first peer of wg interface, populated on init
            peer: null
        }
    },

    scrollable: true,
    layout: 'vbox',

    items: [{
        xtype: 'formpanel',
        width: 400,
        bind: {
            flex: '{isDialog ? 1 : "auto"}'
        },
        items: [{
            xtype: 'component',
            padding: '16 0',
            style: 'font-weight: 100; font-size: 20px;',
            html: 'VPN Tunnel Configuration'
        }, {
            xtype: 'textfield',
            name: 'host',
            label: 'Remote endpoint address',
            placeholder: 'enter address ...',
            clearable: false,
            autoComplete: false,
            labelAlign: 'top',
            flex: 1,
            bind: {
                value: '{peer.host}',
                required: '{intf.type === "WIREGUARD"}',
                disabled: '{intf.type !== "WIREGUARD"}'
            }
        }, {
            xtype: 'textfield',
            name: 'publicKey',
            label: 'Remote endpoint public key',
            labelAlign: 'top',
            clearable: false,
            autoComplete: false,
            placeholder: 'enter public key ...',
            flex: 1,
            bind: {
                value: '{peer.publicKey}',
                required: '{intf.type === "WIREGUARD"}',
                disabled: '{intf.type !== "WIREGUARD"}'
            },
            validators: [function (val) {
                if (val.length !== 44 || val.indexOf(' ') >= 0) {
                    return 'Invalid base64 key value'
                }
                return true;
            }]
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = vm.get('intf');

            /**
             * because bindings cannot handle arrays
             * set a new bind on the unique first wireguard interface peer
             */
            vm.set('peer', intf.wireguardPeers().first());

            /**
             * because wireguard backend requires intf 'device' to be set
             * just gave it the same value as the name
             * only when creating a new interface!
             */
            if (vm.get('isNew')) {
                vm.bind('{intf.name}', function(name) {
                    intf.set('device', name);
                });
            }

            /**
             * attempt not to show field errors on form initialization
             * as the user hasn't done any input yet
             * - requires fields to have a "name"
             * - it should be done after the initial binding occurs (which triggers change event)
             * - it still requires a small delay to be effective
             */
            vm.bind('{intf}', function() {
                Ext.defer(function () { view.down('formpanel').clearErrors(); }, 50);
            });
        }
    }
});
