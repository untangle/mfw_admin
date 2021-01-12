Ext.define('Mfw.settings.network.Interface', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-interface',

    layout: 'fit',

    header: {
        padding: '0 8 0 16'
    },

    bind: {
        title: '{isNew ? "Add" : "Edit"} Interface',
    },

    tools: [{
        xtype: 'button',
        text: 'Cancel',
        iconCls: 'x-fa fa-times',
        cls: 'btn-tool',
        handler: 'onCancel'
    }, {
        xtype: 'button',
        bind: {
            text: '{isNew ? "Add" : "Save"}',
        },
        cls: 'btn-tool',
        iconCls: 'md-icon-save',
        handler: 'onSave'
    }],

    viewModel: {
        data: {
            intf: null,
            cardKey: 'ipv4',
            setupContext: false,
            isNew: false,
            isDialog: false,
            validDhcpRange: null,
            wifiWarning: false,
            // Most configurations are ok using any bound WAN, but not all.
            boundOptionsAllowAny: true
        },
        formulas: {
            /**
             * conditions when toolbar and cards are hidden
             */
            _hiddenToolbar: function (get) {
                return get('intf.type') === 'WWAN' ||
                    get('intf.type') === 'OPENVPN' ||
                    get('intf.type') === 'WIREGUARD' ||
                    get('intf.configType') === 'BRIDGED' ||
                    (get('intf.type') === 'WIFI' && get('intf.configType') !== 'ADDRESSED');
            },
            _hiddenIpv4: function (get) {
                return get('intf.configType') !== 'ADDRESSED' ||
                    get('intf.type') === 'OPENVPN' ||
                    get('intf.type') === 'WIREGUARD' ||
                    get('intf.type') === 'WWAN';
            },
            _hiddenIpv6: function (get) {
                return get('intf.configType') !== 'ADDRESSED' ||
                    get('intf.type') === 'OPENVPN' ||
                    get('intf.type') === 'WIREGUARD' ||
                    get('intf.type') === 'WWAN';
            },
            _hiddenDhcp: function (get) {
                return get('intf.configType') !== 'ADDRESSED' ||
                    get('intf.type') === 'OPENVPN' ||
                    get('intf.type') === 'WIREGUARD' ||
                    get('intf.type') === 'WWAN' ||
                    get('intf.wan');
            },
            _hiddenQos: function (get) {
                return !get('intf.wan') ||
                    get('intf.type') === 'WIFI' ||
                    get('intf.type') === 'OPENVPN' ||
                    get('intf.type') === 'WIREGUARD' ||
                    get('intf.type') === 'VLAN' && get('intf.wan') === false;
            },
            _hiddenAdvanced: function (get) {
                return get('intf.type') !== 'NIC';
            },
            _intfAddTitle: function(get) {
                return 'Add ' + CommonUtil.getNiceInterfaceTypeName(get('intf.type')) +' Interface';
            },

            /**
             * set possible interface config types based on its type (NIC, OPENVPN)
             */
            _configTypes: function (get) {
                // all types
                var options = [
                    { text: 'Addressed', value: 'ADDRESSED' },
                ];

                switch(get('intf.type')) {
                    //Openvpn does not have bridged, but for everything else we need to append Bridged in
                    case 'OPENVPN':
                        break;
                    default:
                        options.push({ text: 'Bridged',   value: 'BRIDGED' })
                    }

                return options;
            },

            /**
             * set possible interfaces which can be bridged
             */
            _bridgedOptions: function (get) {
                var interfaces = [];
                Ext.getStore('interfaces').each(function (intf) {
                    // interface should be ADDRESSED
                    if (intf.get('interfaceId') === get('intf.interfaceId') ||
                        // MFW-702, do not show WANs in list of bridged to interfaces options
                        intf.get('configType') !== 'ADDRESSED' || intf.get('wan')) {
                            return;
                        }

                    interfaces.push({
                        text: intf.get('name'),
                        value: intf.get('interfaceId')
                    });
                });
                return interfaces;
            },

            /**
             * _bridgedTo is used for displaying the bridgedTo link relationship
             * 
             * 
             * @param {get} get - the get property for getting VM items 
             */
            _bridgedTo: function (get) {
                var name;
                if (!get('intf.bridgedTo')) {
                    return '<em>&lt;not set&gt;</em>';
                }
                name = Map.interfaces[get('intf.bridgedTo')];
                if (get('setupContext')) {
                    return '<strong>' + name + '</strong>';
                }
                return '<a href="#settings/network/interfaces/' + get('intf.bridgedTo') + '"><strong>' + name + '</strong></a>';
            },

            /**
             * _v4AliasText gets the text display for the v4Alias button
             * 
             * @param {get} get - get property for getting from VM elements
             */
            _v4AliasText: function(get) {
                var intf = get('intf'),
                    returnText = 'IPv4 Aliases';

                if (!intf || !intf.v4Aliases() || intf.v4Aliases().getCount() == 0) {
                    return returnText + ' (none)';
                }

                return returnText + ' (' + intf.v4Aliases().getCount() + ')'.t();
            },

            /**
             * _v6AliasText gets the text display for the v6Alias button
             * 
             * @param {get} get - get property for getting from VM elements
             */
            _v6AliasText: function(get) {
                var intf = get('intf'),
                    returnText = 'IPv6 Aliases';

                if (!intf || !intf.v6Aliases() || intf.v6Aliases().getCount() == 0) {
                    return returnText + ' (none)';
                }

                return returnText + ' (' + intf.v6Aliases().getCount() + ')'.t();
            },

            /**
             * _dhcpOptionsText gets the text display for the DHCP options button
             * 
             * @param {*} get - get property for getting VM elements
             */
            _dhcpOptionsText: function(get) {
                var intf = get('intf'),
                returnText = 'DHCP Options';

                if (!intf || !intf.dhcpOptions() || intf.dhcpOptions().getCount() == 0) {
                    return returnText + ' (none)'.t();
                }

                return returnText + ' (' + intf.dhcpOptions().getCount() + ')'.t();
            },

            /**
             * set possible interfaces which can be bound to an openvpn
             */
            _boundOptions: {
                bind: {
                    bindTo: '{boundOptionsAllowAny}',
                    deep: true,
                },
                get: function (get){
                    var interfaces = [];
                    if(this.get('boundOptionsAllowAny') == true){
                        interfaces.push({
                            text: 'any WAN',
                            value: 0
                        });
                    }
                    Ext.getStore('interfaces').each(function (intf) {
                        if (intf.get('type') === 'NIC' && intf.get('wan')) {
                            interfaces.push({
                                text: intf.get('name'),
                                value: intf.get('interfaceId')
                            });
                        }
                    });
                    return interfaces;
                }
            },
            /**
             * VLAN parent interface options
             * 
             * Use the interfaces store to query NIC type of interfaces to be available for bridge options
             * 
             * returns - a list of interface options
             */
            _vlanParentOptions: function() {
                var interfaces = [];

                Ext.getStore('interfaces').each(function (intf) {
                    if (intf.get('type') === 'NIC') {
                        interfaces.push(intf);
                    }
                });
                return interfaces;
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        padding: 0,
        layout: 'vbox',
        shadow: false,
        zIndex: 10,
        items: [{
            xtype: 'container',
            padding: '16 24 0 16',
            bind: {
                width: '{isDialog ? "auto" : 400}',
            },
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                style: 'font-weight: 100; font-size: 20px;',
                flex: 1,
                hidden: true,
                bind: {
                    html: '<strong>{intf.name}</strong> {!intf.enabled ? "(disabled)" : ""}',
                    hidden: '{isNew}'
                }
            }, {
                xtype: 'component',
                style: 'font-weight: 100; font-size: 20px;',
                flex: 1,
                hidden: true,
                bind: {
                    html: '{_intfAddTitle}',
                    hidden: '{!isNew}'
                }
            }, {
                xtype: 'togglefield',
                activeBoxLabel: 'Enabled',
                inactiveBoxLabel: 'Disabled',
                bind: '{intf.enabled}'

            }
        ]
        }, {
            xtype: 'container',
            padding: '0 8 16 8',
            bind: {
                width: '{isDialog ? "auto" : 400}'
            },
            items: [{
                xtype: 'formpanel',
                itemId: 'main',
                validateOnSync: true,
                padding: 0,
                bodyStyle: 'background: transparent;',
                layout: {
                    type: 'vbox'
                },
                defaults: {
                    margin: '0 8',
                    labelAlign: 'top'
                },
                items: [{
                    xtype: 'containerfield',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    defaults: {
                        labelAlign: 'top',
                        required: false,
                        clearable: false,
                        autoComplete: false
                    },
                    items: [{
                        xtype: 'textfield',
                        label: 'Name',
                        name: 'name',
                        flex: 1,
                        placeholder: 'enter name ...',
                        required: true,
                        hidden: true,
                        bind: {
                            value: '{intf.name}',
                            hidden: '{!intf.type}'
                        },
                        maxLength: 10,
                        errorTarget: 'bottom',
                    }, {
                        xtype: 'selectfield',
                        label: 'Config Type',
                        margin: '0 0 0 32',
                        hidden: true,
                        flex: 1,
                        bind: {
                            value: '{intf.configType}',
                            options: '{_configTypes}',
                            required: '{intf.type !== "WWAN"}',
                            hidden: '{intf.type === "WWAN" || intf.type === "OPENVPN" || intf.type === "WIREGUARD"}'
                        }
                    }]
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    bind: {
                        hidden:'{intf.type !== "VLAN"}'
                    },
                    items: [{
                        xtype: 'selectfield',
                        label: 'Interface',
                        name: 'vlaninterface',
                        flex: 1,
                        queryMode: 'local',
                        valueField: 'interfaceId',
                        displayField: 'name',
                        bind: {
                            required: '{intf.type === "VLAN"}',
                            options: '{_vlanParentOptions}',
                            value: '{intf.boundInterfaceId}',
                        },
                        listeners: {
                            select: 'handleVlanSelect'
                        }
                        
                    }, {
                            xtype: 'numberfield',
                            label: 'VLAN ID',
                            flex: 1,
                            margin: '0 0 0 38',
                            name: 'vlanid',
                            placeholder: 'enter VLAN ID ...',
                            bind: {
                                required: '{intf.type === "VLAN"}',
                                value: '{intf.vlanid}',
                            },
                            minValue: 1,
                            maxValue: 4094,
                        }
                    ]
                }, {
                    xtype: 'containerfield',
                    layout: 'hbox',
                    items: [{
                        xtype: 'selectfield',
                        label: 'Bridged To',
                        placeholder: 'Select bridge ...',
                        required: false,
                        autoSelect: true,
                        hidden: true,
                        bind: {
                            value: '{intf.bridgedTo}',
                            // MFW-703, show bridged to for WiFi interfaces
                            hidden: '{intf.configType !== "BRIDGED" || intf.type === "WWAN"}',
                            required: '{intf.configType === "BRIDGED" || intf.type === "VLAN"}',
                            options: '{_bridgedOptions}'
                        }
                    }, {
                        xtype: 'selectfield',
                        label: 'Bound to',
                        flex: 1,
                        required: true,
                        hidden: true,
                        bind: {
                            options: '{_boundOptions}',
                            value: '{intf.boundInterfaceId}',
                            hidden: '{intf.type !== "OPENVPN" && intf.type !== "WIREGUARD"}',
                            required: '{intf.type === "OPENVPN" || intf.type === "WIREGUARD"}',
                        }
                    },
                ]
            }, {
                    xtype: 'containerfield',
                    margin: '8 0 0 4',
                    layout: 'hbox',
                    items: [{
                        xtype: 'checkbox',
                        boxLabel: '<b>Is WAN</b>',
                        itemId: 'wan',
                        bodyAlign: 'start',
                        margin: '0 32 0 0',
                        hidden: true,
                        disabled: false,
                        bind: {
                            checked: '{intf.wan}',
                            hidden: '{intf.configType !== "ADDRESSED" || intf.type === "VLAN" && !intf.wan}',
                            disabled: '{intf.type === "VLAN"}'
                        }
                    }, {
                        xtype: 'checkbox',
                        boxLabel: '<b>NAT outgoing traffic (including bridged peers)</b>',
                        bodyAlign: 'start',
                        flex: 1,
                        hidden: true,
                        bind: {
                            checked: '{intf.natEgress}',
                            hidden: '{!intf.wan}'
                        }
                    }, {
                        xtype: 'checkbox',
                        boxLabel: '<b>NAT incoming traffic (including bridged peers)</b>',
                        bodyAlign: 'start',
                        flex: 1,
                        hidden: true,
                        bind: {
                            checked: '{intf.natIngress}',
                            hidden: '{intf.wan || intf.configType !== "ADDRESSED"}'
                        }
                    }]
                }]
            }]
        }]
    }, {
        xtype: 'toolbar',
        itemId: 'cardsToolbar',
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        docked: 'top',
        shadow: false,
        defaultType: 'button',
        padding: '0 11',
        style: {
            background: '#f5f5f5'
        },
        hidden: true,
        bind: {
            hidden: '{_hiddenToolbar}'
        },
        defaults: {
            margin: '0 3',
            ripple: false,
            handler: 'selectCard',
            // style: 'color: #333'
        },
        items: [{
            text: 'IPv4',
            value: 'ipv4',
            hidden: true,
            bind: {
                ui: '{cardKey === "ipv4" ? "action" : ""}',
                hidden: '{_hiddenIpv4}'
            }
        }, {
            text: 'IPv6',
            value: 'ipv6',
            hidden: true,
            bind: {
                ui: '{cardKey === "ipv6" ? "action" : ""}',
                hidden: '{_hiddenIpv6}'
            }
        }, {
            text: 'DHCP',
            value: 'dhcp',
            hidden: true,
            bind: {
                ui: '{cardKey === "dhcp" ? "action" : ""}',
                hidden: '{_hiddenDhcp}'
            }
        },
        // {
        //     text: 'VRRP',
        //     value: 'vrrp',
        //     hidden: true,
        //     bind: {
        //         ui: '{cardKey === "vrrp" ? "action" : ""}',
        //         hidden: '{intf.type !== "NIC"}'
        //     }
        // },
        {
            text: 'WIFI',
            value: 'wifi',
            hidden: true,
            bind: {
                ui: '{cardKey === "wifi" ? "action" : ""}',
                hidden: '{intf.type !== "WIFI"}'
            }
        }, {
            text: 'LTE',
            value: 'lte',
            hidden: true,
            bind: {
                ui: '{cardKey === "lte" ? "action" : ""}',
                hidden: '{intf.type !== "WWAN"}'
            }
        }, {
            text: 'OpenVPN',
            value: 'openvpn',
            hidden: true,
            bind: {
                ui: '{cardKey === "openvpn" ? "action" : ""}',
                hidden: '{intf.type !== "OPENVPN"}'
            }
        }, {
            text: 'QoS',
            value: 'qos',
            hidden: true,
            bind: {
                ui: '{cardKey === "qos" ? "action" : ""}',
                hidden: '{_hiddenQos}'
            },
        }, {
            text: 'Advanced',
            value: 'advanced',
            hidden: true,
            bind: {
                ui: '{cardKey === "advanced" ? "action" : ""}',
                hidden: '{_hiddenAdvanced}'
            },
        }]

    }, {

        /**
         * card layout panel holding each section with following itemIds:
         * - ipv4
         * - ipv6
         * - dhcp
         * - vrrp
         * - wifi
         * - qos
         * - bridged
         * - disabled
         * - notset
         */
        xtype: 'panel',
        layout: {
            type: 'card',
            deferRender: false,
        },
        // hidden: true,
        bind: {
            activeItem: '#{cardKey}',
            // hidden: '{!intf}'
        },
        defaults: {
            // padding: 16
        },
        items: [{
            xtype: 'interface-ipv4',
            itemId: 'ipv4'
        }, {
            xtype: 'interface-ipv6',
            itemId: 'ipv6'
        }, {
            xtype: 'interface-dhcp',
            itemId: 'dhcp'
        },
        // {
        //     xtype: 'interface-vrrp',
        //     itemId: 'vrrp'
        // },
        {
            xtype: 'interface-lte',
            itemId: 'lte'
        }, {
            xtype: 'interface-wifi',
            itemId: 'wifi'
        }, {
            xtype: 'interface-openvpn',
            itemId: 'openvpn'
        }, {
            xtype: 'interface-wireguard',
            itemId: 'wireguard'
        }, {
            xtype: 'interface-qos',
            itemId: 'qos'
        }, {
            xtype: 'interface-advanced',
            itemId: 'advanced'
        },{
            /**
             * Interface is bridged card
             */
            xtype: 'container',
            itemId: 'bridged',
            items: [{
                xtype: 'component',
                padding: 16,
                bind: {
                    html: '<h1 style="font-weight: 100; font-size: 20px;"><strong>{intf.name}</strong> is bridged to {_bridgedTo}</h1>'
                }
            }]
        }, {
            /**
             * Interface is disabled card
             */
            xtype: 'container',
            itemId: 'disabled',
            padding: 16,
            items: [{
                xtype: 'component',
                bind: {
                    html: '<h1 style="font-weight: 100; font-size: 20px;"><strong>{intf.name}</strong> is disabled</h1>'
                }
            }]
        }, {
            /**
             * Interface is null/not set card
             */
            xtype: 'container',
            itemId: 'notset',
            padding: 16,
            layout: {
                type: 'center'
            },
            items: [{
                xtype: 'component',
                bind: {
                    html: '<h1 style="font-weight: 100; font-size: 20px;">Please select interface type</h1>'
                }
            }]
        }]
    }],

    controller: {
        init: function (view) {
            var me = this, vm = view.getViewModel();

            // set the app context "admin" or "setup"
            vm.set('setupContext', Mfw.app.context === 'setup');

            if (!vm.get('intf')) {
                vm.set('cardKey', 'notset');
            };

            /**
             * bind interface enabled, type, configType at once
             * then display the proper settings based on those values
             */
            vm.bind(['{intf.type}', '{intf.configType}'], function (data) {
                var type = data[0],
                    configType = data[1];

                // if (!enabled) {
                //     vm.set('cardKey', 'disabled');
                //     return;
                // }

                if (type === 'WWAN') {
                    vm.set('cardKey', 'lte');
                    return;
                }

                if (type === 'OPENVPN') {
                    vm.set('cardKey', 'openvpn');
                    return;
                }

                if (type === 'WIREGUARD') {
                    vm.set('cardKey', 'wireguard');
                    return;
                }

                if (type === 'WIFI') {
                    vm.set('cardKey', 'wifi');
                    me.detectWiFiChanges();
                    return;
                }

                if (configType === "BRIDGED") {
                    vm.set('cardKey', 'bridged');
                    return;
                }

                // if is NIC
                if (configType === 'ADDRESSED') {
                    vm.set('cardKey', 'ipv4');
                    if (!vm.get('intf.v4ConfigType')) {
                        vm.set('intf.v4ConfigType', 'DHCP');
                    }
                    if (!vm.get('intf.v6ConfigType')) {
                        vm.set('intf.v6ConfigType', 'DISABLED');
                    }
                }
            });


            var form = me.getView().down('formpanel');
            var nameField = form.getFields('name');
            var currentIntf = vm.get('intf');

            /**
             * Use the current bound interface to in the validator we pass to the Name field 
             */
            nameField.setValidators( function(val) {
                    var nameMatcher = new RegExp('^[a-zA-Z]+[a-zA-Z0-9_]*$');
        
                    // if value dos not match any
                    if (!nameMatcher.test(val)) {
                        return 'Interface Name must be alphanumeric, without spaces.';
                    }

                    //See if any interfaces in the store use this name
                    var existingIntf = Ext.getStore('interfaces').findRecord('name', val, 0, false, false, true);
                    
                    if(currentIntf != null && existingIntf != null && existingIntf.get('interfaceId') != currentIntf.get('interfaceId')) {
                        return 'Interface Name must be unique.';
                    }
    
                    return true;
                }
            )

            var vlanidField = form.getFields('vlanid');
            var vlaninterfaceField = form.getFields('vlaninterface');

            /**
             * On VLAN ID changes, validate that there are no
             * other vlan interfaces with the same parent
             * interface and same vlan id
             */
            vlanidField.setValidators( function(val) {
                var Err = null;

                Ext.getStore('interfaces').each(function (intf) {
                    if(intf.get('interfaceId') != currentIntf.get('interfaceId') && intf.get('type') == 'VLAN' && intf.get('enabled') && intf.get('vlanid') == val && intf.get('boundInterfaceId') == vlaninterfaceField.getValue()) {
                        Err = 'A VLAN interface with the specified VLAN ID already exists on this interface';
                        return false;
                    }
                });

                if(Err) {
                    return Err;
                }

                /**
                 * If the VLAN ID field is valid, and the
                 * parent interface field isn't, rerun the
                 * parent interface validator so it will
                 * mark it as valid as well
                 */
                if(!vlaninterfaceField.isValid()) {
                    vlanidField.clearInvalid();
                    vlaninterfaceField.validate();
                }

                return true;
            })

            /**
             * On VLAN parent changes, validate that there are no
             * other vlan interfaces with the same parent
             * interface and same vlan id
             */
            vlaninterfaceField.setValidators( function(val) {
                var Err = null;

                Ext.getStore('interfaces').each(function (intf) {
                    if(intf.get('interfaceId') != currentIntf.get('interfaceId') && intf.get('type') == 'VLAN' && intf.get('enabled') && intf.get('vlanid') == vlanidField.getValue() && intf.get('boundInterfaceId') == val) {
                        Err = 'A VLAN interface with the specified VLAN ID already exists on this interface';
                        return false;
                    }
                });

                if(Err) {
                    return Err;
                }

                /**
                 * If the VLAN parent interface field is valid,
                 * and the VLAN ID field isn't, rerun the VLAN
                 * ID field validator so it will mark it as valid
                 * as well
                 */
                if(!vlanidField.isValid()) {
                    vlaninterfaceField.clearInvalid();
                    vlanidField.validate();
                }

                return true;
            })

        },

        selectCard: function (btn) {
            var vm = this.getViewModel();
            vm.set('cardKey', btn.getValue());
        },

        /**
         * MFW-670 show caution warning when changing WiFi settings
         */
        detectWiFiChanges: function () {
            var me = this,
                vm = me.getViewModel(),
                wifiForm = me.getView().down('interface-wifi formpanel'),

                // on change method for wireless fields
                changeFn = function (field, _new, _old) {
                    if (_old !== null && !vm.get('wifiWarning')) {
                        vm.set('wifiWarning', true);

                        // remove on change event after first change detected
                        Ext.Object.each(wifiForm.getFields(), function (key, field) {
                            if (key === 'null') { return; }
                            field.un('change', changeFn);
                        });
                    }
                }

            // attach on change event
            Ext.Object.each(wifiForm.getFields(), function (key, field) {
                if (key === 'null') { return; } // ! null key is string
                field.on('change', changeFn);
            });
        },



        ipInRange: function (ip, rangeStart, rangeEnd) {
            var i, inRange = true,
                ipParts = ip.split('.'),
                rangeStartParts = rangeStart.split('.'),
                rangeEndParts = rangeEnd.split('.');

            for (i = 0; i <=3; i++) {
                if (parseInt(ipParts[i], 10) < parseInt(rangeStartParts[i], 10)) {
                    inRange = false;
                }
                if (parseInt(ipParts[i], 10) > parseInt(rangeEndParts[i], 10)) {
                    inRange = false;
                }
            }
            return inRange;
        },


        checkDhcpRange: function (cidr, currentRangeStart, currentRangeEnd) {
            var me = this, vm = this.getViewModel(),
                part = cidr.split("/"), // part[0] = base address, part[1] = netmask
                ipaddress = part[0].split('.'),
                netmaskblocks = ['0','0','0','0'],
                invertedNetmaskblocks,
                validRangeStart,
                validRangeEnd;

            if(!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
              netmaskblocks = ('1'.repeat(parseInt(part[1], 10)) + '0'.repeat(32-parseInt(part[1], 10))).match(/.{1,8}/g);
              netmaskblocks = netmaskblocks.map(function(el) { return parseInt(el, 2); });
            } else {
              netmaskblocks = part[1].split('.').map(function(el) { return parseInt(el, 10); });
            }

            invertedNetmaskblocks = netmaskblocks.map(function(el) { return el ^ 255; });
            validRangeStart = ipaddress.map(function(block, idx) { return block & netmaskblocks[idx]; });
            validRangeEnd = validRangeStart.map(function(block, idx) { return block | invertedNetmaskblocks[idx]; });

            validRangeStart = validRangeStart.join('.');
            validRangeEnd = validRangeEnd.join('.');

            if (!me.ipInRange(currentRangeStart, validRangeStart, validRangeEnd) ||
                !me.ipInRange(currentRangeEnd, validRangeStart, validRangeEnd)) {
                vm.set('cardKey', 'dhcp');
                vm.set('validDhcpRange', (validRangeStart + ' - ' + validRangeEnd));
            } else {
                vm.set('validDhcpRange', null);
            }
        },


        onCancel: function (btn) {
            var me = this,
                intf = me.getViewModel().get('intf'),
                dialog = btn.up('dialog');

            // reject any changes made on cancel

            intf.v4Aliases().rejectChanges();
            intf.v6Aliases().rejectChanges();
            intf.dhcpOptions().rejectChanges();
            intf.v4Aliases().rejectChanges();
            // intf.vrrpV4Aliases().rejectChanges();
            if (intf.getOpenvpnConfFile()) {
                intf.getOpenvpnConfFile().reject();
            }
            intf.reject();

            if (dialog) {
                // if in a dialog just close it
                dialog.destroy();
            } else {
                // if in admin editor redirect to interfaces grid
                Mfw.app.redirectTo('settings/network/interfaces');
            }
        },

        onSave: function (cb) {
            var me = this,
                view = me.getView(),
                dialog = view.up('dialog'),

                vm = me.getViewModel(),
                intf = vm.get('intf'),
                isNew = vm.get('isNew'),
                interfacesStore = Ext.getStore('interfaces'),
                forms = me.getView().query('formpanel'),
                invalidForm;

            // find any invalid form
            Ext.Array.each(forms, function (form) {
                if (!form.validate()) {
                    invalidForm = form;
                    return;
                }
            });

            /**
             * switch to invalid form except if it's the main top form (always visible)
             * validate only if interface is enabled
             */
            if (intf.get('enabled') && invalidForm) {
                if (invalidForm.getItemId() !== 'main') {
                    vm.set('cardKey', invalidForm.up('panel').getItemId());
                }

                Ext.toast('Please fill or correct invalid fields!', 3000);
                return;
            }

            /**
             * check for valid DHCP range
             */
            if (intf.get('dhcpEnabled') &&
                intf.get('v4StaticAddress') &&
                intf.get('v4StaticPrefix') &&
                intf.get('dhcpRangeStart') &&
                intf.get('dhcpRangeEnd')) {
                me.checkDhcpRange(
                    intf.get('v4StaticAddress') + '/' + intf.get('v4StaticPrefix'),
                    intf.get('dhcpRangeStart'),
                    intf.get('dhcpRangeEnd')
                );
            }

            // when is set means that current range is invalid
            if (vm.get('validDhcpRange')) {
                return;
            }


            /**
             * For VLAN, set the device to the name
             */
            if(intf.get('type') == 'VLAN') {
                intf.set('device', intf.get('name'));
            }


            /**
             * if in Setup Wizard just close the editor dialog
             * all interfaces will be updated on Continue action
             */
            if (vm.get('setupContext') && dialog) {
                dialog.close();
                return;
            }

            if (isNew) {

                /**
                 * If the new interface is a wan, add a 'new' field
                 * which allows sync-settings to know that it should
                 * create a new wan policy for this interface
                 */
                if (intf.get('wan')) {
                    intf.set('new', true);
                }

                interfacesStore.add(intf);
            } else {
                intf.commit();
            }

            if (dialog) {
                dialog.close();
            }


            Sync.progress();

            /**
             * very important to clear filters otherwise it saves filtered records
             */
            interfacesStore.clearFilter(true);

            interfacesStore.each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            interfacesStore.sync({
                success: function () {
                    Sync.success();
                    if (isNew) {
                        // after adding and saving new interface, reload store
                        interfacesStore.reload();
                    } else {
                        // otherwise redirect to interfaces (non dialog editing)
                        if (Ext.isFunction(cb)) { cb(); }
                        Mfw.app.redirectTo('settings/network/interfaces');
                    }
                },
                failure: function () {
                    // interfaces store have to be reloaded on sync failure too
                    interfacesStore.reload();
                    console.warn('Unable to save interfaces!');
                }
            });
        },

        checkModified: function (cb) {
            var me = this,
                isModified = false,
                intf = me.getViewModel().get('intf');


            if (intf.modified !== undefined &&
                !Ext.Object.isEmpty(intf.modified)) {
                    isModified = true;
                }

            if (intf.v4Aliases().getModifiedRecords().length > 0 ||
                intf.v4Aliases().getNewRecords().length > 0 ||
                intf.v4Aliases().getRemovedRecords().length > 0) {
                isModified = true;
            }

            if (intf.v6Aliases().getModifiedRecords().length > 0 ||
                intf.v6Aliases().getNewRecords().length > 0 ||
                intf.v6Aliases().getRemovedRecords().length > 0) {
                isModified = true;
            }

            if (intf.dhcpOptions().getModifiedRecords().length > 0 ||
                intf.dhcpOptions().getNewRecords().length > 0 ||
                intf.dhcpOptions().getRemovedRecords().length > 0) {
                isModified = true;
            }

            if (intf.getOpenvpnConfFile() &&
                intf.getOpenvpnConfFile().modified !== undefined &&
                !Ext.Object.isEmpty(intf.modified)) {
                isModified = true;
            }

            cb(isModified);
        },

        discardChanges: function (cb) {
            var me = this,
                intf = me.getViewModel().get('intf');

            intf.reject(true);
            intf.v4Aliases().rejectChanges();
            intf.v6Aliases().rejectChanges();
            intf.dhcpOptions().rejectChanges();
            if (intf.getOpenvpnConfFile()) { intf.getOpenvpnConfFile().reject(); }
            cb();
        },

        /**
         * handleVlanSelect is called when we select an item in the VLAN 
         * interface selection.
         * 
         * For WAN interfaces, we set the current interface to a WAN type so that 
         * certain properties are hidden automatically.
         */
        handleVlanSelect: function(item, record) {
            var vm = this.getViewModel(),
                configType = record.get('configType');

            if(record && vm) {
                if(configType === 'ADDRESSED') {
                    vm.set('intf.wan', record.get('wan'));
                } else {
                    vm.set('intf.wan', false);
                }
            }
        },

    }
});
