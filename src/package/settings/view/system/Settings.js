Ext.define('Mfw.settings.system.Settings', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-settings',

    title: 'Settings'.t(),

    viewModel: {
        data: {
            system: null
        }
    },

    // layout: "form",
    // bind: {
    //     layout: '{!smallScreen ? "form" : "vbox"}',
    // },

    // defaults: {
    //     labelAlign: 'right'
    // },

    items: [{
        xtype: 'formpanel',
        layout: 'vbox',
        width: 300,
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
            label: 'Timezone'.t(),
            bind: '{system.timeZone.displayName}',
            valueField: 'text',
            options: Globals.timezones
        }, {
            xtype: 'toolbar',
            shadow: false,
            style: 'background: transparent;',
            docked: 'bottom',
            items: ['->', {
                text: 'Save',
                ui: 'action',
                handler: 'onSave'
            }]
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
            var me = this;
                me.load();
        },

        load: function () {
            var me = this,
                vm = me.getViewModel(),
                form = me.getView().down('formpanel');

            me.getView().mask({xtype: 'loadmask' });
            Ext.Ajax.request({
                url: '/api/settings/system',
                success: function (result) {
                    var decoded = Ext.decode(result.responseText);
                    console.log(decoded);
                    vm.set('system', decoded);
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

            tz = Ext.Array.findBy(Globals.timezones, function (zone) {
                return zone.text === values.displayName;
            });
            console.log(tz);

            Ext.apply(system, {
                hostName: values.hostName,
                domainName: values.domainName,
                timeZone: {
                    displayName: values.displayName,
                    value: tz.value
                }
            });

            me.getView().mask({xtype: 'loadmask' });
            Ext.Ajax.request({
                url: '/api/settings/system',
                method: 'POST',
                params: Ext.JSON.encode(system),
                success: function () {
                    window.location.href = '/';
                    Ext.toast('System settings saved!');
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        }
    }

});
