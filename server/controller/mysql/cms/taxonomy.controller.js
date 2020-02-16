var mySqlController = require('./../mysql.controller');
var _ = require('lodash');

class TaxonomyController {
    constructor() {

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    getListTaxonomy(req, res) {
        var  data = req.body;
        var  paging = data.paging;
        var  user = req.user;
        if(typeof(paging) == "string"){
            paging = JSON.parse(paging);
        }
        let paging_str = "";
        if(paging){
            var offset = paging.offset? paging.offset : 0;
            var limit = paging.limit? paging.limit : 1000;
            paging_str = `LIMIT ${offset}, ${limit}`;
        }
        let list_value = [];

        var sql_query = `select id, parent, name, status FROM fx_info_taxonomy ${paging_str}`;
        mySqlController.ExeQuery({
            query: sql_query,
            values: list_value
        }, function (err, rows, fields) {
            if (!err) {
                //reformat data return                
                _.map(rows, (v, i) => {
                    v.parent_name = '';
                    if (v.parent !== 0) {
                        let idx = _.findIndex(rows, (o) => {
                            return o.id === v.parent
                        });
                        if (idx > 0) {
                            v.parent_name = rows[idx].name;
                        }
                    }
                });

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

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    postCreateTaxonomy(req, res) {
        var data = req.body;
        var user = req.user;

        var sql_query = `insert into fx_info_taxonomy (
            parent, name, slug, taxonomy_type, excerpt, created_by, edited_by, 
            status, create_date, update_time, thumbnail, language, site
        ) values(
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?
        );`;
        
        let values = [];
        values.push(data.parent ? data.parent : null);
        values.push(data.name ? data.name : null);
        values.push(data.slug ? data.slug : null);
        values.push(data.taxonomy_type ? data.taxonomy_type : null);
        values.push(data.excerpt ? data.excerpt : null); //excerpt
        //values.push(data.index ? data.index : null); //index
        values.push(user.account_id ? user.account_id : null); //created by
        values.push(user.account_id ? user.account_id : null); //edited by
        values.push(data.status ? data.status : null); //status
        values.push(new Date()); //create_date
        values.push(new Date()); //update_time
        values.push(data.thumbnail ? data.thumbnail : null); //status
        values.push(data.language ? data.language : null); //language
        values.push(user.site ? user.site : null); //update_time

        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    message: 'add new taxonomy success'
                });
            } else {
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                });
            }
        });
    }

    /**
     * 
     */
    getEditTaxonomy(req, res) {
        let taxID = req.params.id;
        let sql_query = 'select * from fx_info_taxonomy where id = ? limit 1';
        let values = [];
        values.push(taxID);
        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    data: rows[0]
                });
            } else {
                res.json({
                    result_code: global.define.ResultCode.NOT_SUCCESS
                });
            }
        });
    }

    /**
     * 
     */
    postEditTaxonomy(req, res) {
        var data = req.body;
        var user = req.user;
        let sql_query = `update fx_info_taxonomy set parent = ?,  name = ?,
            slug = ?, edited_by = ?,  status = ?, update_time = ?
            where id = ?`;
        let values = [];
        values.push(data.parent ? data.parent : null);
        values.push(data.name ? data.name : null);
        values.push(data.slug ? data.slug : null);
        values.push(user.account_id ? user.account_id : null); //thumbnail
        values.push(data.status ? data.status : null); //content
        values.push(new Date()); //update_time
        values.push(parseInt(data.id));

        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    message: 'edit post success'
                });
            } else {
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                });
            }
        });
    }

    /**
     * 
     */
    getDeleteTaxonomy(req, res) {
        var id = req.params.id;
        let sql_query = `delete from fx_info_taxonomy where id = ?`;
        let values = [];
        values.push(parseInt(id));

        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    message: 'delete post success'
                });
            } else {
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                });
            }
        });
    }
}

module.exports = new TaxonomyController();
