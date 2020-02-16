// 'use strict';


let  userController = require('./../mysql/user.controller');
let verifyController = require( './../verify.controller');
let transactionController = require('./../mysql/transaction.controller')
class UserRouter {
    constructor() {
    }
    intRouter(app){
        
        app.route('/user_login')
        .post((a,b)=>userController.Login(a,b));

        app.route('/user_register')
        .post((a,b)=>userController.Register(a,b));
             
        app.route("/user_create_new")
        .post((a,b)=>userController.CreateNewUser(a,b));

        app.route("/user_list")
        .post((a,b)=>userController.ListAllUser(a,b));
              
        app.route("/user_block")
        .post((a,b)=>userController.BlockUser(a,b));
     
        app.route("/user_get_profile")
        .post((a,b)=>userController.GetProfile(a,b));

        app.route("/user_active")
        .post((a,b)=>userController.ActiveUser(a,b));

        app.route("/user_update_profile")
        .post((a,b)=>userController.UpdateUserProfile(a,b));

        app.route("/user_update_password")
        .post((a,b)=>userController.UpdatePassword(a,b));
        
        app.route("/user_reset_password")
        .post((a,b)=>userController.ResetUserPassword(a,b));

        app.route("/user_update_profile")
        .post((a,b)=>userController.UpdateUserProfile(a,b));

    }
};
module.exports = new UserRouter();

