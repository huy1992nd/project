
var mySqlController = require('./mysql.controller');
var {ResultCode}  = require('./../../define')
class WebsiteController  {
    constructor(){};

    GetWebInit(req, res) {
        var data = req.body;
        
        let domain = req.headers.domain;
        if (domain) {
            var sql_query = `SELECT * FROM fx_webs where domain = ?`;
            mySqlController.ExeQuery({
                query: sql_query,
                values : [domain]
            }, function (err, rows, fields) {
                if (!err) {
                    if(rows && rows.length > 0) {
                        res.json({
                            resultCode: ResultCode.SUCCESS,
                            data: rows[0]
                        });
                    }else {
                        res.json({
                            resultCode: ResultCode.INCORRECT_DATA,
                            data: []
                        });
                    }
                  
                } else {
                    res.json({
                        resultCode: ResultCode.INCORRECT_DATA
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
        let domain = req.headers.domain;
        if (domain) {
            var sql_query = `SELECT * FROM fx_web_info where  domain = ?;`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [domain]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        resultCode: ResultCode.SUCCESS,
                        data: rows
                    });
                } else {
                    res.json({
                        resultCode: ResultCode.SUCCESS
                    });
                }
            });
        }
        else {
            res.json({
                resultCode: ResultCode.SUCCESS
            });
        }
    }
}

module.exports = new WebsiteController();