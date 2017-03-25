const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const DB = require('./app/db');
const Todo = require('./app/models/todo');
const notifier = require('node-notifier');
// Init app
const mainDb = DB.open('main.db');
Todo._db = mainDb;

var win, modal;

function createWindow () {
    win = new BrowserWindow({width: 400, height: 500, icon: path.join(__dirname, 'asset/ico.png'), frame: false});
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //win.webContents.openDevTools();
    win.on('closed', () => {
        win = null
    });
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});


ipcMain.on('event-close-window', function () {

    if (win != null){
       win.close();
   }
});



ipcMain.on('event-minimize-window', function () {
    if (win != null){
        win.minimize();
    }
});



ipcMain.on('event-show-modal', function (event, name) {
    switch (name){
        case 'info':
            modal = new BrowserWindow({parent: win, modal: true, show: false, transparent: true, frame: false, width: 500, height: 200});
            modal.loadURL(url.format({
                pathname: path.join(__dirname, 'views/modal/info.html'),
                protocol: 'file:',
                slashes: true
            }));
            modal.once('ready-to-show', function () {
                modal.show();
            });
            break;
    }
});


ipcMain.on('event-close-modal', function(){
   if (modal != null){
       modal.close();
       modal =  null;
   }
   win.webContents.send('event-close-modal');
});



ipcMain.on('route-getMarkedTodoList', function(event){
    event.returnValue = JSON.stringify(Todo.select('marked = 1 AND status != 2'));
});

ipcMain.on('route-getUnFinishedTodo', function(event){
    event.returnValue = JSON.stringify(Todo.select('status != 2'));
});

ipcMain.on('route-getFinishedTodo', function(event){
    event.returnValue = JSON.stringify(Todo.select('status = 2'));
});



ipcMain.on('route-makeNewTODO', function (event, args) {
    args = JSON.parse(args);
    Todo.makeNew(args.title, args.content, args.marked, []);
    event.returnValue = 1;
    console.log('New TODO (' + args.title + ' => ' + args.content + ') created!');
    notifier.notify({
        'title': 'Mphj TODO',
        'message': 'TODO has created!',
        'icon': path.join(__dirname, 'asset/ico.png')
    });
});


ipcMain.on('route-templates', function (event, args) {
    event.returnValue = fs.readFileSync(path.join(__dirname, args), "utf-8");
});


ipcMain.on('route-openTODOModal', function(event, args){
    modal = new BrowserWindow({parent: win, modal: true, show: false, transparent: true, frame: false, width: 500, height: 315});
    modal.loadURL(url.format({
        pathname: path.join(__dirname, 'views/modal/todo.html'),
        protocol: 'file:',
        slashes: true
    }));
    modal.once('ready-to-show', function () {
        modal.show();
    });
    var todoItem = Todo.byId(args);
    modal.webContents.on('did-finish-load', function(){
        modal.webContents.send('todo-set', JSON.stringify(todoItem));
    });
    event.returnValue = 1;
});


ipcMain.on('route-changeTODO', function (event, data) {
    data = JSON.parse(data);
    todo_item = Todo.byId(data.id);
    todo_item.title = data.title;
    todo_item.content = data.content;
    todo_item.marked = data.marked;
    todo_item.updated_at = Math.floor(Date.now() / 1000);
    todo_item.progress = data.progress;
    if (todo_item.progress == 0){
        todo_item.status = 0;
    }else if (todo_item.progress == 100){
        todo_item.status = 2;
    }else{
        todo_item.status = 1;
    }
    todo_item.update();
    event.returnValue = 1;
    notifier.notify({
        'title': 'Mphj TODO',
        'message': 'TODO has changed!',
        'icon': path.join(__dirname, 'asset/ico.png')
    });
});



ipcMain.on('route-deleteTODO', function (event, data) {
    todo_item = Todo.byId(data);
    todo_item.delete();
    event.returnValue = 1;
    notifier.notify({
        'title': 'Mphj TODO',
        'message': 'TODO has deleted!',
        'icon': path.join(__dirname, 'asset/ico.png')
    });
});


ipcMain.on('log', function(event, log){
    console.log(log);
    event.returnValue = 1;
});




