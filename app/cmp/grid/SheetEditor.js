Ext.define('Mfw.cmp.grid.SheetEditor', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.sheet-editor',

    controller: 'sheet-editor',

    title: 'Sheet title'.t(),

    viewModel: {
        record: null
    },

    layout: 'fit',

    scrollable: true,

    isViewportMenu: true,

    side: 'right',

    exit: 'right',

    width: 350,
    hideOnMaskTap: false,

    buttons: {
        ok: {
            text: 'OK',
            handler: 'onApply'
        },
        cancel: {
            text: 'Cancel'.t(),
            handler: 'onCancel'
        }
    },

    listeners: {
        // beforeshow: 'onBeforeShow',
        initialize: 'onInitialize'
    },

    init: function (sheet) {
        console.log(sheet);
        sheet.on('beforeshow', 'onBeforeShow', this);
    },

    onBeforeShow: function () {
        console.log('beforeshow');
    }

});
