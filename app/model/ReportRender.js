Ext.define('Mfw.model.ReportRender', {
    extend: 'Ext.data.Model',
    alias: 'model.report_render',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'units', type: 'string' },
        { name: 'colors', type: 'auto' },
        { name: 'pieNumSlices', type: 'integer' },
        { name: 'pieStyle', type: 'string' }, // ["PIE","PIE_3D","DONUT","DONUT_3D","COLUMN","COLUMN_3D"]
        { name: 'textString', type: 'string' },
        { name: 'timeStyle', type: 'string' }, // ["BAR","BAR_OVERLAPPED","BAR_STACKED","LINE","AREA","AREA_STACKED"]
        { name: 'approximation', type: 'string' }, // ["average", "open", "high", "low", "close", "sum"],

        {
            name: '_icon',
            calculate: function (rendering) {
                var icon;
                if (rendering.pieStyle === 'COLUMN' || rendering.pieStyle === 'COLUMN_3D') {
                    icon = 'fa-bar-chart';
                } else {
                    if (rendering.pieStyle === 'PIE' || rendering.pieStyle === 'PIE_3D' || rendering.pieStyle === 'DONUT' || rendering.pieStyle === 'DONUT_3D') {
                        icon = 'fa-pie-chart';
                    }
                }

                if (!rendering.timeStyle) { return icon; }
                if (rendering.timeStyle.indexOf('BAR') >= 0) {
                    icon = 'fa-bar-chart';
                } else {
                    if (rendering.timeStyle.indexOf('AREA') >= 0) {
                        icon = 'fa-area-chart';
                    }
                }
                return icon;
            }
        }
    ]
});
