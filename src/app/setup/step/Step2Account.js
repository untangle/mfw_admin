Ext.define('Mfw.setup.step.Account', {
    extend: 'Ext.Panel',
    alias: 'widget.step-account',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1>Admin Account</h1><br/><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,
        layout: 'hbox',
        // disabled: true,
        // bind: {
        //     disabled: '{skip.checked}'
        // },
        items: [{
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            defaults: {
                clearable: false
            },
            items: [{
                xtype: 'component',
                html: '<p>Choose a new password for the <strong>admin</strong> account</p>'
            }, {
                xtype: 'passwordfield',
                id: 'password',
                name: 'password',
                width: 300,
                // ui: 'solo',
                label: 'Password',
                labelAlign: 'left',
                labelTextAlign: 'right',
                required: true
            }, {
                xtype: 'passwordfield',
                id: 'confirm',
                name: 'confirm',
                width: 300,
                // ui: 'solo',
                label: 'Confirm',
                labelAlign: 'left',
                labelTextAlign: 'right',
                required: true
            }, {
                xtype: 'component',
                margin: '24 0 0 0',
                html: '<p>Administrators receive email alerts and report summaries.</p>'
            }, {
                xtype: 'emailfield',
                name: 'email',
                width: 300,
                // ui: 'solo',
                label: 'Email',
                labelAlign: 'left',
                labelTextAlign: 'right'
            }]
        }, {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            items: [{
                xtype: 'component',
                html: '<p>Select Timezone</p>'
            }, {
                xtype: 'selectfield',
                width: 400,
                name: 'displayName',
                label: 'Timezone'.t(),
                labelAlign: 'left',
                labelTextAlign: 'right',
                required: true,
                valueField: 'text',
                options: Globals.timezones
            }]
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
        },

        onActivate: function (view) {
            var me = this;
            view.down('formpanel').reset(true);
            me.loadTimezone();
        },

        loadTimezone: function () {
            var me = this,
                form = me.getView().down('formpanel');

            Ext.Ajax.request({
                url: '/api/settings/system/timeZone',
                success: function (result) {
                    var tz = Ext.decode(result.responseText);
                    if (!tz || tz === null) {
                        form.getFields('displayName').setValue(moment.tz.guess());
                    } else {
                        form.getFields('displayName').setValue(tz.displayName || 'UTC');
                    }

                },
                failure: function () {
                    console.warn('Unable to load Timezone!');
                }
            });
        },


        setAccount: function () {
            var me = this,
                deferred = new Ext.Deferred(),
                adminAccount = Ext.create('Mfw.model.Account'),
                form = me.getView().down('formpanel');

            adminAccount.load({
                success: function (account) {
                    if (account && account.get('username') === 'admin') {
                        var values = form.getValues();
                        account.set('passwordCleartext', values.password);
                        account.set('email', values.email);
                        adminAccount.save({
                            success: function () {
                                deferred.resolve();
                            },
                            failure: function () {
                                deferred.reject();
                            }
                        });
                    } else {
                        // if account admin non existent add it
                    }
                }
            });
            return deferred.promise;
        },

        setTimezone: function () {
            var me = this,
                deferred = new Ext.Deferred(),
                form = me.getView().down('formpanel'),
                tz, tzName = tzName = form.getFields('displayName').getValue();

            tz = Ext.Array.findBy(Globals.timezones, function (zone) {
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
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        continue: function (cb) {
            var me = this, // skip = me.lookup('skip'),
                form = me.getView().down('formpanel'),
                view = me.getView(),
                wizard = view.up('setup-wizard');

            if (!form.validate()) { return; }

            wizard.mask({xtype: 'loadmask' });
            wizard.lookup('bbar').mask();

            Ext.Deferred.sequence([me.setAccount, me.setTimezone], me)
                .then(
                    function () {
                        cb();
                    }, function (error) {
                        console.error('Unable to save!');
                    })
                .always(function () {
                    wizard.unmask();
                    wizard.lookup('bbar').unmask();
                });
        }
    }


});
