
/*globals define*/
define(["qlik", "jquery",
'ng!$q',
"./lib/dataTables",
"./lib/fixedColumns",
"./lib/iscroll",
"./addScreen",
"css!./lib/bootstrap.css",
"css!./lib/fixedTable.css",
"css!./style.css"
],
function(qlik, $, $q, DataTables, FixedColumns, iscroll, addScreen) {
'use strict';
var tablsInit = null;
var initHeight = 0;
var initWidth = 0;

function createRows(rows, dimensionInfo, qMeasureInfo, sgmTableStyle) {

    var html = "";

    rows.forEach(function(row, index) {
        if (index % 2 == 0) {
            html += '<tr class="active">';
        } else {
            html += '<tr>';
        }
        //if (dimensionInfo.length <= 2) {
            row.forEach(function(cell, key) {
                if (cell.qIsOtherCell) {
                    cell.qText = dimensionInfo[key].othersLabel;
                }
                if(sgmTableStyle.length !=0){
                    for(var key in sgmTableStyle) {
                     for(var keys in dimensionInfo) {
                         if(sgmTableStyle[key].columnType == dimensionInfo[keys].qFallbackTitle) {

                             if(sgmTableStyle[key].columnName == cell.qText){
                                 html += "<td data-color='"+sgmTableStyle[key].columnColor+"'" ;
                                 html += "data-font-color='"+sgmTableStyle[key].columnFontColor+"'" ;
                                 // html += "style='background:"+ sgmTableStyle[key].columnColor+"'";
                                 if (!isNaN(cell.qNum)) {
                                     html += "class='numeric'";
                                 }
                             }
                         }else {
                             html += "<td ";
                             if (!isNaN(cell.qNum)) {
                                 html += "class='numeric'";
                             }
                         }
                     }
                     for(var keys in qMeasureInfo) {
                             console.log(sgmTableStyle[key].columnType);
                            console.log(qMeasureInfo[keys].qFallbackTitle);
                         if(qMeasureInfo[keys].qFallbackTitle.indexOf(sgmTableStyle[key].columnType) != -1) {
                         
                             if(sgmTableStyle[key].columnName == cell.qText){
                                 html += "<td data-color='"+sgmTableStyle[key].columnColor+"'" ;
                                 html += "data-font-color='"+sgmTableStyle[key].columnFontColor+"'" ;
                                 // html += "style='background:"+ sgmTableStyle[key].columnColor+"'";
                                 if (!isNaN(cell.qNum)) {
                                     html += "class='numeric'";
                                 }
                             }
                         }else {
                             html += "<td ";
                             if (!isNaN(cell.qNum)) {
                                 html += "class='numeric'";
                             }
                         }
                     }
                }
                }else{
                    html += "<td ";
                             if (!isNaN(cell.qNum)) {
                                 html += "class='numeric'";
                             }
                }
                 
                //html += "<td ";
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
                label: "表格配置",
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
                    },
                    addLeftColor: {
                        label: "背景颜色",
                        ref: "fixedLeftColor",
                        component: "string",
                        defaultValue: 'rgb(52, 90, 167)'
                    },
                    addLeftFontColor: {
                        label: "字体颜色",
                        ref: "fixedLeftFontColor",
                        component: "string",
                        defaultValue: '#FFF'
                    }
                }

            },
            layout2: {
                type: "items",
                label: "添加筛选行颜色",
                items: {
                    addScreen: addScreen
                }
            }

        }
    },
    snapshot: {
        canTakeSnapshot: true
    },
    paint: function($element, layout) {

        var fiexedCloumnsNmuber = layout.fiexedCloumnsNmuber;

        var fixedLeftColor = layout.fixedLeftColor;
        var sgmTableStyle = layout.SgmTableStyle;
        var fixedLeftFontColor = layout.fixedLeftFontColor;

        var id = 'table' + Math.ceil(Math.random() * 100000);

        var html = "<div id='table-wrapper-box'><table class='table table-bordered table-striped' id='" + id + "'><thead><tr class='gradeX'>",
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
        html += createRows(hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo, hypercube.qMeasureInfo, sgmTableStyle);
        html += "</tbody></table></div>";

        $element.html(html);
        var changeList = $('[data-color]');
        changeList.each(function() {
                var parent = $(this).parent();
                var colors = $(this).attr('data-color');
                var fontColor = $(this).attr('data-font-color');
                parent.find('td').css({ 'background': colors, 'color': fontColor });
            })
            // var color = $('[data-color]').eq(0).attr('data-color');
            // parentList.find('td').css('background', color)

        var ele = $element.find("#table-wrapper-box");
        var tableHeight = $('#table-wrapper-box').height();
        var tableWidth = $('#table-wrapper-box').width();

        tablsInit = ele.find('#' + id).on('order.dt',
            function() {
                // megre();
            }).DataTable({
            bInfo: false,
            searching: false, //禁止搜索
            ordering: false, //禁止排序
            scrollY: (tableHeight - 50) + 'px',
            scrollX: '100%',
            responsive: true,
            paging: false, //禁止分页
            fixedColumns: { //设置固定列数
                leftColumns: fiexedCloumnsNmuber
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
            $('.DTFC_LeftBodyLiner td').css({ 'background': fixedLeftColor, "color": fixedLeftFontColor });
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

        return qlik.Promise.resolve();
    }
};
});