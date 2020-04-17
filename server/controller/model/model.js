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
var UserSocialSchema = new Schema({
    id: String,
    name: String,
    email: String,
    photoUrl: String,
    firstName: String,
    lastName: String,
    provider: String,
    facebook: Schema.Types.Mixed,
    views: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: 'user_social' });
UserSocialSchema.index({ id : 1});

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

//favoriteSong
var FavoritesSongSchema = new Schema({
    song_id: String,
    account_id: String,
    song_type: String,
    status: Boolean,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: 'favorites_song' });
FavoritesSongSchema.index({ song_id : 1, account_id: 1 });

//verify mail
var VerifyMailSchema = new Schema({
    account_id: String,
    email: String,
    code: String,
    template: String,
    type: String,
    status: Boolean,
    time: Number,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: 'verify_mail' });
VerifyMailSchema.index({ type:1, account_id : 1, email: 1});

//mongoose.connect(config.get('dbURL'), options);
mongoose.connect(config.get('mongodb').URI, options, function (err) {
    if (err) throw err;
    console.log("connect mongodb done");
});

exports.Song = mongoose.model('Song', SongSchema);
exports.FavoritesSong = mongoose.model('FavoritesSong', FavoritesSongSchema);
exports.UserSocial = mongoose.model('UserSocial', UserSocialSchema);
exports.VerifyMail = mongoose.model('VerifyMail', VerifyMailSchema);