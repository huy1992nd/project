/**
 * Created by nguyen.quang.huy on 01/03/2020.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('config');
var options = {
    //useMongoClient: true,
    auth: {
        user: config.get('mongodb').dbuser,
        password: config.get('mongodb').dbpass
    },
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
};

mongoose.Promise = global.Promise;

//Song
var SongSchema = new Schema({
    song_id: String,
    type: String,
    name: String,
    link_song: String,
    link_you_tube: String,
    link_image: String,
    content: Schema.Types.Mixed,
    singer: String,
    actor: String,
    view: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: 'song' });
SongSchema.index({ source : 1, name: 1 });

//mongoose.connect(config.get('dbURL'), options);
mongoose.connect(config.get('mongodb').URI, options, function (err) {
    if (err) throw err;
    console.log("connect mongodb done");
});

exports.Song = mongoose.model('Song', SongSchema);