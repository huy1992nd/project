'use strict';
let WebController = require('../mysql/web.controller');
class WebRouter {
    constructor() {
        
    }
    intRouter(app) {
        app.route('/add_web')
            .post((a, b) => WebController.AddWeb(a, b));

        app.route('/update_web')
            .post((a, b) => WebController.UpdateWeb(a, b));

        app.route('/delete_web')
            .post((a, b) => WebController.DeleteWeb(a, b));

        app.route('/list_web')
            .post((a, b) => WebController.ListWeb(a, b));

    }
};
module.exports = new WebRouter();