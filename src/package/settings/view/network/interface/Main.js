Ext.define('Mfw.settings.network.interface.Main', {
    extend: 'Ext.Container',
    alias: 'widget.interface-main',

    headerTitle: 'Edit Interface'.t(),

    itemId: 'main',
    scrollable: true,
    padding: '0',
    layout: {
        type: 'vbox'
    },
    defaults: {
        labelAlign: 'left',
        labelWidth: 80,
        // margin: '0'
        // labelTextAlign: 'right'
    },
    items: [{
        xtype: 'container',
        padding: '0 16 16 16',
        layout: {
            type: 'vbox',
            // itemSpacing: 8,
        },
        defaults: {
            labelWidth: 80,
            padding: 0,
            margin: 0,
            labelAlign: 'left',
            labelTextAlign: 'right'
        },
        items: [{
            xtype: 'textfield',
            name: 'name',
            label: 'Name'.t(),
            autoComplete: false,
            errorLabel: 'Interface Name'.t(),
            required: true,
            bind: '{record.name}'
        }, {
            xtype: 'combobox',
            name: 'configType',
            label: 'Type'.t(),
            editable: false,
            required: true,
            bind: '{record.configType}',
            options: [
                { text: 'Addressed'.t(), value: 'ADDRESSED' },
                { text: 'Bridged'.t(),   value: 'BRIDGED' },
                { text: 'Disabled'.t(),  value: 'DISABLED' }
            ]
        }, {
            xtype: 'selectfield',
            name: 'bridgedTo',
            label: 'Bridged To'.t(),
            editable: false,
            required: false,
            autoSelect: true,
            forceSelection: true,
            hidden: true,
            bind: {
                value: '{record.bridgedTo}',
                hidden: '{record.configType !== "BRIDGED"}',
                required: '{record.configType === "BRIDGED"}',
                options: '{bridgedOptions}'
            }
        }, {
            xtype: 'togglefield',
            name: 'wan',
            // margin: '0 16',
            label: 'Is WAN'.t(),
            required: true,
            hidden: true,
            bind: {
                value: '{record.wan}',
                hidden: '{record.configType !== "ADDRESSED"}'
            }
        }]
    }, {
        xtype: 'component',
        height: 3,
        style: 'background: #EEE',
        html: '',
    },
        {
        xtype: 'list',
        disableSelection: true,
        // ui: 'nav',
        margin: 4,
        itemTpl: '<strong>{text}</strong> [{status}]',
        onItemDisclosure: Ext.emptyFn,
        bind: {
            store: {
                data: '{availableSettings}'
            }
        },
        listeners: {
            childtap: function (list, location) {
                list.up('formpanel').setActiveItem('#' + location.record.get('card'));
            }
        }
    }]
});
