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
            errorLabel: 'Interface Name'.t(),
            required: true,
            bind: '{rec.name}'
        }, {
            xtype: 'combobox',
            name: 'configType',
            label: 'Type'.t(),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            required: true,
            bind: '{rec.configType}',
            store: [
                { name: 'Addressed'.t(), value: 'ADDRESSED' },
                { name: 'Bridged'.t(),   value: 'BRIDGED' },
                { name: 'Disabled'.t(),  value: 'DISABLED' }
            ]
        }, {
            xtype: 'combobox',
            name: 'bridgedTo',
            label: 'Bridged To'.t(),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            required: false,
            forceSelection: true,
            hidden: true,
            bind: {
                hidden: '{rec.configType !== "BRIDGED"}',
                required: '{rec.configType === "BRIDGED"}'
            },
            store: [
                { name: 'Intf 1'.t(), value: '1' },
                { name: 'Intf 2'.t(),   value: '2' }
            ]
        }, {
            xtype: 'togglefield',
            name: 'wan',
            // margin: '0 16',
            label: 'Is WAN'.t(),
            required: true,
            hidden: true,
            bind: {
                value: '{rec.wan}',
                hidden: '{rec.configType !== "ADDRESSED"}'
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
        // userCls: 'config-menu',
        // ui: 'nav',
        margin: 4,
        itemTpl: '<strong>{text}</strong> / {status}',
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
