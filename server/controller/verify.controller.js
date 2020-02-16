const config = require('config');
const myEmitter = require('./../lib/myemitter.js');

var { EmitType, ResultCode, TemplateMail, VerifyType } = require('./../define');
let { log } = require('./../lib/log');
var mailController = require('./../mail/mail.controller');
let mySqlController = require('./mysql/mysql.controller');
class VerifyController {
    constructor() {
        this.obj = {};
        this.timeout = config.get("time_out_code");
    }


    RandomCode() {
        return Math.floor(Math.random() * (100000 - 20000)) + 20000;
    }
    SetTimeoutCode(key, time) {
        if (this.obj[key]) {
            this.obj[key].time = setTimeout(() => {
                if (this.obj[key])
                    delete this.obj[key];
            }, time);
        }
    }
    VerifyCode(data) {
        if (data.account_id && data.type && data.session && data.code) {
            let key = data.account_id + data.type + data.session;
            if (this.obj[key] && this.obj[key].code) {
                if (this.obj.key.code == data.code) {
                    clearTimeout(this.obj[key].time);
                    var objData = this.obj[key];
                    delete this.obj[key];
                    return {
                        result: 1,
                        data: objData
                    };
                }
                else {
                    this.obj[key].count++;
                    if (this.obj[key].count > 4)
                        return {
                            result: -1,
                            data: null
                        };
                    else
                        return {
                            result: 0,
                            data: null
                        };
                }
            } else {
                return {
                    result: -2,
                    data: null
                };;
            }
        } else {
            return {
                result: -2,
                data: null
            };;
        }
    }

    async VerifyApi(req, res) {
        var data = req.body;
        //let user = req.user;
        try {
            if (data.account_id && data.type) {
                var mail = null;
                if (data.type == VerifyType.REGISTER) {
                    mail = data.mail;
                } else {
                    var mail = await this.GetMyMail(data.account_id);
                }
                console.log("MAILL", mail);
                let session = Date.now();
                if (mail) {
                    let key = data.account_id + data.type + session;
                    if (this.obj[key]) {
                        clearTimeout(this.obj[key].time);
                    }
                    this.obj[key] = {
                        code: this.RandomCode(),
                        time: this.SetTimeoutCode(key, this.timeout),
                        account_id: data.account_id,
                        mail: mail,
                        count: 0
                    }

                    let result = await mailController.SendMail({
                        sendTo: mail,
                        subject: "[Sharectv] Mail code verify",
                        template: TemplateMail.VERIFY_CODE
                    }, {
                            codeVerify: this.obj[key].code,
                            mail: mail
                        });
                    // myEmitter.emit(EmitType.SEND_MAIL,{
                    //     mail: mail,
                    //     account_id: account_id,
                    //     type: data.verify_type,
                    //     verifyCode: this.obj.key.code
                    // })
                    if (result) {
                        res.json({
                            resultCode: 0,
                            session: session,
                            message: "Tạo mã code thành công."
                        });
                    } else {
                        res.json({
                            resultCode: ResultCode.SEND_MAIL_ERROR,
                            message: "send mail bị lỗi."
                        });
                    }


                } else {
                    res.status(401).json({
                        resultCode: ResultCode.MAIL_NOT_FOUND,
                        message: " Bạn chưa đăng kí mail."
                    });
                }
            } else {
                res.status(401).json({
                    resultCode: 100
                });
            }
        } catch (e) {
            log.info(e);
            res.status(401).json({
                resultCode: 100
            });
        }
    }

    CreateSessionMail(mail, data) {
        return new Promise(async resolve => {
            let session = Date.now();

            let key = data.account_id + data.type + session;
            if (this.obj[key]) {
                clearTimeout(this.obj[key].time);
            }
            this.obj[key] = {
                code: this.RandomCode(),
                time: this.SetTimeoutCode(key, this.timeout),
                account_id: data.account_id,
                mail: mail,
                data: data,
                count: 0
            }
            let result = false;
            switch(data.type) {
                case VerifyType.REGISTER: {

                     result = await mailController.SendMail({
                        sendTo: mail,
                        subject: "[Sharectv] Mail xác nhận đăng kí",
                        template: TemplateMail.VERIFY_CODE
                    }, {
                            codeVerify: this.obj[key].code,
                            mail: mail
                        });
                    break;
                }
                case VerifyType.SEND_MONEY: {
                    result = await mailController.SendMail({
                        sendTo: mail,
                        subject: "[Sharectv] Mail xác nhận chuyển tiền",
                        template: TemplateMail.TRANSFER_MONEY
                    }, {
                            codeVerify: this.obj[key].code,
                            mail: mail,
                            time: new Date().toISOString().
                            replace(/T/, ' ').      // replace T with a space
                            replace(/\..+/, ''),
                            amount: (+data.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                            typeTransaction: "Chuyển khoản",
                            recieveAccount: data.account_recieve,
                            message: "Chuyển tiền.",
                            deposit: data.deposit
                        });
                    break;
                }
                case VerifyType.ADD_MONEY: {
                    result = await mailController.SendMail({
                        sendTo: mail,
                        subject: "[Sharectv] Mail xác nhận thêm quỹ tiền.",
                        template: TemplateMail.ADD_MONEY
                    }, {
                            codeVerify: this.obj[key].code,
                            mail: mail,
                            time: new Date().toISOString().
                            replace(/T/, ' ').      // replace T with a space
                            replace(/\..+/, ''),
                            amount: (+data.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                            typeTransaction: "Nạp tiền",
                            message: "Chuyển tiền."
                        });
                    break;
                }
                default: {

                }
            }

          
            resolve({
                result: result,
                key: key
            })
        })
    }

    GetMyMail(account_id) {
        return new Promise(async resolve => {
            let str = `SELECT mail FROM fx_users where  account_id = ?`;
            let rows = await mySqlController.Query({
                query: str,
                values: [account_id]
            });
            if (rows && rows.length == 1) {

                resolve(rows[0].mail);
            } else {
                resolve(null);
            }
        })
    }

}
module.exports = new VerifyController();