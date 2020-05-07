/**
 * Wireguard interface options
 * shown only if interface type is WIREGUARD
 */
Ext.define('Mfw.settings.interface.Wireguard', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wireguard',

    viewModel: {
        data: {
            activeCard: 'wg-conf',
            /**
             * IMPORTANT!!!
             * this wireguardPublicKey should be retrieved from intf status or settings
             * to be removed later
             */
            wireguardPublicKey: btoa(Math.random().toFixed(32).substr(2))
        },
        formulas: {
            /**
             * helper to convert the interface addresses string to array
             */
            _wireguardAddresses: {
                get: function (get) {
                    if (!get('intf.wireguardAddresses')) { return ''; }
                    return get('intf.wireguardAddresses').join(',');
                },
                set: function (value) {
                    this.set('intf.wireguardAddresses', value ? value.replace(/\s/g,'').split(',') : null);
                }
            }
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
            xtype: 'textfield',
            name: 'wireguardAddresses',
            label: 'Address',
            placeholder: 'enter address ...',
            clearable: false,
            autoComplete: false,
            labelAlign: 'top',
            flex: 1,
            bind: {
                value: '{_wireguardAddresses}',
                required: '{intf.type === "WIREGUARD"}',
                disabled: '{intf.type !== "WIREGUARD"}'
            },
            validators: 'ipv4expression'
        }, {
            xtype: 'numberfield',
            name: 'wireguardPort',
            width: 150,
            label: 'Wireguard Listen Port',
            labelAlign: 'top',
            clearable: false,
            autoComplete: false,
            placeholder: 'enter port ...',
            bind: {
                value: '{intf.wireguardPort}',
                required: '{intf.type === "WIREGUARD"}',
                disabled: '{intf.type !== "WIREGUARD"}'
            },
            validators: 'port',
        }, {
            xtype: 'component',
            margin: '16 0',
            html: '<span style="color: rgba(17, 17, 17, 0.54)">Allowed IPs</span> <br/>' +
                '<span style="color: #555; "><strong>0.0.0.0/0</strong> (allow all IPv4 addresses)</span>',
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'bottom'
            },
            margin: '0 0 10 0',
            hidden: true,
            bind: {
                hidden: '{isNew}'
            },
            items: [{
                // wg public key
                xtype: 'component',
                flex: 1,
                bind: {
                    html: '<span style="color: rgba(17, 17, 17, 0.54)">Public key</span> <br/>' +
                        '<span style="color: #555; font-family: monospace;">{wireguardPublicKey}</span>',
                }
            }, {
                xtype: 'button',
                iconCls: 'x-far fa-copy',
                tooltip: 'Copy to Clipboard',
                handler: 'copyToClipboardHandler'
            }]
        }]
    }],

    controller: {
        copyToClipboardHandler: function () {
            var str = this.getViewModel().get('wireguardPublicKey');
            Util.copyToClipboard(str);
        }
    }
});
