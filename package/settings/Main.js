Ext.define('Mfw.settings.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.settings',

    controller: 'settings',

    layout: 'fit',

    config: {
        type: 'static' // api or static
    },

    items: [{
        layout: 'fit',
        xtype: 'panel',
        zIndex: 999,
        resizable: {
            split: true,
            edges: 'east'
        },

        docked: 'left',
        width: '300',

        bbar: {
            shadow: true,
            items: [{
                xtype: 'searchfield',
                ui: 'faded',
                flex: 1,
                placeholder: 'Find settings...'.t(),
                listeners: {
                    change: 'filterSettings'
                }
            }]
        },

        items: [{
            xtype: 'treelist',
            scrollable: true,
            ui: 'nav',
            style: {
                background: '#f5f5f5'
            },
            animation: {
                duration: 150,
                easing: 'ease'
            },
            singleExpand: true,
            expanderFirst: false,
            expanderOnly: false,
            selectOnExpander: true,
            highlightPath: false,
            store: {
                type: 'settings-nav'
            },
            listeners: {
                selectionchange: 'onSelectionChange'
            }
        }]
    }],
    listeners: {
        initialize: function () {
            Ext.create('Mfw.settings.Nav',{
                autoLoad: true
            });
        }
    }

});
