(function () {
    const ipc = require('electron').ipcRenderer;
    window.App = {};
    window.App.closeWindow = function(){
        ipc.send('event-close-window');
    };
    window.App.closeModal = function(){
        ipc.send('event-close-modal');
    };
    window.App.minimizeWindow = function(){
        ipc.send('event-minimize-window');
    };
    window.App.showModalPage = function(name){
        ipc.send('event-show-modal', name);
    };
    window.App.loadRoute = function(name, args){
        return ipc.sendSync('route-' + name, args);
    };
    window.App.log = function(msg){
        return ipc.sendSync('log', msg);
    };
    return window.App;
}());