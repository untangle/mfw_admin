Ext.define('Mfw.cmp.grid.SheetEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sheet-editor',

    onInitialize: function (sheet) {
        console.log('init');
        sheet.getViewModel().bind('{rec}', function (rec) {
            console.log(rec);
            console.log(rec.getFields());
        })
    },

    onApply: function (btn) {
        var me = this, vm = me.getViewModel(),
            sheet = me.getView(),
            grid = sheet.up('grid'),
            form = sheet.down('formpanel');

        // console.log(vm.get('rec').isValid());
        var invalidFields = '';

        // Ext.Object.each(form.getFields(), function(key, field) {
        //     if (field.validate()) { return; }
        //     invalidFields += '<strong>' + (field.errorLabel || field.getLabel()) + '</strong>: <span style="color: red;">' + field.getErrorMessage() + '</span><br/>';
        // })
        // if (invalidFields.length > 0) {
        //     Ext.Msg.alert('Invalid fields'.t(), 'Please correct the following: <br/>' + invalidFields);
        //     return;
        // }

        if (vm.get('isNew')) {
            grid.getStore().add(vm.get('rec'));
        }

        // Ext.Msg.confirm('<span class="x-fa fa-cogs"></span> Apply Changes?'.t(),
        //     '<p><strong>It might take a while for the changes to take effect!</strong></p>' +
        //     '<p>If you want to make additional changes, do them before saving!</p>',
        //     function (answer) {
        //         if (answer === 'no') {
        //             return;
        //         }
        //         btn.up('dialog').hide();
        //     });

        btn.up('sheet').hide();
    },

    onCancel: function (btn) {
        btn.up('sheet').hide();
    }

});
