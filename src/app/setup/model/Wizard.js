Ext.define('Mfw.model.Wizard', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'currentStep', type: 'string' },
        { name: 'completed',   type: 'boolean' }
    ],
    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/api/settings/system/setupWizard',
            update: window.location.origin + '/api/settings/system/setupWizard'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
