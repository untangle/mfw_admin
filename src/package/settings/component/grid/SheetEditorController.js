Ext.define('Mfw.cmp.grid.SheetEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sheet-editor',

    // items: [{
    //     xtype: 'formpanel'
    // }],

    onInitialize: function (sheet) {
        var me = this,
            grid = sheet.up('grid'), form,
            fields = me.getEditorFields(grid.getColumns());

        // form.down('fieldset').setItems(fields);
        me.form = form = Ext.factory({
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: 0,
            items: fields
        }, Ext.form.Panel);
        // me.form = form = sheet.down('formpanel');
        // form.setLayout('vbox');
        // form.setItems(fields);
        sheet.add(form);

        // var me = this; console.log('init');
        // me.grid = sheet.up('grid');
        // console.log(me.grid);
        sheet.getViewModel().bind('{record}', function (record) {
            console.log(record);
            form.setRecord(record);
            // form.down('grid').setBind('record.conditions');
            // form.down('grid').getStore().loadData(record.get('conditions'));
        });
    },

    getEditorFields: function(columns) {
        var fields = [], editable, editor, cfg;
        Ext.Array.each(columns, function (column) {
            editable = column.getEditable();
            editor = editable !== false && column.getEditor();

            if (!editor && editable) {
                cfg = column.getDefaultEditor();
                editor = Ext.create(cfg);
                column.setEditor(editor);
            }

            // console.log(editor);

            if (editor) {
                if (!editor.isXType('collection')) {
                    if (editor.isEditor) {
                        editor = editor.getField();
                    }
                    editor.setLabel(column.getText());
                    editor.setLabelAlign('left');
                    editor.setName(column.getDataIndex());
                } else {
                    editor.setHideHeaders(true);
                    // editor.setTitle('Conditions'.t());
                }
                fields.push(editor);
            }
        });
        return fields;
    },

    onApply: function (btn) {
        var me = this, vm = me.getViewModel(),
            sheet = me.getView(),
            grid = sheet.up('grid'),
            form = sheet.down('formpanel');

        vm.get('record').set(form.getValues());
        vm.get('record').commit();

        // // console.log(vm.get('rec').isValid());
        // var invalidFields = '';

        // // Ext.Object.each(form.getFields(), function(key, field) {
        // //     if (field.validate()) { return; }
        // //     invalidFields += '<strong>' + (field.errorLabel || field.getLabel()) + '</strong>: <span style="color: red;">' + field.getErrorMessage() + '</span><br/>';
        // // })
        // // if (invalidFields.length > 0) {
        // //     Ext.Msg.alert('Invalid fields'.t(), 'Please correct the following: <br/>' + invalidFields);
        // //     return;
        // // }

        // if (vm.get('isNew')) {
        //     grid.getStore().add(vm.get('rec'));
        // }

        // // Ext.Msg.confirm('<span class="x-fa fa-cogs"></span> Apply Changes?'.t(),
        // //     '<p><strong>It might take a while for the changes to take effect!</strong></p>' +
        // //     '<p>If you want to make additional changes, do them before saving!</p>',
        // //     function (answer) {
        // //         if (answer === 'no') {
        // //             return;
        // //         }
        // //         btn.up('dialog').hide();
        // //     });

        btn.up('sheet').hide();
    },

    onCancel: function (btn) {
        var me = this, vm = me.getViewModel();
        vm.get('record').reject();
        btn.up('sheet').hide();
    }

});
