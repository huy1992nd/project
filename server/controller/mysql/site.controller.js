'use strict';
var mySqlController = require('./mysql.controller');
const config = require('config');
let { ResultCode } = require('../../define');

class SiteController {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
    }

    async AddSite(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.site  && data.from  && data.to && data.to >= data.from) {
            let check = await this.CheckExistSite(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_SITE
                });
                return;
            }
            check = await this.CheckExistFromTo(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_LIMIT_SITE
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_mt4_sites` ( `site`, `market`, `from`, `to`, `current`, `status`, `server_mt4`) VALUES ( ?, ?, ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.site);
            values.push(data.market? data.market :'demo');
            values.push(data.from);
            values.push(data.to);
            values.push(data.from);
            values.push(data.status? data.status : "new");
            values.push(data.server_mt4 ? data.server_mt4 : "HoldingFx-Demo");
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

    async UpdateSite(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.site  && data.from  && data.to && data.current && data.status && data.server_mt4 && data.to >= data.from) {
            let check = await this.CheckExistUpdateFromTo(data);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_LIMIT_SITE
                });
                return;
            }
            let sql = 'update fx_mt4_sites set   `from` = ?, `to` = ? , `current` = ?  , `status` = ? , server_mt4 = ?  where site = ? and market = ?';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.from,
                    data.to,
                    data.current,
                    data.status,
                    data.server_mt4,
                    data.site,
                    data.market,
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update site success'
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

    DeleteSite(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.site && data.market) {
            let sql = `DELETE FROM fx_mt4_sites WHERE site = ? and market = ?`;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.site,
                    user.market
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

    ListSite(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.market ) {
            var sql_query = `SELECT * FROM fx_mt4_sites where market = ? `;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [data.market]
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

    CheckExistSite(data) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_mt4_sites where  site = ? and market = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site,
                    data.market
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    CheckExistFromTo(data) {
        return new Promise(async resolve => {
            let str = `SELECT from , to  FROM fx_mt4_sites where  market = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site,
                    data.market
                ]
            });
            if (rows && rows.length >= 1) {
                let flag = false;
                rows.forEach(rows=>{
                    if(data.to >= rows.from && data.from <= row.to){
                        flag = true;
                    }
                });
                resolve(flag);
            } else {
                resolve(false);
            }
        })
    }

    CheckExistUpdateFromTo(data) {
        return new Promise(async resolve => {
            let str = `SELECT from , to  FROM fx_mt4_sites where  market = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    data.site,
                    data.market
                ]
            });
            if (rows && rows.length >= 1) {
                let flag = false;
                rows.forEach(rows=>{
                    if(data.to >= rows.from && data.from <= row.to && data.site != row.site ){
                        flag = true;
                    }
                });
                resolve(flag);
            } else {
                resolve(false);
            }
        })
    }

}


module.exports = new SiteController();