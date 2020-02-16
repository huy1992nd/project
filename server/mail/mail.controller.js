
var fs = require('fs');
const mailer = require('nodemailer');
var ejs = require('ejs');
var path = require('path');
var appDir = path.dirname(require.main.filename).replace(new RegExp("\\\\", 'g'), '/');
var {TemplateMail} = require('./../define');
let config = require("config");
class MailController {
    constructor() {
        this.mailInfo = null;
        this.pathFolder =  appDir + '/mail/template/';
        this.Init(config.get("mailServer"));
    }
    Init(obj){
        this.mailInfo = obj;
      //  this.TestMail();
    }

    TestMail() {
    this.SendMail({
        sendTo:"haipc01224@gmail.com",
        subject: "test",
        template:TemplateMail.VERIFY_CODE
    },{
        codeVerify: "haipc"
    });
    }
    SendMail(obj,data) {
        return new Promise(resolve=>{
            console.log("SENDMAIL",obj,data);
            try{
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
                    html: ejs.render (fs.readFileSync(this.pathFolder + this.getFileTemplate(obj.template), 'utf-8') , data)
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                         console.log(error);
                         resolve(false);
                    }
                    resolve(true);
                });
            }catch(e) {
                console.log(e);
                resolve(false);
            }
        })
    }


    getFileTemplate(type){
        switch(type){
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