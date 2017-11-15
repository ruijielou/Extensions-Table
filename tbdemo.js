/*globals define*/
define(["qlik", "jquery", "./dataTables", "./fixedColumns", "./iscroll", "css!./bootstrap.css", "css!./style.css"], function(qlik, $, DataTables, FixedColumns, iscroll) {
    'use strict';
    var tablsInit = null;
    var initHeight = 0;
    var initWidth = 0;

    function createRows(rows, dimensionInfo) {
        var html = "";

        rows.forEach(function(row, index) {
            if (index % 2 == 0) {
                html += '<tr class="active">';
            } else {
                html += '<tr>';
            }

            row.forEach(function(cell, key) {
                if (cell.qIsOtherCell) {
                    cell.qText = dimensionInfo[key].othersLabel;
                }
                html += "<td ";
                if (!isNaN(cell.qNum)) {
                    html += "class='numeric'";
                }
                html += '>' + cell.qText + '</td>';
            });
            html += '</tr>';
        });
        return html;
    }

    return {
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 20,
                    qHeight: 50
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1,
                    max: 20,
                    items: { "groupStandard": { "type": "items", "label": "amGraph Settings", "items": { "waterfallStart": { "type": "string", "label": "列名", "ref": "qDef.cellTitle", "expression": "always", "defaultValue": "" } } } }
                },
                measures: {
                    uses: "measures",
                    min: 0,
                    items: { "groupStandard": { "type": "items", "label": "amGraph Settings", "items": { "waterfallStart": { "type": "string", "label": "列名", "ref": "qDef.cellTitle", "expression": "always", "defaultValue": "" } } } }
                },
                sorting: {
                    uses: "sorting"
                },
                settings: {
                    uses: "settings"
                },
                layout1: {
                    type: "items",
                    label: "固定列",
                    items: {
                    changeFixedCloumns: {
                        type: "string",
                        component: "dropdown",
                        label: "选择左侧固定列数",
                        ref: "fiexedCloumnsNmuber",
                        options: [{
                            value: "1",
                            label: "1"
                        }, {
                            value: "2",
                            label: "2"
                        }],
                        defaultValue: "1"
                    }
                }
                },
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint: function($element, layout) {

            var fiexedCloumnsNmuber = layout.fiexedCloumnsNmuber;

            var id = 'table' + Math.ceil(Math.random() * 100000);

            var html = "<div id='table-wrapper-box'><table class='table table-bordered browser-table table-striped' id='" + id + "'><thead><tr class='gradeX'>",
                self = this,

                hypercube = layout.qHyperCube,
                rowcount = hypercube.qDataPages[0].qMatrix.length,
                colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length;
            //render titles
            hypercube.qDimensionInfo.forEach(function(cell) {

                //qDef.CellTitle
                var _TitleValue = cell.cellTitle != null && cell.cellTitle != "" ? cell.cellTitle : cell.qFallbackTitle
                html += '<th><div class="padding-th">' + _TitleValue + '</div></th>';
            });
            hypercube.qMeasureInfo.forEach(function(cell) {
                var _TitleValue = cell.cellTitle != null && cell.cellTitle != "" ? cell.cellTitle : cell.qFallbackTitle
                html += '<th><div class="padding-th">' + _TitleValue + '</div></th>';
            });
            html += "</tr></thead><tbody></div>";
            //render data
            html += createRows(hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo);
            html += "</tbody></table></div>";

            $element.html(html);


            var ele = $element.find("#table-wrapper-box");
            var tableHeight = $('#table-wrapper-box').height();
            var tableWidth = $('#table-wrapper-box').width();

            // $.extend($.fn.dataTable.defaults, {
            //     searching: false, //禁止搜索
            //     ordering: false //禁止排序
            // });

            tablsInit = ele.find('#' + id).on('order.dt',
                function() {
                    // megre();
                }).DataTable({
                "bInfo" : false,
                searching: false, //禁止搜索
                ordering: false, //禁止排序
                scrollY: (tableHeight - 50) + 'px',
                scrollX: '100%',
                responsive: true,
                paging: false, //禁止分页
                fixedColumns: { //需要第一列不滚动就设置1
                    leftColumns: 3
                },
                "initComplete": function() {

                },
                "fnDrawCallback": function(oSettings) {
                    // megre();
                },
                "fnStateLoad": function(oSettings) {
                    // console.log('fnstatatatat')
                }

            });

            megre();

            function megre() {
                /*$('.DTFC_LeftBodyLiner tr').each(function() {
                    var str1 = $(this).find('td').eq(0).html();
                    var str2 = $(this).find('td').eq(1).html();
                    if (str1 == str2) {
                        $(this).find('td').eq(0).attr('colspan', '2');
                        $(this).find('td').eq(0).addClass('text-center');
                        $(this).find('td').eq(1).remove();
                    }
                });*/
                $('.DTFC_LeftBodyLiner tr').each(function(index, ele) {
                    var str1 = $(this).find('td[data-dt-column="0"]').html();
                    var that = this;
                    var i = 1;
                    $('.DTFC_LeftBodyLiner tr').each(function(innerIdex, innerEle) {
                        var innerStr = $(this).find('td[data-dt-column="0"]').html();
                        if (index !== innerIdex && str1 == innerStr) {

                            $(this).find('td[data-dt-column="0"]').remove();
                            i++
                            $(that).find('td[data-dt-column="0"]').attr('rowspan', i)
                        }
                    })
                });
            }

            // function megre() {
            //     $('.DTFC_LeftBodyLiner tr').each(function() {
            //         var str1 = $(this).find('td').eq(0).html();
            //         var str2 = $(this).find('td').eq(1).html();
            //         if (str1 == str2) {
            //             $(this).find('td').eq(0).attr('colspan', '2');
            //             $(this).find('td').eq(0).addClass('text-center');
            //             $(this).find('td').eq(1).remove();
            //         }
            //     });
            //     $('.DTFC_LeftBodyLiner tr').each(function(index, ele) {
            //         var str1 = $(this).find('td').html();
            //         var that = this;
            //         var i = 1;
            //         $('.DTFC_LeftBodyLiner tr').each(function(innerIdex, innerEle) {
            //             var innerStr = $(this).find('td').html();
            //             if (index !== innerIdex && str1 == innerStr) {
            //                 $(this).find('td').remove();
            //                 i++
            //                 $(that).find('td').attr('rowspan', i)
            //             }
            //         })
            //     })
            // }
            return qlik.Promise.resolve();
        }
    };
});
