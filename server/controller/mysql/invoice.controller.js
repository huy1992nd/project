let {CODE_ID,gSequence,SocketApiKey} = require ('./../../define');
class InvoiceController  {
    constructor(){};
    CreateInvoiceID(deposit){
        if(!gSequence[deposit] ) {
            gSequence[deposit] = {
                invoiceCode: 0
            };
        } else if(gSequence[deposit].invoiceCode) {
            gSequence[deposit].invoiceCode = 0;
        }
        let order_time = new Date().toISOString().replace('Z', '').replace('T', ' ');
		let sDate = order_time.substr(0, 10).split('-').join('');
        let invoiceCode = [CODE_ID.INVOICE,  ['00000000', ++gSequence[deposit].invoiceCode].join('').substr(-8)].join('');
        return invoiceCode;
    }

    CreateInvoiceSQL(obj,stream){
        if(obj.invoiceCode&& obj.order_code&& obj.invoiceTemplate && obj.createInvoice && obj.customerId && obj.deposit && obj.payment) {
            if(obj.status == undefined) {
                obj.status = 1
            }
            if(obj.totalPayment == undefined) {
                obj.totalPayment = obj.payment;
            }
            stream.list.push( {
                type: SocketApiKey.NEW_INVOICE,
                socket_user: [obj.createInvoice,obj.customerId],
                data: {
                    invoice_code: obj.invoiceCode,
                    order_code: obj.order_code,
                    invoice_tempalte:obj.invoiceTempalte,
                    create_invoice: obj.createInvoice,
                    customer_id: obj.customerId,
                    deposit:obj.deposit,
                    payment: obj.payment,
                    total_payment: obj.totalPayment,
                    status: obj.status
                }
               
            });
            stream.sql += `insert into fx_invoice(invoice_code,order_code,invoice_template,create_invoice,customer_id,deposit,
                status,payment,total_payment) values ('${obj.invoiceCode}','${obj.order_code}','${obj.invoiceTemplate}','${obj.createInvoice}','${obj.customerId}'
                ,'${obj.deposit}',${obj.status},${obj.payment},${obj.totalPayment}) ;`;

        }else {
            throw "error invoice sql",obj;
        }
    }
}

module.exports = new InvoiceController();