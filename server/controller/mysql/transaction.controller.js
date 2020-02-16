
var mySqlController = require('./mysql.controller');
let { log, logError } = require('./../../lib/log');
let { ResultCode, VerifyType, gTask, TypeVerify, SocketApiKey, InvoiceTemplate,UserPermission,PaymentType } = require("./../../define")
let async = require('async');
let verifyController = require('./../verify.controller');
let invoiceContrller = require('./invoice.controller');
let util = require('./../../lib/util');
class TransactionController {
    constructor() {

    }
   



    getInfoProductPublisher(data, callback) {

        let sql = `SELECT * FROM fx_products_publisher where account_id ='${data.account_id}' and product_code = '${data.product_code}' and status = 1;`
        mySqlController.Query(sql)
            .then(product => {
                if (product && product.price) {
                    data.productPublisher = product;
                    data.productPublisher.quantity = data.quantity;
                    callback(null, data);
                } else {
                    callback(ResultCode.PRODUCT_NOT_FOUND, data);
                }

            }).catch(err => {
                callback(ResultCode.SQL_ERROR, data);
            })
    }


    checkBalancePublisher(data, callback) {
        let sql = `SELECT real_balance FROM fx_balance where account_id ='${data.account_id}' and deposit ='${data.deposit}';`
        mySqlController.Query(sql)
            .then(balance => {
                if (balance && balance.length > 0 && data.productPublisher && balance[0].real_balance > data.productPublisher.price) {
                    callback(null, data);
                } else {
                    callback(ResultCode.PUB_BALANCE_NOT_ENOUGH, data);
                }
            }).catch(err => {
                callback(ResultCode.SQL_ERROR, data);
            })
    }


    getInfoProductRetailer(data, callback) {
        let sql = `SELECT * FROM fx_products_retailer where account_id ='${data.account_create}' and product_code = '${data.product_code}' and status = 1;`
        mySqlController.Query(sql)
            .then(product => {
                if (!product) {
                    callback(ResultCode.PRODUCT_NOT_FOUND, data);
                } else {
                    data.productRetailer = product;
                }
                if (product.account_id == product.account_create) {
                    data.isCheckStore = false;
                } else {
                    data.isCheckStore = true;
                }
                if (product.product_type == 1) {
                    data.isCheckStore = false;
                    data.productRetailer.quantity = data.quantity;
                    callback(null, data);
                } else if (product.product_type == 2) {
                    if (product.quantity < data.quantity) {
                        callback(ResultCode.PRODUCT_NOT_ENOUGH, data);
                    } else {
                        data.productRetailer.quantity = data.quantity;
                        callback(null, data);
                    }
                }

            }).catch(err => {
                callback(ResultCode.SQL_ERROR, data);
            })
    }


    checkBalanceRetailer(data, callback) {
        let sql = `SELECT real_balance FROM fx_balance where account_id ='${data.account_create}' and deposit ='${data.deposit}';`
        mySqlController.Query(sql)
            .then(balance => {
                if (!balance) {
                    callback(ResultCode.RETAIL_BALANCE_NOT_ENOUGH, data);
                }
                if (data.productRetailer && balance.real_balance > data.productRetailer.price) {
                    callback(null, data);
                } else {
                    callback(ResultCode.RETAIL_BALANCE_NOT_ENOUGH, data);
                }
            }).catch(err => {
                callback(ResultCode.SQL_ERROR, data);
            })
    }




    getInfoProductRoot(data, callback) {
        if (data.isCheckStore) {
            let sql = `SELECT * FROM fx_products where account_id ='${account_id}' and product_code = '${product_code}' and status = 1;`
            mySqlController.Query(sql)
                .then(product => {
                    if (product) {
                        if (product.quantity > data.quantity) {
                            callback(null, data);
                        } else {
                            callback(ResultCode.PRODUCT_NOT_ENOUGH, data);
                        }
                    } else {
                        callback(ResultCode.PRODUCT_NOT_FOUND, data);
                    }
                }).catch(err => {
                    callback(ResultCode.SQL_ERROR, data);
                })
        } else {
            callback(null, data);
        }

    }


    async  AddMoneyForMyCurrency(req, res) {
        var data = req.body;
        let user = req.user;
        if (user && data.amount) {
            let mail = await verifyController.GetMyMail(user.account_id);
            if (!mail) {
                res.status(401).json({
                    resultCode: ResultCode.OTHER_ERROR

                });
            }
            let result = await verifyController.CreateSessionMail(mail, {
                account_id: user.account_id,
                amount: data.amount,
                invoiceTemplate: InvoiceTemplate.NAP_TIEN,
                type: VerifyType.ADD_MONEY
            })
            // gTask.listTransferMoney.push(data);
            //     res.json({
            //         resultCode: 0,
            //         message: 'success'
            //     });  
            res.json({
                resultCode: ResultCode.SUCCESS,
                status: result.result,
                key: result.key
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    VerifyAddMoneyForMyCurrency(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.keyVerify && data.codeVerify) {
            let key = data.keyVerify;
            if (verifyController.obj[key] && verifyController.obj[key].code) {
                if (verifyController.obj[key].code == data.codeVerify) {
                    clearTimeout(verifyController.obj[key].time);
                    var objData = verifyController.obj[key];
                    delete verifyController.obj[key];

                    gTask.listAddMoney.push(objData.data);
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        message: 'success'
                    });
                }
                else {
                    verifyController.obj[key].count++;
                    if (verifyController.obj[key].count > 4) {
                        delete verifyController.obj[key];
                        res.status(401).json({
                            resultCode: ResultCode.VERIFY_MAX_REQUEST
                        });
                    }
                    else
                        res.status(401).json({
                            resultCode: ResultCode.VERIFY_ERROR
                        });
                }
            } else {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
            }
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }


    // SendMoney(req, res ){
    //     var data = req.body;


    //    // let b_validate = verifyController.VerifyCode(data);
    //  //   if(b_validate == 1 && TypeVerify.CONFIRM_ADD_MONEY == data.type) {

    //    //   if(true) {
    //         if(data.amount && data.account_recieve && data.deposit) {

    //             gTask.listTransferMoney.push(data);
    //                 res.json({
    //                     resultCode: 0,
    //                     message: 'success'
    //                 });                   
    //         }else {
    //             res.status(401).json({
    //                 resultCode: ResultCode.INCORRECT_DATA
    //             });
    //         }


    //     // }else {
    //     //     res.status(401).json({
    //     //         resultCode: ResultCode.VERIFY_ERROR
    //     //     });
    //     // }
    // }


    async SendMoney(req, res) {
        var data = req.body;
        let user = req.user;
        if (user && data.amount && data.account_recieve && data.deposit) {
            let mail = await verifyController.GetMyMail(user.account_id);
            if (!mail) {
                res.status(401).json({
                    resultCode: ResultCode.OTHER_ERROR
                });
            }
            let result = await verifyController.CreateSessionMail(mail, {
                account_recieve: data.account_recieve,
                account_id: user.account_id,
                deposit: data.deposit,
                message: data.message,
                amount: data.amount,
                type: VerifyType.SEND_MONEY
            })
            // gTask.listTransferMoney.push(data);
            //     res.json({
            //         resultCode: 0,
            //         message: 'success'
            //     });  
            res.json({
                resultCode: ResultCode.SUCCESS,
                status: result.result,
                key: result.key
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }


    VerifySendMoney(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.keyVerify && data.codeVerify) {
            let key = data.keyVerify;
            if (verifyController.obj[key] && verifyController.obj[key].code) {
                if (verifyController.obj[key].code == data.codeVerify) {
                    clearTimeout(verifyController.obj[key].time);
                    var objData = verifyController.obj[key];
                    delete verifyController.obj[key];

                    gTask.listTransferMoney.push(objData.data);
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        message: 'success'
                    });
                }
                else {
                    verifyController.obj[key].count++;
                    if (verifyController.obj[key].count > 4) {
                        delete verifyController.obj[key];
                        res.status(401).json({
                            resultCode: ResultCode.VERIFY_MAX_REQUEST
                        });
                    }
                    else
                        res.status(401).json({
                            resultCode: ResultCode.VERIFY_ERROR
                        });
                }
            } else {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
            }
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }
    TransactionHistory(req, res) {
        var data = req.body;
        let user = req.user;
        if (user) {
            var sql_query = `SELECT t1.from,t1.to,t1.invoice_code, t1.amount,t1.deposit,t1.create_date , t2.invoice_template, t2.description FROM fx_transaction as t1 join fx_invoice as t2 on t1.invoice_code = t2.invoice_code  where t1.from = '${user.account_id}' or t1.to = '${user.account_id}'`;
            mySqlController.ExeQuery({
                query: sql_query
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: 0,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        resultCode: 20
                    });
                }
            });
        }
        else {
            res.status(401).json({
                resultCode: 100
            });
        }
    }

    CreateBalanceSQL(obj, stream, isDeposit) {
        if (obj.sequence_number && obj.hash != undefined && obj.account_id && obj.deposit && obj.balance != undefined && obj.lockBalance != undefined) {

            var type = isDeposit ? SocketApiKey.DEPOSIT : SocketApiKey.WITHDRAW;
            stream.list.push({
                type: type,
                socket_user: [obj.account_id],
                data: {
                    sequence_number: obj.sequence_number,
                    hash: obj.hash,
                    account_id: obj.account_id,
                    deposit: obj.deposit,
                    balance: obj.balance,
                    lock_balance: obj.lock_balance
                },
                sequence_number: obj.sequence_number

            });
            stream.sql += `insert fx_balance(sequence_number,transaction_hash,account_id,deposit,balance,lock_balance) values(
                ${obj.sequence_number},'${obj.hash}','${obj.account_id}','${obj.deposit}',${obj.balance},${obj.lockBalance}) 
                ON DUPLICATE KEY UPDATE  sequence_number = '${obj.sequence_number}',transaction_hash = '${obj.hash}',balance =\`balance\` ${isDeposit ? '+' : '-'} ${obj.balance} ,lock_balance =\`lock_balance\` ${isDeposit ? '+' : '-'} ${obj.lockBalance} ;`;
        } else {
            throw "error balance sql", obj;
        }
    }

    CallbackWhypay(req, res) {
        var data = req.query;
        log.info('CallbackWhypay Data', data);
        if (data.request_id && data.aff_sub1 && data.aff_sub2 && data.amount && data.message && data.success == 1) {
            gTask.listPayment.push({
                account_id: data.aff_sub1,
                deposit: data.aff_sub2,
                amount: data.amount,
                request_id: data.request_id,
                message: data.message,
                partner: "Whypay"
            });

            res.json({
                resultCode: 0,
                message: "success"
            })
        } else {
            res.json({
                resultCode: 1,
                message: "error data"
            })
        }
    }
    GetWhypayUrl(deposit) {
        return new Promise(resolve=>{
            let sql = 'select * from fx_currency where currency_code =  ?;';
            mySqlController.QueryValue(sql,[deposit])
            .then(data=>{
                if(data && data.length >0) {
                    resolve(data[0].whypay);
                }else resolve(null);
            }).catch(err =>{
               log.error(err);
               resolve(null); 
            });
        })
    } 
   async PaymentSession(req, res) {
        let data = req.body;
        let user = req.user;
        
        if (user && data.amount && data.deposit && data.amount > 10000 &&  data.site && data.mail) {
            let session = "SS" + Date.now();
                let link = await this.GetWhypayUrl(data.deposit);
                if(!link) {
                    res.json({
                        resultCode: ResultCode.OTHER_ERROR
                    });
                    return;
                }
                if(!data.message) {
                    data.message = `Tài khoản ${user.account_id} nạp tiền.`;
                }

            data.type = PaymentType.CTV_PAY;
            data.account_id = user.account_id;
            data.request_id = session;
            data.partner = 'Whypay';

            let url =  `${link}?request_id=${session}&sender_contact=${data.mail}&aff_sub1=${user.account_id}&aff_sub2=${data.deposit}&message=${data.message}&amount=${data.amount}&redirect_url=http://${data.site}?`;
            let sql = `insert fx_payment_history(session,account_id,invoice_code,partner,amount,deposit,type,jData) values (?,?,?,?,?,?,?,?);`;
            let values = [];
            values.push(session);
            values.push(user.account_id);
            values.push("");
            values.push("Whypay");
            values.push(data.amount);
            values.push(data.deposit);
            values.push(PaymentType.CTV_PAY);
            values.push(JSON.stringify(data));

            mySqlController.ExeQuery({
                query: sql,
                values: values

            }, function (err, rows, fields) {
                if (!err) {                    
                    res.json({
                        resultCode: 0,
                        session: session,
                        url: url
                    });
                } else {
                    res.status(401).json({
                        resultCode: 20
                    });
                }
            });

        } else {
            res.json({
                resultCode: 1,
                message: "error data"
            })
        }
    }
    CreateTransactionSQL(obj, stream) {
        if (obj.sequence_number && obj.hash != undefined && obj.from && obj.to && obj.invoiceCode && obj.amount && obj.deposit) {
            stream.list.push({
                type: SocketApiKey.NEW_TRANSACTION,
                socket_user: [obj.from, obj.to],
                data: {
                    sequence_number: obj.sequence_number,
                    from: obj.from,
                    to: obj.to,
                    invoice_code: obj.invoiceCode,
                    amount: obj.amount,
                    deposit: obj.deposit
                },
                sequence_number: obj.sequence_number

            });
            stream.sql += `insert into fx_transaction(sequence_number,\`hash\`,\`from\`,\`to\`,invoice_code,amount,deposit) values(
                ${obj.sequence_number},'${obj.hash}','${obj.from}','${obj.to}','${obj.invoiceCode}',${obj.amount},'${obj.deposit}');`;
        } else {
            throw "error transaction sql", obj;
        }
    }
    GetListCurrency(req,res) {
        let data = req.body;
        let user = req.user;
        if(user && user.permission == UserPermission.ROOT) {
            let sql_query = `select * from fx_currency`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: []
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: 0,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        resultCode: 20
                    });
                }
            });
        }else {
            res.json( {
                resultCode: ResultCode.INCORRECT_DATA
            })
        }
    }
}

module.exports = new TransactionController();