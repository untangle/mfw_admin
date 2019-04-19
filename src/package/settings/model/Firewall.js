Ext.define('Mfw.model.Firewall', {
    extend: 'Ext.data.Model',
    alias: 'model.firewall',

    idProperty: '_id',
    identifier: 'uuid',

    fields: [],

    hasOne: [{
        model: 'Mfw.model.table.Table',
        name: 'access',
        associationKey: 'access'
    }, {
        model: 'Mfw.model.table.Table',
        name: 'captivePortal',
        associationKey: 'captive-portal'
    }, {
        model: 'Mfw.model.table.Table',
        name: 'filter',
        associationKey: 'filter'
    }, {
        model: 'Mfw.model.table.Table',
        name: 'nat',
        associationKey: 'nat'
    }, {
        model: 'Mfw.model.table.Table',
        name: 'portForward',
        associationKey: 'port-forward'
    }, {
        model: 'Mfw.model.table.Table',
        name: 'shaping',
        associationKey: 'shaping'
    }, {
        model: 'Mfw.model.table.Table',
        name: 'webFilter',
        associationKey: 'web-filter'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/firewall/tables',
            update: Util.api + '/settings/firewall/tables'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: false, // wrap single record in array
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    }
});

