'use strict';
let SiteController = require('../mysql/site.controller');
class SiteRouter {
    constructor() {
    }
    intRouter(app) {

        app.route('/add_site')
            .post((a, b) => SiteController.AddSite(a, b));

        app.route('/update_site')
            .post((a, b) => SiteController.UpdateSite(a, b));

        app.route('/delete_site')
            .post((a, b) => SiteController.DeleteSite(a, b));

        app.route('/list_site')
            .post((a, b) => SiteController.ListSite(a, b));

    }

};
module.exports = new SiteRouter();