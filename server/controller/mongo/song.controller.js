'use strict';
const config = require('config');
const model = require('../model/model');
const Song = model.Song;
const FavoritesSong = model.FavoritesSong;
let { ResultCode } = require('../../define');
const DEFAUL_NUMBER_SONG_PER_PAGE = 30;
const NUMBER_TOP_LIKE = 10;
const NUMBER_TOP_VIEW = 8;
class SongController {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
    }

    async ListSong(req, res) {
        let data = req.body;
        var user = req.user;
        if (user) {
            try {
                let page = parseInt(req.query.page) || 1;
                let search = req.query.search || "";
                var condition = {
                    type: "2"
                };
                if (search) {
                    condition = {
                        $or: [
                            { "name": { '$regex': search }, "type": "2" },
                            { "singer": { '$regex': search }, "type": "2" }
                        ]
                    }
                }
                let number_of_page = req.number_of_page ? parseInt(req.number_of_page) : DEFAUL_NUMBER_SONG_PER_PAGE;
                let offset = number_of_page * parseInt(page - 1);
                let list_song = await Song.find(
                    condition,
                    {},
                    { skip: offset, limit: number_of_page }
                ).sort({ "name": 1 });
                res.status(200).json({
                    page: page,
                    data: list_song
                });
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async Song(req, res) {
        var user = req.user;
        if (user) {
            try {
                let id_song = parseInt(req.query.id_song) || 0;
                let song = await Song.findOne({ type: "2", song_id: id_song }, {}, {});
                res.status(200).json({
                    data: song
                });
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async listPageSong(req, res) {
        var user = req.user;
        if (user) {
            try {
                var condition = {
                    type: "2"
                };
                let search = req.query.search || "";
                var condition = {
                    type: "2"
                };
                if (search) {
                    condition = {
                        $or: [
                            { "name": { '$regex': search }, "type": "2" },
                            { "singer": { '$regex': search }, "type": "2" }
                        ]
                    }
                }
                let count = await Song.find(condition, {}, {}).count();
                let number_of_page = req.number_of_page ? parseInt(req.number_of_page) : DEFAUL_NUMBER_SONG_PER_PAGE;
                var result = [];
                let number_page = Math.ceil(count / number_of_page);
                for (let i = 0; i < number_page; i++) {
                    result.push(i + 1);
                }
                res.status(200).json({
                    data: result
                });
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async listLike(req, res) {
        var user = req.user;
        if (user) {
            try {
                let list_favorites = await FavoritesSong.find({ account_id: user.account_id, status: true }, {}, {});
                var list_result = {};
                list_favorites.forEach(item => {
                    list_result[item.song_id] = true;
                })
                res.status(200).json({
                    data: list_result
                });
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async listFavorites(req, res) {
        var user = req.user;
        if (user) {
            try {
                FavoritesSong.aggregate([
                    {$match : {status : true, account_id:user.account_id}},
                    { $lookup:
                      {
                        from: 'song',
                        localField: 'song_id',
                        foreignField: 'song_id',
                        as: 'songData'
                      }
                    }
                  ], (err, result) => {
                    if (err) {
                        res.status(500).json({
                            result_code: ResultCode.NOT_SUCCESS
                        });
                        throw err;
                    }
                    let list_result = [];
                    result.forEach(item=>{
                        if(item && item.songData && item.songData[0]){
                            list_result.push(item.songData[0]);
                        }
                    })
                    res.status(200).json({
                        data: list_result
                    });
                });
               
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async updateFavorites(req, res) {
        var user = req.user;
        var body = req.body;
        if (user && body.song_id) {
            try {
                let status = body.status ? true : false;
                await FavoritesSong.findOneAndUpdate({
                    account_id: body.account_id,
                    song_id: body.song_id
                }, {
                    $set: {
                        status: status
                    }
                }, { upsert: true }, (err, result) => {
                    if (err) {
                        console.log('Have error when update status favorites', err, user);
                        res.status(500).json({
                            result_code: ResultCode.NOT_SUCCESS
                        });
                    } else {
                        res.status(200).json({
                            result_code: 0
                        });
                    }
                });
              
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async topLike(req, res) {
        var user = req.user;
        if (user) {
            try {
                let list_favorites = await FavoritesSong.aggregate([
                    { $match: { status: true } },
                    { $group: { song_id: "$song_id", count: { $sum: 1 } } },
                    {
                        $sort: { count: -1 }
                    },
                    { $limit: NUMBER_TOP_LIKE }
                ], (err, result) => {
                    if (err) throw err
                });
                var list_song_id = [];
                list_favorites.forEach(item => {
                    list_song_id.push(item.song_id);
                });

                var list_song = await Song.find({ song_id: { "$in": list_song_id }, type: "2" }, {}, {});

                res.status(200).json({
                    data: list_song
                });
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async topView(req, res) {
        var user = req.user;
        if (user) {
            try {
                var list_song = await Song.find({
                    type: "2"
                }, {},
                    { skip: 0, limit: NUMBER_TOP_VIEW }
                ).sort({ "view": -1 });

                res.status(200).json({
                    data: list_song
                });
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

    async updateView(req, res) {
        var user = req.user;
        var body = req.body;
        if (user && body._id) {
            try {
                Song.findOneAndUpdate({ _id: body._id }, { $inc: { view: 1 } }, { new: true }, function (err, response) {
                    if (err) {
                        res.status(500).json({
                            result_code: ResultCode.NOT_SUCCESS
                        });
                    } else {
                        res.status(200).json({
                            result_code: 0
                        });
                    }
                })
            } catch (error) {
                res.status(500).json({
                    result_code: ResultCode.NOT_SUCCESS
                });
            }

        } else {
            res.status(401).json({
                result_code: ResultCode.NOT_AUTHEN
            });
        }
    }

}


module.exports = new SongController();