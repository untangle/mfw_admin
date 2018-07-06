Ext.define('Mfw.settings.network.InterfaceDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',
    title: 'Edit Interface'.t(),

    viewModel: {},
    scrollable: true,
    // closable: true,
    // closeAction: 'hide',
    draggable: false,
    maskTapHandler: 'onDialogCancel',
    layout: 'fit',
    alwaysOnTop: true, // important
    maximized: false,
    maximizeAnimation: null,

    bind: {
        maximized: '{smallScreen}',
        minWidth: '{!smallScreen ? 300 : null}',
        maxHeight: '{!smallScreen ? 600 : null}',
    },
    // bodyPadding: '0 16',

    items: [{
        xtype: 'formpanel',
        // layout: 'form',
        // scrollable: true,
        // padding: 0,
        items: [{
            xtype: 'textfield',
            // labelAlign: 'top',
            // label: 'Name'.t()
            placeholder: 'Name'.t(),
            bind: '{rec.name}'
        }, {
            xtype: 'component',
            html: '<br/><br/><br/><br/><br/><br/>Interface Editor fields <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>Some scrollable content .....</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>END OF SCROLL</p>'
        }]

    }],
    buttons: {
        ok: 'onOk',
        cancel: 'onCancel'
    },

    controller: {
        onOk: function (btn) {
            btn.up('dialog').hide();
        },
        onCancel: function (btn) {
            btn.up('dialog').hide();
        }

    }
});
