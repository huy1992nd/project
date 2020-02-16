

var mySqlController = require('./mysql.controller');
var crypto_controller = require('../../lib/util');
var userController = require('./user.controller');
var jwt = require('jsonwebtoken');
var { log } = require('./../../lib/log');
const myEmitter = require('./../../lib/myemitter.js');
let logController = require('./log.controller');
let { ResultCode, UserPermission, EmitType, ProductStatus, LogAction, LOGType,SocketApiKey,CODE_ID,SOCKET_GROUP } = require('./../../define')

class GroupController {
    constructor() {
    }

    //mobilde
    ListMyGroup(req, res) {
        var data = req.body;
        var sql_query = '';
        var user = req.user;
        let values = [];
        if (user.permission == UserPermission.RETAILER) {
            sql_query = `SELECT * FROM fx_groups where  account_create = ?`;
            values.push(user.account_id);

        } else if (user.permission == UserPermission.ROOT) {
            sql_query = `SELECT * FROM fx_groups`;
        } else {
            res.status(401).json({
                resultCode: 20
            });
        }
        mySqlController.ExeQuery({
            query: sql_query,
            values: values
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
    };

    ListUsersOfGroup(req, res) {
        var data = req.body;
        var sql_query = '';
        if (data.group_id) {
            sql_query = `SELECT * FROM fx_group_members where  group_id = ?;`;


            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.group_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.HACKER
            });
        }
    };


    ListProductsOfGroup(req, res) {
        var data = req.body;
        var sql_query = '';
        if (data.group_id) {
            sql_query = `SELECT * FROM fx_group_settings where  group_id = ?;`;


            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.group_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        resultCode: 20
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        };
    }

    GetProductInGroupSetting(group_id, product_code) {
        return new Promise(resolve => {
            var sql = 'SELECT * FROM fx_group_settings where  group_id = ? and product_code = ?;';

            mySqlController.ExeQuery({
                query: sql,
                values: [group_id, product_code]
            }, function (err, rows, fields) {
                if (rows && rows.length == 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            });
        })
    }

    CreateGroupSQL(data,stream) {
        
        stream.sql += `insert into fx_groups (group_id,name,account_create,description,type,status)
        values(?,?,?,?,?,?);`;

        stream.sql += `insert into fx_group_members (group_id,account_id,permission,status) values (?,?,?,1);`;

           stream.values.push(data.group_id);
           stream.values.push(data.group_name);
           stream.values.push(data.create_account);
           stream.values.push(data.description ? data.description : '');
           stream.values.push(data.type ? data.type : '0');
           stream.values.push(data.status ? data.status : 0);
           stream.values.push(data.group_id);
           stream.values.push(data.create_account);
           stream.values.push(UserPermission.ADMIN_GROUP);

           stream.list.push({
            type: SocketApiKey.NEW_GROUP,
            socket_user: [data.create_account],
            data: data
        })
    }
    CreateGroup(req, res) {
        var data = req.body;
        let user = req.user;
        if (user && data.group_id && data.group_name) {
            data.account_create = user.account_id;
            var stream = {
                sql: "",
                values: [],
                list: []
            }
            this.CreateGroupSQL(data,stream);
            logController.CreateLogNotificationSQL({
                account_id: user.account_id,
                socket_user: [user.account_id], 
                action: LogAction.CREATE_GROUP,
                type: LOGType.NOTIFY,
                data:data
            }, stream);

            mySqlController.ExeQuery({
                query: stream.sql,
                values: stream.values
            }, function (err, rows, fields) {
                if (!err) {
                    if(stream.list.length) {
                        myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                    }
                    res.json({
                        resultCode: 0,
                        message: 'Create group success'
                    });
                } else {
                    res.status(401).json({
                        resultCode: 11
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };

    AddMemberGroup(req, res) {
        let data = req.body;
        if (data.permission) {
            switch (data.permission) {
                case UserPermission.MEMBER_GROUP: {
                    this.AddPublisher(req, res);
                    break;
                }
                // case UserPermission.MEMBER_GROUP: {
                //     this.AddMember(req, res);
                // }

                default: {
                    res.status(401).json({
                        resultCode: ResultCode.INCORRECT_DATA
                    });
                }
            }
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    VerifyAdminGroup(user, group_id) {
        return new Promise(resolve => {
            let sql = `select * from fx_groups where group_id = ? and account_create = ?;`;
            mySqlController.Query({ query: sql, values: [group_id, user.account_id] })
                .then(data => {
                    if (data.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(e => {
                    return false;
                });

        })
    }
    async AddMember(req, res) {
        var data = req.body;
        let user = req.user;
        if (user && data.group_id && data.account_id && data.permission && (data.permission == 12 || data.permission == 13)) {
            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            var sql_query = `insert into fx_group_members (group_id,account_id,permission,status) values (?,?,?,1);`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.group_id, data.account_id, data.permission]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: 0,
                        message: 'Add member success'
                    });
                } else {
                    res.status(401).json({
                        resultCode: 11
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };
    async AddPublisher(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.group_id && data.account_id) {

            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            let sql_select = `select * from fx_group_settings where group_id = ?`;

            mySqlController.Query({
                query: sql_select,
                values: [data.group_id]
            })
                .then(async (products) => {
                    var stream = {
                        sql: "",
                        values: [],
                        list: []
                    }
                    stream.sql = `insert into fx_group_members (group_id,account_id,permission,status) values (?,?,?,1);`;
                    stream.values.push(data.group_id);
                    stream.values.push(data.account_id);
                    stream.values.push(data.permission);

                    logController.CreateLogNotificationSQL({
                        account_id: user.account_id,
                        socket_user: [user.account_id], 
                        action: LogAction.ADD_MEMBER_GROUP,
                        type: LOGType.NOTIFY,
                        data: data
                    }, stream);

                    let permission = await userController.GetPermission(data.account_id);

                    if (products.length > 0) {
                        products.forEach(item => {
                            if (item.status == ProductStatus.ACTIVE) {
                                if (permission == UserPermission.PUBLISHER) {
                                    productController.CreateProductPublisherSQL({
                                        account_id: data.account_id,
                                        group_id: data.group_id,
                                        product_code: item.product_code,
                                        product_name: item.product_name,
                                        productType: item.product_type,
                                        campaign_id: item.campaign_id,
                                        image: item.image,
                                        price: item.price,
                                        deposit: item.deposit,
                                        status: ProductStatus.ACTIVE,
                                        account_create: user.account_id,
                                        campaignSub: item.campaign_sub
                                    }, stream);
                                } else if (permission == UserPermission.RETAILER) {
                                    productController.CreateProductRetailerSQL({
                                        account_id: data.account_id,
                                        group_id: data.group_id,
                                        product_code: item.product_code,
                                        product_name: item.product_name,
                                        productType: item.product_type,
                                        campaign_id: item.campaign_id,
                                        image: item.image,
                                        price: item.price,
                                        deposit: item.deposit,
                                        status: ProductStatus.ACTIVE,
                                        account_create: user.account_id,
                                        campaignSub: item.campaign_sub
                                    }, stream);
                                }

                                logController.CreateLogNotificationSQL({
                                    account_id: data.account_id,
                                    socket_user: [data.account_id], 
                                    action: LogAction.NEW_MUTIL_PRODUCT,
                                    type: LOGType.NOTIFY,
                                    data: {
                                        account_create: user.account_create,
                                        quantity: products.length
                                    }
                                }, stream);
                            }

                        })


                    }



                    mySqlController.TransactionValue(stream.sql, stream.values)
                        .then(data => {
                            if (stream.list.length > 0)
                                myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                            res.json({
                                resultCode: 0,
                                message: 'update success'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(401).json({
                                resultCode: 99
                            });
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(401).json({
                        resultCode: 99
                    });
                })
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };
    async RemoveProducts(req, res) {
        var data = req.body;
        var user = req.user;
        if (data.group_id && data.list_products) {

            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            let sql_select = `select * from fx_group_members where group_id = ? and permission != 12;`;


            mySqlController.Query({ query: sql_select, values: [data.group_id] })
                .then(async (members) => {

                    var stream = {
                        sql: "",
                        values: [],
                        list: []
                    };
                    if (data.list_products.length > 0) {


                        for (let i = 0; i < data.list_products.length; i++) {
                            stream.sql += 'delete from fx_group_settings where group_id = ? and product_code = ? and deposit = ?;';
                            let item = data.list_products[i];
                            stream.values.push(data.group_id);
                            stream.values.push(item.product_code);
                            stream.values.push(item.deposit);

                            logController.CreateLogNotificationSQL({
                                account_id: user.account_id,
                                socket_user: [user.account_id],
                                action: LogAction.REMOVE_PRODUCT_GROUP,
                                type: LOGType.NOTIFY,
                                data: Object.assign(item,{ group_id: data.group_id})
                            }, stream);
                        }

                        
                    // gửi thông tin đến web con      
                    stream.list.push({
                        socket_group:[data.group_id + SOCKET_GROUP.PRODUCT],
                        data : {
                            type: SocketApiKey.REMOVE_PRODUCT,
                            data: data.list_products
                        } 
                    });
                    }

                    if (members.length > 0 && data.list_products.length > 0) {
                        for (const item of members) {
                            let permission = await userController.GetPermission(item.account_id);
                            if (permission == UserPermission.PUBLISHER) {
                                data.list_products.forEach(async product => {

                                    productController.RemoveProductSQL({
                                        account_id: item.account_id,
                                        product_code: product.product_code,
                                        deposit: product.deposit,
                                        group_id: product.group_id
                                    }, stream, UserPermission.PUBLISHER);

                                    logController.CreateLogNotificationSQL({
                                        account_id: item.account_id,
                                        socket_user: [item.account_id],
                                        action: LogAction.REMOVE_PRODUCT,
                                        type: LOGType.NOTIFY,
                                        data: {
                                            product_code: product.product_code,
                                            product_name: product.product_name,
                                            campaign_id: product.campaign_id,
                                            price: product.price,
                                            deposit: product.deposit,
                                            account_create: user.account_id
                                        }
                                    }, stream);

                                    // productController.UpdateStatusProductSQL({
                                    //     account_id: item.account_id,
                                    //     group_id: item.group_id,
                                    //     deposit: product.deposit,
                                    //     product_code: product.product_code,
                                    //     status: ProductStatus.REMOVED,
                                    // }, stream, UserPermission.PUBLISHER);
                                })

                            } else if (permission == UserPermission.RETAILER) {
                                data.list_products.forEach(async product => {
                                    productController.RemoveProductSQL({
                                        account_id: item.account_id,
                                        product_code: product.product_code,
                                        deposit: product.deposit,
                                        group_id: product.group_id
                                    }, stream, UserPermission.RETAILER);

                                    logController.CreateLogNotificationSQL({
                                        account_id: item.account_id,
                                        socket_user:  [item.account_id],
                                        action: LogAction.REMOVE_PRODUCT,
                                        type: LOGType.NOTIFY,
                                        data: {
                                            product_code: product.product_code,
                                            product_name: product.product_name,
                                            campaign_id: product.campaign_id,
                                            price: product.price,
                                            deposit: product.deposit,
                                            account_create: user.account_id
                                        }
                                    }, stream);
                                    // productController.UpdateStatusProductSQL({
                                    //     account_id: item.account_id,
                                    //     deposit: product.deposit,
                                    //     group_id: item.group_id,
                                    //     product_code: product.product_code,
                                    //     status: ProductStatus.REMOVED,
                                    // }, stream, UserPermission.RETAILER);
                                })
                            }
                        }
                    }
                    mySqlController.TransactionValue(stream.sql, stream.values)
                        .then(data => {
                            if(stream.list.length >0)
                            myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                            res.json({
                                resultCode: 0,
                                message: 'remove success'
                            });
                        })
                        .catch(err => {
                            log.info("sql error", err);
                            res.status(401).json({
                                resultCode: 99
                            });
                        });
                })
                .catch(err => {
                    log.info("sql error", err);
                    res.status(401).json({
                        resultCode: 99
                    });
                })

        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    };

    async UpdateStatusListProduct(list, user) {
        for (const item of list) {
            item.isUpdate = true;
            let sql = 'SELECT * FROM fx_products_retailer where account_id = ? and product_code = ?';
            let product = await mySqlController.QueryValue(sql, [item.product_code, user.account_id]);
            if (product && product.length > 0) {
                if (product[0].status != ProductStatus.ACTIVE)
                    item.isUpdate = false;
            }
        }
    }
    async UpdateProductsGroup(req, res) {
        var data = req.body;
        var user = req.user;
        if (data.group_id && data.list_products) {

            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            let sql_select = `select * from fx_group_members where group_id = ? and permission != 12 ;`;

            await this.UpdateStatusListProduct(data.list_products, user);
            mySqlController.Query({ query: sql_select, values: [data.group_id] })
                .then(async (members) => {
                    var stream = {
                        sql: "",
                        list: [],
                        values: []
                    }
                    if (data.list_products.length > 0) {

                        let strLog = "";
                        for (let i = 0; i < data.list_products.length; i++) {
                            let item = data.list_products[i];

                            stream.sql += 'update fx_group_settings set price = ? , status = ? ,deposit = ? where product_code  = ? and group_id  = ?;';


                            let product = await this.GetProductInGroupSetting(data.group_id, item.product_code);
                            if (product) {
                                strLog += this.AddChangeProductLog(product, item);
                            }
                            log.info(strLog);

                            stream.values.push(item.price);
                            stream.values.push(item.status ? item.status : 1);
                            stream.values.push(item.deposit);
                            stream.values.push(item.product_code);
                            stream.values.push(data.group_id);
                        }

                        stream.list.push({
                            socket_group:[data.group_id + SOCKET_GROUP.PRODUCT],
                            data : {
                                type: SocketApiKey.UPDATE_PRODUCT,
                                data: data.list_products
                            } 
                        });
                    }
                    if (members.length > 0 && data.list_products.length > 0) {
                        for (const item of members) {
                            let permission = await userController.GetPermission(item.account_id);
                            if (permission == UserPermission.PUBLISHER) {
                                data.list_products.forEach(async product => {
                                    if (product.isUpdate) {
                                        productController.UpdateProductSQL({
                                            account_id: item.account_id,
                                            group_id: item.group_id,
                                            product_code: product.product_code,
                                            product_name: product.product_name,
                                            campaign_id: product.campaign_id,
                                            campaignSub: product.campaign_sub,
                                            account_create: user.account_id,
                                            productType: product.product_type,
                                            price: product.price,
                                            deposit: product.deposit,
                                            status: product.status,
                                            image: product.image
                                        }, stream, UserPermission.PUBLISHER);

                                        logController.CreateLogNotificationSQL({
                                            account_id: item.account_id,
                                            socket_user:  [item.account_id],
                                            action: LogAction.UPDATE_PRODUCT,
                                            
                                            type: LOGType.NOTIFY,
                                            data: {
                                                product_code: product.product_code,
                                                product_name: product.product_name,
                                                campaign_id: product.campaign_id,
                                                price: product.price,
                                                deposit: product.deposit,
                                                account_create: product.account_create
                                            }
                                        }, stream);
                                    }
                                })

                            } else if (permission == UserPermission.RETAILER) {
                                data.list_products.forEach(async product => {
                                    if (product.isUpdate) {
                                        productController.UpdateProductSQL({
                                            account_id: item.account_id,
                                            group_id: item.group_id,
                                            product_code: product.product_code,
                                            product_name: product.product_name,
                                            campaign_id: product.campaign_id,
                                            campaignSub: product.campaign_sub,
                                            account_create: user.account_id,
                                            productType: product.product_type,
                                            deposit: product.deposit,
                                            price: product.price,
                                            status: product.status,
                                            image: product.image
                                        }, stream, UserPermission.RETAILER);

                                        logController.CreateLogNotificationSQL({
                                            account_id: item.account_id,
                                            socket_user:  [item.account_id],
                                            action: LogAction.UPDATE_PRODUCT,
                                            type: LOGType.NOTIFY,
                                            data: {
                                                product_code: product.product_code,
                                                product_name: product.product_name,
                                                campaign_id: product.campaign_id,
                                                price: product.price,
                                                deposit: product.deposit,
                                                account_create: product.account_create
                                            }
                                        }, stream);
                                    }
                                })
                            }
                        }
                    }
                    mySqlController.TransactionValue(stream.sql, stream.values)
                        .then(data => {
                            myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                            res.json({
                                resultCode: 0,
                                message: 'update success'
                            });
                        })
                        .catch(err => {
                            log.info("sql error", err);
                            res.status(401).json({
                                resultCode: 99
                            });
                        });
                })
                .catch(err => {
                    log.info("sql error", err);
                    res.status(401).json({
                        resultCode: 99
                    });
                })

        } else {
            res.status(401).json({
                resultCode: 100
            });
        }
    };
    async InsertProductsGroup(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.group_id && data.list_products) {

            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            let sql_select = `select * from fx_group_members where group_id = ? and permission != 12`;


            mySqlController.Query({ query: sql_select, values: [data.group_id] })
                .then(async (members) => {
                    // let values = [];
                    // let sql_query = ``;

                    var stream = {
                        sql: "",
                        list: [],
                        values: []
                    }
                    if (!data.list_products) {
                        res.status(401).json({
                            resultCode: ResultCode.INCORRECT_DATA
                        });
                        return;
                    }
                    if (data.list_products.length > 0) {
                        stream.sql += 'insert into fx_group_settings (group_id,product_code,product_name,product_type,campaign_id,price,deposit,status,campaign_sub,image) values';
                        let listData = [];
                        for (let i = 0; i < data.list_products.length; i++) {
                            let item = data.list_products[i];

                            stream.values.push(data.group_id);
                            stream.values.push(item.product_code);
                            stream.values.push(item.product_name);
                            stream.values.push(item.product_type);
                            stream.values.push(item.campaign_id);
                            stream.values.push(item.price);
                            stream.values.push(item.deposit);
                            stream.values.push(item.status ? item.status : 1);
                            stream.values.push(item.campaign_sub);
                            stream.values.push(item.image ? item.image : "");
                            listData.push(`(?,?,?,?,?,?,?,?,?,?)`);
                        }
                        stream.sql += listData.join(',\n');
                        stream.sql += ';';

                        for (let i = 0; i < data.list_products.length; i++) {
                            let item = data.list_products[i];
                            logController.CreateLogNotificationSQL({
                                account_id: user.account_id,
                                socket_user:  [user.account_id],
                                action: LogAction.ADD_PRODUCT_GROUP,
                                type: LOGType.NOTIFY,
                                data: Object.assign(item,{
                                    group_id: data.group_id
                                })
                            }, stream);
                        }

                    // gửi thông tin đến web con      
                    stream.list.push({
                        socket_group:[data.group_id + SOCKET_GROUP.PRODUCT],
                        data : {
                            type: SocketApiKey.NEW_PRODUCT,
                            data: data.list_products
                        } 
                    });

                }
                    if (members.length > 0 && data.list_products.length > 0) {
                        for (const member of members) {
                            if (member.permission == UserPermission.MEMBER_GROUP) {
                                let permission = await userController.GetPermission(member.account_id);
                                data.list_products.forEach(item => {

                                    if (permission == UserPermission.PUBLISHER) {
                                        productController.CreateProductPublisherSQL({
                                            account_id: member.account_id,
                                            group_id: data.group_id,
                                            product_code: item.product_code,
                                            product_name: item.product_name,
                                            productType: item.product_type,
                                            campaign_id: item.campaign_id,
                                            price: item.price,
                                            deposit: item.deposit,
                                            status: item.status,
                                            account_create: user.account_id,
                                            campaignSub: item.campaign_sub,
                                            image: item.image
                                        }, stream);

                                        logController.CreateLogNotificationSQL({
                                            account_id: member.account_id,
                                            socket_user:  [member.account_id],
                                            action: LogAction.NEW_PRODUCT,
                                            type: LOGType.NOTIFY,
                                            data: {
                                                product_code: item.product_code,
                                                product_name: item.product_name,
                                                campaign_id: item.campaign_id,
                                                price: item.price,
                                                deposit: item.deposit,
                                                account_create: user.account_id
                                            }
                                        }, stream);

                                    } else if (permission == UserPermission.RETAILER) {
                                        productController.CreateProductRetailerSQL({
                                            account_id: member.account_id,
                                            group_id: data.group_id,
                                            product_code: item.product_code,
                                            product_name: item.product_name,
                                            productType: item.product_type,
                                            campaign_id: item.campaign_id,
                                            price: item.price,
                                            deposit: item.deposit,
                                            status: item.status,
                                            account_create: user.account_id,
                                            campaignSub: item.campaign_sub,
                                            image: item.image
                                        }, stream);

                                        logController.CreateLogNotificationSQL({
                                            account_id: member.account_id,
                                            socket_user:  [member.account_id],
                                            action: LogAction.NEW_PRODUCT,
                                            type: LOGType.NOTIFY,
                                            data: {
                                                product_code: item.product_code,
                                                product_name: item.product_name,
                                                campaign_id: item.campaign_id,
                                                price: item.price,
                                                deposit: item.deposit,
                                                account_create: user.account_id
                                            }
                                        }, stream);
                                    }

                                })
                            }
                        };
                    }
                    mySqlController.TransactionValue(stream.sql, stream.values)
                        .then(data => {
                            if (stream.list.length > 0)
                                myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                            res.json({
                                resultCode: 0,
                                message: 'Insert success'
                            });
                        })
                        .catch(err => {
                            log.info("sql error", err);
                            res.status(401).json({
                                resultCode: 99
                            });
                        });
                })
                .catch(err => {
                    log.info("sql error", err);
                    res.status(401).json({
                        resultCode: 99
                    });
                })

        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };
    async  RemoveGroup(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.group_id) {
            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            let sql = `select * from fx_groups where group_id = ? and account_create = ?;`;
            mySqlController.Query({ query: sql, values: [data.group_id, user.account_id] })
                .then(async data_temp => {
                    if (data_temp.length > 0) {
                        var stream = {
                            sql: "",
                            values: [],
                            list: []
                        }
                        stream.sql += ` delete from fx_group_members where  group_id = ?;`;
                        stream.values.push(data.group_id);

                        stream.sql += ` delete from fx_group_settings where  group_id = ?;`;
                        stream.values.push(data.group_id);

                        stream.sql += ` delete from fx_groups where  group_id = ?;`;
                        stream.values.push(data.group_id);


                        var listMember = await mySqlController.QueryValue(' select account_id,group_id from fx_group_members where group_id = ? and permission = ? ',
                            [data.group_id, UserPermission.MEMBER_GROUP]);
                        var list_product = await mySqlController.QueryValue('select * from fx_group_settings where group_id = ?', [data.group_id]);
                        if (list_product && list_product.length > 0) {

                             // gửi thông tin đến web con      
                    stream.list.push({
                        socket_group:[data.group_id + SOCKET_GROUP.PRODUCT],
                        data : {
                            type: SocketApiKey.REMOVE_PRODUCT,
                            data: data.list_product
                        } 
                    });

                            for (const item of listMember) {
                                let permission = await userController.GetPermission(item.account_id);
                                if (permission == UserPermission.PUBLISHER) {
                                    if (list_product) {
                                        list_product.forEach(async product => {
                                            // productController.UpdateStatusProductSQL({
                                            //     account_id: item.account_id,
                                            //     group_id: item.group_id,
                                            //     product_code: product.product_code,
                                            //     deposit: item.deposit,
                                            //     status: ProductStatus.REMOVED,
                                            // }, stream, UserPermission.PUBLISHER);
                                            productController.RemoveProductSQL({
                                                account_id: item.account_id,
                                                product_code: product.product_code,
                                                deposit: product.deposit,
                                                group_id: product.group_id
                                            }, stream, UserPermission.PUBLISHER);

                                            logController.CreateLogNotificationSQL({
                                                account_id: item.account_id,
                                                socket_user:  [item.account_id],
                                                action: LogAction.REMOVE_PRODUCT,
                                                type: LOGType.NOTIFY,
                                                data: {
                                                    product_code: product.product_code,
                                                    product_name: product.product_name,
                                                    campaign_id: product.campaign_id,
                                                    price: product.price,
                                                    deposit: product.deposit,
                                                    account_create: user.account_id
                                                }
                                            }, stream);

                                        })
                                    }
                                } else if (permission == UserPermission.RETAILER) {
                                    list_product.forEach(async product => {
                                        // productController.UpdateStatusProductSQL({
                                        //     account_id: item.account_id,
                                        //     group_id: item.group_id,
                                        //     deposit: item.deposit,
                                        //     product_code: product.product_code,
                                        //     status: ProductStatus.REMOVED,
                                        // }, stream, UserPermission.RETAILER);
                                        productController.RemoveProductSQL({
                                            account_id: item.account_id,
                                            product_code: product.product_code,
                                            deposit: product.deposit,
                                            group_id: product.group_id
                                        }, stream, UserPermission.RETAILER);

                                        logController.CreateLogNotificationSQL({
                                            account_id: item.account_id,
                                            socket_user:  [item.account_id],
                                            action: LogAction.REMOVE_PRODUCT,
                                            type: LOGType.NOTIFY,
                                            data: {
                                                product_code: product.product_code,
                                                product_name: product.product_name,
                                                campaign_id: product.campaign_id,
                                                price: product.price,
                                                deposit: product.deposit,
                                                account_create: user.account_id
                                            }
                                        }, stream);
                                    })
                                }
                            };
                        }

                        stream.list.push({
                            socket_group:[data.group_id + SOCKET_GROUP.PRODUCT],
                            data : {
                                type: SocketApiKey.REMOVE_PRODUCT,
                                data: list_product
                            } 
                        });


                        mySqlController.TransactionValue(stream.sql, stream.values)
                            .then(data_temp1 => {
                                myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                                res.json({
                                    resultCode: 0,
                                    message: 'Remove success'
                                });
                            })
                            .catch(err => {
                                res.status(401).json({
                                    resultCode: 11
                                });

                            });
                    } else {
                        res.status(401).json({
                            resultCode: ResultCode.NOT_PERMISSION,
                            message: " Không tìm thấy group định xóa. "
                        });
                    }
                })

        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };


    async RemoveMember(req, res) {
        var data = req.body;
        var user = req.user;
        if (data.group_id && data.account_id) {
            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            var stream = {
                sql: "",
                values: [],
                list: []
            }
            stream.sql += `delete from fx_group_members where account_id = ? and group_id =  ?;`;
            stream.values.push(data.account_id);
            stream.values.push(data.group_id);
            let permission = await userController.GetPermission(data.account_id);
            if (permission == UserPermission.PUBLISHER) {
                let list_product = await mySqlController.QueryValue(`select * from fx_products_publisher where account_id = ? and group_id = ? `,
                    [data.account_id, data.group_id]);
                //log.error(list_product);
                if (list_product) {
                    list_product.forEach(async item => {
                        // productController.UpdateStatusProductSQL({
                        //     account_id: item.account_id, group_id: item.group_id,
                        //     product_code: item.product_code,
                        //     deposit: item.deposit,
                        //     status: ProductStatus.REMOVED,
                        // }, stream, UserPermission.PUBLISHER);

                        productController.RemoveProductSQL({
                            account_id: item.account_id,
                            product_code: item.product_code,
                            deposit: item.deposit,
                            group_id: item.group_id
                        }, stream, UserPermission.PUBLISHER);

                        logController.CreateLogNotificationSQL({
                            account_id: item.account_id,
                            socket_user:  [item.account_id],
                            action: LogAction.REMOVE_PRODUCT,
                            type: LOGType.NOTIFY,
                            data: {
                                product_code: item.product_code,
                                product_name: item.product_name,
                                campaign_id: item.campaign_id,
                                price: item.price,
                                deposit: item.deposit,
                                account_create: user.account_id
                            }
                        }, stream);

                    })
                }
            } else if (permission == UserPermission.RETAILER) {
                let list_product = await mySqlController.QueryValue(`select * from fx_products_retailer where account_id = ? and group_id = ? `,
                    [data.account_id, data.group_id]);
                if (list_product) {
                    list_product.forEach(item => {
                        // productController.UpdateStatusProductSQL({
                        //     account_id: item.account_id, group_id: item.group_id,
                        //     product_code: item.product_code,
                        //     deposit: item.deposit,
                        //     status: ProductStatus.REMOVED,
                        // }, stream, UserPermission.RETAILER);

                        productController.RemoveProductSQL({
                            account_id: item.account_id,
                            product_code: item.product_code,
                            deposit: item.deposit,
                            group_id: item.group_id
                        }, stream, UserPermission.RETAILER);

                        logController.CreateLogNotificationSQL({
                            account_id: item.account_id,
                            socket_user:  [item.account_id],
                            action: LogAction.REMOVE_PRODUCT,
                            type: LOGType.NOTIFY,
                            data: {
                                product_code: item.product_code,
                                product_name: item.product_name,
                                campaign_id: item.campaign_id,
                                price: item.price,
                                deposit: item.deposit,
                                account_create: user.account_id
                            }
                        }, stream);
                    })
                }
            }


            mySqlController.TransactionValue(stream.sql, stream.values)
                .then(result => {

                    myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                    res.json({
                        resultCode: 0,
                        message: 'Remove success'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(401).json({
                        resultCode: 11
                    });

                });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };

    async ListGroupCTVJoined(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.account_id) {
            // let check = await this.VerifyAdminGroup(user, data.group_id);
            // if (!check) {
            //     res.status(401).json({
            //         resultCode: ResultCode.VERIFY_ERROR
            //     });
            //     return;
            // }
            var sql_query = `
            select a.group_id, a.name from fx_groups as a inner join fx_group_members as b on a.group_id = b.group_id
            where  a.account_create = '${user.account_id}' and b.account_id = '${data.account_id}'; `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [user.account_id, data.account_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: 0,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }


    async BlockGroup(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.group_id && data.account_id) {
            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            var sql_query = `update fx_groups set status = 0 where  group_id = ?; `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.group_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: 0,
                        message: "block success"
                    });
                } else {
                    res.status(401).json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };
    async ActiveGroup(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.group_id && data.account_id) {
            let check = await this.VerifyAdminGroup(user, data.group_id);
            if (!check) {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
                return;
            }
            var sql_query = `update fx_groups set status = 1 where  group_id = ?; `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.group_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: 0,
                        message: "active success"
                    });
                } else {
                    res.status(401).json({
                        resultCode: ResultCode.SQL_ERROR
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    };

    AddChangeProductLog(oldProduct, newProduct) {
        let str = `Sản phẩm ${oldProduct.product_name} , mã sản phẩn: ${oldProduct.product_code} đã được thay đổi `;
        if (oldProduct.price != newProduct.price) {
            str += ` giá: từ ${oldProduct.price}  sang ${newProduct.price}`;
        }
        if (oldProduct.status != newProduct.status) {
            str += ` status: từ  ${oldProduct.status} sang ${newProduct.status}`;
        }

        if (oldProduct.product_name != newProduct.product_name) {
            str += ` Tên: từ  ${oldProduct.product_name} sang ${newProduct.product_name}`;
        }

        if (oldProduct.deposit != newProduct.deposit) {
            str += ` đồng tiền: từ  ${oldProduct.product_name} sang ${newProduct.product_name}`;
        }

        str += ";";
        return str;
    }

    // CreateDefaultGroup(user) {
    //     return new Promise(resolve=>{
    //         if (user ) {

    //             let values = [];
    //             var sql_query = `insert into fx_groups (group_id,name,account_create,description,type,status)
    //          values(?,?,?,?,?,?);`;

    //             sql_query += `insert into fx_group_members (group_id,account_id,permission,status) values (?,?,?,1);`;

    //             values.push("group_"+ user.account_id);
    //             values.push(`group_${user.account_id} mặc định`);
    //             values.push(user.account_id);
    //             values.push('Đây là group mặc định khi ctv đăng kí.');
    //             values.push(1);
    //             values.push(data.status ? data.status : 0);
    //             values.push("group_"+ user.account_id);
    //             values.push(user.account_id);
    //             values.push(UserPermission.ADMIN_GROUP);

    //             mySqlController.ExeQuery({
    //                 query: sql_query,
    //                 values: values
    //             }, function (err, rows, fields) {
    //                 if (!err) {
    //                   resolve(true);
    //                 } else {
    //                  resolve(false);
    //                 }
    //             });
    //         }else resolve(false);
    //     })

    // };

}
module.exports = new GroupController();