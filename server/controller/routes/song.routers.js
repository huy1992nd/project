'use strict';
let SongController = require('../mongo/song.controller');
class SongRouter {
    constructor() {
    }
    intRouter(app) {
        app.route('/list_song')
            .post((a, b) => SiteController.ListSong(a, b));
    }

};
module.exports = new SongRouter();