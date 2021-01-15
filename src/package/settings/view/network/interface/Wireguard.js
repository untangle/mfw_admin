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
            peer: null,
            localPublicKey: null,
            localInterfaceIpAddress: null
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
            style: 'font-weight: 100; font-size: 20px;',
            html: 'WireGuard VPN Configuration'
        },{
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                required: false,
                clearable: false
            },
            items:[{
                xtype: 'selectfield',
                label: 'Configuration mode',
                itemId: 'wireguardConfigurationMode',
                required: true,
                autoSelect: true,
                hidden: true,
                flex: 1,
                options: [
                    { text: 'Import from clipboard', value: 'PASTE' },
                    { text: 'Manual', value: 'MANUAL' }
                ],
                bind: {
                    value: '{intf.wireguardEditMode}',
                    hidden: '{intf.type !== "WIREGUARD"}',
                    required: '{intf.type === "WIREGUARD"}',
                    disabled: '{intf.type !== "WIREGUARD"}'
                }
            },{
                // !!!! MOVE THIS TO LOCAL FIELDSET
                xtype: 'button',
                iconCls: 'x-far fa-copy',
                tooltip: 'Copy configuration to clipboard for remote connection',
                hidden: true,
                bind: {
                    hidden: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode != "MANUAL"}',
                },
                handler: 'copyConfiguration'
            }]
        }, {
            xtype: 'textfield',
            placeholder: 'paste WireGuard configuration from clipboard here ...',
            clearable: false,
            autoComplete: false,
            labelAlign: 'top',
            flex: 1,
            bind: {
                hidden: '{intf.wireguardEditMode != "PASTE" && intf.type == "WIREGUARD"}',
            },
            listeners: {
                paste: 'pasteConfiguration'
            }
        }, {
            xtype: 'component',
            html: 'Imported settings are read-only',
            disabled: true,
            bind: {
                hidden: '{intf.wireguardEditMode != "PASTE"}'
            }
        }, {
            xtype: 'container',
            items:[{
                xtype: 'fieldset',
                title: 'Local',
                margin: '0 0 32 0',
                items:[{
                    xtype: 'container',
                    margin: '0 0 0 -8',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    items: [{
                        /**
                         * the key is dummy generated in UI
                         * it should be retreived via an API status call (see MFW-940)
                         */
                        xtype: 'component',
                        flex: 1,
                        bind: {
                            html: '<div style="color: rgba(17, 17, 17, 0.54)">Public key</div>' +
                                        '<div style="color: #555; margin-top: 8px;">' +
                                        '{intf.wireguardPublicKey}' +
                                        '</div>',
                        }
                    }]
                },{
                    xtype: 'containerfield',
                    layout: 'hbox',
                    margin: '0 0 0 -8',
                    defaults: {
                        required: false,
                        clearable: false
                    },
                    items:[{
                        xtype: 'selectfield',
                        label: 'Type',
                        placeholder: 'Select type ...',
                        required: true,
                        autoSelect: true,
                        hidden: true,
                        options: [
                            { text: 'Roaming', value: 'ROAMING' },
                            { text: 'Tunnel', value: 'TUNNEL' }
                        ],
                        bind: {
                            value: '{intf.wireguardType}',
                            hidden: '{intf.type !== "WIREGUARD"}',
                            required: '{intf.type === "WIREGUARD"}',
                            disabled: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode == "PASTE"}'
                        },
                        listeners:{
                            select: 'wireguardTypeSelect'
                        }
                    },{
                        xtype: 'textfield',
                        label: 'Listen port',
                        clearable: false,
                        hidden: true,
                        bind: {
                            value: '{intf.wireguardPort}',
                            required: '{intf.type === "WIREGUARD"}',
                            hidden: '{intf.wireguardType !== "TUNNEL"}',
                            disabled: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode == "PASTE"}'
                        },
                        validators: 'port'
                    }]
                },{
                    xtype: 'textfield',
                    label: 'Interface IP address',
                    itemId: 'localInterfaceId',
                    margin: '0 0 0 -8',
                    placeholder: 'enter IP address ...',
                    clearable: false,
                    autoComplete: false,
                    labelAlign: 'top',
                    flex: 1,
                    bind: {
                        value: '{intf.wireguardAddresses.first.address}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode == "PASTE"}'
                    },
                    validators: 'ipany'
                }]
            }, {
                xtype: 'fieldset',
                margin: '-16 0 0 0',
                title: 'Remote',
                items: [{
                    xtype: 'textfield',
                    name: 'publicKey',
                    label: 'Public key',
                    margin: '0 0 0 -8',
                    labelAlign: 'top',
                    clearable: false,
                    autoComplete: false,
                    placeholder: 'enter public key ...',
                    flex: 1,
                    bind: {
                        value: '{peer.publicKey}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode == "PASTE"}'
                    },
                    validators: [function (val) {
                        if (val.length !== 44 || val.indexOf(' ') >= 0) {
                            return 'Invalid base64 key value'
                        }
                        return true;
                    }]
                },{
                    xtype: 'container',
                    layout: 'vbox',
                    margin: '0 0 0 -8',
                    hidden: true,
                    bind: { hidden: '{intf.type !== "WIREGUARD"}' },
                    items: [{
                        xtype: 'containerfield',
                        layout: 'hbox',
                        defaults: {
                            flex: 1,
                            required: false,
                            clearable: false
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'host',
                            label: 'Endpoint address',
                            placeholder: 'enter address ...',
                            clearable: false,
                            autoComplete: false,
                            labelAlign: 'top',
                            flex: 1,
                            bind: {
                                value: '{peer.host}',
                                required: '{intf.type === "WIREGUARD"}',
                                disabled: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode == "PASTE"}'
                            },
                            validators: 'hostname'
                        }, {
                            xtype: 'textfield',
                            label: 'Endpoint listen port',
                            margin: '0 0 0 16',
                            clearable: false,
                            bind: {
                                value: '{peer.port}',
                                required: '{intf.type === "WIREGUARD"}',
                                disabled: '{intf.type !== "WIREGUARD" || intf.wireguardEditMode == "PASTE"}'
                            },
                            validators: 'port'
                        }]
                    }]
                }, {
                    xtype: 'button',
                    margin: '16 0 0 -16',
                    bind: {
                        text: 'Allowed IP Addresses ({peer.allowedIps.count || "none"})',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    ui: 'action',
                    handler: 'showPeerAllowedIpAddresses'
                }]
            }]
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = vm.get('intf'),
                type = intf.get('type');

            if(type == 'WIREGUARD'){
                /**
                 * because bindings cannot handle arrays
                 * set a new bind on the unique first wireguard interface peer
                 */
                vm.set('peer', intf.wireguardPeers().first());

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

                var wanCheckbox = view.up('mfw-settings-network-interface').down('[_itemId=wan]');
                if(wanCheckbox){
                    wanCheckbox.onAfter('change', this.onWanChange);
                }

                var confgurationMode = view.down('[_itemId=wireguardConfigurationMode]');
                if(confgurationMode){
                    confgurationMode.onAfter('change', this.onConfigurationModeChange);
                    if(vm.get('isNew')){
                        this.onConfigurationModeChange(confgurationMode, 'PASTE');
                    }
                }
            }
        },

        // If wan, add 0.0.0.0/0 to allowedIps if not there, otherwise remove it.
        onWanChange: function(component, newValue, oldValue){
            var vm = component.up('mfw-settings-network-interface').getViewModel(),
                peerAllowedIps = vm.get('intf').wireguardPeers().first().allowedIps();
            if(newValue == true){
                // Add 0.0.0.0/0 to allowed list if not already there.
                var defaultNetworkFound = false;
                peerAllowedIps.each( function(network){
                    if(network.get("address") == '0.0.0.0' && network.get('prefix') == 0){
                        defaultNetworkFound = true;
                    }
                });
                if(defaultNetworkFound == false){
                    peerAllowedIps.add({
                        address: '0.0.0.0',
                        prefix: 0
                    });
                }
            }else{
                // Remove 0.0.0.0/0
                var index = peerAllowedIps.find('address', '0.0.0.0', 0, false, false, true);
                if(index > -1){
                    peerAllowedIps.removeAt(index);
                }
            }
        },

        onConfigurationModeChange: function(component, newValue, oldValue){
            var vm = component.up('mfw-settings-network-interface').getViewModel(),
                vmWg = component.up('interface-wireguard').getViewModel(),
                intf = vm.get('intf');

            if(vm.get('isNew')){
                if(vmWg.get('localPublicKey') == null){
                    vmWg.set('localPublicKey', intf.get('wireguardPublicKey'));
                }
                if(vmWg.get('localInterfaceIpAddress') == null){
                    vmWg.set('localInterfaceIpAddress', intf.wireguardAddresses().first().get('address'));
                }
                if(newValue == 'PASTE'){
                    intf.set('wireguardPublicKey', '');
                    intf.wireguardAddresses().first().set('address', '');
                }else{
                    if(intf.get('wireguardPublicKey') == ''){
                        intf.set('wireguardPublicKey', vmWg.get('localPublicKey'));
                    }
                    if(intf.wireguardAddresses().first().get('address') == ''){
                        intf.wireguardAddresses().first().set('address', vmWg.get('localInterfaceIpAddress'));
                    }
                }
            }
        },

        /**
         * Generate dialog to allow editing of allowedIP networks.
         */
        showPeerAllowedIpAddresses: function () {
            var me = this;
            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-wireguard-allowedipaddresses',
                width: 500,
                height: 500,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        },

        // In Roaming mode, can be bound to any WAN interface.
        // In Tunnel mode, must be bound to specific WAN.
        wireguardTypeSelect: function(component, newValue){
            var value = newValue.get('value');
            component.up('mfw-settings-network-interface').getViewModel().set('boundOptionsAllowAny', (value == 'ROAMING') ? true : false);
        },

        // Paste from a NGFW WireGuard copy to pasteboard.
        pasteConfiguration: function(component, options){
            var me = this,
                vm = component.up('mfw-settings-network-interface').getViewModel(),
                interface = vm.get('intf'),
                pasteData = options.event.clipboardData.getData("text/plain"),
                configured = false;

            try{
                // If in JSON format, build peer snippit.
                var jsonPasteData = JSON.parse(pasteData);
                var remote = ["[Peer]"]
                var endpoint = [];
                for( var key in jsonPasteData ){
                    if (jsonPasteData.hasOwnProperty(key)){
                        switch(key){
                            case 'hostname':
                                remote.push('# ' + jsonPasteData[key]);
                                break;
                            case 'publicKey':
                                remote.push('PublicKey=' + jsonPasteData[key]);
                                break;
                            case 'endpointAddress':
                                endpoint[0] = jsonPasteData[key];
                                break;
                            case 'endpointPort':
                                endpoint[1] = jsonPasteData[key];
                                break;
                            case 'networks':
                                remote.push('AllowedIps=' + jsonPasteData[key]);
                                break;
                        }
                    }
                }
                remote.push("Endpoint=" + endpoint.join(':'));
                pasteData = remote.join("\n");
            }catch(e){}

            // Process as a WireGuard configuration file format from the
            // perspective that is intended for us (NGFW "Remote Client")
            var group = null;
            pasteData.split("\n").forEach( function(line){
                line = line.replace(/(\r\n|\n|\r)/gm,"");
                if(line.toLowerCase() == "[interface]"){
                    group = "local";
                }else if(line.toLowerCase() == "[peer]"){
                    group = "remote";
                }else{
                    // using split() on "=" will remove from target string even beyond a specifying
                    // the limit.  For example, this would remove the neccessary character in private key
                    // so use a manual split on = and space.
                    var delimeterIndex = line.indexOf('=');
                    if(delimeterIndex == -1){
                        delimeterIndex = line.indexOf(' ');
                    }
                    if(delimeterIndex > -1){
                        var key = line.substr(0, delimeterIndex).toLowerCase();
                        var value = line.substr(delimeterIndex + 1);
                        if(group == "local"){
                            switch(key){
                                case "privatekey":
                                    if(value == ""){
                                        Ext.toast('PrivateKey specified but no value; please verify PublicKey on both ends!', 3000);
                                    }else{
                                        /**
                                         * Get public key from private key.
                                         */
                                        Ext.Ajax.request({
                                            url: Util.api + '/wireguard/publickey',
                                            method: 'POST',
                                            params: Ext.JSON.encode({
                                                privateKey: value
                                            }),
                                            async: false,
                                            success: function (response) {
                                                var keypair = JSON.parse(response.responseText);
                                                interface.set('wireguardPrivateKey', keypair.privateKey);
                                                interface.set('wireguardPublicKey', keypair.publicKey);
                                                configured = true;
                                            },
                                            failure: function () {
                                            }
                                        });
                                    }
                                    break;
                                case "address":
                                    interface.wireguardAddresses().first().set('address', value);
                                    configured = true;
                                    break;
                                case "listenport":
                                    interface.set("wireguardType", "TUNNEL");
                                    interface.set("wireguardPort", parseInt(value,10));
                                    configured = true;
                                    break;
                                default:
                                    console.log("Unknown interface key:" + key);
                            }
                        }else if(group == "remote"){
                            var peer = interface.wireguardPeers().first();
                            switch(key){
                                case "publickey":
                                    peer.set('publicKey', value);
                                    configured = true;
                                    break;
                                case "endpoint":
                                    var endpoint = value.split(':');
                                    peer.set('host', endpoint[0]);
                                    peer.set('port', endpoint[1]);
                                    configured = true;
                                    break;
                                case "allowedips":
                                    var allowedIps = peer.allowedIps();
                                    allowedIps.removeAll();
                                    value.split(/[,]/).forEach(function(cidr){
                                        cidr = cidr.replace(/(\r\n|\n|\r)/gm,"");
                                        if(cidr != ""){
                                            cidr = cidr.split("/");
                                            allowedIps.add({
                                                address: cidr[0],
                                                prefix: cidr.length == 2 ? parseInt(cidr[1], 10) : 32
                                            });
                                        }
                                    });
                                    configured = true;
                                    me.onWanChange(component, interface.get('wan'));
                                    break;
                                case "#":
                                    // Ignore host
                                    break;
                                default:
                                    console.log("Unknown peer key:" + key);
                            }
                        }
                    }
                }
            });

            if(configured){
                var clearTask = new Ext.util.DelayedTask( Ext.bind(function(){
                    if( component ){
                        component.clearValue();
                    }
                }, me ));
                clearTask.delay(50);
            }else{
                Ext.toast('No valid WireGuard settings found!', 3000);
            }
        },
        copyConfiguration: function(component){
            // What do do about NGFW and Javascript?
            var vm = component.up('mfw-settings-network-interface').getViewModel(),
                interface = vm.get('intf'),
                peer = interface.wireguardPeers().first();

            var address = interface.wireguardAddresses().first();
            var jsonData = {
                'hostname' : interface.get('name'),
                'publicKey' : interface.get('wireguardPublicKey'),
                'peerAddress' : address.get('address')
            };
            if(interface.get('wireguardType') == 'TUNNEL'){
                var boundInterface = Ext.getStore('interfaces').findRecord('interfaceId', interface.get('boundInterfaceId'));
                if(boundInterface == null){
                    Ext.toast('Could not find bound interface!', 3000);
                    return;
                }
                var address = '';

                if(boundInterface.get('v4ConfigType') === 'STATIC'){
                    // for static configuration grab the configured static address
                    address = boundInterface.get('v4StaticAddress');
                }
                else if((boundInterface.get('v4ConfigType') === 'DHCP') || (boundInterface.get('v4ConfigType') === 'PPPOE')){
                    // for DHCP and PPPoE grab the first address from the array in the _status info
                    address = boundInterface.get('_status').ip4Addr[0].split('/')[0]
                }

                if(address == ''){
                    if(boundInterface.get('v6ConfigType') === 'STATIC'){
                        // for static configuration grab the configured static address
                        address = boundInterface.get('v6StaticAddress');
                    }
                    else if((boundInterface.get('v46onfigType') === 'DHCP') || (boundInterface.get('v6ConfigType') === 'PPPOE')){
                        // for DHCP and PPPoE grab the first address from the array in the _status info
                        address = boundInterface.get('_status').ip6Addr[0].split('/')[0]
                    }
                }

                if(address != ''){
                    jsonData['endpointAddress'] = address;
                    jsonData['endpointPort'] = interface.get('wireguardPort');
                }

            }
            // Get local networks
            var networks = [];
            Ext.getStore('interfaces').each( function(interface){
                if(interface.get('wan') == false){
                    if(interface.get('v4ConfigType') == 'STATIC'){
                        networks.push(interface.get('v4StaticAddress') + '/' + interface.get('v4StaticPrefix'));
                    }
                    if(interface.get('v6ConfigType') == 'STATIC'){
                        networks.push(interface.get('v6StaticAddress') + '/' + interface.get('v6StaticPrefix'));
                    }
                }
            });
            if(networks.length > 0){
                jsonData['networks'] = networks.join(",");
            }

            el = document.createElement('textarea'),
            el.value = JSON.stringify(jsonData);
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            // this executes the actual copy
            document.execCommand('copy');
            // remove the textarea helper
            document.body.removeChild(el);
        }
    },

});
