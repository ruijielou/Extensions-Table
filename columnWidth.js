define([], function() {
    
        function isNotNull(str) {
            if(str === null || str === '' || str === undefined || str === 0) {
                return false;
            } 
            return true;
        }
        
        var columnWidth ={
            type: "array",
            ref: "SgmTableStyle",
            label: "List Items",
            itemTitleRef: "columnType",
            allowAdd: true,
            allowRemove: true,
            label: "第几列",
            addTranslation: "Add Item",
            items: {
                string: {
                    label:"指定类型",
                    ref: "columnType",
                    component: "string",
                    defaultValue: ''
                },
                name: {
                    label:"指定字段名",
                    ref: "columnName",
                    component: "string",
                    defaultValue: ''
                },
                color1: {
                    label:"背景颜色",
                    ref: "columnColor",
                    component: "string",
                    defaultValue: ''
                },
                color2: {
                    label:"字体颜色",
                    ref: "columnFontColor",
                    component: "string",
                    defaultValue: ''
                }
            }
        };
        
        return {
            type: "items",
            //component: "expandable-items",
            items: {
                columnWidth:columnWidth
            }
        };
    });
    
    
    
    
    