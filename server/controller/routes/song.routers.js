'use strict';
let SongController = require('../mongo/song.controller');
class SongRouter {
    constructor() {
    }
    intRouter(app) {
        app.route('/list_song')
            .get((a, b) => SongController.ListSong(a, b));
            
        app.route('/song')
            .get((a, b) => SongController.Song(a, b));

        app.route('/list_page_song')
            .get((a, b) => SongController.listPageSong(a, b));

        app.route('/list_like')
            .get((a, b) => SongController.listLike(a, b));
            
        app.route('/list_favorites')
            .get((a, b) => SongController.listFavorites(a, b));
        
        app.route('/update_like')
            .post((a, b) => SongController.updateFavorites(a, b));
            
        app.route('/top_like')
            .get((a, b) => SongController.topLike(a, b));

        app.route('/top_view')
            .get((a, b) => SongController.topView(a, b));

        app.route('/update_view')
            .post((a, b) => SongController.updateView(a, b));
    }
};
module.exports = new SongRouter();