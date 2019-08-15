Ext.define('Mfw.settings.system.Logging', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-logging',

    title: 'Logging'.t(),
    layout: 'fit',

    viewModel: {},

    items: [{
        xtype: 'container',
        style: 'font-size: 14px;',
        padding: 16,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button',
                text: 'Logread',
                handler: 'onLogtypeSelected',
                value: 'logread'
            },
            {
                xtype:'button',
                text: 'Dmesg',
                handler: 'onLogtypeSelected',
                value: 'dmesg'
            }]
        }, {
                xtype: 'textareafield',
                bind: '{loginfo}',
                grow: true,
                height: '100%',
                readOnly: true,
                scrollable: true,
                listeners: {
                    change: function(field) {
                        // An attempt to scroll to bottom of text field after data changes, doesn't seem to work though.
                        field.getScrollable().scrollBy(0, Infinity, false);
                    }
                }
            }]
    }],
    controller: {
        onLogtypeSelected: function(btn) {
            var currentLog = btn.getValue();
            var vm = this.getViewModel();
            Ext.Ajax.request({
                url: '/api/logging/' + currentLog,
                success: function (response) {
                    vm.set('loginfo',Ext.util.Base64.decode(Ext.decode(response.responseText).logresults));
                },
                failure: function (response) {
                    vm.set('loginfo', "Failed to load logs:\n" + Ext.decode(response.responseText).error);
                }
            });
        }
    }

});
