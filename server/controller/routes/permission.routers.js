// 'use strict';


let  permissionController = require('./../mysql/permission.controller');

let transactionController = require('./../mysql/transaction.controller')
class PermissionRouter {
    constructor() {
    }
    intRouter(app){
        
        app.route('/list_module')
        .post((a,b)=>permissionController.ListModule(a,b));
        
        app.route('/create_roles')
        .post((a,b)=>permissionController.CreateRoles(a,b));

        app.route('/list_roles')
        .post((a,b)=>permissionController.listRoles(a,b));

        app.route('/remove_roles')
        .post((a,b)=>permissionController.RemoveRoles(a,b));

        app.route('/update_roles')
        .post((a,b)=>permissionController.UpdateRoles(a,b));

        app.route('/add_permission')
        .post((a,b)=>permissionController.CreatePermission(a,b));

        app.route('/update_permissions')
        .post((a,b)=>permissionController.UpdatePermission(a,b));
       
        app.route('/remove_permissions')
        .post((a,b)=>permissionController.RemovePermission(a,b));
        
        app.route('/permission_by_account')
        .post((a,b)=>permissionController.GetPermissionByAccount(a,b));

        app.route('/permission_by_role')
        .post((a,b)=>permissionController.GetPermissionByRole(a,b));

        app.route('/list_permissions')
        .post((a,b)=>permissionController.ListPermission(a,b));

        app.route('/list_user_by_permissions')
        .post((a,b)=>permissionController.ListUserByPermission(a,b));
        
        app.route('/update_roles_permission')
        .post((a,b)=>permissionController.UpdatePermissionForRole(a,b));
      
        app.route('/update_user_permission')
        .post((a,b)=>permissionController.UpdatePermissionForUser(a,b));
        
    }
};
module.exports = new PermissionRouter();

