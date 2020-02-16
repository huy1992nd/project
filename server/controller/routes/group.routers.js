'use strict';
let  groupController = require('./../mysql/group.controller');
class GroupRouter {
    constructor() {
    }
    intRouter(app){
        
    app.route('/list_my_group')
    .post((a,b)=>groupController.ListMyGroup(a,b));
    
    app.route('/list_user_group')
    .post((a,b)=>groupController.ListUsersOfGroup(a,b));
    
    app.route('/list_product_group')
    .post((a,b)=>groupController.ListProductsOfGroup(a,b));

    app.route('/update_product_group')
    .post((a,b)=>groupController.UpdateProductsGroup(a,b));
    
    app.route('/remove_product_group')
    .post((a,b)=>groupController.RemoveProducts(a,b));
    
    app.route('/insert_product_group')
    .post((a,b)=>groupController.InsertProductsGroup(a,b));
    app.route('/create_group')
    .post((a,b)=>groupController.CreateGroup(a,b));

    app.route('/add_member')
    .post((a,b)=>groupController.AddMemberGroup(a,b));

    app.route('/remove_member')
    .post((a,b)=>groupController.RemoveMember(a,b));
    app.route('/remove_group')
    .post((a,b)=>groupController.RemoveGroup(a,b));

    app.route('/list_group_ctv_joined')
    .post((a,b)=>groupController.ListGroupCTVJoined(a,b));

    app.route('/block_my_group')
    .post((a,b)=>groupController.BlockGroup(a,b));

    app.route('/active_my_group')
    .post((a,b)=>groupController.ActiveGroup(a,b));

    }

    

};
module.exports = new GroupRouter();