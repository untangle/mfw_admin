Ext.define('Mfw.model.ReportRender', {
    extend: 'Ext.data.Model',
    alias: 'model.report_render',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type', type: 'string' },
        { name: 'colors', type: 'auto' },
        { name: 'lineWidth', type: 'number', defaultValue: 2 },
        { name: 'borderWidth', type: 'number', defaultValue: 1 },
        { name: 'areaOpacity', type: 'number', defaultValue: 0.7 },
        { name: 'stacking', type: 'string', defaultValue: 'none' }, // normal, percent
        { name: 'dashStyle', type: 'string', defaultValue: 'Solid' },

        { name: 'dataGroupingEnabled', type: 'boolean', defaultValue: true }, // ["average", "open", "high", "low", "close", "sum"],
        { name: 'approximation', type: 'string', defaultValue: 'sum' }, // ["average", "open", "high", "low", "close", "sum"],
        { name: 'groupPixelWidth', type: 'integer', defaultValue: 10 },

        { name: 'donutInnerSize', type: 'number', defaultValue: 0 }, // percent
        { name: '3dEnabled', type: 'boolean', defaultValue: false },
        { name: '3dAlpha', type: 'integer', defaultValue: 45 },
        { name: '3dBeta', type: 'integer', defaultValue: 0 },
        { name: '3dDepth', type: 'integer', defaultValue: 40 }

        // { name: 'units', type: 'string' },
        // { name: 'colors', type: 'auto' },
        // { name: 'pieNumSlices', type: 'integer' },
        // { name: 'pieStyle', type: 'string' }, // ["PIE","PIE_3D","DONUT","DONUT_3D","COLUMN","COLUMN_3D"]
        // { name: 'textString', type: 'string' },
        // { name: 'timeStyle', type: 'string' }, // ["BAR","BAR_OVERLAPPED","BAR_STACKED","LINE","AREA","AREA_STACKED"]


        // {
        //     name: '_icon',
        //     calculate: function (rendering) {
        //         var icon;
        //         if (rendering.pieStyle === 'COLUMN' || rendering.pieStyle === 'COLUMN_3D') {
        //             icon = 'fa-bar-chart';
        //         } else {
        //             if (rendering.pieStyle === 'PIE' || rendering.pieStyle === 'PIE_3D' || rendering.pieStyle === 'DONUT' || rendering.pieStyle === 'DONUT_3D') {
        //                 icon = 'fa-pie-chart';
        //             }
        //         }

        //         if (!rendering.timeStyle) { return icon; }
        //         if (rendering.timeStyle.indexOf('BAR') >= 0) {
        //             icon = 'fa-bar-chart';
        //         } else {
        //             if (rendering.timeStyle.indexOf('AREA') >= 0) {
        //                 icon = 'fa-area-chart';
        //             }
        //         }
        //         return icon;
        //     }
        // }
    ]
});
