Ext.define('Ung.view.settings.Select', {
    extend: 'Ext.Container',
    alias: 'widget.mfw-settings-select',

    layout: 'center',

    items: [{
        xtype: 'component',
        cls: 'config-bg',
        width: 384,
        margin: '0 auto 0 -192',
        html: '<i class="x-fa fa-cog fa-4x" style="font-style: normal; color: #EEE; font-size: 32em;"></i>'
    }, {
        html: '<h1 style="font-family: \'Roboto Condensed\'; font-weight: 100; color: #777;">Please select desired Category/Settings!</h1>'
    }]
});
