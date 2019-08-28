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
            label: 'Time zone'.t(),
            bind: '{system.timeZone.displayName}',
            valueField: 'text',
            options: Map.options.timezones
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
        }
    }

});
