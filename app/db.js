(function () {
    var DB = {};
    const fs = require('fs');
    const path = require('path');
    require('sql.js');
    const Helper = require('./helper/helper');
    DB.exists = function(name){
        return fs.existsSync(DB.pathByName(name));
    };

    DB.pathByName = function(name){
        return path.join(__dirname, '../asset/db/' + name);
    };
    DB.open = function(name){
        var db = null;
        var _path = DB.pathByName(name);
        if (!DB.exists(name)){
            scheme = fs.readFileSync(path.join(__dirname, '../confs/db/scheme.sql'), 'utf-8');
            db = new SQL.Database();
            db.run(scheme);
            var data = db.export();
            var buffer = new Buffer(data);
            fs.writeFileSync(_path, buffer);
        }else{
            var filebuffer = fs.readFileSync(_path);
            db = new SQL.Database(filebuffer);
        }
        db._run = db.run;
        db.__name = name;
        db.run = function (a, b) {
            result = this._run(a, b);
            DB.save(this.__name, this);
            return result;
        }
        return db;
    };
    DB.save = function(name, db){
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFileSync(DB.pathByName(name), buffer);
    };
    DB.updateByObj = function(db, table, obj, _key){
        arr = Helper.objToArr(obj);
        key = Helper.getValueByKey(_key, arr);
        arr = arr.join(',');
        db.run(
            "UPDATE " + table
            + " SET " + arr
            + " WHERE " + _key + " = " + key
        );
    };
    DB.getById = function(db, table, key, id){
        var stmt = db.prepare("SELECT * FROM " + table + " where " + key + " = $id");
        stmt = stmt.getAsObject({$id : id});
        stmt.update = function(){
            DB.updateByObj(db, table, this, key);
        };
        return stmt;
    };
    DB.selectByStmt = function(db, table, stmt){
        stmt = db.prepare("SELECT * FROM " + table + " WHERE " + stmt);
        var result = [];
        while(stmt.step()) {
            var row = stmt.getAsObject();
            result.push(row);
        }
        return result;
    };
    module.exports = DB;
}());