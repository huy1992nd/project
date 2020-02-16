'use strict';
let BankController = require('../mysql/bank.controller');
class SiteRouter {
    constructor() {
    }
    intRouter(app) {

        app.route('/add_bank')
            .post((a, b) => BankController.AddBank(a, b));

        app.route('/update_bank')
            .post((a, b) => BankController.UpdateBank(a, b));

        app.route('/delete_bank')
            .post((a, b) => BankController.DeleteBank(a, b));

        app.route('/list_bank')
            .post((a, b) => BankController.ListBank(a, b));

        app.route('/list_bank_site')
            .post((a, b) => BankController.ListBankSite(a, b));

        app.route('/list_bank_suggest')
            .post((a, b) => BankController.ListBankSuggest(a, b));
            
        app.route('/add_bank_account')
            .post((a, b) => BankController.AddBankAccount(a, b));

        app.route('/update_bank_account')
            .post((a, b) => BankController.UpdateBankAccount(a, b));

        app.route('/delete_bank_account')
            .post((a, b) => BankController.DeleteBankAccount(a, b));

        app.route('/list_bank_account')
            .post((a, b) => BankController.ListBankAccount(a, b));

        app.route('/add_rate')
            .post((a, b) => BankController.AddRate(a, b));

        app.route('/update_rate')
            .post((a, b) => BankController.UpdateRate(a, b));

        app.route('/delete_rate')
            .post((a, b) => BankController.DeleteRate(a, b));

        app.route('/list_rate')
            .post((a, b) => BankController.ListRate(a, b));

        app.route('/list_currencies')
            .post((a, b) => BankController.ListCurrencies(a, b));
            
        app.route('/add_fee')
            .post((a, b) => BankController.AddFee(a, b));

        app.route('/update_fee')
            .post((a, b) => BankController.UpdateFee(a, b));

        app.route('/delete_fee')
            .post((a, b) => BankController.DeleteFee(a, b));

        app.route('/list_fee')
            .post((a, b) => BankController.ListFee(a, b));    

    }

};
module.exports = new SiteRouter();