define(["qlik", "jquery",'ng!$q'], function(qlik, $, $q) {
    
        function isNotNull(obj) {
            return obj != "" && obj != null && obj != undefined;
        };
        
        //获取Sheet List
        var getSheetList = function () {
            var app = qlik.currApp();
            var defer = $q.defer();
            app.getAppObjectList( function ( data ) {
                var sheets = [];
                var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
                    return item.qData.rank;
                } );
                _.each( sortedData, function ( item ) {
                    sheets.push( {
                        value: item.qInfo.qId,
                        label: item.qMeta.title
                    } );
                } );
                return defer.resolve( sheets );
            } );
    
            return defer.promise;
        };
        
        //定义Action类型对象
        var actionList = {
            gotoSheet: "GotoSheet",
            CurrentSheet: "CurrentSheet",
            NoAction: "None"
        };
        
        var bindAction = {
            ref: "qsTable.action",
            label: "Navigation Action",
            type: "string",
            component: "dropdown",
            options: [{
                value: "None",
                label: "None"
            },{
                value: actionList.gotoSheet,
                label: "Go to a specific sheet"
            },{
                value: actionList.CurrentSheet,
                label: "Current Sheet"
            }],
            defaultValue: "None"
        };
        
        //定义导航选项，只有action为gotoSheet才显示
        var sheetList = {
            type: "string",
            component: "dropdown",
            label: "Select Sheet",
            ref: "qsTable.selectedSheet",
            options: function() {
                return getSheetList().then( function ( items ) {
                    return items;
                });
            },
            show: function ( data ) {
                return data.qsTable.action === actionList.gotoSheet;
            }
        };
        
        //color-picker
        var BorderColorPicker = {
            ref: "qsTable.borderColor",
            label: "Border color",
            type: "integer",
            component: "color-picker",
            defaultValue: 3
        };
        
        var FontColor = {
            ref: "qsTable.fontColor",
            label: "Font color",
            type: "string",
            defaultValue: "Black"
        };
        
        var borderSize = {
            type: "number",
            component: "slider",
            label: "Border Size",
            ref: "qsTable.borderSize",
            min: 1,
            max: 2,
            step: 0.1,
            defaultValue: 1
        };
        
        return {
            type: "items",
            //component: "expandable-items",
            items: {
                bindAction: bindAction,
                sheetList: sheetList
            }
        };
    });
    
    
    