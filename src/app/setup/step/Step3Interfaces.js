Ext.define('Mfw.setup.step.Interfaces', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interfaces',

    viewModel: {
    	formulas: {
    		infoInterface: function (get) {
    			var intf = get('interfaces.selection'), str = [], v4 = '';
    			if (!intf) {
    				return '<i class="x-fa fa-info-circle" style="color: #777;"></i>&nbsp; Select an Interface to see more information!'
    			}

                str.push(intf.get('type'));
                str.push(intf.get('configType'));

                v4 = intf.get('v4ConfigType');
                if (intf.get('v4StaticAddress')) {
                    v4 += ', ' + intf.get('v4StaticAddress') + '/' + intf.get('v4StaticPrefix')
                }
                str.push(v4);
    			return str.join(' &nbsp;|&nbsp; ');
    		},
            infoDevice: function (get) {
                var intf = get('interfaces.selection'), device;
                if (!intf) {
                    return;
                }
                device = Mfw.app.getStore('devices').findRecord('name', intf.get('device'));
                if (!device) {
                    return;
                }
                return 'duplex: ' + device.get('duplex') + ' | mtu: ' + (device.get('mtu') || '-');
            }
    	}
    },

    style: 'color: #555;',

    layout: 'vbox',

    bodyPadding: 24,

    items: [{
    	xtype: 'container',
    	layout: 'hbox',
    	padding: '0 0 24 0',
    	items: [{
	        xtype: 'component',
	        flex: 1,
	        html: '<h1>Interfaces Mapping</h1><p>Use arrow buttons to map an interface with a different device.</p>'
	    }, {
			xtype: 'container',
			items: [{
		    	xtype: 'button',
		    	ui: 'action',
		    	margin: '8 0 0 0',
		    	text: 'Refresh Interfaces'
		    }]
	    }]
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        flex: 1,
        store: 'interfaces',
        columns: [
        // {
        //     dataIndex: 'status',
        //     width: 40,
        //     cell: {
        //         encodeHtml: false,
        //     },
        //     renderer: function (v) {
        //         if (v === 'CONNECTED') {
        //             return '<i class="x-fa fa-circle" style="color: green;"></i>'
        //         }
        //         if (v === 'DISCONNECTED') {
        //             return '<i class="x-fa fa-circle" style="color: #999;"></i>'
        //         }
        //         return '<i class="x-fa fa-exclamation-circle" style="color: orange;"></i>'
        //     }
        // },
        {
            text: 'Name',
            dataIndex: 'name',
            flex: 1,
            cell: {
                style: 'font-weight: bold'
            },
            renderer: function (value, record) {
                return value + (record.get('wan') ? ' [WAN]' : '');
            }
        }, {
            text: 'MAC',
            dataIndex: 'mac',
            width: 150
        }, {
            text: 'Device',
            align: 'right',
            width: 100,
            dataIndex: 'device'
        }, {
            width: 120,
            align: 'center',
            cell: {
                encodeHtml: false,
                style: 'background: #EEE;'
            },
            renderer: function() {
                return '<i class="x-fa fa-long-arrow-left"></i> map to <i class="x-fa fa-long-arrow-right"></i>'
            }
        }, {
            text: 'Devices',
            dataIndex: 'device',
            width: 100,
            cell: {
                style: 'font-weight: bold;'
            }
        }, {
            // align: 'center',
            width: 80,
            cell: {
                tools: {
                    up: {
                        iconCls: 'x-fa fa-arrow-circle-up',
                        tooltip: 'Move Up',
                        handler: function (grid, info) {
                            var store = grid.getStore(), rec = info.record;
                            var oldIdx = store.indexOf(rec);
                            store.removeAt(oldIdx);
                            store.insert(oldIdx - 1 , rec);
                        }
                    },
                    down: {
                        iconCls: 'x-fa fa-arrow-circle-down',
                        tooltip: 'Move Down',
                        handler: function (grid, info) {
                            var store = grid.getStore(), rec = info.record;
                            var oldIdx = store.indexOf(rec);
                            store.removeAt(oldIdx);
                            store.insert(oldIdx + 1 , rec);
                        }
                    }
                }
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        padding: '0 40',
        style: {
            background: 'transparent',
            fontSize: '12px',
            color: '#777'
        },
        items: [{
        	xtype: 'component',
	        bind: {
	        	html: '{infoInterface}'
	        }
        }, '->', {
            xtype: 'component',
            bind: {
                html: '{infoDevice}'
            }
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        init: function () {
            console.log('init');
        },

        onActivate: function (view) {
            // console.log();
            // var store = view.lookup('interfaces').getStore();
            // store.load();

            Mfw.app.getStore('devices').load();

            // console.log(store.getData());
            // view.lookup('interfaces').getStore().load();
            // console.log('activate');
        }
    }

});
