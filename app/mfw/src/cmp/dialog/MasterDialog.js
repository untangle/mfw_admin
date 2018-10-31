Ext.define('Mfw.cmp.dialog.MasterDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.masterdialog',
    controller: 'masterdialog',
    viewModel: {},

    title: 'MasterDialog',

    showAnimation: null,
    hideAnimation: null,

    scrollable: true,
    closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel',
    layout: 'fit',
    // alwaysOnTop: true, // important
    maximized: false,
    maximizeAnimation: null,

    padding: 0,

    height: 500,
    bind: {
        maximized: '{smallScreen}',
        minWidth: '{!smallScreen ? 320 : null}',
        maxHeight: '{!smallScreen ? 600 : null}',
    },
    // bodyPadding: '0 16',

    items: [],

    listeners: {
        initialize: 'onInitialize'
    },

    buttons: {
        ok: 'onOk',
        cancel: 'onCancel'
    }
});
