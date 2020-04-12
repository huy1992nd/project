'use strict';
const model = require('../controller/model/model');
const UserSocial = model.UserSocial;
const config = require("config")
var passport = require('passport'),
  FacebookTokenStrategy = require('passport-facebook-token');
module.exports = () => {
  passport.use(new FacebookTokenStrategy({
    clientID: config.get('face_book').CLIENT_ID,
    clientSecret: config.get('face_book').CLIENT_SECRET
  },
    async (accessToken, refreshToken, user, done) => {
      await UserSocial.findOneAndUpdate({ id: user.id }, {
        $set: {
          name: user.displayName,
          email: user.emails? user.emails[0].value : "",
          photoUrl: user.photos? user.photos[0].value : "",
          firstName: user.name.familyName,
          lastName: user.name.givenName,
          provider: user.provider
        }
      }, { upsert: true }, (err, result) => {
        if (err) {
          console.log('Have error when insert social user', err, user);
          return done(err, null);
        } else {
          return done(err, result);
        }
      });
    }));

};