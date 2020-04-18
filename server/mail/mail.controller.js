
var fs = require('fs');
const mailer = require('nodemailer');
const model = require('../controller/model/model');
const df = require('../define');
const VerifyMail = model.VerifyMail;
var ejs = require('ejs');
var path = require('path');
var appDir = path.dirname(require.main.filename).replace(new RegExp("\\\\", 'g'), '/');
var { TemplateMail } = require('./../define');
let config = require("config");
const TIME_EXPIRSE = 10 * 60 * 1000;
class MailController {
    constructor() {
        this.mailInfo = null;
        this.pathFolder = appDir + '/mail/template/';
        this.Init(config.get("mailServer"));
    }

    Init(obj) {
        this.mailInfo = obj;
    }

    async sendMailRegister(account_id, email, calback) {
        if (account_id && email) {
            var code = this.generateCode();
            await VerifyMail.findOneAndUpdate({
                account_id: account_id,
                email: email,
            }, {
                $set: {
                    status: true,
                    template: 'verifyCode',
                    type: 'register',
                    code: code,
                    time: new Date().getTime()
                }
            }, { upsert: true }, async (err, result) => {
                if (err) {
                    console.log('Have error when update status favorites', err, result);
                    calback(err, null);
                } else {
                    let send_mail = await this.SendMail({
                        sendTo: email,
                        subject: "Mã đăng ký tài khoản",
                        template: 'verify_code',
                    },
                        {
                            "email":email,
                            "code":code,
                        }
                    )
                    if (send_mail) {
                        calback(null, {
                            status: true
                        })
                    } else {
                        calback(null, {
                            status: false
                        })
                    }
                }
            });
        }
    }

    async checkCode(data) {
        return new Promise(async (resolve, reject) => {

            let code_exit = await VerifyMail.findOne({
                type: data.type,
                account_id: data.account_id,
                email: data.email,
                code: data.verify_code
            },
                {},
                (err, result) => {
                });
            if (code_exit) {
                if (new Date().getTime() - code_exit.time < TIME_EXPIRSE) {

                    resolve({
                        status: true,
                        result_code: df.ResultCode.SUCCESS
                    })
                } else {
                    resolve({
                        status: false,
                        result_code: df.ResultCode.MAIL_VERIFY_REGIS_USER_EXPIRSE
                    })
                }

            } else {
                resolve({
                    status: false,
                    result_code: df.ResultCode.MAIL_VERIFY_REGIS_USER_NOT_EXIT
                })
            }
        })
    }

    generateCode() {
        return [1, 2, 3, 4, 5, 6].map(item => {
            return Math.floor(Math.random() * 10);
        }).join("");
    }

    TestMail() {
        this.SendMail({
            sendTo: "huy1992nd@gmail.com",
            subject: "test",
            template: TemplateMail.VERIFY_CODE
        }, {
            codeVerify: "haipc"
        });
    }

    SendMail(obj, data) {
        return new Promise(resolve => {
            console.log("SENDMAIL", obj, data);
            try {
                let transporter = mailer.createTransport({
                    host: this.mailInfo.host,
                    port: this.mailInfo.port,
                    secure: true,
                    auth: {
                        user: this.mailInfo.user,
                        pass: this.mailInfo.pass
                    }
                });

                let mailOptions = {
                    from: this.mailInfo.user,
                    to: obj.sendTo,
                    subject: obj.subject,
                    html: ejs.render(fs.readFileSync(this.pathFolder + this.getFileTemplate(obj.template), 'utf-8'), data)
                };
                transporter.sendMail(mailOptions, (er, info) => {
                    if (er) {
                        console.log('send mail ----->',er);
                        resolve(false);
                    }
                    resolve(true);
                });
            } catch (e) {
                console.log(e);
                resolve(false);
            }
        })
    }

    getFileTemplate(type) {
        switch (type) {
            case TemplateMail.VERIFY_CODE: {
                return "verifyCode.ejs";
            }
            case TemplateMail.TRANSFER_MONEY: {
                return "verifyTransfer.ejs";
            }
            case TemplateMail.ADD_MONEY: {
                return 'verifyAddmoney.ejs';
            }
            case TemplateMail.RESET_PASWORD: {
                return 'resetPassWord.ejs';
            };
        }

        return null;
    }
}


module.exports = new MailController();