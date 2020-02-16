// 'use strict';


let  transactionController = require('./../mysql/transaction.controller');

class TransactionRouter {
    constructor() {
    }
    intRouter(app){
        
        app.route("/add_money_my_currency")
        .post((a,b)=>transactionController.AddMoneyForMyCurrency(a,b));
        app.route("/add_money_my_currency_verify")
        .post((a,b)=>transactionController.VerifyAddMoneyForMyCurrency(a,b));


        app.route("/send_money")
        .post((a,b)=>transactionController.SendMoney(a,b));
        app.route("/send_money_verify")
        .post((a,b)=>transactionController.VerifySendMoney(a,b));

        app.route("/transaction_history")
        .post((a,b)=>transactionController.TransactionHistory(a,b));

        app.route("/callback_whypay_haipc1109")
        .get((a,b)=>transactionController.CallbackWhypay(a,b));

        app.route("/get_payment_session")
        .post((a,b)=>transactionController.PaymentSession(a,b));
        app.route("/get_list_currency")
        .post((a,b)=>transactionController.GetListCurrency(a,b));

    
    }
};
module.exports = new TransactionRouter();

