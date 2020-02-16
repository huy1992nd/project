'use strict';
let symbolController = require('../mysql/symbol.controller');
class SymbolRouter {
    constructor() {
    }
    intRouter(app) {

        app.route('/add_symbol')
            .post((a, b) => symbolController.AddSymbol(a, b));

        app.route('/update_symbol')
            .post((a, b) => symbolController.UpdateSymbol(a, b));

        app.route('/delete_symbol')
            .post((a, b) => symbolController.DeleteSymbol(a, b));
        
        app.route('/list_symbol')
            .post((a, b) => symbolController.ListSymbol(a, b));

        app.route('/list_symbol_by_group')
            .post((a, b) => symbolController.ListSymbolByGroup(a, b));

        app.route('/add_group_symbol')
            .post((a, b) => symbolController.AddGroupSymbol(a, b));

        app.route('/update_group_symbol')
            .post((a, b) => symbolController.UpdateGroupSymbol(a, b));

        app.route('/delete_group_symbol')
            .post((a, b) => symbolController.DeleteGroupSymbol(a, b));

        app.route('/list_group_symbol')
            .post((a, b) => symbolController.ListGroupSymbol(a, b));

        app.route('/load_symbol_favorite_to_redis')
            .post((a, b) => symbolController.LoadAllFavoriteToRedis(a, b));

        app.route('/list_symbol_favorite')
            .post((a, b) => symbolController.ListSymbolFavorite(a, b));

        app.route('/add_symbol_favorite')
            .post((a, b) => symbolController.AddSymbolFavorite(a, b));
    }

};
module.exports = new SymbolRouter();