// 'use strict';

let menuController = require('./../../mysql/cms/menu.controller');

class MenuRouter {
    
    constructor() {
    }

    intRouter(app){
        app.route("/cms/menu/index")
            .get((a,b)=>menuController.getListMenu(a,b));
    }
};
module.exports = new MenuRouter();

