Ext.define('Mfw.cmp.grid.MasterGridEditable', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.mastergrideditable',


    config: {
        /**
         * @private
         */
        grid: null,

        /**
         * @cfg {String} triggerEvent
         * The event used to trigger the showing of the editor form. This event should
         * be an event that is fired by the grid.
         */
        triggerEvent: 'masteredit',

        /**
         * @cfg {Object} formConfig
         * By changing the formConfig you can hardcode the form that gets created when editing a row.
         * Note that the fields are not set on this form, so you will have to define them yourself in this config.
         * If you want to alter certain form configurations, but still have the default editor fields applied, use
         * the defaultFormConfig instead.
         */
        formConfig: null,

        /**
         * @cfg {Object} defaultFormConfig
         * Configures the default form appended to the editable panel.
         */
        defaultFormConfig: {
            xtype: 'formpanel',
            scrollable: true,
            items: [{
                xtype: 'fieldset',
                defaults: {
                    autoComplete: false
                }
            }]
        },

        /**
         * @cfg {Object} toolbarConfig
         * Configures the toolbar appended to the editable panel.
         */
        toolbarConfig: {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [{
                xtype: 'button',
                // ui: 'alt',
                text: 'Cancel',
                align: 'left',
                action: 'cancel'
            }, {
                xtype: 'button',
                // ui: 'alt',
                text: 'Submit',
                align: 'right',
                action: 'submit'
            }]
        }
    },

    init: function(grid) {
        this.setGrid(grid);

        grid.setTouchAction({
            doubleTapZoom: false
        });
    },

    destroy: function() {
        this.cleanup();
        this.callParent();
    },

    updateGrid: function(grid, oldGrid) {
        var triggerEvent = this.getTriggerEvent();
        // console.log('here');
        if (oldGrid) {
            oldGrid.un(triggerEvent, 'onTrigger', this);
        }

        if (grid) {
            grid.on(triggerEvent, 'onTrigger', this);
        }
    },

    onCancelTap: function() {
        this.sheet.hide();
    },

    onSubmitTap: function() {
        var me = this, record = this.form.getRecord(),
            data = this.form.getValues();

        record.set(data);

        var r = record.clone();

        console.log(r);
        if (record.phantom) {

            // console.log(record.getData());
            // console.log(data);
            // me.getGrid().getStore().add({macAddress: 'aaa', address: 'bbb'});
            me.getGrid().getStore().add(r);
        }
        me.sheet.hide();
    },

    onSheetHide: function() {
        this.cleanup();
    },

    getEditorFields: function(columns) {
        var fields = [],
            ln = columns.length,
            // <debug>
            map = {},
            // </debug>
            i, column, editor, editable, cfg;

        for (i = 0; i < ln; i++) {
            column = columns[i];
            editable = column.getEditable();
            editor = editable !== false && column.getEditor();

            if (!editor && editable) {
                cfg = column.getDefaultEditor();
                editor = Ext.create(cfg);
                column.setEditor(editor);
            }

            if (editor) {
                // <debug>
                if (map[column.getDataIndex()]) {
                    Ext.raise('An editable column with the same dataIndex "' +
                        column.getDataIndex() + '" already exists.');
                }
                map[column.getDataIndex()] = true;
                // </debug>

                if (editor.isEditor) {
                    editor = editor.getField();
                }
                editor.setLabel(column.getText());
                editor.setName(column.getDataIndex());
                fields.push(editor);
            }
        }

        return fields;
    },

    onTrigger: function(grid, record) {
        var me = this,
            // record = location.record,
            formConfig = me.getFormConfig(),
            toolbarConfig = me.getToolbarConfig(),
            fields, form, sheet, toolbar;

        // Don't want to react to grid headers etc
        // if (!record || !location.row) {
        //     return;
        // }

        if (grid.getEditor()) {
            if (!me.sheet) {
                me.sheet = sheet = grid.add(grid.getEditor());
                // sheet.on('hide', 'onSheetHide', me);
            }
            me.sheet.show();
            return;
        }

        if (formConfig) {
            me.form = form = Ext.factory(formConfig, Ext.form.Panel);
        } else {
            me.form = form = Ext.factory(me.getDefaultFormConfig());

            fields = me.getEditorFields(grid.getColumns());
            form.down('fieldset').setItems(fields);
            form.clearFields = true;
        }

        toolbar = Ext.factory(toolbarConfig, Ext.form.TitleBar);
        me.submitButton = toolbar.down('button[action=submit]');
        toolbar.down('button[action=cancel]').on('tap', 'onCancelTap', me);
        me.submitButton.on('tap', 'onSubmitTap', me);

        // We sync the enabled state of the submit button with form validity
        form.on({
            change: 'onFieldChange',
            delegate: 'field',
            scope: me
        });

        form.setRecord(record);

        me.sheet = sheet = grid.add({
            xtype: 'sheet',
            title: 'Test'.t(),
            items: [toolbar, form],
            hideOnMaskTap: true,
            enter: 'right',
            exit: 'right',
            right: 0,
            width: 320,
            layout: 'fit',
            stretchY: true,
            hidden: true
        });

        sheet.on('hide', 'onSheetHide', me);

        sheet.show();
    },

    privates: {
        onFieldChange: function() {
            this.submitButton.setDisabled(!this.form.isValid());
        },

        cleanup: function() {
            var me = this,
                form = me.form;

            // form.setRecord(null);

            // if (form && !form.destroyed && form.clearFields) {
            //     form.removeAll(false);
            // }

            me.form = me.sheet = Ext.destroy(me.sheet);
        }
    }
});
