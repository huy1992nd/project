'use strict';
let SiteController = require('../mysql/template.controller');
class TemplateRouter {
    constructor() {
    }
    intRouter(app) {

        app.route('/add_template')
            .post((a, b) => SiteController.AddTemplate(a, b));

        app.route('/update_template')
            .post((a, b) => SiteController.UpdateTemplate(a, b));

        app.route('/delete_template')
            .post((a, b) => SiteController.DeleteTemplate(a, b));

        app.route('/list_template')
            .post((a, b) => SiteController.ListTemplate(a, b));

    }

};
module.exports = new TemplateRouter();