'use strict';
var mySqlController = require('./mysql.controller');
const config = require('config');
let { ResultCode } = require('../../define');

class TemplateController {
    constructor() {
    }

    async AddTemplate(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.template && data.type) {
            let check = await this.CheckExistTemplate(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_TEMPLATE
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_web_template` ( `template`, `account_create`, `type`, `description`) VALUES ( ?, ?, ?, ?);';
            let values = [];
            values.push(data.template);
            values.push(user.account_id);
            values.push(data.type);
            values.push(data.description ? data.description : "");
            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Add new template success'
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

    async UpdateTemplate(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.template && data.type) {
            let sql = 'update fx_web_template set   `account_create` = ?, `type` = ? , `description` = ?   where template = ? ';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    user.account_id,
                    data.type,
                    data.description ? data.description : "",
                    data.template
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update template success'
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

    DeleteTemplate(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.template) {
            let sql = `DELETE FROM fx_web_template WHERE template = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.template
                ]
            }, async (err, rows, fields) => {
                if (!err) {
                    await this.UpdateTemplateForWeb(data.template);
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Delete template success'
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

    ListTemplate(req, res) {
        let data = req.body;
        var user = req.user;
        if (user ) {
            var sql_query = `SELECT * FROM fx_web_template  `;
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

    CheckExistTemplate(data) {
        return new Promise(async resolve => {
            let str = `SELECT id FROM fx_web_template where  template = ? `;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.template,
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    UpdateTemplateForWeb(template) {
        return new Promise((resolve, reject)=>{
            let sql = 'update fx_webs set   `template` = ?   where template = ? ';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    "",
                    template
                ]
            }, (err, rows, fields) => {
                if (!err) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        })
        
    }

}


module.exports = new TemplateController();