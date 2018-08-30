Ext.define('Mfw.cmp.grid.SheetEditor', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.sheeteditor',

    controller: 'sheeteditor',

    title: 'Sheet title'.t(),

    viewModel: {},

    isViewportMenu: true,

    side: 'right',

    exit: 'right',

    width: 350,
    hideOnMaskTap: false,

    // items: [{
    //     xtype: 'interface-main'
    // }],

    // xtype: 'toolbar',
    // docked: 'bottom',
    // defaultType: 'button',
    // ui: 'footer',
    // hidden: true,
    // bind: { hidden: '{!isMainCard}' },
    // items: [
    //     '->',
    //     { text: 'Cancel'.t(), handler: 'onCancel' },
    //     { text: 'Apply'.t(), handler: 'onApply' }
    //     // '->',
    // ]

    buttons: {
        ok: {
            text: 'OK',
            handler: 'onApply'
        },
        cancel: {
            text: 'Cancel'.t(),
            handler: 'onCancel'
        }
    }

});
