// 'use strict';

let postController = require('./../../mysql/cms/post.controller');

class OrderRouter {
    
    constructor() {
    }

    intRouter(app){
        app.route("/cms/post/index")
        .get((a,b)=>postController.getListPost(a,b));

        app.route("/cms/post/create")
        .get((a,b)=>postController.getCreatePost(a,b));

        app.route("/cms/post/create")
        .post((a,b)=>postController.postCreatePost(a,b));

        app.route("/cms/post/edit/:id")
        .get((a,b)=>postController.getEditPost(a,b));

        app.route("/cms/post/edit/:id")
        .post((a,b)=>postController.postEditPost(a,b));

        app.route("/cms/post/delete/:id")
        .get((a,b)=>postController.getDeletePost(a,b));
    }
};
module.exports = new OrderRouter();

