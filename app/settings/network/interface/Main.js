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
        padding: 16,
        layout: {
            type: 'vbox',
            // itemSpacing: 8,
        },
        defaults: {
            labelWidth: 80,
            labelAlign: 'left'
        },
        items: [{
            xtype: 'textfield',
            label: 'Name'.t(),
            required: true,
            bind: '{rec.name}'
        }, {
            xtype: 'combobox',
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
            name: 'configType',
            label: 'Bridged To'.t(),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            required: true,
            forceSelection: true,
            hidden: true,
            bind: {
                hidden: '{rec.configType !== "BRIDGED"}'
            },
            store: [
                { name: 'Addressed'.t(), value: 'ADDRESSED' },
                { name: 'Bridged'.t(),   value: 'BRIDGED' },
                { name: 'Disabled'.t(),  value: 'DISABLED' }
            ]
        }, {
            xtype: 'togglefield',
            // margin: '0 16',
            label: 'Is WAN'.t(),
            required: true,
            hidden: true,
            bind: {
                value: '{rec.wan}',
                hidden: '{rec.configType !== "ADDRESSED"}'
            }
        }]
    },
        {
        xtype: 'list',
        disableSelection: true,
        // userCls: 'config-menu',
        // ui: 'nav',
        itemTpl: '<strong>{text}</strong> / {status}',
        onItemDisclosure: 'onDisclosureTap',
        bind: {
            store: {
                data: '{availableSettings}'
            }
        },
        listeners: {
            childtap: function (list, location) {
                console.log(location.record.get('card'));
                list.up('formpanel').setActiveItem('#' + location.record.get('card'));
            }
        }
    }]
});
