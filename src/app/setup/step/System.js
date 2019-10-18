Ext.define('Mfw.setup.step.System', {
    extend: 'Ext.Panel',
    alias: 'widget.step-system',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    padding: '16 0 24 0',

    scrollable: true,

    items: [{
        xtype: 'formpanel',

        width: 330,

        defaults: {
            clearable: false,
            labelAlign: 'top',
            autoComplete: false
        },
        items: [{
            xtype: 'component',
            padding: '0 0 24 0',
            html: '<h1 style="text-align: center;">Admin Account</h1><hr/>'
        }, {
            xtype: 'component',
            style: 'font-size: 14px;',
            html: 'Choose a new password for the <strong>admin</strong> account'
        }, {
            xtype: 'passwordfield',
            userCls: 'x-custom-field',
            errorTarget: 'side',
            itemId: 'password',
            name: 'password',
            label: 'Password',
            required: true,
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
            xtype: 'passwordfield',
            userCls: 'x-custom-field',
            errorTarget: 'side',
            itemId: 'confirm',
            name: 'confirm',
            label: 'Confirm',
            required: true
        }, {
            xtype: 'component',
            padding: '24 0 24 0',
            html: '<h1 style="text-align: center;">Time zone</h1><hr/>'
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            name: 'timezone',
            required: true,
            valueField: 'text',
            options: Map.options.timezones
        }]
    }],

    listeners: {
        activate: 'onActivate'
    },

    controller: {
        init: function (view) {
            // set validation on confirm field
            var passField = view.down('#password'),
                confirmField = view.down('#confirm');

            confirmField.setValidators(function (value) {
                if (value !== passField.getValue()) {
                    return 'Passwords do not match!';
                }
                return true;
            });

            view.down('formpanel').reset(true);

        },

        onActivate: function (view) {
            var me = this,
                form = view.down('formpanel');

            form.reset(true);

            // load accounts and timezone
            Ext.Deferred.sequence([
                me.loadAccounts,
                me.loadTimezone
            ], me).then(function (result) {
                var tz = result[1];

                // populate timezone field
                if (!tz || tz === null) {
                    form.getFields('timezone').setValue('UTC');
                } else {
                    form.getFields('timezone').setValue(tz.displayName || 'UTC');
                }
            }, function (err) {
                console.warn(err);
            })
            .always(function () {
                // vm.set('testprogress', false);
            });
        },

        /**
         * load user accounts, needed to check for admin account
         */
        loadAccounts: function () {
            var deferred = new Ext.Deferred();
            Ext.getStore('accounts').load(function (records, operation, success) {
                if (!success) {
                    deferred.reject('Unable to load accounts!');
                    return;
                }
                deferred.resolve();
            });
            return deferred.promise;
        },

        /**
         * load timezone to populate the field
         */
        loadTimezone: function () {
            var deferred = new Ext.Deferred();
            Ext.Ajax.request({
                url: '/api/settings/system/timeZone',
                success: function (result) {
                    deferred.resolve(Ext.decode(result.responseText));
                },
                failure: function () {
                    deferred.reject('Unable to load time zone!');
                }
            });
            return deferred.promise;
        },


        /**
         * save accounts (admin account)
         */
        saveAccounts: function () {
            var me = this,
                deferred = new Ext.Deferred(),
                clearPasswd = me.getView().down('#password').getValue(),
                accountsStore = Ext.getStore('accounts'),
                adminAccount = accountsStore.findRecord('username', 'admin');

            if (!adminAccount) {
                accountsStore.add({
                    username: 'admin',
                    passwordCleartext: clearPasswd
                });
            } else {
                adminAccount.set({
                    passwordCleartext: clearPasswd
                });
            }

            Ext.getStore('accounts').sync({
                success: function () {
                    deferred.resolve();
                },
                failure: function () {
                    deferred.reject('Unable to sync accounts');
                }
            });
            return deferred.promise;
        },

        /**
         * save timezone
         */
        saveTimezone: function () {
            var me = this,
                deferred = new Ext.Deferred(),
                form = me.getView().down('formpanel'),
                tz, tzName = form.getFields('timezone').getValue();

            tz = Ext.Array.findBy(Map.options.timezones, function (zone) {
                return zone.text === tzName;
            });

            Ext.Ajax.request({
                url: '/api/settings/system/timeZone',
                method: 'POST',
                params: Ext.JSON.encode({
                    displayName: tz.text,
                    value: tz.value,
                }),
                success: function () {
                    deferred.resolve();
                },
                failure: function() {
                    deferred.reject('Unable to save timezone');
                }
            });
            return deferred.promise;
        },

        continue: function (cb) {
            var me = this,
                vm = me.getViewModel(),
                form = me.getView().down('formpanel');

            if (!form.validate()) {
                vm.set('processing', false);
                return;
            }

            // save accounts and timezone
            Ext.Deferred.sequence([
                me.saveAccounts,
                me.saveTimezone
            ], me).then(function () {
                cb();
            }, function (err) {
                console.warn(err);
                vm.set('processing', false);
            });
        }
    }
});
