
let mySqlController = require('./../mysql/mysql.controller');
let { log, logHacker } = require('./../../lib/log');
let { ResultCode, EmitType, KeyJwt , VerifyType } = require('./../../define')
class PermissionController {
    constructor() {
    }

    listRoles(req, res) {
        var data = req.body;
        var user = req.user;
        var sql_query = "";
        if (user) {
            sql_query = `SELECT * FROM fx_roles`;
            mySqlController.ExeQuery({
                query: sql_query
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: 0,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        result_code: 20
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    ListModule(req, res) {
        var data = req.body;
        var user = req.user;
        var sql_query = "";
        if (user) {
            sql_query = `SELECT * FROM fx_module`;
            mySqlController.ExeQuery({
                query: sql_query
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: 0,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        result_code: 20
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    ListPermission(req, res) {
        var data = req.body;
        var user = req.user;
        var sql_query = "";
        if (user) {
            sql_query = `SELECT fx_permissions.* , fx_module.display_name as module_name FROM fx_permissions left join fx_module on fx_permissions.module = fx_module.name `;
            mySqlController.ExeQuery({
                query: sql_query
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: 0,
                        data: rows
                    });
                } else {
                    res.status(401).json({
                        result_code: 20
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    ListUserByPermission(req, res) {
        var user = req.user;
        var permission_id = req.body.permission_id;
        if (user) {
            var sql_query = `SELECT fx_users.* FROM fx_users  INNER JOIN fx_user_permission on fx_users.account_id = fx_user_permission.account_id   where 
            fx_user_permission.permission_id = ?`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [permission_id]
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

    async CreateRoles(req, res) {
        var data = req.body;
        var user = req.user;
        var headers = req.headers;
        if (user) {
            let exit_role = await this.CheckExistRole(data.name);
            if (exit_role) {
                res.status(401).json({
                    result_code: ResultCode.EXIT_ROLE
                });
            } else {
                var sql = `insert into fx_roles (name,display_name,description,site,created_by,language)
                values(?,?,?,?,?,?);`;
                var values = [];
                values.push(data.name);
                values.push(data.display_name);
                values.push(data.description ? data.description : "");
            values.push(user.site);
                values.push(user.account_id);
                values.push(data.language ? data.language : "");
                mySqlController.ExeQuery({
                    query: sql,
                    values: values
                }, async (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            result_code: global.define.ResultCode.SUCCESS,
                            message: 'create role success'
                        });
                    } else {
                        log.info("create role err", err);
                        res.json({
                            result_code: global.define.ResultCode.SQL_ERROR,
                            message: "SQL_ERROR"
                        });
                    }
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    UpdateRoles(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            let sql = `update fx_roles set 
            name = ?,  
            display_name = ?, 
            description = ? , 
            edited_by = ?, 
            language = ? 
            where id = ?`;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.name ? data.name : "",
                    data.display_name ? data.display_name : "",
                    data.description ? data.description : "",
                    user.account_id,
                    data.language ? data.language : "",
                    data.id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update roles success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    RemoveRoles(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            var sql = "DELETE FROM fx_roles WHERE name = ?;"
            var values = [];
            values.push(data.name);
            mySqlController.ExeQuery({
                query: sql,
                values: values
            }, async (err, rows, fields) => {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete role success'
                    });
                } else {
                    log.info("delete role err", err);
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR,
                        message: "SQL_ERROR"
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    GetPermissionByAccount(req, res) {
        var user = req.user;
        var accountId = req.body.account_id;
        this.GetPermissionByAccountId(user, accountId, res);
    }

    GetPermissionByRole(req, res) {
        var user = req.user;
        var role_id = req.body.role_id;
        if (user) {
            var sql_query = `SELECT fx_permissions.* FROM fx_permissions  INNER JOIN fx_permission_role on fx_permissions.id = fx_permission_role.permission_id   where 
            fx_permission_role.role_id = ?`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [role_id]
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

    async CreatePermission(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            let exit_permission = await this.CheckExitPermission(data.name);
            if (exit_permission) {
                res.status(401).json({
                    result_code: ResultCode.EXIT_PERMISSION
                });
            } else {
                var sql = `insert into fx_permissions (name,display_name,description,module,language)
         values(?,?,?,?,?);`;
                var values = [];
                values.push(data.name);
                values.push(data.display_name);
                values.push(data.description ? data.description : "");
                values.push(data.module ? data.module : "");
                values.push(data.language ? data.language : "");
                mySqlController.ExeQuery({
                    query: sql,
                    values: values
                }, async (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            result_code: global.define.ResultCode.SUCCESS,
                            message: 'create permission success'
                        });
                    } else {
                        log.info("create permission err", err);
                        res.json({
                            result_code: global.define.ResultCode.SQL_ERROR,
                            message: "SQL_ERROR"
                        });
                    }
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    UpdatePermission(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            let sql = `update fx_permissions set 
            name = ?,  
            display_name = ?, 
            description = ? , 
            module = ?, 
            language = ? 
            where id = ?`;
            mySqlController.ExeQuery({
                query: sql,
                values: [
                    data.name ? data.name : "",
                    data.display_name ? data.display_name : "",
                    data.description ? data.description : "",
                    data.module ? data.module : "",
                    data.language ? data.language : "",
                    data.id]
            }, function (err, rows, fields) {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'Update permission success'
                    });
                } else {
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    RemovePermission(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            var sql = "DELETE FROM fx_permissions WHERE name = ?;"
            var values = [];
            values.push(data.name);
            mySqlController.ExeQuery({
                query: sql,
                values: values
            }, async (err, rows, fields) => {
                if (!err) {
                    res.json({
                        result_code: global.define.ResultCode.SUCCESS,
                        message: 'delete permission success'
                    });
                } else {
                    log.info("delete permission err", err);
                    res.json({
                        result_code: global.define.ResultCode.SQL_ERROR,
                        message: "SQL_ERROR"
                    });
                }
            });
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdatePermissionForRole(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            let delete_all_permission = await new Promise((resolve, reject) => {
                let sql_delete = "DELETE FROM fx_permission_role WHERE role_id = ?;";
                mySqlController.ExeQuery({
                    query: sql_delete,
                    values: [data.role_id]
                }, async (err, rows, fields) => {
                    if (!err) {
                        resolve(true);
                    } else {
                        resolve(false)
                    }
                });
            })
            if (delete_all_permission) {
                let values = [];
                let sql = "INSERT INTO fx_permission_role (role_id, permission_id) VALUES ";
                var list_join = [];
                data.list_permission.forEach(element => {
                    list_join.push("(?, ?)");
                    values.push(data.role_id)
                    values.push(element);
                });
                sql = sql + list_join.join(",");
                mySqlController.ExeQuery({
                    query: sql,
                    values: values
                }, async (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            result_code: global.define.ResultCode.SUCCESS,
                            message: 'update permission success'
                        });
                    } else {
                        log.info("Can not update permission", err);
                        res.json({
                            result_code: global.define.ResultCode.SQL_ERROR,
                            message: "SQL_ERROR"
                        });
                    }
                });
            } else {
                log.info("Can not delete permission of role");
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                    message: "SQL_ERROR"
                });
            }
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    async UpdatePermissionForUser(req, res) {
        var data = req.body;
        var user = req.user;
        if (user) {
            let delete_all_permission = await new Promise((resolve, reject) => {
                let sql_delete = "DELETE FROM fx_user_permission WHERE account_id = ?;";
                mySqlController.ExeQuery({
                    query: sql_delete,
                    values: [data.account_id]
                }, async (err, rows, fields) => {
                    if (!err) {
                        resolve(true);
                    } else {
                        resolve(false)
                    }
                });
            })
            if (delete_all_permission) {
                let values = [];
                let sql = "INSERT INTO fx_user_permission (account_id, permission_id) VALUES ";
                var list_join = [];
                data.list_permission.forEach(element => {
                    list_join.push("(?, ?)");
                    values.push(data.account_id)
                    values.push(element);
                });
                sql = sql + list_join.join(",");
                sql = sql.trimRight(",");
                mySqlController.ExeQuery({
                    query: sql,
                    values: values
                }, async (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            result_code: global.define.ResultCode.SUCCESS,
                            message: 'update permission for user success'
                        });
                    } else {
                        log.info("Can not update permission for user", err);
                        res.json({
                            result_code: global.define.ResultCode.SQL_ERROR,
                            message: "SQL_ERROR"
                        });
                    }
                });
            } else {
                log.info("Can not delete permission of user");
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                    message: "SQL_ERROR"
                });
            }
        } else {
            res.status(401).json({
                result_code: ResultCode.INCORRECT_DATA
            });
        }
    }

    GetPermissionByAccountId(user, accountId, res) {
        if (user) {
            var sql_query = `SELECT fx_permissions.* FROM fx_permissions  INNER JOIN fx_user_permission on fx_permissions.id = fx_user_permission.permission_id   where 
           fx_user_permission.account_id = ?`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [accountId]
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

    CheckExistRole(name) {
        return new Promise(async resolve => {
            let str = `SELECT id FROM fx_roles where  name = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [name]
            });
            if (rows && rows.length == 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    CheckExitPermission(name) {
        return new Promise(async resolve => {
            let str = `SELECT id FROM fx_permissions where  name = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [name]
            });
            if (rows && rows.length == 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

}


module.exports = new PermissionController();