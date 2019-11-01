Ext.define('Mfw.setup.step.Eula', {
    extend: 'Ext.Panel',
    alias: 'widget.step-eula',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    padding: '16 0 24 0',

    scrollable: true,

    viewModel: {
        data: {
            eulaLoaded: false
        }
    },

    items: [{
        xtype: 'container',
        width: 600,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'component',
            padding: '8 0',
            html: '<h1 style="text-align: center;">Untangle SD-WAN Router</h1><hr/>'
        }, {
            xtype: 'component',
            style: 'text-align: center;',
            html: '<p>To continue installing and using this software, you must agree to the terms of the software license agreement. Please review the whole license agreement by scrolling through to the end of the agreement.</p>'
        }, {
            xtype: 'container',
            style: 'background: #FFF; border-radius: 3px; border: 1px #EEE solid; line-height: 0;',
            html: '<iframe id="eula-src" style="border: none; width: 100%; height: 350px;"></iframe>',
            // mask container until eula content is loaded
            masked: {
                xtype: 'loadmask',
                message: 'Loading ...'
            },
            listeners: {
                painted: 'onPainted'
            }
        }, {
            xtype: 'component',
            style: 'text-align: center;',
            html: '<p>After installation, this license is available at <a style="color: blue;" href="https://www.untangle.com/legal" target="_blank">https://www.untangle.com/legal</a></p>'
        }, {
            xtype: 'container',
            margin: '8 0',
            layout: {
                type: 'hbox',
                pack: 'middle'
            },
            defaults: {
                xtype: 'button',
                margin: 8
            },
            hidden: true,
            bind: {
                hidden: '{!eulaLoaded || wizardStatus.completed || currentStepIndex > 1}'
            },
            items: [{
                text: 'Disagree',
                handler: 'onDisagree'
            }, {
                text: 'Agree',
                ui: 'action',
                handler: 'onContinue'
            }]
        }]
    }],

    controller: {
        /**
         * check connection on painted event to make sure that iframe was rendered
         * and found in DOM (is not null)
         * online check consists in trying to load a small image form a known reliable location
         * on success load remote EULA
         * otherwise fallback on local EULA
         */
        onPainted: function (cmp) {
            var vm = this.getViewModel(),
                remoteEulaSrc = 'https://www.untangle.com/legal',
                localEulaSrc = '/setup/eula.html',
                iframe = document.getElementById('eula-src'),
                img = new Image(0,0); // 0 width and height

            // if eula already loaded no connection check required
            if (iframe.src) {
                vm.set('eulaLoaded', true);
                return;
            }

            // todo: find a better image url to test
            img.src = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png';

            img.addEventListener('load', function () {
                iframe.src = remoteEulaSrc;
            });
            img.addEventListener('error', function () {
                iframe.src = localEulaSrc;
            });

            // unmask eula container, remove image and show agreement buttons after license content loaded
            iframe.addEventListener('load', function () {
                img.parentNode.removeChild(img);
                cmp.unmask();
                vm.set('eulaLoaded', true);
            });
            // append the test image wich will trigger the load/error events
            document.body.appendChild(img);
        },

        onContinue: function () {
            this.getView().up('setup-wizard').getController().updateWizard();
        },

        // called from EULA step
        onDisagree: function () {
            Mfw.app.redirectTo('welcome');
        }

    }
});
