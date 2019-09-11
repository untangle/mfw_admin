/**
 * VRRP options
 * shown only if interface type is NIC
 */
Ext.define('Mfw.settings.interface.Vrrp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-vrrp',

    layout: 'fit',

    items: [{
        xtype: 'container',
        scrollable: true,
        layout: 'hbox',
        items: [{
            xtype: 'formpanel',
            padding: '8 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'VRRP options'
            }, {
                xtype: 'togglefield',
                boxLabel: 'Enable VRRP',
                bind: {
                    value: '{intf.vrrpEnabled}'
                }
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    required: false,
                    disabled: false,
                    clearable: false,
                    autoComplete: false,
                    labelAlign: 'top'
                },
                items: [{
                    xtype: 'numberfield',
                    label: 'VRRP ID',
                    placeholder: 'enter id number ...',
                    margin: '0 16 0 0',
                    width: 110,
                    bind: {
                        value: '{intf.vrrpID}',
                        required: '{intf.vrrpEnabled === true}',
                        disabled: '{!intf.vrrpEnabled}'
                    }
                }, {
                    xtype: 'numberfield',
                    label: 'VRRP Priority',
                    placeholder: 'enter priority number ...',
                    margin: '0 0 0 16',
                    flex: 1,
                    bind: {
                        value: '{intf.vrrpPriority}',
                        required: '{intf.vrrpEnabled === true}',
                        disabled: '{!intf.vrrpEnabled}'
                    }
                }]
            }, {
                xtype: 'button',
                margin: '16 0 0 0',
                hidden: true,
                disabled: true,
                bind: {
                    text: 'VRRP v4 Aliases ({intf.vrrpV4Aliases.count || "none"})',
                    hidden: '{setupContext}',
                    disabled: '{!intf.vrrpEnabled}'
                },
                ui: 'action',
                handler: 'showVrrpV4Aliases'
            }]
        }]
    }],
    controller: {
        showVrrpV4Aliases: function () {
            var me = this;
            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-vrrpv4aliases',
                width: 500,
                height: 600,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        }
    }
});
