'use strict';
const config = require('config');
const model = require('../model/model');
const Song = model.Song;
let { ResultCode } = require('../../define');
const DEFAUL_NUMBER_SONG_PER_PAGE =  30;

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
                if(search){
                    condition = {$or:[
                    {"name":{'$regex': search}, "type": "2"},
                    {"singer":{'$regex': search}, "type": "2"}
                  ]}
                }
                let number_of_page = req.number_of_page ? parseInt(req.number_of_page) : DEFAUL_NUMBER_SONG_PER_PAGE;
                let offset = number_of_page * parseInt(page - 1);
                let list_song = await Song.find(
                    condition,
                    {},
                    { skip: offset, limit: number_of_page }
                ).sort({"name": 1 });
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
                if(search){
                    condition = {$or:[
                    {"name":{'$regex': search}, "type": "2"},
                    {"singer":{'$regex': search}, "type": "2"}
                  ]}
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

}


module.exports = new SongController();