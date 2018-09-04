/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.cmp.panel.MasterPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.masterpanel',

    viewModel: {},

    controller: 'masterpanel',

    config: {
        /**
         * @cfg {Boolean} enableSave
         * `true` to allow user push changes to server
         */
        enableSave: true,

        /**
         * @cfg {Boolean} enableReset
         * `true` to allow user reset settings to stable defaults
         */
        enableReset: true,

        /**
         * @cfg {Boolean} enableReload
         * `true` to allow user to reload/refetch data from server
         * any changes made to the grid will be lost/reset
         */
        enableReload: true,

        /**
         * @cfg {String} recordModel
         * the data model for the new record to be created
         * e.g. `interface`
         */
        recordModel: null
    },

    scrollable: true,

    listeners: {
        initialize: 'onInitialize'
    }
});
