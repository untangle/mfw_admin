Ext.define('Mfw.setup.step.Timezone', {
    extend: 'Ext.Panel',
    alias: 'widget.step-timezone',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    // bodyPadding: 24,

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Timezone</h1><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,

        width: 300,
        // disabled: true,
        // bind: {
        //     disabled: '{skip.checked}'
        // },
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox',
                pack: 'right'
            },
            // flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'top',
                // labelTextAlign: 'right'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 14px;',
                html: 'Choose server timezone'
            }, {
                xtype: 'selectfield',
                userCls: 'x-custom-field',
                name: 'displayName',
                // label: 'Timezone'.t(),
                required: true,
                valueField: 'text',
                options: Globals.timezones
            }, {
                xtype: 'button',
                margin: '16 0 0 0',
                width: 150,
                text: 'Continue',
                ui: 'action',
                handler: 'onContinue'
            }]
        }]
    }],

    listeners: {
        activate: 'loadTimezone'
    },

    controller: {
        init: function (view) {
            // set validation on confirm field
        },

        onActivate: function (view) {
            var me = this;
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
                        form.getFields('displayName').setValue('UTC');
                    } else {
                        form.getFields('displayName').setValue(tz.displayName || 'UTC');
                    }

                },
                failure: function () {
                    console.warn('Unable to load Timezone!');
                }
            });
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

        onContinue: function (cb) {
            var me = this,
                wizard = me.getView().up('#wizard'),
                layout = wizard.getLayout();

            layout.next();
            // cb();
            // var me = this, // skip = me.lookup('skip'),
            //     form = me.getView().down('formpanel'),
            //     view = me.getView(),
            //     wizard = view.up('setup-wizard');

            // if (!form.validate()) { return; }

            // wizard.mask({xtype: 'loadmask' });
            // wizard.lookup('bbar').mask();

            // Ext.Deferred.sequence([me.setAccount, me.setTimezone], me)
            //     .then(
            //         function () {
            //             cb();
            //         }, function (error) {
            //             console.error('Unable to save!');
            //         })
            //     .always(function () {
            //         wizard.unmask();
            //         wizard.lookup('bbar').unmask();
            //     });
        }
    }


});
