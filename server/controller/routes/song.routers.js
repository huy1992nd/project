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
    }
};
module.exports = new SongRouter();