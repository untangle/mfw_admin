/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.cmp.grid.MasterGrid', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mastergrid',

    viewModel: {},

    controller: 'mastergrid',

    store: {},

    plugins: {
        // this is the plugin which enables generic grids data editing
        mastergrideditable: true
    },

    config: {
        /**
         * @cfg {Boolean} enableAdd
         * `true` to allow user to add new records
         */
        enableAdd: true,

        /**
         * @cfg {Boolean} enableEdit
         * `true` to allow user to edit any record, `false` to disable editing
         */
        enableEdit: true,

        /**
         * @cfg {String} disableEditCondition
         * a binding expression condition which disables edit for specific records (e.g. `{record.wan}`)
         * it makes sense only when `enableEdit` is `true`
         */
        disableEditCondition: null,

        /**
         * @cfg {Boolean} enableDelete
         * `true` to allow user to remove any record, `false` to disable removal
         */
        enableDelete: true,

        /**
         * @cfg {String} disableDeleteCondition
         * a binding expression condition which disables deletion for specific records (e.g. `{record.wan}`)
         * it makes sense only when `enableDelete` is `true`
         */
        disableDeleteCondition: null,

        /**
         * @cfg {Boolean} enableCopy
         * `true` to allow user to copy/duplicate a record, `false` to disable copy
         */
        enableCopy: true,

        /**
         * @cfg {String} disableCopyCondition
         * a binding expression condition which disables copy/duplicate for specific records (e.g. `{record.wan}`)
         * it makes sense only when `enableCopy` is `true`
         */
        disableCopyCondition: null,

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
         * @cfg {Boolean} enableImport
         * `true` to allow user to import data from a file
         */
        enableImport: true,

        /**
         * @cfg {Boolean} enableExport
         * `true` to allow user to export data to a file
         */
        enableExport: true,


        /**
         * @cfg {Boolean} enableManualSort
         * `true` to allow user to sort records manually only
         * any other type of sorting shoul be disabled
         */
        enableManualSort: true,

        /**
         * @cfg {String} editor
         * the dialog component alias used for editing grid records
         * e.g. `interface-dialog`
         */
        editor: null,

        /**
         * @cfg {String} newRecordModel
         * the data model for the new record to be created
         * e.g. `interface`
         */
        recordModel: null
    },

    emptyText: 'No Data'.t(),
    scrollable: true,

    selectable: {
        mode: 'multi',
        // mode: 'single',
        cells: false,
        // checkbox: true,
        allowDeselect: true,
        drag: true
    },

    bind: {
        hideHeaders: '{smallScreen}'
    },

    itemConfig: {
        viewModel: true,
    },

    listeners: {
        initialize: 'onInitialize',
        select: 'onSelect',
        deselect: 'onDeselect',
        beforesave: 'beforeSave', // custom event to prepare records
        destroy: 'onDestroy'
        // childdoubletap: function (listview, location) {
        //     console.log(location);
        // },
        // customedit: function () {
        //     console.log('here');
        // }
    }
});
