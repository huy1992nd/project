'use strict';
var mySqlController = require('./mysql.controller');
const config = require('config');
let { ResultCode } = require('../../define');
let BaseController = require('./base.controller');
const redis_helper = require('../../lib/redis_helper');

class SymbolController extends BaseController {
    constructor() {
        super();
    }

    async AddSymbol(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.symbol && data.left && data.right && data.group && data.mt4_group) {
            let check = await this.CheckExistSymbol(data.symbol, user.site);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_SYMBOL
                });
                return;
            }

            var sql_query = 'INSERT INTO `fx_mt4_symbols` ( `symbol`, `market`, `left`, `right`, `site`, `group`, `mt4_group`, `server_mt4`, `status`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?);';
            let values = [];
            values.push(data.symbol);
            values.push(data.market ? data.market : 'demo');
            values.push(data.left);
            values.push(data.right);
            values.push(user.site ? user.site : "");
            values.push(data.group);
            values.push(data.mt4_group);
            values.push(data.server_mt4 ? data.server_mt4 : "'HoldingFx-Demo'");
            values.push(data.status ? data.status : "pending");

            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'add new symbol success'
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

    UpdateSymbol(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.symbol) {
            let sql = 'update fx_mt4_symbols set market = ?,  `left` = ?, `right` = ? , `group` = ? , mt4_group = ? , `status` = ? where symbol = ? and site = ?';
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.market ? data.market : "",
                    data.left ? data.left : "",
                    data.right ? data.right : "",
                    data.group,
                    data.mt4_group,
                    data.status ? data.status : 'pending',
                    data.symbol,
                    user.site
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update symbol success'
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

    DeleteSymbol(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.symbol) {
            let sql = `DELETE FROM fx_mt4_symbols WHERE symbol = ? and site = ?`;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.symbol,
                    user.site
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete symbol success'
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

    ListSymbol(req, res) {
        var user = req.user;
        var id = req.body.id;
        if (user) {
            var sql_query = `SELECT * FROM fx_mt4_symbols `;
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

    ListSymbolByGroup(req, res) {
        var user = req.user;
        var group = req.body.group;
        if (user && group) {
            var sql_query = 'SELECT * FROM fx_mt4_symbols  where  `group` like ?  and site = ?';
            mySqlController.ExeQuery({
                query: sql_query,
                values: [
                    group,
                    user.site
                ]
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

    async AddGroupSymbol(req, res) {
        var data = req.body;
        var user = req.user;
        if (user && data.group_name && data.group_display) {
            let check = await this.CheckExistGroup(data.group_name, user.site);
            if (check) {
                res.json({
                    result_code: global.define.ResultCode.EXIT_GROUP_SYMBOL
                });
                return;
            }

            var sql_query = `insert into fx_mt4_group_symbol (site, group_name, group_display, description, language)
            values(?,?,?,?,?);`;
            let values = [];
            values.push(user.site ? user.site : "");
            values.push(data.group_name);
            values.push(data.group_display);
            values.push(data.description ? data.description : "");
            values.push(data.language ? data.language : "vn");

            mySqlController.ExeQuery({
                query: sql_query,
                values: values
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'add new symbol success'
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

    UpdateGroupSymbol(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.group_name) {
            let sql = `update fx_mt4_group_symbol set 
            group_display = ?, 
            description = ?, 
            language = ?
             where group_name = ? and site = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.group_display ? data.group_display : "",
                    data.description ? data.description : "",
                    data.language ? data.language : "",
                    data.group_name,
                    user.site
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update group symbol success'
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

    async DeleteGroupSymbol(req, res) {
        let data = req.body;
        var user = req.user;
        if (user && data.group_name) {
            let sql = `DELETE FROM fx_mt4_group_symbol WHERE group_name = ? and site = ? `;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.group_name,
                    user.site
                ]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete group symbol success'
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

    ListGroupSymbol(req, res) {
        var user = req.user;
        if (user) {
            var sql_query = `SELECT * FROM fx_mt4_group_symbol  `;
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

    deleteListSymbolByGroup(group_name) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM fx_mt4_symbols WHERE `group` = ?';
            mySqlController.ExeQuery({
                query: sql,
                values: [group_name]
            }, function (err, rows, fields) {
                if (!err) {
                    resolve(true)
                } else {
                    reject(err);
                }
            });
        })
    }

    CheckExistSymbol(symbol, site) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_mt4_symbols where  symbol = ? and site = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    symbol,
                    site
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    CheckExistGroup(group_name, site) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM fx_mt4_group_symbol where  group_name = ? and site = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [
                    group_name,
                    site
                ]
            });
            if (rows && rows.length >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    async LoadAllFavoriteToRedis(req, res) {
        // Delete all key in redis 
        redis_helper.keys(keys => {
            let str_key = keys.filter(key => key.includes("favorite")).join(" ");
            if (str_key) {
                redis_helper.delete(str_key);
            }
        });
        //reupdate redis 
        let list_favorites = await new Promise( async (resolve, reject) => {
            let sql_query = `SELECT * FROM fx_mt4_symbol_favorites ; `;
            mySqlController.ExeQuery({
                query: sql_query
            }, async (err, rows, fields) => {
                if (!err) {
                    resolve(rows);
                }else{
                    reject(err);
                }
            });
        });
        let list_save = {};
        list_favorites.forEach(favorite => {
            let key_redis = `${favorite.market}_${favorite.login}_favorite`;
            if (list_save[key_redis] == undefined) {
                list_save[key_redis] = {};
            };
            list_save[key_redis][favorite.symbol] = 1;
        });
        Object.keys(list_save).forEach(key_redis => {
            let str_save = JSON.stringify(list_save[key_redis])
            redis_helper.set(key_redis, str_save);
        });
        res.json({
            result_code: global.define.ResultCode.SUCCESS,
            message: `load Favorite success`
        });
    }

    async ListSymbolFavorite(req, res) {
        let data = req.body;
        let user = req.user;
        if (user && data.market && user.site && data.login) {
            let key_redis = `${data.market}_${data.login}_favorite`;
            redis_helper.get(key_redis, (err, data_redis) => {
                let data_redis_obj = {};
                if (data_redis) {
                    data_redis_obj = data_redis;
                    res.status(200).json({
                        data: Object.keys(data_redis_obj)
                    })
                } else {
                    this.getFavoriteFromSql(data, user, res);
                }
            });

        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async getFavoriteFromSql(data, user, res) {
        let sql_query = 'Select * from `fx_mt4_symbol_favorites` where market = ? and site = ? and login = ? ;';
        let values = [];
        values.push(data.market);
        values.push(user.site);
        values.push(data.login);
        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, async (err, rows, fields) => {
            if (!err) {
                await this.reupdateListFavoriteInRedis(data.market, data.login, rows);
                res.status(200).json({
                    data: rows.map(item=>  item.symbol)
                })
            } else {
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                });
            }
        });
    }

    async AddSymbolFavorite(req, res) {
        let data = req.body;
        let user = req.user;
        if (user && data.symbol && data.market && user.site && data.login && data.flag != undefined) {
            let sql_query = "";
            if (data.flag) {
                sql_query = 'INSERT INTO `fx_mt4_symbol_favorites` ( `symbol`, `market`, `site`, `login`, `server_mt4`) VALUES ( ?, ?, ?, ?, ?);';
            } else {
                sql_query = `DELETE FROM fx_mt4_symbol_favorites WHERE symbol = ? and market = ? and site = ? and login = ? `;
            }
            let values = [];
            values.push(data.symbol);
            values.push(data.market);
            values.push(user.site);
            values.push(data.login);
            values.push(data.server_mt4 ? data.server_mt4 : "'HoldingFx-Demo'");
            let check = true;
            if (data.flag) {
                check = await this.CheckExitFavorite(values);
            }
            if (check) {
                mySqlController.ExeQuery({
                    query: sql_query,
                    values: values
                }, async (err, rows, fields) => {
                    if (!err) {
                        //reupdate in redis 
                        await this.reupdateFavoriteInRedis(data.market , data.login, data.flag, data.symbol);
                        res.json({
                            result_code: global.define.ResultCode.SUCCESS,
                            message: `${data.flag ? 'Add' : 'Delete'} new symbol_favorite success`
                        });
                    } else {
                        res.json({
                            result_code: global.define.ResultCode.SQL_ERROR,
                        });
                    }
                });
            } else {
                await this.reupdateFavoriteInRedis(data.market , data.login, data.flag, data.symbol);
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    message: `Favorite is add`
                });
            }


        } else {
            res.json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
    }

    async reupdateFavoriteInRedis(market, login , flag, symbol) {
        return new Promise((resolve, reject) => {
            let key_redis = `${market}_${login}_favorite`;
            redis_helper.get(key_redis, (err, data_redis) => {
                let data_redis_obj = {};
                if (data_redis) {
                    data_redis_obj = data_redis;
                    if (flag) {
                        data_redis_obj[symbol] = 1;
                    } else {
                        delete data_redis_obj[symbol];
                    }
                } else {
                    data_redis_obj[symbol] = 1;
                }
                redis_helper.set(key_redis, JSON.stringify(data_redis_obj));
                resolve(true);
            });
        });

    }

    async reupdateListFavoriteInRedis(market, login, list) {
        return new Promise((resolve, reject) => {
            let key_redis = `${market}_${login}_favorite`;
            let data_redis_obj = {};
            list.forEach(item=>{
                data_redis_obj[item.symbol] = 1;
            })
            redis_helper.set(key_redis, JSON.stringify(data_redis_obj));
            resolve(true);
        });

    }

    CheckExitFavorite(values) {
        return new Promise(async resolve => {
            let str = `SELECT * FROM  fx_mt4_symbol_favorites WHERE symbol = ? and market = ? and site = ? and login = ? `;
            let rows = await mySqlController.Query({
                query: str,
                values: values
            });
            if (rows && rows.length >= 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }

}


module.exports = new SymbolController();