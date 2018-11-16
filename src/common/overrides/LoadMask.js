Ext.define('Ext.override.LoadMask', {
    override: 'Ext.LoadMask',

    config: {
        message: '<span style="color: #EEE;">Wait ...</span>',
        cls: Ext.baseCSSPrefix + 'loading-mask',
        messageCls: null,
        indicator: false
    },

    getTemplate: function() {
        var prefix = Ext.baseCSSPrefix;

        return [
            {
                //it needs an inner so it can be centered within the mask, and have a background
                reference: 'innerElement',
                // cls: prefix + 'mask-inner',
                children: [
                    //the element used to display the {@link #message}
                    {
                        reference: 'messageElement'
                    }
                ]
            }
        ];
    },

    /**
     * Updates the message element with the new value of the {@link #message} configuration
     * @private
     */
    updateMessage: function(newMessage) {
        var cls = Ext.baseCSSPrefix + 'has-message';

        if (newMessage) {
            this.addCls(cls);
        } else {
            this.removeCls(cls);
        }

        this.messageElement.setHtml(newMessage);
    }
});
