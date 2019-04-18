Ext.define('Mfw.settings.system.Upgrade', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-upgrade',

    title: 'Upgrade'.t(),

    viewModel: {
        data: {
            system: null
        }
    },

    items: [{
        xtype: 'formpanel',
        width: 300,
        items: [{
            xtype: 'filefield',
            name: 'file',
            label: 'Sysupgrade File'.t()
        }],
        buttons: [{
            text: 'Upload',
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        onSubmit: function () {
            var form = this.getView();
            if(form.isValid()){
                form.submit({
                    url: '/api/sysupgrade',
                    waitMsg: 'Upgrading...',
                    success: function(fp, o) {
                        Ext.Msg.alert('Upgrade', 'The upgrade is in progress.');
                    },
                    failure: function(fp, o) {
                        Ext.Msg.alert('Error', 'The returned an error.' + ' ' + o);
                    }
                });
            }
        }
    }

});
