(function () {
    var Helper = {};
    Helper.objToArr = function(obj){
        var arr = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "function")
                    continue;
                if (typeof obj[key] === "string" || typeof obj[key] === "object"){
                    arr.push(key + "='" + obj[key] + "'");
                }else if (typeof obj[key] === "boolean"){
                    arr.push(key + '=' + Helper.boolToInt(obj[key]));
                }else{
                    arr.push(key + '=' + obj[key]);
                }
            }
        };
        return arr;
    };
    Helper.boolToInt = function(bool){
        if (bool)
            return 1;
        return 0;
    };
    Helper.getValueByKey = function(key, arr){
        for (i = 0; i < arr.length; i++){
            _key = arr[i];
            console.log(_key);
            if (_key.split('=')[0] == key){
                return _key.split('=')[1];
            }
        }
        return null;
    };
    module.exports = Helper;
}());