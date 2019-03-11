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
        layout: 'vbox',
        width: 300,
        defaults: {
            labelAlign: 'top',
            clearable: false,
            required: true
        },
        items: [{
            xtype: 'filefield',
            name: 'file',
            label: 'Sysupgrade File'.t()
        }, {
            xtype: 'toolbar',
            shadow: false,
            style: 'background: transparent;',
            docked: 'bottom',
            items: ['->', {
                text: 'Upload',
                ui: 'action',
                handler: 'onUpload'
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
        },

        onUpload: function () {
            //FIXME
            var form = this.getView().up('form').getForm();
            if(form.isValid()){
                form.submit({
                    url: '/sysupgrade',
                    waitMsg: 'Upgrading...',
                    success: function(fp, o) {
                        msg('Success', tpl.apply(o.result));
                    }
                });
            }            
        }
    }

});
