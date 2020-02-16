

var mySqlController = require('./mysql.controller');
var crypto_controller = require('../../lib/util');
var jwt = require('jsonwebtoken');
let util = require('./../../lib/util');
let { log, logHacker } = require('./../../lib/log');
var verifyController = require('./../verify.controller');
const config = require('config');
const myEmitter = require('./../../lib/myemitter.js');
let { ResultCode, EmitType, KeyJwt , VerifyType } = require('./../../define')
var dateFormat = require('dateformat');
class CustomerController {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
    }

    //mobilde
    Login(req, res) {
        var data = req.body;
        if (data.account_id && data.password) {
            var sql_query = `SELECT account_id,user_name,site,active,password FROM fx_customer where  account_id = ? and site = ?`;
            let values = [data.account_id, req.headers.domain];
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, (err, rows, fields) => {
                // console.log(rows);
                if (rows && rows.length == 1) {
                    if (crypto_controller.validatePassword(data.password, rows[0].password)) {
                        var user = rows[0];

                        if (user.active) {
                            let passKey = util.md5(user.account_id + user.password);
                            res.json({
                                resultCode: 0,
                                user_name: user.user_name,
                                account_id: user.account_id,
                                token_authen: jwt.sign({ account_id: user.account_id, key: passKey, site: user.site,  Date: Date.now() }, KeyJwt)
                            });
                        } else {
                            res.json({
                                resultCode: global.define.ResultCode.BLOCKED
                            });
                        }

                    } else {
                        res.json({
                            resultCode: global.define.ResultCode.WRONG_PASSWORD
                        });
                    }
                }
                else
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS
                    });
            });
        } else if (data.token) {
            jwt.verify(data.token.trim(), KeyJwt, (err, user) => {
                if (err) {
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS
                    });
                } else {
                    if (user.Date && this.checkExtDate(user.Date)) {
                        var sql_query = `SELECT account_id,user_name,permission,active,password FROM fx_customer where  account_id = ? and site = ?`;
                        let values = [user.account_id, user.site];
                        mySqlController.ExeQuery({
                            query: sql_query,
                            values: values
                        }, (err, rows, fields) => {
                            // console.log(rows);
                            if (rows && rows.length == 1) {
                                var userData = rows[0];
                                let passKey = util.md5(userData.account_id + userData.password);
                                if (user.key == passKey && userData.active) {
                                    res.json({
                                        resultCode: 0,
                                        user_name: userData.user_name,
                                        account_id: userData.account_id,
                                        permission: userData.permission,
                                        token_authen: jwt.sign({ account_id: userData.account_id, key: passKey, site: userData.site, permission: userData.permission, Date: Date.now() }, KeyJwt)
                                    });
                                } else {
                                    res.json({
                                        resultCode: global.define.ResultCode.NOT_SUCCESS
                                    });
                                }
                            }
                        });
                    } else {
                        res.json({
                            resultCode: global.define.ResultCode.NOT_SUCCESS
                        });
                    }
                }
            });
        } else {
            res.json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    };

    checkExtDate(date) {
        try {
            if (Date.now() - date > this.ext_token)
                return false;
            else
                return true;
        } catch (err) {
            return false;
        };
    }

    async Register(req, res) {
        var data = req.body;
        var headers = req.headers;
        console.log("data register", data);
        if (data.user_name && data.password && data.account_id && data.phone_number && data.mail && data.identity_card) {
            let check = await this.CheckExistCustomer(data.account_id);
            if (check) {
                res.json({
                    resultCode: global.define.ResultCode.USER_EXISTED
                });
                return;
            }

            // check = await this.CheckExistMail(data.mail);
            // if (check) {
            //     res.json({
            //         resultCode: global.define.ResultCode.MAIL_EXISTED
            //     });
            //     return;
            // }
            var stream = {
                sql: "",
                values: [],
                list: []
            }

            stream.sql = `insert into fx_customer (account_id,user_name,password,phone_number,mail,refer_id,address,identity_card,gender,birth_day,site)
         values(?,?,?,?,?,?,?,?,?,?,?);`;

            stream.values.push(data.account_id);
            stream.values.push(data.user_name);
            stream.values.push(util.saltAndHash(data.password));
            stream.values.push(data.phone_number);
            stream.values.push(data.mail ? data.mail : "");
            stream.values.push(data.refer_id ? data.refer_id : "");
            stream.values.push(data.address ? data.address : "");
            stream.values.push(data.identity_card ? data.identity_card : "");
            stream.values.push(data.gender ? data.gender : "");
            stream.values.push(data.birth_day  ? dateFormat(new Date(data.birth_day), "yyyy-mm-dd") : "");
            stream.values.push(headers.domain ? headers.domain : "");

            mySqlController.ExeQuery({
                query: stream.sql,
                values: stream.values
            }, async (err, rows, fields) => {
                if (!err) {
                    data.type = VerifyType.REGISTER;
                    if(stream.list)
                        myEmitter.emit(EmitType.SOCKET_EMIT, stream.list);
                    res.json({
                        resultCode: global.define.ResultCode.SUCCESS,
                        message: 'register success'
                    });
                } else {
                    log.info("register customer err", err);
                    res.json({
                        resultCode: global.define.ResultCode.USER_EXISTED,
                        message: "Account existed."
                    });
                }
            });
        } else {
            res.status(401).json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    };

    //lever root
    //list danh sách user.
    ListAllCustomer(req, res) {
        var data = req.body;
        var paging = data.paging;
        if(typeof(paging) == "string"){
            paging = JSON.parse(paging);
        }
        var offset = paging.offset? paging.offset : 0;
        var limit = paging.limit? paging.limit : 1000;
        var sql_query = `SELECT account_id,user_name,identity_card,phone_number,mail,address,gender,birth_day,create_date,active,site FROM fx_customer LIMIT ${offset}, ${limit}`;
        mySqlController.ExeQuery({
            query: sql_query
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    resultCode: global.define.ResultCode.SUCCESS,
                    data: rows
                });
            } else {
                res.json({
                    resultCode: global.define.ResultCode.NOT_SUCCESS
                });
            }
        });
    }

    BlockCustomer(req, res) {
        var user = req.user;
        let sql_query = "";
        var data = req.body;

        if (user && data.account_id) {
            sql_query = 'update fx_customer set active = 0 where account_id = ? and site = ?';
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.account_id, user.site]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        message: 'update success'
                    });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });

        } else {
            res.status(401).json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    ActiveCustomer(req, res) {
        var user = req.user;
        let sql_query = "";
        var data = req.body;

        if (user && data.account_id) {
            sql_query = 'update fx_customer set active = 1 where account_id = ? and site = ?';
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.account_id, req.headers.domain]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        message: 'Active success'
                    });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });

        } else {
            res.status(401).json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async GetProfile(req, res) {
        let user = req.user;
        if (user) {
            let sql = `SELECT u.user_name, u.account_id,u.mail,u.phone_number,u.address,u.site,u.identity_card, u.gender, u.birth_day FROM fx_customer as u where u.account_id = '${user.account_id}' and u.site = '${user.site}'`;
            mySqlController.ExeQuery({
                query: sql
            }, function (err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        res.json({
                            resultCode: global.define.ResultCode.SUCCESS,
                            data: rows[0]
                        });
                    } else
                        res.json({
                            resultCode: global.define.ResultCode.NOT_SUCCESS,
                        });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });

        } else {
            res.json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdatePassword(req, res) {
        var data = req.body;
        let user = req.user;
        if (data.password_old && data.password_new) {
            var sql_query = `SELECT fx_customer.* FROM fx_customer where  account_id = ?`;
            let values = [user.account_id];
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, async (err, rows, fields) => {
                // console.log(rows);
                if (rows && rows.length == 1) {
                    if (crypto_controller.validatePassword(data.password_old, rows[0].password)) {
                        var user = rows[0];
                        if (user.active) {

                            var sql = `Update fx_customer set password = '${util.saltAndHash(data.password_new)}' where account_id = '${user.account_id}'`;

                            mySqlController.ExeQuery({
                                query: sql
                            }, function (err, rows, fields) {
                                if (!err) {

                                    res.json({
                                        resultCode: global.define.ResultCode.SUCCESS,
                                        message: "Update password success"

                                    });
                                } else {
                                    res.json({
                                        resultCode: global.define.ResultCode.NOT_SUCCESS
                                    });
                                }
                            });

                        } else {
                            res.json({
                                resultCode: global.define.ResultCode.BLOCKED
                            });
                        }

                    } else {
                        res.json({
                            resultCode: global.define.ResultCode.NOT_SUCCESS
                        });
                    }
                }
                else
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS
                    });
            });
        }
    }

    async CreateNewCustomer(req, res) {
        var data = req.body;
        var headers = req.headers;
        if (data.user_name && data.password && data.account_id) {
            let check = await this.CheckExistCustomer(data.account_id);
            if (check) {
                res.json({
                    resultCode: global.define.ResultCode.USER_EXISTED
                });
                return;
            }

            check = await this.CheckExistMail(data.mail);
            if (check) {
                res.json({
                    resultCode: global.define.ResultCode.MAIL_EXISTED
                });
                return;
            }
            var sql_query = `insert into fx_customer (account_id,user_name,password,phone_number,mail,refer_id,address,identity_card,gender,birth_day,site)
                values(?,?,?,?,?,?,?,?,?,?,?);`;

            let values = [];
            values.push(data.account_id);
            values.push(data.user_name);
            values.push(util.saltAndHash(data.password));
            values.push(data.phone_number);
            values.push(data.mail ? data.mail : "");
            values.push(data.refer_id ? data.refer_id : "");
            values.push(data.address ? data.address : "");
            values.push(data.identity_card ? data.identity_card : "");
            values.push(data.gender ? data.gender : "");
            values.push(data.birth_day ? data.birth_day : "");
            values.push(headers.site ? headers.site : "");

            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: global.define.ResultCode.SUCCESS,
                        message: 'add new account customer success'
                    });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.USER_EXISTED,
                    });
                }
            });
        } else {
            res.json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    UpdateProfile(req, res) {
        let data = req.body;
        var user = req.user;
        if (data.user_name && data.mail != null && data.phone_number != null) {
            let sql = `update fx_customer set user_name = ?,  mail = ?, phone_number = ? , 
            address = ?, 
            identity_card = ?, 
            gender = ?, 
            birth_day = ? 
            where account_id = ?`;
            mySqlController.ExeQuery({
                query: sql,
                values: [data.user_name, data.mail, data.phone_number,
                data.address ? data.address : "",
                data.identity_card ? data.identity_card : "",
                data.gender ? data.gender : "",
                data.birth_day ? data.birth_day : "",
                user.account_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: global.define.ResultCode.SUCCESS,
                        message: 'Update profile  success'
                    });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    GetPermission(account_id) {
        return new Promise(async resolve => {

            let str = `SELECT permission FROM fx_customer where  account_id = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [account_id]
            });
            if (rows && rows.length == 1) {

                resolve(rows[0].permission);
            } else {
                resolve(null);
            }
        })
    }

    CheckExistCustomer(account_id) {
        return new Promise(async resolve => {

            let str = `SELECT mail FROM fx_customer where  account_id = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [account_id]
            });
            if (rows && rows.length == 1) {

                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    async CheckExistMail(mail) {
        return new Promise(async resolve => {

            let str = `SELECT mail,account_id FROM fx_customer where  mail = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [mail]
            });
            if (rows && rows.length >= 1) {
                log.info(rows);
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    async VerifyMail(req, res) {
        var data = req.body;
        var user = req.user;
        if (data.session && data.verify_code && data.account_id) {
            let obj = verifyController.VerifyCode(data);
            if (obj.result == 1) {
                let sql = 'Update  fx_customer set permission = 0 where account_id = ? and permission = 3';
                mySqlController.ExeQuery({
                    query: sql,
                    values: [obj.data.account_id]
                }, function (err, rows, fields) {
                    if (!err) {
                        res.json({
                            resultCode: 0,
                            message: 'verify mail  success'
                        });
                    } else {
                        res.status(401).json({
                            resultCode: ResultCode.SQL_ERROR
                        });
                    }
                });
            } else {
                res.status(401).json({
                    resultCode: ResultCode.VERIFY_ERROR
                });
            }

        } else {
            logHacker.info(user, req.url);
            res.status(401).json({
                resultCode: ResultCode.INCORRECT_DATA
            });
        }
    }

    async GetCustomerProfile(req, res) {
        let user = req.user;
        let data = req.body;
        let sql = `SELECT u.user_name, u.mail, u.refer_id,u.my_currency,u.phone_number,u.address,u.site,u.identity_card,u.gender,u.birth_day FROM fx_customer as u where u.account_id = '${data.account_id}'`;
        mySqlController.ExeQuery({
            query: sql
        }, function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    res.json({
                        resultCode: global.define.ResultCode.SUCCESS,
                        data: rows[0]
                    });
                } else
                    res.json({
                        resultCode: global.define.ResultCode.NOT_SUCCESS,
                        data: {}
                    });
            } else {
                res.json({
                    resultCode: global.define.ResultCode.SQL_ERROR
                });
            }
        });
    }

    UpdateUserProfile(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.account_id && data.mail && data.user_name) {
            let sql = `update fx_customer set user_name = ?,  mail = ?, phone_number = ? , 
             address = ?,
             identity_card = ?,
             gender = ?,
             birth_day = ?,
             where account_id = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [data.user_name, data.mail, data.phone_number,
                data.address ? data.address : "",
                data.identity_card ? data.identity_card : "",
                data.gender ? data.gender : "",
                data.birth_day ? dateFormat(new Date(data.birth_day), "yyyy-mm-dd") : "",
                data.account_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: global.define.ResultCode.SUCCESS,
                        message: 'Update profile success'
                    });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }


    ResetCustomerPassword(req, res) {
        let data = req.body;
        var user = req.user;
        let password = util.saltAndHash("9");
        if (user && data.account_id) {
            let sql = `update fx_customer set password = ? where account_id = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [password, data.account_id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: global.define.ResultCode.SUCCESS,
                        message: 'Reset password  success'
                    });
                } else {
                    res.json({
                        resultCode: global.define.ResultCode.ResultCode.SQL_ERROR
                    });
                }
            });
        } else {
            res.json({
                resultCode: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    GetCustomerInfoByDomain(domain) {
        return new Promise(resolve => {
            let sql = 'select account_id,active,my_currency,identity_card,gender,birth_day from fx_customer where site = ?;';
            mySqlController.QueryValue(sql, [domain]).then(data => {
                if (data && data.length > 0)
                    resolve(data[0]);
                else {
                    resolve(null);
                }
            }).catch((data) => {
                resolve(null);
            })

        })
    }

}


module.exports = new CustomerController();