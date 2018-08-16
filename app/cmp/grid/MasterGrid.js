Ext.define('Mfw.cmp.MasterGrid', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mastergrid',

    viewModel: {},

    items: [{
        xtype: 'toolbar',
        padding: 0,
        itemId: 'operations',
        // ui: 'footer',
        docked: 'top',
        items: [{
            text: 'Add',
            iconCls: 'x-fa fa-plus',
            handler: 'addRecord',
            margin: '0 20 0 0'
        }, {
            xtype: 'segmentedbutton',
            margin: '0 20 0 0',
            allowToggle: false,
            hidden: true,
            bind: {
                hidden: '{selcount !== 1}'
            },
            defaults: {
                ui: 'default',
                handler: 'onSort',
            },
            items: [{
                iconCls: 'x-fa fa-angle-double-up',
                tooltip: 'Move First'.t(),
                pos: 'first'
            }, {
                iconCls: 'x-fa fa-angle-up',
                tooltip: 'Move Up'.t(),
                pos: 'up'
            }, {
                iconCls: 'x-fa fa-angle-down',
                tooltip: 'Move Down'.t(),
                pos: 'down'
            }, {
                iconCls: 'x-fa fa-angle-double-down',
                tooltip: 'Move Last'.t(),
                pos: 'last'
            }]
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-pencil',
            hidden: true,
            bind: {
                hidden: '{selcount !== 1}'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-trash',
            hidden: true,
            bind: {
                hidden: '{selcount === 0}'
            }
        }]
    }],

    scrollable: true,

    selectable: {
        mode: 'multi',
        checkbox: true,
        deselectable: true,
        drag: true
    },

    bind: {
        hideHeaders: '{smallScreen}'
    },


    listeners: {
        select: 'onSelect',
        deselect: 'onSelect'
    },

    controller: {
        onSelect: function (grid) {
            var selcount = grid.getSelections().length;
            grid.getViewModel().set('selcount', selcount);
        },

        onSort: function (btn) {
            // var grid = this;
            var store = this.getView().getStore(),
            record = this.getView().getSelection(),
            oldIndex = store.indexOf(record),
            newIndex, pos;
            switch (btn.pos) {
                case 'first': newIndex = 0; break;
                case 'up':    newIndex = oldIndex > 0 ? (oldIndex - 1) : oldIndex; break;
                case 'down':  newIndex = oldIndex < store.getCount() ? (oldIndex + 1) : oldIndex; break;
                case 'last':  newIndex = store.getCount(); break;
                default: break;
            }
            store.removeAt(oldIndex);
            store.insert(newIndex, record);
            store.sync();

            if (store.indexOf(record) === 0) { pos = 'first'; }
            if (store.indexOf(record) === store.getCount() - 1) { pos = 'last'; }

            this.getView().setSelection(record);
            this.getViewModel().set('pos', pos);
        },

        addRecord: function () {

        }
    }

});
