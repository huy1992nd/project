var SequelizeController = require('./../sequelize.controller');
var mySqlController = require('./../mysql.controller');

class MenuController {
    constructor() {

    }

    getListMenu = (req, res) => {
        var  data = req.body;
        
        let list_value = [];

        var sql_query = `select id, name, position, status from fx_info_menu`;
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
}



module.exports = new MenuController();