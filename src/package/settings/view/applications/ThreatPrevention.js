Ext.define('Mfw.settings.applications.ThreatPrevention', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-applications-threat-prevention',

    title: 'Threat Prevention'.t(),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    viewModel: {
        data: {
            visibleAddHost: false,
        }
    },

    tools: [{
        xtype: 'button',
        cls: 'btn-tool',
        iconCls: 'md-icon-search',
        text: 'Threat Lookup',
        handler: 'onThreatLookup'
    }, {
        xtype: 'button',
        cls: 'btn-tool',
        iconCls: 'md-icon-save',
        text: 'Save',
        handler: 'onSave'
    }],

    items: [{
        xtype: 'component',
        padding: 20,
        style: 'font-size: 14px',
        html: 'Threat Prevention is an IP address and URL reputation service. <br />If enabled, Threat Prevention blocks hosts that may be associated with Spam, Mobile Threats, Tor Proxy, Keyloggers, Malware, Spyware, Windows Exploits, Web Attacks, Botnets, Scanners, Denial of Service, Reputation, Phishing, or Compromised Proxy.'
    }, {
        xtype: 'formpanel',
        layout: 'vbox',
        width: 500,
        padding: 10,
        defaults: {
            labelAlign: 'top',
            clearable: false,
            required: true
        },
        items: [{
            xtype: 'togglefield',
            boxLabel: 'Enable Threat Prevention',
            margin: '0 10',
            bind: '{threatprevention.enabled}'
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Filter Sensitivity',
            required: true,
            margin: '0 10',
            options: [
                { text: 'Normal', value: 'normal' },
                { text: 'Aggressive', value: 'aggressive' },
            ],
            bind: {
                value: '{threatprevention.sensitivity}',
                disabled: '{!threatprevention.enabled}'
            }
        }, {
            xtype: 'fieldcontainer',
            padding: 10,
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [{
                xtype: 'checkbox',
                label: 'Custom URL redirect',
                labelAlign: 'right',
                labelWidth: 150,
            }, {
                xtype: 'textfield',
                flex: 1,
                placeholder: 'enter url...'
            }]
        }]
    }, {
        xtype: 'grid',
        itemId: 'passList',
        flex: 1,
        disabled: true,
        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },
        emptyText: 'No data',
        selectable: false,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            shadow: false,
            zIndex: 2,
            padding: '0 8 0 16',
            bind: {
                shadow: '{!visibleAddHost}'
            },
            items: [{
                xtype: 'component',
                html: 'Pass List',
                style: 'font-weight: 400;'
            }, '->', {
                xtype: 'button',
                cls: 'btn-tool',
                iconCls: 'md-icon-refresh',
                handler: 'load'
            }, {
                xtype: 'button',
                iconCls: 'md-icon-add',
                text: 'Add',
                handler: 'toggleAddHost',
                hidden: true,
                bind: {
                    hidden: '{visibleAddHost}'
                },
            }],
        }, {
            xtype: 'formpanel',
            reference: 'staticentryform',
            itemId: 'staticentryform',
            docked: 'top',
            shadow: true,
            // style: 'box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2)',
            padding: '0 16 16 16',
            zIndex: 1,
            layout: {
                type: 'hbox',
                align: 'bottom'
            },
            hidden: true,
            bind: {
                hidden: '{!visibleAddHost}'
            },
            defaults: {
                labelAlign: 'top',
                autoComplete: false,
                required: true,
                clearable: false,
                keyMapEnabled: true,
                keyMap: {
                    enter: {
                        key: Ext.event.Event.ENTER,
                        handler: 'addHostKeyEvt'
                    }
                }
            },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                shadow: false,
                style: 'background: transparent',
                items: [{
                    xtype: 'component',
                    style: 'font-weight: 100; font-size: 14px;',
                    html: 'Add Host',
                }, '->', {
                    xtype: 'button',
                    iconCls: 'md-icon-close',
                    handler: 'toggleAddHost'
                }]
            }, {
                xtype: 'textfield',
                name: 'host',
                width: 400,
                label: 'Hostname'.t(),
                placeholder: 'Enter host ...'
            }, {
                xtype: 'textfield',
                name: 'description',
                label: 'Description',
                margin: '0 8 0 16',
                flex: 1,
                placeholder: 'Enter description ...'
            }, {
                xtype: 'button',
                text: 'Add',
                ui: 'action',
                margin: '0 0 0 16',
                handler: 'onAddHost'
            }],
            listeners: {
                show: function (form) {
                    form.getFields('host').focus();
                },
                hide: function (form) {
                    form.reset(true);
                }
            }
        }],

        bind: '{threatprevention.passList}',
        itemConfig: {
            viewModel: true
        },

        columns: [{
            width: 5,
            minWidth: 5,
            sortable: false,
            hideable: false,
            resizable: false,
            menuDisabled: true,
            cell: {
                userCls: 'x-statuscolumn'
            },
            renderer: function (value, record, dataIndex, cell) {
                cell.setUserCls('');
                if (record.isDirty()) {
                    cell.setUserCls('status-dirty');
                }
                if (record.get('_deleteSchedule')) {
                    cell.setUserCls('status-delete');
                }
                if (record.phantom) {
                    cell.setUserCls('status-phantom');
                }
            }
        }, {
            text: 'Host'.t(),
            dataIndex: 'host',
            width: 220,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                clearable: false,
                required: true
            }
        }, {
            text: 'Description'.t(),
            dataIndex: 'description',
            flex: 1,
            cell: {
                tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
            },
            editable: true,
            editor: {
                xtype: 'textfield',
                clearable: false,
                required: true
            }
        }, {
            width: 90,
            align: 'right',
            sortable: false,
            hideable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    delete: {
                        iconCls: 'md-icon-delete',
                        hidden: true,
                        bind: {
                            hidden: '{record._deleteSchedule}',
                        },
                        handler: function (grid, info) {
                            if (info.record.phantom) {
                                info.record.drop();
                            } else {
                                info.record.set('_deleteSchedule', true);
                            }
                        }
                    },
                    undo: {
                        iconCls: 'md-icon-undo',
                        hidden: true,
                        bind: {
                            hidden: '{!record._deleteSchedule}',
                        },
                        handler: function (grid, info) {
                            info.record.reject();
                        }
                    }
                }
            }
        }]
    }],

    controller: {
        init: function (view) {
            this.load();
        },

        load: function () {
            var me = this,
                vm = me.getViewModel();

            me.model = new Mfw.model.ThreatPrevention();

            me.getView().mask({ xtype: 'loadmask' });
            me.model.load({
                success: function (record) {
                    vm.set('threatprevention', record);
                    console.log(record)
                    record.passList().commitChanges();
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        },

        toggleAddHost: function () {
            var me = this,
                vm = me.getViewModel(),
                visible = vm.get('visibleAddHost');
            vm.set('visibleAddHost', !visible);
        },

        onAddHost: function (btn) {
            var me = this, form = btn.up('formpanel');
            if (!form.validate()) { return; }

            me.getView().down('#passList').getStore().add(form.getValues());
            form.getFields('host').focus();
            form.reset(true);
        },

        addHostKeyEvt: function (evt, fld) {
            var me = this, form = fld.up('formpanel');
            if (!form.validate()) { return; }
            me.getView().down('#passList').getStore().add(form.getValues());
            fld.blur();
            form.getFields('host').focus();
            form.reset(true);
        },

        onSave: function (cb) {
            var me = this,
                threatprevention = me.getViewModel().get('threatprevention');

            threatprevention.passList().each(function (record) {
                if (record.get('_deleteSchedule')) {
                    record.drop();
                }
                record.dirty = true;
                record.phantom = false;
            });

            me.getViewModel().set({
                visibleAddHost: false,
            });

            Sync.progress();
            threatprevention.save({
                success: function () {
                    if (Ext.isFunction(cb)) { cb(); } else { me.load(); }
                    Sync.success();
                }
            });
        },


        // threat lookup
        onThreatLookup: function () {
            var me = this;

            me.dialog = Ext.Viewport.add({
                xtype: 'dialog',
                ownerCmp: me.getView(),
                layout: 'fit',
                width: 600,
                height: 400,
                padding: 0,
                // title: 'AAA',

                showAnimation: false,
                hideAnimation: false,

                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },

                items: [{
                    xtype: 'panel',
                    title: 'Threat Lookup',

                    tools: [{
                        xtype: 'button',
                        cls: 'btn-tool',
                        iconCls: 'md-icon-close',
                        handler: 'onDialogClose'
                    }],

                    bodyPadding: 10,
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    items: [{
                        xtype: 'textfield',
                        itemId: 'lookup_field',
                        label: 'Enter IP Address or URL',
                        // labelAlign: 'top',
                        flex: 1
                    }, {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Search',
                        handler: 'onThreatLookupSearch'
                    }]
                }, {
                    xtype: 'container',
                    padding: 10,
                    html: 'Threat Results'
                    // Trustworthy (57 occurrences) - These are clean IPs that have not been tied to a security risk. There is a very low predictive risk that your infrastructure and endpoints will be exposed to attack.
                    // Low Risk - These are benign IPs and rarely exhibit characteristics that expose your infrastructure and endpoints to security risks. There is a low predictive risk of attack.
                }, {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: [
                        '->', {
                        xtype: 'button',
                        text: 'Close',
                        handler: 'onDialogClose'
                    }]
                }]
            });

            me.dialog.on('destroy', function () {
                me.dialog = null;
            });
            me.dialog.show();
        },

        onThreatLookupSearch: function () {
            var me = this
                lookupValue = me.dialog.down('#lookup_field').getValue()
            Ext.Ajax.request({
                url: '/api/threatprevention/lookup/' + lookupValue,
                success: function (response) {
                    var resp = Ext.decode(response.responseText)
                    // TODO - parse and display the response
                    console.log(response)
                },
                failure: function () {
                    console.warn('Unable to perform lookup!');
                }
            });
        },

        onDialogClose: function () {
            this.dialog.close();
        }
    },
});
