Ext.define('Mfw.cmp.grid.Collection', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.collection',

    hideHeaders: true,

    // height: 200,
    flex: 1,
    bind: '{record.conditions}',
    fields: [
        'conditionType'
    ],
    // bind: '{record.conditions}',

    columns: [{
        dataIndex: 'conditionType',
        // renderer: function (value, record) {
        //     console.log(record);
        //     return record.get('conditionType') + ' = ' + record.get('value');
        // }
    }]

});
