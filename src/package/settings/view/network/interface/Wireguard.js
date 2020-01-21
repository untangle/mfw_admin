/**
 * Wireguard interface options
 * shown only if interface type is WIREGUARD
 */
Ext.define('Mfw.settings.interface.Wireguard', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wireguard',

    layout: 'fit',

    viewModel: {
    },

    items: [{
        xtype: 'component',
        html: 'wireguard settings'
    }]

    // controller: {
    //     /**
    //      * OpenVPN configuration file handler
    //      */
    //     onFileChange: function (fileField) {
    //         var reader = new FileReader(),
    //             file = fileField.getFiles()[0],
    //             textarea = fileField.up('formpanel').down('textareafield');

    //          reader.onload = function () {
    //             textarea.setValue(reader.result);
    //         };
    //         reader.readAsText(file);
    //     }
    // }
});
