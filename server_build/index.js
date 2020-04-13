require('./lib/prototype.custom');
var monitor_define = require('./define');
var apiController = require('./controller/api.controller');
require('events').EventEmitter.prototype._maxListeners = 100;
global.define = monitor_define;
startService = function() {
    apiController.Init();
}
startService();
