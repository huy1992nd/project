var SequelizeController = require('./../sequelize.controller');
var mySqlController = require('./../mysql.controller');

class OrderController {
    constructor() {

    }
    
    /**
     * List all post
     * @param {*} req 
     * @param {*} res 
     */
    getListPost(req, res) {
        var  data = req.body;
        var  paging = data.paging;
        var  user = req.user;
        var  post_type = req.query.post_type;
        if(typeof(paging) == "string"){
            paging = JSON.parse(paging);
        }
        
        var condition_str = '';
        if (post_type) {
            condition_str = `where post_type = '${post_type}'`;
        }
        
        let paging_str = "";
        if(paging){
            var offset = paging.offset? paging.offset : 0;
            var limit = paging.limit? paging.limit : 1000;
            paging_str = `limit ${offset}, ${limit}`;
        }
        let list_value = [];

        var sql_query = `select id, thumbnail, post_title, post_author, post_status, create_date from fx_info_post ${paging_str} ${condition_str}`;
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
    
    getCreatePost(req, res) {
        var  data = req.body;
        
        let list_value = [];

        var sql_query = `select id, parent, name, status FROM fx_info_taxonomy where taxonomy_type = 'category'`;
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
                })

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
     * Create new post
     * @param {*} req 
     * @param {*} res 
     */
    postCreatePost(req, res) {
        var data = req.body;
        var user = req.user;

        var sql_query = `insert into fx_info_post (
            post_title, post_slug,
            post_excerpt, post_content, post_author, thumbnail, post_type, post_template, post_status,
            edited_by, publish_at, display, language, create_date, update_time, site
        )
        values(
            ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?
        );`;
        
        let values = [];
        values.push(data.post_title ? data.post_title : null);
        values.push(data.post_slug ? data.post_slug : null);
        values.push(data.post_excerpt ? data.post_excerpt : null);
        values.push(data.post_content ? data.post_content : null); //content
        values.push(user.account_id ? user.account_id : null); //author
        values.push(data.thumbnail ? data.thumbnail : null); //thumbnail
        values.push(data.post_type ? data.post_type : 'post'); //post_type
        values.push(data.post_template ? data.post_template : null); //post_template
        values.push(data.post_status ? data.post_status : 'publish');
        values.push(user.account_id ? user.account_id : null); //edited by
        values.push(data.publish_at ? new Date(data.publish_at) : new Date()); //publish_at
        values.push(data.display ? data.display : null); //display
        values.push(data.language ? data.language : null); //language
        values.push(new Date()); //create_date
        values.push(new Date()); //update_time
        values.push(user.site ? user.site : null); //update_time

        mySqlController.ExeQuery({
            query: sql_query,
            values: values
        }, function (err, rows, fields) {
            if (!err) {
                res.json({
                    result_code: global.define.ResultCode.SUCCESS,
                    message: 'add new post success'
                });
            } else {
                res.json({
                    result_code: global.define.ResultCode.SQL_ERROR,
                });
            }
        });
    }

    /**
     * get post by post id
     * @param {*} req 
     * @param {*} res 
     */
    getEditPost(req, res) {
        var postID = req.params.id;
        var sql_query = 'select * from fx_info_post where id = ? limit 1';
        let values = [];
        values.push(postID);
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
     * @param {*} req 
     * @param {*} res 
     */
    postEditPost(req, res) {
        var data = req.body;
        var user = req.user;
        let sql_query = `update fx_info_post set post_title = ?,  post_slug = ?,
            post_excerpt = ?, post_content = ?,  thumbnail = ?, post_template = ?, post_status = ?,
            edited_by = ?, publish_at = ?, display = ?, update_time = ?, site = ?
            where id = ?`;
        let values = [];
        values.push(data.post_title ? data.post_title : null);
        values.push(data.post_slug ? data.post_slug : null);
        values.push(data.post_excerpt ? data.post_excerpt : null);
        values.push(data.post_content ? data.post_content : null); //content
        values.push(data.thumbnail ? data.thumbnail : null); //thumbnail
        values.push(data.post_template ? data.post_template : null); //post_template
        values.push(data.post_status ? data.post_status : 'publish');
        values.push(user.account_id ? user.account_id : null); //edited by
        values.push(data.publish_at ? new Date(data.publish_at) : new Date()); //publish_at
        values.push(data.display ? data.display : null); //display
        values.push(data.language ? data.language : null); //language
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
     * @param {*} req 
     * @param {*} res 
     */
    getDeletePost(req, res) {
        var postID = req.params.id;
        //console.log(postID);
        //return false;
        let sql_query = `delete from fx_info_post where id = ?`;
        let values = [];
        values.push(parseInt(postID));

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



module.exports = new OrderController();
