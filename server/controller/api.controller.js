var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cors = require('cors');
var express = require('express');
const path = require('path');
var userRouter = require('./routes/user.routers');
var customerRouter = require('./routes/customer.routers');
var PermissionRouter = require('./routes/permission.routers');
var SymbolRouter = require('./routes/symbol.routers');
var SiteRouter = require('./routes/site.routers');
var TemplateRouter = require('./routes/template.routers');
var WebRouter = require('./routes/web.routers');
var BankRouter = require('./routes/bank.routers');

//CMS
var PostRouter = require('./routes/cms/post.router');
var TaxonomyRouter = require('./routes/cms/taxonomy.router');
var MenuRouter = require('./routes/cms/menu.router');
var MenuNodeRouter = require('./routes/cms/menunode.router');

var mysqlController = require('./mysql/mysql.controller');

const config = require('config'); 
let socketServer = require('./socket/socket.server')
let { log,logHacker } = require('./../lib/log');
let redisController = require('./redis.controlller');
let rolesConfig = require('./routes/roles.config')

class ApiController {
  constructor() {
    this.app = express();
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);
    log.info("###################### START APP #####################################");
    log.info("--------------DEBUG------------------:" ,config.get("debug"))
    this.ext_token = config.get("ext_token") * 1000;
  
  }

  Init() {
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use((err, req, res, next) => {
      if (err) {
        log.warn('Invalid Request data');
        res.send('Invalid Request data');
      } else {
        next()
      }
    })
    this.app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
      // res.setHeader('Access-Control-Allow-Headers', 'Authorization');
      next();
    })

    this.app.use( (req, res, next) =>{
       console.log('req.url: ', req.url);
      if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization.trim(), global.define.KeyJwt,  (err, decode)=> {
          if (err) {
            return res.json({ resultCode: global.define.ResultCode.NOT_AUTHEN });
          }
          else {
            if(this.checkExtDate(decode.Date)) {
              req.user = decode;
              req.headers.domain = req.user.site;
              console.log(req.user);
              next();
            }else {
              return res.json({ resultCode: global.define.ResultCode.NOT_AUTHEN});
            }
          }
        })
      } else {
      //  console.log('Không có authen');
          req.user = undefined;
          next();
      }
    });
    this.app.use( (req, res, next) =>{
      if(!req.headers.domain)
        return res.json({  resultCode: global.define.ResultCode.INCORRECT_DATA });

      next();
    });

    this.InitRouter();
    this.IntWeb();
    this.LoadData();

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
  InitRouter() {
    log.info('init router');
    userRouter.intRouter(this.app);
    customerRouter.intRouter(this.app);
    PermissionRouter.intRouter(this.app);
    SymbolRouter.intRouter(this.app);
    SiteRouter.intRouter(this.app);

    TemplateRouter.intRouter(this.app);
    WebRouter.intRouter(this.app);
    PostRouter.intRouter(this.app);
    BankRouter.intRouter(this.app);
    TaxonomyRouter.intRouter(this.app);
    MenuRouter.intRouter(this.app);
    MenuNodeRouter.intRouter(this.app);
  }

  IntWeb() {
    // this.app.use(express.static(path.join(__dirname, './../../web/dist/web')));
    // this.app.use(express.static(path.join(__dirname, './../../../html')));
    this.app.use(express.static(path.join(__dirname, './../uploads')));
  }


  LoadData() {
    Promise.all([mysqlController.InitData()])
      .then(values => {
        socketServer.Init(this.io);
        let server = this.http.listen(config.get("port"), () => {
          var host = server.address().address
          var port = server.address().port
          log.info('monitor app api', host, port);
        });
      })
  }
  
  async VerifyPermission(account_id,url){
    if(!rolesConfig.API_PERMISSION[url])
          return true;
    if(!account_id)
      return false;
    let permissions = await redisController.GetUserPermission(account_id);
    if(!permissions || !permissions[rolesConfig.API_PERMISSION[url]])
        return false;
    else return true;
  }
}

module.exports = new ApiController();
