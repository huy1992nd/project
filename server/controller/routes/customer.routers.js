// 'use strict';
let customerController = require('./../mysql/customter.controller');
class CustomerRouter {
    constructor() {
    }
    
    intRouter(app) {

        app.route("/customer_register")
            .post((a, b) => customerController.Register(a, b));

        app.route("/customer_create_new")
            .post((a,b)=>customerController.CreateNewCustomer(a,b));

        app.route("/customer_list")
            .post((a,b)=>customerController.ListAllCustomer(a,b));

        app.route("/customer_block")
            .post((a,b)=>customerController.BlockCustomer(a,b));

        app.route("/customer_get_profile")
            .post((a, b) => customerController.GetProfile(a, b));

        app.route("/customer_active")
            .post(customerController.ActiveCustomer);

        app.route("/customer_update_profile")
            .post((a, b) => customerController.UpdateProfile(a, b));

        app.route("/customer_update_password")
            .post((a, b) => customerController.UpdatePassword(a, b));

        app.route("/customer_reset_password")
            .post((a, b) => customerController.ResetCustomerPassword(a, b));

    }
};
module.exports = new CustomerRouter();

