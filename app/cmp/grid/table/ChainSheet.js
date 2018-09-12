Ext.define('Mfw.cmp.grid.table.ChainSheet', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.chainsheet',

    viewModel: {
        data: {
            operation: null
        }
    },

    config: {
        chain: null
    },

    bind: {
        title: '{operation === "EDIT" ? "Edit Chain" : "New Chain"}',
    },
    side: 'right',
    exit: 'right',

    width: 300,
    // padding: 0,

    items: [{
        xtype: 'formpanel',
        padding: 0,
        defaults: {
            // labelAlign: 'top'
        },
        items: [{
            xtype: 'textfield',
            name: 'name',
            label: 'Name'.t(),
            autoComplete: false,
            clearable: false,
            required: true
        }, {
            xtype:'textareafield',
            name: 'description',
            label: 'Description'.t(),
            autoComplete: false,
            required: true
        }, {
            xtype: 'combobox',
            name: 'type',
            label: 'Choose Type'.t(),
            editable: false,
            clearable: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            store: [
                { value: 'filter', name: 'Filter'.t() },
                { value: 'route', name: 'Route'.t() },
                { value: 'nat', name: 'NAT'.t() }
            ]
        }, {
            xtype: 'combobox',
            name: 'hook',
            label: 'Choose Hook'.t(),
            editable: false,
            clearable: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            store: [
                { value: 'prerouting', name: 'Prerouting'.t() },
                { value: 'input', name: 'Input'.t() },
                { value: 'forward', name: 'Forward'.t() },
                { value: 'output', name: 'Output'.t() },
                { value: 'postrouting', name: 'Postrouting'.t() },
                { value: 'ingress', name: 'Ingress'.t() }
            ]
        }
        // {
        //     xtype: 'togglefield',
        //     name: 'default',
        //     margin: '16 0 0 0',
        //     boxLabel: 'Default Chain'.t()
        // }
    ]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        shadow: false,
        margin: 0,
        padding: '0 8',
        items: ['->', {
            text: 'Cancel'.t(),
            margin: '0 8',
            handler: 'onCancel'
        }, {
            bind: {
                text: '{operation === "EDIT" ? "Update" : "Create"}'
            },
            ui: 'action',
            handler: 'onApply'
        }]

    }],

    listeners: {
        initialize: 'onInitialize',
        show: 'onShow',
        hide: 'onHide'
    },

    controller: {
        onInitialize: function (sheet) {
            console.log(sheet.getRefOwner());

        },

        onShow: function (sheet) {
            var form = sheet.down('formpanel');
            form.setRecord(sheet.getChain());
        },

        onApply: function () {
            var me = this, sheet = me.getView(),
                form = sheet.down('formpanel'),
                record = form.getRecord();
            record.set(form.getValues());
            record.commit();

            if (me.getViewModel().get('operation') === "NEW") {
                sheet.table.chains().add(record);
            }
            console.log(sheet.table.chains());
            // record.commit();
            sheet.hide();
        },

        onHide: function (sheet) {
            var form = sheet.down('formpanel');
            form.setRecord(null);
            form.reset(true);
        },

        onCancel: function () {
            var me = this;
            me.getView().hide();
        }
    }

});
