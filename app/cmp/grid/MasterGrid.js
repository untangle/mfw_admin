Ext.define('Mfw.cmp.grid.MasterGrid', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mastergrid',

    viewModel: {},

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        margin: 0,
        shadow: false,
        items: [{
            xtype: 'component',
            style: 'color: #777; font-size: 18px; font-weight: normal;',
            html: 'Port Forward Rules'.t() + '<br/><span style="font-size: 12px;">Firewall</span>'
        }, '->', {
            text: 'Add',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'addRecord'
        }]
        // margin: '0 0 0 8',
    }, {
        xtype: 'toolbar',
        // padding: '0 8',
        itemId: 'operations',
        // ui: 'footer',
        docked: 'top',
        shadow: false,
        hidden: true,
        bind: {
            hidden: '{selcount === 0}'
        },
        items: [{
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
        }, '->', {
            xtype: 'button',
            ui: 'action round',
            iconCls: 'x-fa fa-pencil',
            margin: '0 16 0 0',
            hidden: true,
            bind: {
                hidden: '{selcount !== 1}'
            },
            handler: 'onEdit'
        }, {
            xtype: 'button',
            ui: 'action round',
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

        },

        onEdit: function () {
            var store = this.getView().getStore(),
            record = this.getView().getSelection();

            var me = this;
            if (!me.dialog) {
                me.dialog = Ext.Viewport.add({
                    xtype: 'rule-dialog',
                    // ownerCmp: me.getView(),
                    listeners: {
                        hide: function () {
                            console.log('hide');
                            store.commitChanges();
                        }
                    }
                });
            }
            // me.dialog.setAddAction(!condition);
            me.dialog.getViewModel().set('record', record);
            me.dialog.show();
        },

        // onDialogHide: function () {
        //     console.log('hide');
        // }
    }

});
