var SequelizeController = require('./../sequelize.controller');
var mySqlController = require('./../mysql.controller');
var _ = require('lodash');

class MenuController {
    constructor() {

    }

    /**
     *
     * @param req
     * @param res
     */
    getListMenuNode = (req, res) => {
        let  data = req.body;
        let  menu_id = req.query.menu_id;

        let list_value = [];

        var sql_query = `select * from fx_info_menu_node where menu_id = '${menu_id}'`;

        mySqlController.ExeQuery({
            query: sql_query,
            values: list_value
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
    }

    postCreateMenuNode = (req, res) => {
        var data = req.body;
        var user = req.user;

        var sql_query = `insert into fx_info_menu_node (
            menu_id, parent, name, slug, menu_type, type_id, thumbnail, url, status, 
            target, mega_menu, created_by, edited_by, create_date, update_time, is_home
        )
        values(
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?
        );`;

        let values = [];
        values.push(data.menu_id ? data.menu_id : 0);
        values.push(data.parent ? data.parent : 0);
        values.push(data.name ? data.name : '');
        values.push(data.slug ? data.slug : '');
        values.push(data.menu_type ? data.menu_type : '');
        values.push(data.type_id ? data.type_id : 0);
        values.push(data.thumbnail ? data.thumbnail : '');
        values.push(data.url ? data.url : '');
        values.push(data.status ? data.status : 'active');
        values.push(data.target ? data.target : '');
        values.push(data.mega_menu ? data.mega_menu : 0);
        values.push(user.account_id ? user.account_id : null);
        values.push(user.account_id ? user.account_id : null);
        values.push(new Date());
        values.push(new Date());
        values.push(user.is_home ? user.is_home : 0);

        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    message: 'add new menu node success'
                });
            } else {
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                });
            }
        });
    }
}



module.exports = new MenuController();
