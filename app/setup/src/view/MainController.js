Ext.define('Mfw.setup.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainc',

    init: function () {
        var bbar = this.lookup('bbar');
        var card = this.lookup('panel').getLayout();

        // Lazily create the Indicator (wired to the card layout)
        var indicator = card.getIndicator();

        // Render it into our bottom toolbar (bbar)
        bbar.insert(2, indicator);
        // this.lookup('panel').setActiveItem(5);
    },

    onNext: function () {
        var card = this.lookup('panel').getLayout();

        card.next();
    },

    onPrevious: function () {
        var card = this.lookup('panel').getLayout();

        card.previous();
    },

    onCancel: function () {
        Ext.Msg.confirm('Exit Setup?', 'Are you sure you want exit setup wizard?',
            function (answer) {

            });
    }
});
