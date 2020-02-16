// 'use strict';


let  userController = require('./../mysql/user.controller');
let webController = require( './../mysql/website.controller');
class WebsiteRouter {
    constructor() {
    }
    intRouter(app){
        
    
        app.route("/web_init")
        .post((a,b)=>webController.GetWebInit(a,b));
        
         
        app.route("/web_info")
        .post((a,b)=>webController.GetWebInfo(a,b));     
    }
};
module.exports = new WebsiteRouter();

