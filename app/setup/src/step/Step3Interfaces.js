Ext.define('Mfw.setup.step.Interfaces', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interfaces',

    viewModel: {
    	formulas: {
    		info: function (get) {
    			var intf = get('interfaces.selection');
    			if (!intf) {
    				return '<i class="x-fa fa-info-circle" style="color: #777;"></i>&nbsp; Select an Interface to see more information!'
    			}
    			return intf.get('duplex') + ' | ' + intf.get('mbit') + ' | ' +  intf.get('vendor');
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
        xtype: 'panel',
        flex: 1,
        layout: 'hbox',
        items: [{
            xtype: 'grid',
            reference: 'interfaces',
            flex: 1,
            store: {
                // fields: ['name', 'device', 'mac'],
                data: [{
                    name: 'External Network',
                    device: 'eth0',
                    mac: '08:00:27:E2:54:B0',
                    status: 'CONNECTED',
                    duplex: 'FULL-DUPLEX',
                    mbit: '100Mb',
                    vendor: 'Broadcom Corporation NetXtreme BCM5761e Gigabit Ethernet PCIe (rev 10)'
                }, {
                    name: 'Intrnal',
                    device: 'eth1',
                    mac: '10:00:27:E2:54:B0',
                    status: 'DISCONNECTED',
                    duplex: 'HALF-DUPLEX',
                    mbit: '100Mb',
                    vendor: 'Intel Corporation Ultimate N WiFi Link 5300'
                }, {
                    name: 'Interface 3',
                    device: 'eth2',
                    mac: '10:00:27:99:54:B0',
                    status: 'MISSING',
                    duplex: 'unknown',
                    mbit: '1000Mb',
                    vendor: 'Intel Corporation Ultimate N WiFi Link 5300'
                }]
            },
            columns: [{
                dataIndex: 'status',
                width: 40,
                cell: {
                    encodeHtml: false,
                },
                renderer: function (v) {
                    if (v === 'CONNECTED') {
                        return '<i class="x-fa fa-circle" style="color: green;"></i>'
                    }
                    if (v === 'DISCONNECTED') {
                        return '<i class="x-fa fa-circle" style="color: #999;"></i>'
                    }
                    return '<i class="x-fa fa-exclamation-circle" style="color: orange;"></i>'
                }
            }, {
                text: 'Name',
                dataIndex: 'name',
                cell: {
                    style: 'font-weight: bold'
                },
                flex: 1
            }, {
                text: 'MAC',
                dataIndex: 'mac',
                width: 150
            }, {
                text: 'Device',
                align: 'right',
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
            }]
        }, {
            xtype: 'grid',
            // docked: 'right',
            width: 180,
            // columnLines: true,
            store: {
                data: [
                    { name: 'eth0' },
                    { name: 'eth1' },
                    { name: 'eth2' }
                ]
            },
            columns: [{
                text: 'Devices',
                dataIndex: 'name',
                flex: 1,
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
	        	html: '{info}'
	        }
        }]
    }]

});
