var mySqlController = require('./mysql.controller');
let invoiceContrller = require('./invoice.controller');
let productController = require('./product.controller');
let userController =require('./user.controller');
let { log, logError } = require('./../../lib/log');
let myEmitter = require('./../../lib/myemitter');
let { CODE_ID, gSequence, gTask, ResultCode, TaskType, OrderType ,UserPermission,SocketApiKey,ProductType,EmitType,OrderStatus,PaymentType,LogAction,LOGType} = require('./../../define');
let util = require('./../../lib/util');
let transactionController = require('./transaction.controller');
let customerController = require('./customter.controller');
let logController = require('./log.controller');
class OrderController {
    constructor() {

    }
    CreateOrderID(deposit) {
        if (!gSequence[deposit]) {
            gSequence[deposit] = {
                order_code: 0
            };
        } else if (!gSequence[deposit].order_code) {
            gSequence[deposit].order_code = 0;
        }
        // let order_time = new Date().toISOString().replace('Z', '').replace('T', ' ');
        // let sDate = order_time.substr(2, 10).split('-').join('');
        // let orderId = [CODE_ID.ORDER, sDate, deposit, ['00000000', ++gSequence[deposit].order_code].join('').substr(-8)].join('');


        let orderId = [CODE_ID.ORDER,deposit, ['00000000', ++gSequence[deposit].order_code].join('').substr(-8)].join('');
        return orderId;
    }
    CreateOrderDetail(data) {
        if (data && data.length == 0) {
            logError.error('createOrderDetail');
            return '';
        }
        let sql = `
        insert into fx_orders_detail(order_id,product_code,quantity,price,deposit) values`;
        let arr = [];
        data.forEach(item => {
            arr.push(`('${item.order_id}','${item.product_code}','${item.quantity}',${item.price},${item.deposit})`);
        });

        sql += arr.join(',\n');
        sql += ';';

    }

    AddOrderTolist(data) {

        var order;
        //     if(!listOrder[data.deposit])
        //     listOrder[data.deposit] = [];
        //    let  list = listOrder[data.deposit];
        if (data.quantity) {

            order = {
                order_code: data.order_code,
                account_create: data.account_create,
                account_to: data.account_to,
                orderType: data.order_type,
                account_permission: data.account_permission,
                description: data.description ? data.description : "",
                deposit: data.deposit,
                status: data.status ? data.status : OrderStatus.WAIT_VERIFY,
                payment: data.payment,
                paid: 0,
                campaign_id: data.product.campaign_id,
                clientId : data.clientId ? data.clientId : null,
                items: [
                    {
                        product_code: data.product_code,
                        quantity: data.quantity,
                        price: data.product.price,
                        deposit: data.deposit,
                        time_day: data.time_day ? data.time_day : 1,
                        campaign_id: data.product.campaign_id,
                        productType: data.product.product_type,
                        startDate: data.start_date ? data.start_date : null,
                        customer: data.customer ? data.customer : null
                    }
                ]
            }
            console.log("listOrder push", order);
            gTask.listOrder.push(order);
        } else {
            order = {
                order_code: data.order_code,
                account_create: data.account_create,
                account_to: data.account_to,
                account_permission: data.account_permission,
                orderType:  data.order_type,
                description: data.description ? data.description : "",
                deposit: data.deposit,
                status: data.status ? data.status : OrderStatus.WAIT_VERIFY,
                payment: data.payment,
                paid: 0,
                campaign_id: data.campaign_id,
                items: [
                ]
            }
            data.list_product.forEach(item => {
                order.items.push({

                    product_code: item.product_code,
                    quantity: item.quantity,
                    price: item.price,
                    deposit: item.deposit,
                    campaign_id: item.campaign_id,
                    
                    productType: item.product_type,
                    startDate: item.start_date ? item.start_date : null,
                    customer: item.customer ? item.customer : null
                });
            })
            console.log("listOrder push", order);
            gTask.listOrder.push(order);
        }
    }
    CalculatorPayment(items) {
        let payment = 0;
        items.forEach(item => {
            payment += item.price * item.quantity;
        })
        return payment;
    }

    async CreateOrder(req,res){
        let user = req.user;
        let data = req.body;
        if (data.quantity && data.product_code &&  data.deposit) {
            let product = await productController.GetProductInfo(data.product_code, data.deposit, user);
            if (!product) {
                res.status(401).json({
                    resultCode: ResultCode.PRODUCT_NOT_FOUND
                });
                return;
            }
            if(product.product_type == ProductType.RENT_FOR_MONTH) {
                if(!data.time_day) {
                    res.status(401).json({
                        resultCode: ResultCode.INCORRECT_DATA,
                        message: "Sản phẩm thuê theo tháng thiếu time_day"
                    });
                    return;
                }
            }else {
                data.time_day = 0;
            }
            data.account_to = product.account_create;
            data.account_create = req.user.account_id;
            data.product = product;
            let order_code = this.CreateOrderID(product.deposit);
    
            data.account_permission =  user.permission;

            data.payment = product.price * data.quantity;
            if(product.product_type == ProductType.RENT_FOR_MONTH) {
                data.payment = data.payment * data.time_day;
            }
            if(!data.price)
                data.price = product.price;
            data.profit = data.price ? data.price * data.quantity - data.payment : 0;

            let values = [];
            let customer_code = null;
            if(data.customer) {
                customer_code = 'KH'+ new Date().getTime();
            }
            let sql = `insert into fx_orders(order_code,request_id,account_create,account_to,payment,profit,deposit,status,order_type,description,account_permission) values('${order_code}','','${data.account_create}','${data.account_to}',${data.payment}
            ,${data.profit},'${product.deposit}',${OrderStatus.WAIT_VERIFY},${OrderType.NEW},'${data.description ? data.description : ""}',${user.permission});`;
            //  values.push([order_code,'',data.account_create,data.account_to,data.payment,data.profit,product.deposit,0,1,data.description ? data.description : ""]);

            sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code,time_day) 
            values('${order_code}','${data.product_code}',${product.product_type},${data.quantity},'${product.campaign_id}'
                ,${product.price},${data.price},'${product.deposit}',${data.start_date ? "'" + data.start_date + "'" : null},${data.start_date ? "'" + data.end_date + "'" : null},'${customer_code}',${data.time_day ? data.time_day : 0});`;

            sql += `insert into fx_orders_history(order_code,request_id,account_create,account_to,payment,deposit,status,order_type,description,account_permission) values('${order_code}','','${data.account_create}','${data.account_to}',${data.payment}
            ,'${product.deposit}',0,${OrderType.NEW},'${data.description ? data.description : ""}',${user.permission});`;

            if(data.customer) {
                let customer = data.customer;
                data.customer.customer_code = customer_code; 
                customer.address = customer.address ? customer.address : "";
                customer.note = customer.note ? customer.note : "";
                customer.mail = customer.mail ? customer.mail : "";
                customer.phone_number = customer.phone_number ? customer.phone_number : '';
                sql+= `insert into fx_customer(customer_code,uuid,account_create,mail,phone_number,address,note,user_name) values('${customer_code}','${customer.uuid}','${req.user.account_id}','${customer.mail}'
            ,'${customer.phone_number}','${customer.address}','${customer.note}','${customer.user_name}')`;
            }
            mySqlController.Transaction(sql)
                .then(da => {
                    data.order_code = order_code;
                    //  gSequence[data.deposit].hash = hash;
                    this.AddOrderTolist(data);
                    res.json({
                        resultCode: 0,
                        message: 'order success'
                    });
                })
                .catch(err => {
                    log.info("ERR", err);
                    res.status(401).json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                })
        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    }
    async Order(req,res){
        let data = req.body;
        console.log(data);
        switch(data.order_type){
            case OrderType.CTV_ORDER_PAID:{
                this.CreateOrderMultiProduct(req,res);
                break;
            }
            case OrderType.MY_ORDER: {
                this.CreateMyOrder(req,res);
                break;
            }
            case OrderType.CUS_ORDER_NOT_PAY:{
                this.CustomerOrder(req,res);
                break;
            }
            case OrderType.CTV_ORDER_NOT_PAY:{
                    this.CreateOrderMultiProduct(req,res);
                break;
            }
            case OrderType.CTV_ORDER_BONUS:{
                    this.CreateOrderMultiProduct(req,res);
                break;
            }
            case OrderType.CUS_ORDER_PAID:{
                this.CustomerOrderPaid(req,res);
            break;
        }
            default:{
                res.json({
                    resultCode: ResultCode.INCORRECT_DATA
                })
            }
        }
    }

async CustomerOrderPaid(req,res){
    let data = req.body;
    console.log(data);
    if(data.campaign_id  && data.list_product&& data.site&&data.deposit && data.clientId){
        

        let user = await  userController.GetUserInfoByDomain(data.site);
            if(!user){ 
                res.json({
                    resultCode: ResultCode.INCORRECT_DATA,
                    message: "Không tìm thấy site"
                })
                return;
            }                               
                data.account_to = user.account_id;
                let order_code = this.CreateOrderID(data.deposit);
                data.account_permission =  user.permission;
                let session = "SS" + Date.now();
                     let stream = {
                    sql:"",
                    list:[],
                    values:[]
                }
                
                let customer_code = null;
                if(data.customer){
                    data.customer.customer_code = customerController.CreateCustomerID();
                    customer_code = data.customer.customer_code;

                    customerController.CreateCustomerSQL({
                        socket_user: [user.account_id],
                        customerName: data.customer.user_name,
                        account_create: data.account_create ? data.account_create : user.account_id ,
                        customer_code: customer_code,
                        mail: data.customer.mail,
                        address: data.customer.address,
                        note: data.customer.note,
                        facebook: data.customer.facebook,
                        phoneNumber: data.customer.phone_number
                    },stream);
                }

                this.CreateNewOrderSQL({
                    socket_user: [user.account_id],
                    socket_id: data.socket_id,
                    order_code: order_code,
                    customer_code: data.customer ? data.customer.customer_code : null,
                    requestId: data.account_id,
                    account_create: data.account_create ? data.account_create : user.account_id,
                    payment: data.payment,
                    paid: 0,
                    deposit: data.deposit,
                    orderType: OrderType.CUS_ORDER_PAID,
                    account_to: user.account_id,
                    status: OrderStatus.WAIT_VERIFY,
                    account_permission: user.permission,
                    description: data.description,
                    isAuto: false
                 },stream);
    
    
                data.list_product.forEach(item => {
                   stream.sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code,time_day) 
                    values('${order_code}','${item.product_code}',${item.product_type},${item.quantity},'${item.campaign_id}'
                        ,${item.price},${item.price},'${item.deposit}',${item.start_date ? "'" + item.start_date + "'" : null},${item.end_date ? "'" + item.end_date + "'" : null},'${customer_code}',${data.time_day ? data.time_day : 0});`; 
                });



           
                let link = await transactionController.GetWhypayUrl(data.deposit);
                if(!link) {
                    res.json({
                        resultCode: ResultCode.OTHER_ERROR
                    });
                    return;
                }
                if(!data.message) {
                    data.message = `Khách hàng  với số mã số: ${data.customer.customer_code} thanh toán order ${order_code}.`;
                }
                
                data.order_code = order_code;
                data.request_id = session;
                data.account_to = user.account_id;
                data.account_create = data.account_create ? data.account_create : user.account_id;
                data.type = PaymentType.CUSTOMER_PAY;
                data.account_permission = user.permission;
                data.partner = 'Whypay';

            let url =  `${link}?request_id=${session}&sender_contact=${user.mail}&aff_sub1=${data.account_to}&aff_sub2=${data.deposit}&message=${data.message}&amount=${data.payment}&redirect_url=http://${data.site}?`;
            stream.sql += `insert fx_payment_history(session,account_id,invoice_code,partner,amount,deposit,jData,type) values (?,?,?,?,?,?,?,?);`;
            stream.values.push( data.request_id);
            stream.values.push(data.account_to);
            stream.values.push("");
            stream.values.push(data.partner);
            stream.values.push(data.payment);
            stream.values.push(data.deposit);
            stream.values.push(JSON.stringify(data));
            stream.values.push(data.type);
            
    
                mySqlController.TransactionValue(stream.sql,stream.values)
                    .then(da => {
                        res.json({
                            resultCode: 0,
                            session: session,
                            url: url
                        });
                        this.AddOrderTolist(data);
                        if(stream.list.length >0)
                            myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                    })
                    .catch(err => {
                        log.info("ERR", err);
                        res.json({
                            resultCode: ResultCode.SQL_ERROR
                        });
                    })  
    }else {
        res.json({
            resultCode: ResultCode.INCORRECT_DATA
        })
    }
}
    
async  CustomerOrder(req,res){
        let data = req.body
        if(data.list_product&&data.deposit) {
            let user = await  userController.GetUserInfoByDomain(req.headers.domain);
            if(user){                                
                data.account_to = user.account_id;
                let order_code = this.CreateOrderID(data.deposit);
                data.account_permission =  user.permission;
                
                let stream = {
                    sql:"",
                    list:[],
                    values:[]
                }


                let customer_code = null;
                if(data.customer){
                    data.customer.customer_code = customerController.CreateCustomerID();
                    customer_code = data.customer.user_name;
                    customerController.CreateCustomerSQL({
                        customerName: data.customer.user_name,
                        account_create: user.account_id ,
                        socket_user: [user.account_id],
                        customer_code: data.customer.customer_code,
                        mail: data.customer.mail,
                        address: data.customer.address,
                        note: data.customer.note,
                        facebook: data.customer.facebook,
                        phoneNumber: data.customer.phone_number
                    },stream);
                }
                this.CreateNewOrderSQL({
                    order_code: order_code,
                    customer_code: data.customer ? data.customer.customer_code : null,
                    account_create:  data.account_create ? data.account_create :'CUSTOMER',
                    socket_user: [user.account_id],
                    socket_id: data.socket_id,
                    payment: data.payment,
                    paid: 0,
                    deposit: data.deposit,
                    orderType: OrderType.CUS_ORDER_NOT_PAY,
                    account_to: user.account_id,
                    status: OrderStatus.NEW,
                    account_permission: user.permission,
                    description: data.description,
                    isAuto: false
                 },stream);
                 
                 logController.CreateLogNotificationSQL({
                    account_id: user.account_id,
                    action: LogAction.NEW_ORDER_CUS,
                    socket_user: [user.account_id],
                    socket_id : data.socket_id,
                    type: LOGType.NOTIFY,
                    data: {
                        order_code: order_code,
                        account_create: user.account_id
                    }
                }, stream);
    
                data.list_product.forEach(item => {
                   stream.sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code,time_day) 
                    values('${order_code}','${item.product_code}',${item.product_type},${item.quantity},'${item.campaign_id}'
                        ,${item.price},${item.price},'${item.deposit}',${item.start_date ? "'" + item.start_date + "'" : null},${item.end_date ? "'" + item.end_date + "'" : null},'${data.customer.customer_code}',${data.time_day ? data.time_day : 0});`; 
                });
    
                mySqlController.TransactionValue(stream.sql,stream.values)
                    .then(da => {
                        res.json({
                            resultCode: 0,
                            message: 'order success'
                        });
                        if(stream.list.length >0)
                            myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                    })
                    .catch(err => {
                        log.info("ERR", err);
                        res.json({
                            resultCode: ResultCode.SQL_ERROR
                        });
                    })  


            }else {
                res.json({
                    resultCode: ResultCode.INCORRECT_DATA
                })
            }

        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            })
        }

    }
    CreateMyOrder(req,res){
        let user = req.user;

        let data = req.body;
        if (data.list_product && data.list_product.length > 0 && data.customer && data.deposit) {

            data.account_create = user.account_id;
            data.account_to = user.account_id;
            let order_code = this.CreateOrderID(data.deposit);
            data.account_permission =  user.permission;

            let stream = {
                sql:"",
                list:[],
                values:[]
            }
            this.CreateNewOrderSQL({
                socket_user: [user.account_id],
                order_code: order_code,
                customer_code: data.customer_code ? data.customer_code: null,
                account_create: user.account_id,
                payment: data.payment,
                deposit: data.deposit,
                orderType: OrderType.MY_ORDER,
                account_to: data.account_to,
                status: OrderStatus.NEW,
                account_permission: user.permission,
                description: data.description,
                isAuto: false
             },stream);


            data.list_product.forEach(item => {
               stream.sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code,time_day) 
                values('${order_code}','${item.product_code}',${item.product_type},${item.quantity},'${item.campaign_id}'
                    ,${item.price},${item.price},'${item.deposit}',${item.start_date ? "'" + item.start_date + "'" : null},${item.end_date ? "'" + item.end_date + "'" : null},'${data.customer_code}',${data.time_day ? data.time_day : 0});`; 
            });

            mySqlController.TransactionValue(stream.sql,stream.values)
                .then(da => {
                    res.json({
                        resultCode: 0,
                        message: 'order success'
                    });
                    if(stream.list.length >0)
                        myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                })
                .catch(err => {
                    log.info("ERR", err);
                    res.json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                })
        } else {
            res.json({
                resultCode: 100
            });
        }
    }
    async CreateOrderMultiProduct(req,res){
        let user = req.user;

        let data = req.body;
        if (data.list_product && data.list_product.length > 0 && data.customer && data.account_to&& data.deposit) {
        
            data.account_create = req.user.account_id;
            let order_code = this.CreateOrderID(data.deposit);
    
            data.account_permission =  user.permission;

            let stream = {
                sql:"",
                list:[],
                values:[]
            }
          
            let values = [];
            if(data.customer && !data.customer.customer_code ) {
                data.customer.customer_code = customerController.CreateCustomerID();
            }
            let status = null;
            if(data.order_type == OrderType.CTV_ORDER_PAID){
                status = OrderStatus.WAIT_VERIFY;
            }
            if(data.order_type ==CTV_ORDER_NOT_PAY) {
                status = OrderStatus.NEW;
            }
            if(data.order_type == CTV_ORDER_BONUS) {
                status = OrderStatus.NEW;
            }

            this.CreateNewOrderSQL({
                order_code: order_code,
                socket_user: [data.account_to,user.account_id],
                customer_code :data.customer.customer_code ? data.customer.customer_code : null,
                account_create: user.account_id,
                payment: data.payment,
                deposit: data.deposit,
                orderType: data.order_type,
                account_to: data.account_to,
                status: status,
                account_permission: user.permission,
                description: data.description,
                isAuto: false
             },stream);


            data.list_product.forEach(item => {
               stream.sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code,time_day) 
                values('${order_code}','${item.product_code}',${item.product_type},${item.quantity},'${item.campaign_id}'
                    ,${item.price},${item.price},'${item.deposit}',${item.start_date ? "'" + item.start_date + "'" : null},${item.end_date ? "'" + item.end_date + "'" : null},'${data.customer.customer_code}',${data.time_day ? data.time_day : 0});`; 
            });

            mySqlController.TransactionValue(stream.sql,stream.values)
                .then(da => {
                    data.order_code = order_code;
                    if(data.order_type == OrderType.CTV_ORDER_PAID) {
                        this.AddOrderTolist(data);
                    }
                    res.json({
                        resultCode: 0,
                        message: 'order success'
                    });
                    myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                })
                .catch(err => {
                    log.info("ERR", err);
                    res.status(401).json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                })
        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    }

 
    OrderListHistory(req, res) {
        var data = req.body;
        if (data.account_id) {
            var sql_query = `SELECT * FROM fx_orders_history where account_create = ? order by update_time desc`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.account_id]
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
    OrderDetailsInfo(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.order_code && user) {
            var sql_query = `
            SELECT * FROM fx_orders_detail where order_code in (select order_code from fx_orders where (account_create = '${user.account_id}' or account_to = '${user.account_id}') and order_code = '${data.order_code}');`;
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

    OrderInfoHistory(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.order_code && user) {
            var sql_query = `SELECT * FROM fx_orders_history where order_code = '${data.order_code}' and ( account_create = '${user.account_id}' or account_to =  '${user.account_id}')`;
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


    ListOrder(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            var sql_query = `SELECT * FROM fx_orders where account_create = '${user.account_id}' or account_to ='${user.account_id}' and status != -1;`;
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



    addLike(product) {
        return new Promise((resolve, reject) => {
            let limitLike = + product.product_code.substr(- (product.product_code.length - 2));
            let customer = product.customer;
            var form = {
                id_user: customer.user_name,
                limitlike: limitLike,
                limitpost: 20,
                name: customer.uuid,
                ngay: 30,
                speed: 5
            };

            var formData = querystring.stringify(form);
            var contentLength = formData.length;

            request({
                headers: {
                    'Content-Length': contentLength,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'http://shoplike.vn/home.php',
                    'Cookie': 'PHPSESSID=1r75lguvoe49l3f77ot45o3ae7'
                },
                uri: 'http://shoplike.vn/Like_add',
                body: formData,
                method: 'POST'
            }, function (err, res, body) {
                if (err) {
                    resolve(false);
                }
                if (body && body.indexOf("Thành công") > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        })
    }

    AcceptProduct(req, res) {
        let data = req.body;
        let user = req.user;
        if (user && data.order_code) {
            let obj ={};
            obj.orderType = OrderType.ACCEPT;
            obj.user = user;
            obj.order_code = data.order_code;
            gTask.listOrder.push(obj);
        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    }

  async  ExtendCustomer(req,res){
        let data = req.body;
        let user = req.user;

        if (user && data.customer_code && data.deposit,data.account_to && ata.product_code) {

            let product = await productController.GetProductInfo(data.product_code, data.deposit, req.user);
            if (!product) {
                res.status(401).json({
                    resultCode: ResultCode.PRODUCT_NOT_FOUND
                });
                return;
            }
            data.account_to = product.account_create;
            data.account_create = req.user.account_id;
            data.product = product;
            let order_code = this.CreateOrderID(product.deposit);
            // is retailer
            data.account_permission = req.user.permission;
            if(!data.quantity)
                data.quantity= 1;
            data.payment = product.price * data.quantity;
            if(!data.price)
                data.price = product.price;
            data.profit = data.price ? data.price * data.quantity - data.payment : 0;

            let sql = `insert into fx_orders(order_code,request_id,account_create,account_to,payment,profit,deposit,status,order_type,description,account_permission) values('${order_code}','','${data.account_create}','${data.account_to}',${data.payment}
            ,${data.profit},'${product.deposit}',0,${OrderType.EXTEND},'${data.description ? data.description : ""}',${user.permission});`;
            //  values.push([order_code,'',data.account_create,data.account_to,data.payment,data.profit,product.deposit,0,1,data.description ? data.description : ""]);

            sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code) 
            values('${order_code}','${data.product_code}',${product.product_type},${data.quantity},'${product.campaign_id}'
                ,${product.price},${data.price},'${product.deposit}',${data.start_date ? "'" + data.start_date + "'" : null},${data.start_date ? "'" + data.end_date + "'" : null},'${data.customer_code}');`;

            sql += `insert into fx_orders_history(order_code,request_id,account_create,account_to,payment,deposit,status,order_type,description,account_permission) values('${order_code}','','${data.account_create}','${data.account_to}',${data.payment}
            ,'${product.deposit}',0,${OrderType.EXTEND},'${data.description ? data.description : ""}',${user.permission});`;

            let obj ={};
            obj.orderType = OrderType.EXTEND;
            obj.account_permission = user.permission;
            obj.account_create = user.account_id;
            obj.account_to = data.account_to;
            obj.product_code = data.product_code;
            obj.order_code = order_code;
            obj.quantity = data.quantity;
            obj.campaign_id = product.campaign_id;
            obj.deposit = data.deposit;
            obj.payment = data.payment;
            obj.price = data.price;
            obj.customer_code = data.customer_code;
            gTask.listOrder.push(obj);
        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    }

    async RemoveCustomer(req,res){
        let data = req.body;
        let user = req.user;

        if (user && data.customer_code && data.deposit,data.account_to) {

            let product = await productController.GetProductInfo(data.product_code, data.deposit, req.user);
            if (!product) {
                res.status(401).json({
                    resultCode: ResultCode.PRODUCT_NOT_FOUND
                });
                return;
            }
            data.account_to = product.account_create;
            data.account_create = req.user.account_id;
            data.product = product;
            let order_code = this.CreateOrderID(product.deposit);
            // is retailer
            data.account_permission = req.user.permission;
            if(!data.quantity)
                data.quantity= 1;
            data.payment = product.price * data.quantity;
            if(!data.price)
                data.price = product.price;
            data.profit = data.price ? data.price * data.quantity - data.payment : 0;

            let sql = `insert into fx_orders(order_code,request_id,account_create,account_to,payment,profit,deposit,status,order_type,description,account_permission) values('${order_code}','','${data.account_create}','${data.account_to}',${data.payment}
            ,${data.profit},'${product.deposit}',0,${OrderType.REMOVE},'${data.description ? data.description : ""}',${user.permission});`;
            //  values.push([order_code,'',data.account_create,data.account_to,data.payment,data.profit,product.deposit,0,1,data.description ? data.description : ""]);

            sql += `insert into fx_orders_detail(order_code,product_code,product_type,quantity,campaign_id,price,real_price,deposit,start_date,end_date,customer_code) 
            values('${order_code}','${data.product_code}',${product.product_type},${data.quantity},'${product.campaign_id}'
                ,${product.price},${data.price},'${product.deposit}',${data.start_date ? "'" + data.start_date + "'" : null},${data.start_date ? "'" + data.end_date + "'" : null},'${data.customer_code}');`;

            sql += `insert into fx_orders_history(order_code,request_id,account_create,account_to,payment,deposit,status,order_type,description,account_permission) values('${order_code}','','${data.account_create}','${data.account_to}',${data.payment}
            ,'${product.deposit}',0,${OrderType.REMOVE},'${data.description ? data.description : ""}',${user.permission});`;

            let obj ={};
            obj.orderType = OrderType.REMOVE;
            obj.account_permission = user.permission;
            obj.account_create = user.account_id;
            obj.account_to = data.account_to;
            obj.product_code = data.product_code;
            obj.order_code = order_code;
            obj.quantity = data.quantity;
            obj.campaign_id = product.campaign_id;
            obj.deposit = data.deposit;
            obj.payment = data.payment;
            obj.price = data.price;
            obj.customer_code = data.customer_code;
            gTask.listOrder.push(obj);
        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    }

    CreateNewOrderSQL(obj, stream) {
        if (obj.order_code &&  obj.account_to && obj.deposit && obj.orderType != undefined && obj.account_permission != undefined) {
            if (obj.status == undefined) {
                obj.status = 2
            }
            if (obj.requestId == undefined) {
                obj.requestId = '';
            }
            if (obj.isAuto == undefined) {
                obj.isAuto = true;
            }
            if (obj.sequenceNumber == undefined) {
                obj.sequenceNumber = 0;
            }
            if (!obj.description) {
                obj.description = "";
            }
            if(!obj.paid)
            {
                obj.paid = 0;
            }
            let oData = {
                socket_user: obj.socket_user? obj.socket_user : [],
                socket_id: obj.socket_id ? obj.socket_id:null,
                socket_group: obj.socket_group ? obj.socket_group: [],
                type: SocketApiKey.UPDATE_ORDER,
                data: {
                    order_code: obj.order_code,
                    account_to: obj.account_to,
                    account_create: obj.account_create,
                    payment: obj.payment,
                    deposit: obj.deposit,
                    order_type: obj.orderType,
                    account_permission: obj.account_permission,
                    status: obj.status
                },
                auto: obj.isAuto
            }
                stream.list.push(oData);

            stream.sql += `insert into fx_orders(order_code,request_id,account_create,account_to,payment,deposit,status,order_type,account_permission,description,customer_code,paid) values(?,?,?,?,?,?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE  status = ?;`;
            stream.values.push(obj.order_code);
            stream.values.push(obj.requestId);
            stream.values.push(obj.account_create);
            stream.values.push(obj.account_to);
            stream.values.push(obj.payment);
            stream.values.push(obj.deposit);
            stream.values.push(obj.status);
            stream.values.push(obj.orderType);
            stream.values.push(obj.account_permission);
            stream.values.push(obj.description);
            stream.values.push(obj.customer_code);
            stream.values.push(obj.paid);

            stream.values.push(obj.status);





        
            stream.sql += `insert into fx_orders_history(order_code,request_id,account_create,account_to,payment,deposit,status,order_type,account_permission,description) values('${obj.order_code}','${obj.requestId}','${obj.account_create}','${obj.account_to}',${obj.payment}
            ,'${obj.deposit}',${obj.status},${obj.orderType},${obj.account_permission},'${obj.description}');`;
        } else {
            throw "error order sql" + JSON.stringify(obj);
        }
    }

    AcceptOrder(req, res) {
        var body = req.body;
        var user = req.user;
        if (user && body.order_code) {
            this.GetOrderInfo(body.order_code)
            .then(data=>{
                console.log("GetOrderInfo",data);
                if(data){
                    if(data.account_to == user.account_id){
                        let sql = `Update fx_orders set status = ${OrderStatus.INPROCESS} where order_code = '${data.order_code}'`
                        mySqlController.Query(sql)
                        .then(da=>{
                            data.status = OrderStatus.INPROCESS;
                            myEmitter.emit(EmitType.SOCKET_EMIT, [
                                {
                                    account_id: [data.account_create,data.account_to],
                                    type: SocketApiKey.UPDATE_ORDER,
                                    data:data
                                }
                            ]);
                            res.json({
                                resultCode: 0
                            });
                        }).catch(e=>{
                            res.json({
                                resultCode: ResultCode.SQL_ERROR
                            });
                        })
                    } else {
                        res.json({
                            resultCode: ResultCode.INCORRECT_DATA
                        });
                    }
                }else {
                    res.json({
                        resultCode: ResultCode.INCORRECT_DATA
                    });
                }
            })

        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }


   async GetOrderInfo(order_code){
        return new Promise(async resolve=>{
            try {
                let str = `SELECT * FROM fx_orders where  order_code = '${order_code}'`;
                console.log("STR",str);
                let rows = await mySqlController.Query(str);
                if (rows && rows.length == 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            } catch (e) {
                resolve(null);
            }
        })
    }
  

    CancelOrder(req, res) {
        var body = req.body;
        var user = req.user;
        if (user &&  body.order_code) {
            this.GetOrderInfo(body.order_code)
            .then(data=>{
                console.log("GetOrderInfo",data);
                if(data){
                    if(data.account_create == user.account_id && data.status == 0){
                        let sql = `Update fx_orders set status = ${OrderStatus.CANCEL} where order_code = '${data.order_code}'`
                        mySqlController.Query(sql)
                        .then(da=>{
                            data.status = OrderStatus.CANCEL;
                            myEmitter.emit(EmitType.SOCKET_EMIT, [
                                {
                                    account_id: [data.account_create,data.account_to],
                                    type: SocketApiKey.UPDATE_ORDER,
                                    data:data
                                }
                            ]);
                            res.json({
                                resultCode: 0
                            });
                        }).catch(e=>{
                            res.json({
                                resultCode: ResultCode.SQL_ERROR
                            });
                        })
                    } else {
                        res.json({
                            resultCode: ResultCode.INCORRECT_DATA
                        });
                    }
                }else {
                    res.json({
                        resultCode: ResultCode.INCORRECT_DATA
                    });
                }
            })

        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }


    RejectOrder(req, res) {
        var body = req.body;
        var user = req.user;
        if (user && body.order_code) {
            this.GetOrderInfo(body.order_code)
            .then(data=>{
                console.log("GetOrderInfo",data);
                if(data){
                    if(data.account_to == user.account_id){
                        data.status = OrderStatus.REJECT;
                        gTask.listOrder.push(data);
                            res.json({
                                resultCode: 0
                            });
            }else {
                res.json({
                    resultCode: ResultCode.INCORRECT_DATA
                });
            }
        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    });
    }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    RefundOrder(req, res) {
        var body = req.body;
        var user = req.user;
        if (user && body.order_code) {
            this.GetOrderInfo(body.order_code)
            .then(data=>{
                console.log("GetOrderInfo",data);
                if(data){
                    if(data.account_to == user.account_id){
                        data.status = OrderStatus.REFUND;
                        gTask.listOrder.push(data);
                            res.json({
                                resultCode: 0
                            });
            }else {
                res.json({
                    resultCode: ResultCode.INCORRECT_DATA
                });
            }
        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    });
    }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    
    FinishOrder(req, res) {
        var body = req.body;
        var user = req.user;
        if (user && body.order_code) {
            this.GetOrderInfo(body.order_code)
            .then(data=>{
                console.log("GetOrderInfo",data);
                if(data){
                    if(data.account_create == user.account_id){
                        let sql = `Update fx_orders set status = ${OrderStatus.FINISHED} where order_code = '${data.order_code}'`
                        mySqlController.Query(sql)
                        .then(da=>{
                            data.status = OrderStatus.FINISHED;
                            myEmitter.emit(EmitType.SOCKET_EMIT, [
                                {
                                    account_id: [data.account_create,data.account_to],
                                    type: SocketApiKey.UPDATE_ORDER,
                                    data:data
                                }
                            ]);
                            res.json({
                                resultCode: 0
                            });
                        }).catch(e=>{
                            res.json({
                                resultCode: ResultCode.SQL_ERROR
                            });
                        })
                    } else {
                        res.json({
                            resultCode: ResultCode.INCORRECT_DATA
                        });
                    }
                }else {
                    res.json({
                        resultCode: ResultCode.INCORRECT_DATA
                    });
                }
            })

        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    DeliveryOrder(req, res) {
        var body = req.body;
        var user = req.user;
        if (user && body.order_code) {
            this.GetOrderInfo(body.order_code)
            .then(data=>{
                console.log("GetOrderInfo",data);
                if(data){
                    if(data.account_to == user.account_id){
                        let sql = `Update fx_orders set status = ${OrderStatus.DELIVERY} where order_code = '${data.order_code}'`
                        mySqlController.Query(sql)
                        .then(da=>{
                            data.status = OrderStatus.DELIVERY;
                            myEmitter.emit(EmitType.SOCKET_EMIT, [
                                {
                                    account_id: [data.account_create,data.account_to],
                                    type: SocketApiKey.UPDATE_ORDER,
                                    data:data
                                }
                            ]);
                            res.json({
                                resultCode: 0
                            });
                        }).catch(e=>{
                            res.json({
                                resultCode: ResultCode.SQL_ERROR
                            });
                        })
                    } else {
                        res.json({
                            resultCode: ResultCode.INCORRECT_DATA
                        });
                    }
                }else {
                    res.json({
                        resultCode: ResultCode.INCORRECT_DATA
                    });
                }
            })

        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdateOrder(req,res){
        
        var data = req.body;
        var user = req.user;
        if (user && data.order_code && data.order_status != undefined) {
            switch(data.order_status){
                case OrderStatus.REJECT:{
                    this.RejectOrder(req,res);
                    break;
                }
                case OrderStatus.REFUND: {
                    this.RefundOrder(req,res);
                    break;
                }
                case OrderStatus.FINISHED:{
                    this.FinishOrder(req,res);
                    break;
                }
                case OrderStatus.DELIVERY:{
                    this.DeliveryOrder(req,res);
                    break;
                }
                case OrderStatus.CANCEL:{
                    this.CancelOrder(req,res);
                    break;
                }
                case OrderType.INPROCESS:{
                    this.AcceptOrder(req,res);
                    break;
                }
                default:{
                    res.json({
                        resultCode: ResultCode.INCORRECT_DATA
                    })
                }
            }
        }else {
            res.json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }

      
    }
}



module.exports = new OrderController();