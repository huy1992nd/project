'use strict';
var mySqlController = require('./mysql.controller');
const config = require('config');
let { ResultCode } = require('../../define');

class SiteController {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
    }

    async AddBank(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && user.permission == 9  && data.name  && data.code ) {
            let check = await this.CheckExistBank(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_SITE
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_banks` ( `country_code`, `name`, `code`, `active`, `language`) VALUES ( ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.country_code? data.country_code : "");
            values.push(data.name);
            values.push(data.code);
            values.push(data.active ? 1 : 0);
            values.push(data.language? data.language : 'vn');
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Add new banks success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR,
                    });
                }
            });
        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdateBank(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && user.permission == 9  && data.id ) {
            let sql = 'update fx_banks set   `country_code` = ?, `name` = ?, active = ? , `language` = ?   where id = ? ';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.country_code,
                    data.name,
                    data.active,
                    data.language,
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update bank success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    DeleteBank(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && user.permission == 9  && data.id) {
            let sql = `DELETE FROM fx_banks WHERE id = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete bank success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    ListBank(req, res) {
        let data = req.body;
        var user = req.user;
        if (user  ) {
            var sql_query = `SELECT * FROM fx_banks `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.site]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    ListBankSuggest(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.market ) {
            var sql_query = `SELECT * FROM fx_banks where site is null `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: []
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    CheckExistBank(data) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_banks where   code = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.code,
                    data.language
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    async AddBankAccount(req, res) {
        var data = req.body;
        var user = req.user;
        if (user  && data.bank_code  && data.account_number && data.account_user_name ) {
            let check = await this.CheckExistBankAccount(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_SITE
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_banks_account` ( `country_code`, `bank_code`, `account_number`, `account_user_name`, `branch`, `deposit`, `site`, `status`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.country_code? data.country_code : "");
            values.push(data.bank_code);
            values.push(data.account_number);
            values.push(data.account_user_name);
            values.push(data.branch ? data.branch : "");
            values.push(data.deposit? data.deposit : 'vn');
            values.push(data.site ? data.site : null);
            values.push(data.status ? 1 : 0);
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Add new banks success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR,
                    });
                }
            });
        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdateBankAccount(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.account_number  && data.account_user_name ) {
            let sql = 'update fx_banks_account set   `country_code` = ?,  `account_number` = ?, `account_user_name` = ?, branch = ? , `deposit` = ?, `status` = ?  where id = ?';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.country_code,
                    data.account_number,
                    data.account_user_name,
                    data.branch,
                    data.deposit,
                    data.status,
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update bank site success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    DeleteBankAccount(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.id) {
            let sql = `DELETE FROM fx_banks_account WHERE id = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete bank site success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    ListBankAccount(req, res) {
        let data = req.body;
        var user = req.user;
        if (user ) {
            var sql_query = `SELECT fx_banks_account.* , fx_banks.name as bank_name FROM fx_banks_account left join fx_banks on fx_banks_account.bank_code = fx_banks.code  where fx_banks_account.site = ? `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.site]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    CheckExistBankAccount(data) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_banks_account where  site = ? and bank_code = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site,
                    data.bank_code
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    async AddRate(req, res) {
        var data = req.body;
        var user = req.user;
        if (user  && data.left  && data.right && data.rate && data.type && data.site ) {
            let check = await this.CheckExistRate(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_SITE
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_site_currency_rate` ( `left`, `right`, `rate`, `type`, `site`) VALUES ( ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.left);
            values.push(data.right);
            values.push(data.rate);
            values.push(data.type);
            values.push(data.site);
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Add new rate site success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR,
                    });
                }
            });
        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdateRate(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.id ) {
            let sql = 'update fx_site_currency_rate set   `rate` = ?,  `type` = ?  where id = ?';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.rate,
                    data.type,
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update rate site success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    DeleteRate(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.id) {
            let sql = `DELETE FROM fx_site_currency_rate WHERE id = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete bank site success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    ListRate(req, res) {
        let data = req.body;
        var user = req.user;
        if (user ) {
            var sql_query = `SELECT fx_site_currency_rate.* FROM fx_site_currency_rate   where site = ? `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.site]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    ListCurrencies(req, res) {
        let data = req.body;
        var user = req.user;
        if (user ) {
            var sql_query = `SELECT *  FROM fx_currencies `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.site]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    CheckExistRate(data) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_site_currency_rate where  site = ? and left = ? and right = ? and type = ? `;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site,
                    data.left,
                    data.right,
                    data.type
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    async AddFee(req, res) {
        var data = req.body;
        var user = req.user;
        if (user  && data.site  && data.type && data.fee ) {
            let check = await this.CheckExistFee(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_SITE
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_fee` ( `site`, `type`, `fee`, `promotion_id`, `description`) VALUES ( ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.site);
            values.push(data.type);
            values.push(data.fee);
            values.push(data.promotion_id? data.promotion_id : 0);
            values.push(data.description);
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Add fee success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR,
                    });
                }
            });
        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdateFee(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.id ) {
            let sql = 'update fx_fee set   `fee` = ?,  `promotion_id` = ?, `description` = ?  where id = ?';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.fee,
                    data.promotion_id? data.promotion_id: 0,
                    data.description? data.description : "",
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update fee success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    DeleteFee(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.id) {
            let sql = `DELETE FROM fx_fee WHERE id = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.id
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete bank site success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }

    }

    ListFee(req, res) {
        let data = req.body;
        var user = req.user;
        if (user ) {
            let condition_admin = user.permission == 6 ?  'where site = ?' : '';
            var sql_query = `SELECT fx_fee.* FROM fx_fee  ${condition_admin} `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.site]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    CheckExistFee(data) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_fee where  site = ? and type = ?  `;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site,
                    data.type
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

}


module.exports = new SiteController();