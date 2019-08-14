Ext.define('Mfw.settings.system.Logging', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-logging',

    title: 'Logging'.t(),
    layout: 'fit',

    viewModel: {},

    items: [{
        xtype: 'container',
        itemId: 'loginfo',
        style: 'font-size: 14px;',
        padding: 16,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'component',
                html: 'Logread'
            }]
        }, {
                xtype: 'component',
                bind: {html: '{loginfo}'},
                readOnly: true
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel();
            Ext.Ajax.request({
                url: '/api/logging/logread',
                success: function (response) {
                    vm.set('loginfo', Ext.decode(response.responseText));
                },
                failure: function () {
                    console.warn('Unable to get logs!');
                }
            });
        }
    }

});
