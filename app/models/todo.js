(function () {
    const DB = require('./../db');
    var Todo = {};
    Todo._db = null;
    Todo._name = 'todo';
    Todo._key = 'id';
    Todo.init = function(db){
        Todo._db = db;
    };
    Todo.makeNew = function(title, content, marked, tags){
        Todo._db.run("INSERT INTO " + Todo._name + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            null,
            title,
            content,
            Math.floor(Date.now() / 1000),
            Math.floor(Date.now() / 1000),
            0,
            0,
            marked,
            tags
        ]);
    };

    Todo.byId = function(id){
        return DB.getById(Todo._db, Todo._name, Todo._key, id);
    };

    Todo.select = function(stmt){
        return DB.selectByStmt(Todo._db, Todo._name, stmt);
    };
    module.exports = Todo;
}());