// 'use strict';


let  userController = require('./../mysql/user.controller');
let  userMongoController = require('./../mongo/user_controller');
const passport = require('passport');
var passportConfig = require('../../lib/passport');
passportConfig();
var passportGoogleConfig = require('../../lib/passport_google');
passportGoogleConfig();
let {KeyJwt} = require('./../../define');

var jwt = require('jsonwebtoken');

var createToken = function(user) {
    return jwt.sign(
        { 
            account_id: user.id,
            key: "", 
            site: "", 
            permission: null,
            Date: Date.now() 
        },
        KeyJwt
    )
  };
  
  var generateToken = function (req, res, next) {
    req.token = createToken(req.user);
    next();
  };
  
  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send({
        result_code: 0,
        token: req.token,
        user: req.user
    });
  };

class UserRouter {
    constructor() {
    }
    intRouter(app){
        
        app.route('/user_login')
        .post((a,b)=>userController.Login(a,b));

        app.route('/register_face')
        .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
            if (!req.user) {
              return res.send(401, 'User Not Authenticated');
            }
            next();
          }, generateToken, sendToken);

        app.route('/register_google')
        .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
            if (!req.user) {
              return res.send(401, 'User Not Authenticated');
            }
            next();
          }, generateToken, sendToken);

        app.route('/login_face')
        .post((a,b)=>userMongoController.LoginFace(a,b));

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

