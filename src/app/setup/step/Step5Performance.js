Ext.define('Mfw.setup.step.Performance', {
    extend: 'Ext.Panel',
    alias: 'widget.step-performance',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        width: 600,
        html: '<h1 style="text-align: center;">WAN(s) Performance</h1><hr/>' +
            '<br/><p style="text-align: center;">Testing WAN(s) performance. You can alter the Download/Upload bandwidth.</p>'
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        minWidth: 600,
        flex: 1,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        store: {
            type: 'interfaces',
            // do not display hidden interfaces
            filters: [{
                property: 'wan',
                value: true
            }]
        },
        rowLines: false,
        selectable: false,
        itemConfig: {
            viewModel: true,
        },

        columns: [{
            text: 'Interface Name [ id ]',
            dataIndex: 'name',
            flex: 1,
            minWidth: 150,
            menuDisabled: true,
            sortable: false,
            cell: { encodeHtml: false },
            renderer: function (value, record) {
                return '<b>' + record.get('name') + ' [ ' + record.get('interfaceId') + ' ]</b>';
            }
        }, {
            text: 'Ping',
            dataIndex: '_ping',
            align: 'right',
            cell: { encodeHtml: false },
            renderer: function (value) {
                return '<strong>' + (value || '?') + '</strong> ms';
            }
        }, {
            text: 'Download Speed',
            dataIndex: '_download',
            align: 'right',
            width: 150,
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'start' }]
            },
            editable: true,
            renderer: function (value) {
                return '<strong>' + (value || '?') + '</strong> Kbps';
            }
        }, {
            text: 'Upload Speed',
            dataIndex: '_upload',
            align: 'right',
            width: 150,
            cell: {
                encodeHtml: false,
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'start' }]
            },
            editable: true,
            renderer: function (value) {
                return '<strong>' + (value || '?') + '</strong> Kbps';
            }
        }]
    }, {
        xtype: 'container',
        flex: 1,
        layout: { type: 'hbox', align: 'top', pack: 'center' },
        items: [{
            xtype: 'component',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            width: 150,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue',
            hidden: true,
            bind: { hidden: '{processing}' }
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function () {
            var me = this,
                interfacesStore = Ext.getStore('interfaces');

            if (interfacesStore.loadCount === 0) {
                Ext.getStore('interfaces').load(function () {
                    me.testInterfaces();
                });
            } else {
                me.testInterfaces();
            }
        },

        testInterfaces: function () {
            var me = this, testsArray = [], vm = me.getViewModel();

            Ext.getStore('interfaces').each(function (intf) {
                testsArray.push(function () {
                    var deferred = new Ext.Deferred(); // create the Ext.Deferred object
                    Ext.defer(function () {
                        intf.set({
                            _ping: Ext.Number.randomInt(5, 70),
                            _download: Ext.Number.randomInt(3000, 8000),
                            _upload: Ext.Number.randomInt(2000, 8000)
                        });
                        deferred.resolve(intf.get);
                    }, 3000, me);
                    return deferred.promise;
                });
            });

            vm.set('processing', true);

            Ext.Deferred.sequence(testsArray, me)
                .then(function (result) {
                    // console.log(result);
                }, function (error) {
                    console.warn('Unable to test: ', error);
                })
                .always(function () {
                    vm.set('processing', false);
                    // me.getView().unmask();
                });

        },

        onContinue: function () {
            var me = this,
                wzCtrl = me.getView().up('setup-wizard').getController();

            me.getViewModel().set('processing', true);
            wzCtrl.update();
        }
    }

});
