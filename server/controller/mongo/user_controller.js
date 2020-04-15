const model = require('../model/model');
const UserSocial = model.UserSocial;
const jwt = require('jsonwebtoken');
const {  KeyJwt } = require('./../../define');

class User {
    constructor() {

    }

    async LoginSocial(req, res) {
        if( req.body.authToken){
            let login_type = req.body.login_type;
            jwt.verify(req.body.authToken.trim(), KeyJwt, async (err, user) => {
                if (err) {
                    res.json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                } else {
                    if (user.Date && this.checkExtDate(user.Date)) {
                        var userData = await UserSocial.findOne({ id: user.account_id }, {}, {});
                        if (userData) {
                            res.json({
                                result_code: 0,
                                user_name: userData.name,
                                account_id: userData.id,
                                permission: 0,
                                photoUrl: userData.photoUrl,
                                login_type: login_type,
                                token_authen: jwt.sign({ 
                                    account_id: userData.id,
                                    key: "", 
                                    site: "", 
                                    permission: null,
                                    Date: Date.now()  
                                }, KeyJwt
                                    )
                            });
                        } else {
                            res.json({
                                result_code: global.define.ResultCode.NOT_SUCCESS
                            });
                        }
                    } else {
                        res.json({
                            result_code: global.define.ResultCode.NOT_SUCCESS
                        });
                    }
                }
            });
        }else{
            res.json({
                result_code: global.define.ResultCode.NOT_SUCCESS
            });
        }
    }

    checkExtDate(date) {
        try {
            if (Date.now() - date > this.ext_token)
                return false;
            else
                return true;
        } catch (err) {
            return false;
        };
    }
}

module.exports = new User();