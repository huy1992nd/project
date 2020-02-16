// 'use strict';


let  orderController = require('./../mysql/order.controller');

class OrderRouter {
    constructor() {
    }
    intRouter(app){
        
        app.route("/order_a_product")
        .post((a,b)=>orderController.CreateOrder(a,b));


        

        app.route("/retailer_order_a_product")
        .post((a,b)=>orderController.OrderFromRetailer(a,b));
        
        app.route("/order_history")
        .post((a,b)=>orderController.OrderListHistory(a,b));
        app.route("/order_info")
        .post((a,b)=>orderController.OrderDetailsInfo(a,b));
        app.route("/order_info_history")
        .post((a,b)=>orderController.OrderInfoHistory(a,b));

        app.route("/order")
        .post((a,b)=>orderController.Order(a,b));
        app.route("/list_order")
        .post((a,b)=>orderController.ListOrder(a,b));

        app.route('./extend_customer')
        .post((a,b)=>orderController.ExtendCustomer(a,b));

        app.route('./remove_customer')
        .post((a,b)=>orderController.RemoveCustomer(a,b));
        app.route("/update_order")
        .post((a,b)=>orderController.UpdateOrder(a,b));

        
        


    }
};
module.exports = new OrderRouter();

