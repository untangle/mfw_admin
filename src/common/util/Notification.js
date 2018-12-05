Ext.define('Mfw.Notification', {
    alternateClassName: 'Notification',
    singleton: true,

    /**
     * Display a toast message
     * @param {String} type, // 'normal', 'warning', 'error'
     * @param {String} message
     */
    toast: function (type, message) {
        Ext.toast({
            cls: 'normal',
            message: message,
            timeout: 300000
        });
    },

    popup: function (type, message) {

    }


});
