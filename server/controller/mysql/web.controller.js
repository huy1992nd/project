'use strict';
var mySqlController = require('./mysql.controller');
const config = require('config');
let { ResultCode } = require('../../define');

class WebController {
    constructor() {
    }

    async AddWeb(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.site && data.template  && data.group_id) {
            let check = await this.CheckExistWeb(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_WEB
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_webs` ( `site`, `account_id`, `template`, `group_id`, `description`, `status`) VALUES ( ?, ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.site);
            values.push(user.account_id);
            values.push(data.template);
            values.push(data.group_id);
            values.push(data.description? data.description : "");
            values.push(data.status ? data.status : "0");
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Add new site success'
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

    async UpdateWeb(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.account_id && data.site  && data.template  && data.group_id  ) {
            let sql = 'update fx_webs set  `account_id` = ?, `template` = ? , `group_id` = ?  , `description` = ? , `status` = ?  where site = ? ';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.account_id,
                    data.template,
                    data.group_id,
                    data.description ? data.description  : "" ,
                    data.status,
                    data.site
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update web success'
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

    ListWeb(req, res) {
        let data = req.body;
        var user = req.user;
        if (user  ) {
            var sql_query = `SELECT * FROM fx_webs `;
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

    DeleteWeb(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.site) {
            let sql = `DELETE FROM fx_webs WHERE site = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.site
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete site success'
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

    CheckExistWeb(data) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_webs where  site = ? `;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site
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


module.exports = new WebController();