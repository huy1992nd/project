'use strict';
const config = require('config');
const model = require('../model/model');
const Song = model.Song;
let { ResultCode } = require('../../define');

class SongController {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
    }

    ListSong(req, res) {
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

}


module.exports = new SongController();