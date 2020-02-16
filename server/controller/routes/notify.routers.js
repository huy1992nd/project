'use strict';
let notifyController = require('./../mysql/log.controller');

class NotifyRouter {
    constructor() {
      
    }
    intRouter(app){
        
        app.route('/notify_history')
        .post(notifyController.NotifyHistory);

    }
};
module.exports = new NotifyRouter();