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
        xtype: 'textfield',
        margin: '0 16',
        required: true,
        label: 'Name'.t(),
        // placeholder: 'Name'.t(),
        bind: '{rec.name}'
    }, {
        xtype: 'combobox',
        margin: '0 16',
        label: 'Type'.t(),
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        store: [
            { name: 'Addressed'.t(), value: 'ADDRESSED' },
            { name: 'Bridged'.t(),   value: 'BRIDGED' },
            { name: 'Disabled'.t(),  value: 'DISABLED' }
        ],
        bind: '{rec.configType}'
    }, {
        xtype: 'togglefield',
        margin: '0 16',
        label: 'Is WAN'.t(),
        bind: '{rec.wan}'
        // reference: 'override',
        // margin: '8 16'
    },
        {
        xtype: 'list',
        disableSelection: true,
        // userCls: 'config-menu',
        // ui: 'nav',
        itemTpl: '<strong>{text}</strong> ({status})',
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
