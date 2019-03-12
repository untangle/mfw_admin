Ext.define('Mfw.settings.system.Upgrade', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-upgrade',

    title: 'Upgrade'.t(),

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

    // buttons: {
    //     save: {
    //         text: 'Save'.t(),
    //         ui: 'action'
    //     }
    // },

    controller: {
        init: function (view) {
        },
        onSubmit: function () {
            var form = this.getView();
            if(form.isValid()){
                form.submit({
                    url: '/api/sysupgrade',
                    waitMsg: 'Upgrading...',
                    success: function(fp, o) {
                        //FIXME display success
                        console.log("UPGRADE SUCCESS");
                    },
                    failure: function(fp, o) {
                        //FIXME display error
                        console.log("UPGRADE FAILURE");
                    }
                });
            }            
        }
    }

});
