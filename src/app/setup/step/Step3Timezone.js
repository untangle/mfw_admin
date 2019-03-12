Ext.define('Mfw.setup.step.Timezone', {
    extend: 'Ext.Panel',
    alias: 'widget.step-timezone',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Timezone</h1><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,
        keyMapEnabled: true,
        keyMap: {
            enter: {
                key: Ext.event.Event.ENTER,
                handler: 'onContinue'
            }
        },
        layout: {
            type: 'vbox',
            align: 'center'
        },
        items: [{
            xtype: 'container',
            width: 300,
            layout: {
                type: 'vbox',
                pack: 'right'
            },
            defaults: {
                clearable: false,
                labelAlign: 'top'
            },
            items: [{
                xtype: 'selectfield',
                userCls: 'x-custom-field',
                name: 'displayName',
                label: 'Choose timezone'.t(),
                required: true,
                valueField: 'text',
                options: Globals.timezones,
                listeners: {
                    painted: function (f) { f.focus(); }
                }
            }]
        }, {
            xtype: 'component',
            margin: '32 0 0 0',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            margin: '32 0 0 0',
            width: 120,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue',
            bind: { hidden: '{processing}' }
        }]
    }],

    listeners: {
        activate: 'loadTimezone'
    },

    controller: {
        onActivate: function () {
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

        onContinue: function () {
            var me = this,
                vm = me.getViewModel(),
                form = me.getView().down('formpanel'),
                tz, tzName = form.getFields('displayName').getValue(),
                wzCtrl = me.getView().up('setup-wizard').getController();

            tz = Ext.Array.findBy(Globals.timezones, function (zone) {
                return zone.text === tzName;
            });

            vm.set('processing', true);
            Ext.Ajax.request({
                url: '/api/settings/system/timeZone',
                method: 'POST',
                params: Ext.JSON.encode({
                    displayName: tz.text,
                    value: tz.value,
                }),
                success: function () {
                    wzCtrl.update();
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }
    }


});
