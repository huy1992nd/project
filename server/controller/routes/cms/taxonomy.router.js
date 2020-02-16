// 'use strict';

let  taxonomyController = require('./../../mysql/cms/taxonomy.controller');

class TaxonomyRouter {
    
    constructor() {
    }

    intRouter(app){
        app.route("/cms/taxonomy/index")
            .get((a,b)=>taxonomyController.getListTaxonomy(a,b));

        app.route("/cms/taxonomy/create")
            .post((a,b)=>taxonomyController.postCreateTaxonomy(a,b));

        app.route("/cms/taxonomy/edit/:id")
            .get((a,b)=>taxonomyController.getEditTaxonomy(a,b));

        app.route("/cms/taxonomy/edit/:id")
            .post((a,b)=>taxonomyController.postEditTaxonomy(a,b));

        app.route("/cms/taxonomy/delete/:id")
            .get((a,b)=>taxonomyController.getDeleteTaxonomy(a,b));
    }
};

module.exports = new TaxonomyRouter();