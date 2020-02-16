// 'use strict';

let menuNodeController = require('./../../mysql/cms/menunode.controller');

class MenuRouter {
    
    constructor() {
    }

    intRouter(app){
        app.route("/cms/menunode/index")
            .get((a,b)=>menuNodeController.getListMenuNode(a,b));

        app.route("/cms/menunode/create")
            .post((a,b) => menuNodeController.postCreateMenuNode(a, b));
        
    }
};
module.exports = new MenuRouter();
