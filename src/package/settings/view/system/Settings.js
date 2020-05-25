Ext.define('Mfw.settings.system.Settings', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-settings',

    title: 'Settings'.t(),

    viewModel: {
        data: {
            system: null
        }
    },

    layout: {
        type: 'vbox'
    },

    items: [{
        xtype: 'formpanel',
        layout: 'vbox',
        width: 300,
        padding: 0,
        defaults: {
            labelAlign: 'top',
            clearable: false,
            required: true
        },
        items: [{
            xtype: 'textfield',
            name: 'hostName',
            label: 'Host Name'.t(),
            bind: '{system.hostName}'
        }, {
            xtype: 'textfield',
            name: 'domainName',
            label: 'Domain Name'.t(),
            bind: '{system.domainName}'
        }, {
            xtype: 'selectfield',
            name: 'displayName',
            label: 'Time zone'.t(),
            bind: '{system.timeZone.displayName}',
            valueField: 'text',
            options: Map.options.timezones
        }],
        buttons: [{
            text: 'Update',
            ui: 'action',
            handler: 'onSave'
        }]

    }, {
        xtype: 'formpanel',
        itemId: 'accountform',
        width: 300,
        margin: '16 0 0 0',
        padding: 0,
        defaults: {
            labelAlign: 'top',
            clearable: false,
            required: true
        },
        items: [{
            xtype: 'component',
            margin: '16 0 0 0',
            html: '<h2 style="font-weight: 400;">Administrator account</h2><p>Set a new password for the "<strong>admin</strong>" account</p>'
        }, {
            xtype: 'textfield',
            inputType: 'password',
            name: 'passwordCleartext',
            label: 'Password',
            placeholder: 'enter new password ...',
            errorTarget: 'under',
            required: true,
            triggers: {
                reveal: {
                    type: 'trigger',
                    iconCls: 'x-fa fa-eye',
                    handler: function (field, trigger) {
                        if (field.getDisabled()) {
                            return;
                        }
                        var inputType = field.getInputType();
                        if (inputType === 'password') {
                            field.setInputType('text');
                            trigger.setIconCls('x-fa fa-eye-slash');
                        } else {
                            field.setInputType('password');
                            trigger.setIconCls('x-fa fa-eye');
                        }
                    }
                }
            },
            validators: [{
                type: 'length',
                min: 4
            }, function (value) {
                if (/\s/.test(value)) {
                    return 'Spaces not allowed';
                }
                return true;
            }]
        }, {
            xtype: 'textfield',
            inputType: 'password',
            name: 'confirm',
            label: 'Confirm',
            placeholder: 'retype new password ...',
            errorTarget: 'under',
            required: true,
            triggers: {
                reveal: {
                    type: 'trigger',
                    iconCls: 'x-fa fa-eye',
                    handler: function (field, trigger) {
                        if (field.getDisabled()) {
                            return;
                        }
                        var inputType = field.getInputType();
                        if (inputType === 'password') {
                            field.setInputType('text');
                            trigger.setIconCls('x-fa fa-eye-slash');
                        } else {
                            field.setInputType('password');
                            trigger.setIconCls('x-fa fa-eye');
                        }
                    }
                }
            }
        }],
        buttons: [{
            text: 'Update',
            ui: 'action',
            handler: 'onUpdatePassword'
        }]

    }, {
        xtype: 'formpanel',
        layout: 'vbox',
        width: 300,
        padding: 0,
        defaults: {
            labelAlign: 'top',
            clearable: false,
            required: true
        },
        items: [{
            xtype: 'component',
            margin: '16 0 0 0',
            html: '<h2 style="font-weight: 400;">Factory Reset</h2><p>Reset all settings to original factory defaults</p>'
        }],
        buttons: [{
            text: 'Reset',
            ui: 'action',
            handler: 'onFactoryReset'
        }]

    }, {
        xtype: 'formpanel',
        layout: 'vbox',
        width: 300,
        padding: 0,
        defaults: {
            labelAlign: 'top',
            clearable: false,
            required: true
        },
        items: [{
            xtype: 'component',
            margin: '16 0 0 0',
            html: '<h2 style="font-weight: 400;">Reboot/Shutdown</h2>'
        }],
        buttons: [{
            text: 'Reboot',
            ui: 'action',
            margin: '0 16 0 0',
            handler: 'onReboot'
        }, {
            text: 'Shutdown',
            ui: 'decline alt',
            handler: 'onShutdown'
        }]

    }],

    // buttons: {
    //     save: {
    //         text: 'Save'.t(),
    //         ui: 'action'
    //     }
    // },

    controller: {
        init: function (view) {
            var me = this,
                accountForm = view.down('#accountform'),
                passField = accountForm.getFields('passwordCleartext'),
                confirmField = accountForm.getFields('confirm');

            confirmField.setValidators(function (value) {
                if (value !== passField.getValue()) {
                    return 'Passwords do not match!';
                }
                return true;
            });

            me.load();
        },

        load: function () {
            var me = this,
                vm = me.getViewModel();

            me.getView().mask({xtype: 'loadmask' });
            Ext.Ajax.request({
                url: '/api/settings/system',
                success: function (result) {
                    var system = Ext.decode(result.responseText);
                    if (!system.timeZone || !system.timeZone.displayName) {
                        system.timeZone = { displayName: 'UTC', value: 'UTC' };
                    }
                    vm.set('system', system);
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        },

        onSave: function () {
            var me = this,
                vm = me.getViewModel(),
                system = vm.get('system'),
                values, tz,
                form = me.getView().down('formpanel');

            if (!form.validate()) { return; }

            values = form.getValues();

            tz = Ext.Array.findBy(Map.options.timezones, function (zone) {
                return zone.text === values.displayName;
            });

            Ext.apply(system, {
                hostName: values.hostName,
                domainName: values.domainName,
                timeZone: {
                    displayName: values.displayName,
                    value: tz.value
                }
            });

            Sync.progress();
            Ext.Ajax.request({
                url: '/api/settings/system',
                method: 'POST',
                params: Ext.JSON.encode(system),
                success: function () {
                    Sync.success();
                    window.location.reload();
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        },

        onUpdatePassword: function (btn) {
            var store = Ext.create('Mfw.store.Accounts', {
                model: 'Mfw.model.Account'
            }),
                form = btn.up('formpanel'),
                adminAccount;

            if (!form.validate()) { return; }

            store.load(function () {
                adminAccount = store.findRecord('username', 'admin');
                adminAccount.set({
                    passwordCleartext: form.getValues().passwordCleartext,
                    passwordHashMD5: null,
                    passwordHashSHA256: null,
                    passwordHashSHA512: null
                });
                adminAccount.commit();
                adminAccount.dirty = true;
                adminAccount.phantom = true;

                Sync.progress();
                store.sync({
                    success: function () {
                        Sync.success();

                        var successMsg = Ext.create('Ext.MessageBox', {
                            title: 'Success!',
                            bodyStyle: 'font-size: 14px; color: #333; padding: 16;',
                            message: '<p style="margin: 0;">The "<strong>admin</strong>" password updated successfully!</p>',
                            showAnimation: null,
                            hideAnimation: null,
                            buttons: [{
                                text: 'OK',
                                ui: 'action',
                                margin: '16 0 0 0',
                                handler: function (btn) {
                                    btn.up('messagebox').hide();
                                }
                            }]
                        });

                        Ext.defer(function () {
                            successMsg.show();
                        }, 1100);

                    },
                    callback: function () {
                        form.reset(true);
                    }
                });
            });
        },

        onFactoryReset: function (btn) {
            var me = this;

            heading = 'WARNING! Please read before proceeding!'
            message = ''
            message += 'If you continue, all settings will be reset to the original factory defaults!'
            message += '<BR><BR>'
            message += 'This will reset ALL settings including currently configured network devices which may interrupt'
            message += '<BR>'
            message += 'any wired or wireless connection you are currently using to manage this device.'
            message += '<BR><BR>'
            message += '<STRONG>ARE YOU SURE YOU WANT TO PROCEED WITH THE FACTORY RESET?</STRONG>'


            Ext.Msg.show({
                title: heading,
                message: message,
                showAnimation: null,
                hideAnimation: null,
                buttons: [{
                    text: 'NO',
                    ui: 'action',
                    handler: function () { this.up('messagebox').hide(); }
                }, {
                    text: 'YES',
                    margin: '0 0 0 16',
                    handler: function () {
                        var dialog = this.up('messagebox');
                        dialog.setButtons([]);
                        dialog.down('toolbar').add({
                            xtype: 'component',
                            html: 'please wait ... <i class="fa fa-spinner fa-spin fa-fw"></i>'
                        });
                        Ext.Ajax.request({
                            url: '/api/factory-reset',
                            method: 'POST',
                            success: function () {
                                dialog.hide();
                                me.onFactoryResetSuccess();
                            },
                            failure: function(response) {
                                Ext.Msg.alert('Operation Failed', response.responseText, function(){
                                    window.location.reload();
                                });
                            }
                        });
                    }
                }]
            });
        },

        /**
         * Show success alert after factory reset completed
         */
        onFactoryResetSuccess: function () {
            Ext.Msg.show({
                title: 'Factory Reset',
                message: 'All settings have been set to factory defaults!',
                showAnimation: null,
                hideAnimation: null,
                buttons: [{
                    text: 'Continue',
                    ui: 'action',
                    handler: function () {
                        // logout user and redirect to setup wizard
                        Ext.Ajax.request({
                            url: '/account/logout',
                            callback: function () {
                                Mfw.app.setAccount(null);
                                document.location.href = '/setup/';
                            }
                        });
                    }
                }]
            });
        },

        /**
         * Reboots the system
         * It will wait until it's back online
         */
        onReboot: function () {
            Ext.Msg.show({
                title: 'Reboot',
                width: 450,
                message: 'Are you sure you want to reboot system now?',
                showAnimation: null,
                hideAnimation: null,
                buttons: [{
                    text: 'Cancel',
                    handler: function () { this.up('messagebox').hide(); }
                }, {
                    text: 'YES',
                    ui: 'action',
                    margin: '0 0 0 16',
                    handler: function () {
                        var dialog = this.up('messagebox');
                        dialog.down('toolbar').hide();
                        dialog.setMessage('Please wait! System is rebooting ... <i class="fa fa-spinner fa-spin fa-fw"></i><br/><br/><br/>');
                        Ext.Ajax.request({
                            url: '/api/reboot',
                            method: 'POST',
                            success: function () {
                                // defer a few seconds the online check after reboot initiated
                                Ext.defer(Util.checkOnlineStatus, 3000);
                            }
                        });
                    }
                }]
            });
        },

        /**
         * Shutsdown the system
         */
        onShutdown: function () {
            Ext.Msg.show({
                title: 'Shutdown',
                width: 450,
                message: 'Are you sure you want to shutdown system now?',
                showAnimation: null,
                hideAnimation: null,
                buttons: [{
                    text: 'Cancel',
                    handler: function () { this.up('messagebox').hide(); }
                }, {
                    text: 'YES',
                    ui: 'action',
                    margin: '0 0 0 16',
                    handler: function () {
                        var dialog = this.up('messagebox');
                        Ext.Ajax.request({
                            url: '/api/shutdown',
                            method: 'POST',
                            success: function () {
                                dialog.down('toolbar').hide();
                                dialog.setMessage('Shutdown procedure initiated. You may close this browser! <br/><br/><br/>');
                            }
                        });
                    }
                }]
            });
        }

    }
});
