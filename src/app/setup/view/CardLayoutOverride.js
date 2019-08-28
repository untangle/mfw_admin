/**
 * Override next(), prev() methods to use routing
 */
Ext.define('Ext.override.layout.Card', {
    override: 'Ext.layout.Card',

    // override
    next: function() {
        var container = this.getContainer(),
            activeItem = container.getActiveItem(),
            innerItems = container.getInnerItems(),
            index = innerItems.indexOf(activeItem);

        activeItem = innerItems[index + 1];

        if (activeItem) {
            Mfw.app.redirectTo(activeItem.xtype.replace('step-', ''));
        }
    },

    // override
    previous: function() {
        var container = this.getContainer(),
            activeItem = container.getActiveItem(),
            innerItems = container.getInnerItems(),
            index = innerItems.indexOf(activeItem);

        activeItem = innerItems[index - 1];

        if (activeItem) {
            Mfw.app.redirectTo(activeItem.xtype.replace('step-', ''));
        }
    },

    // get the next step
    getNext: function() {
        var container = this.getContainer(),
            activeItem = container.getActiveItem(),
            innerItems = container.getInnerItems(),
            index = innerItems.indexOf(activeItem);
        return innerItems[index + 1] || activeItem;
    },


});
