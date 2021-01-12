/**
 * Validate hostname
 */
Ext.define('Ext.data.validator.Hostname', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.hostname',
    type: 'hostname',

    validate: function (value) {
        if (value.charAt(0) === '.') {
            return 'Hostname cannot begin with period.';
        }
        if (!Ext.data.validator.Hostname.matcher.test(value)){
            return 'A hostname can only contain numbers, letters, dashes and periods.';
        }
        return true;
    },

    statics:{
        matcher: RegExp('^[a-zA-Z0-9\-_.]+$'),

    }
});
