require('./lib/prototype.custom');
var monitor_define = require('./define');
var apiController = require('./controller/api.controller');
require('events').EventEmitter.prototype._maxListeners = 100;
var socketService = require('./controller/socket/socket.service');
var {qlog,log} = require('./lib/log');
//api

//socket.io
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
global.define = monitor_define;
startService = function() {
 
    apiController.Init();

}

startService();
