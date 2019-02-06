Ext.define('Mfw.settings.network.InterfaceDialog', {
    // extend: 'Ext.Panel',
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',

    viewModel: {},

    title: 'Add/Edit Interface'.t(),
    width: 500,
    height: 400,
    bodyPadding: 0,
    showAnimation: {
        duration: 0
    },

    layout: 'fit',



    items: [{
        xtype: 'panel',
        padding: 0,
        items: [{
            xtype: 'selectfield',
            name: 'type',
            reference: 'interfaceType',
            label: 'Interface Type',
            labelAlign: 'left',
            margin: '0 16',
            placeholder: 'Please Select',
            required: true,
            options: [{
                text: 'OpenVPN',
                value: 'OpenVPN'
            }]
        }, {
            xtype: 'container',
            defaults: {
                labelAlign: 'left',
                labelTextAlign: 'right'
            },
            hidden: true,
            bind: {
                hidden: '{interfaceType.value !== "OpenVPN"}'
            },
            items: [{
                xtype: 'textfield',
                name: 'name',
                label: 'Interface Name',
                required: true
            }, {
                xtype: 'checkbox',
                reference: 'wanCk',
                name: 'wan',
                label: 'Is WAN',
                allowNull: false
            }, {
                xtype: 'checkbox',
                name: 'nat',
                label: 'Enable NAT',
                allowNull: false,
                bind: {
                    checked: '{wanCk.checked ? true : false}',
                    disabled: '{wanCk.checked}'
                }
            }, {
                width: 400,
                html: "OpenVPN config file: <input id='inputFile' type='file' name='uploaded'/>"
            }]
        }]
    }],

    buttons: {
        ok: {
            text: 'Add',
            ui: 'action',
            handler: 'onSubmit'
        },
        cancel: {
            text: 'Cancel',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }
    },

    controller: {
        onSubmit: function () {
            var panel = this.getView().down('panel');

            // FIXME if (!panel.validate()) { return; }

            // FIXME - load settings? are they already loaded somewher?
            var settings = {};
            // FIXME - calculate lowest unused interfaceId > 0 (X)
            // FIXME - calculate lowest unused tun interface (tunY) (Y)

            var file = document.getElementById("inputFile").files[0];
            var reader = new FileReader();
            reader.onload = function () {
                console.log("Read file: " + file.name);
                console.log("Read file size: " + file.size);
                console.log("Read file type: " + file.type);
                console.log("Read file contents: " + reader.result);

                if (settings["files"] == null)
                    settings["files"] = [];

                var newfile = {};
                newfile["path"] = "/etc/config/openvpn-X.ovpn"; //FIXME calculate correct X
                newfile["encoding"] = "base64";
                newfile["operation"] = "restart-networking";
                newfile["contents"] = btoa(reader.result);

                // remove any prexisting file with same path
                for (var i = 0; i < settings["files"].length; i++) {
                    if (settings["files"][i]["path"] == newfile["path"])
                        settings["files"].splice(i, 1);
                }

                settings["files"].push(newfile);

                var newinterface = {};

                newinterface["configType"] = "ADDRESSED";
                newinterface["type"] = "OPENVPN";
                newinterface["device"] = "tunY"; // FIXME calculate correct Y
                newinterface["interfaceId"] = 1/*X*/; // FIXME calculate correct X
                newinterface["name"] = "name"; // FIXME use name specified in panel
                newinterface["wan"] = true; // FIXME use wan checkbox value
                newinterface["natEgress"] = true; // FIXME use nat checkbox value

                if (settings["interfaces"] == null)
                    settings["interfaces"] = [];
                settings["interfaces"].push(newinterface);

                console.log("New settings:");
                console.log("%j", settings);
                // FIXME save new settings settings
            };
            reader.readAsText(file);
        }
    }

});
