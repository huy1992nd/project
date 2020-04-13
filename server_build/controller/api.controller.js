var bodyParser = require('body-parser');
const cors = require('cors');
var express = require('express');
const path = require('path');
const config = require('config');

class ApiController {
  constructor() {
    this.app = express();
    this.http = require('http').Server(this.app);
  }

  Init() {
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use((err, req, res, next) => {
      if (err) {
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

    this.app.use((req, res, next) => {
      console.log('req.url: ', req.url);
      next();
    });

    this.IntWeb();
    let server = this.http.listen(config.get("port"), () => {
      var host = server.address().address
      var port = server.address().port
      console.log('monitor app api', host, port);
    });

  }

  IntWeb() {
    console.log('path', path.join(__dirname, './../dist/dashboard/'));
    // this.app.use(express.static(path.join(__dirname, './../../web')));
    // this.app.use(express.static(path.join(__dirname, './../../../html')));
    this.app.use(express.static(path.join(__dirname, './../dist/dashboard/')));
    this.app.get('/*', (req, res) => { 
      res.sendFile(path.join(__dirname, './../dist/dashboard/', 'index.html')); 
      // or res.sendFile(path.join(__dirname, 'public', 'dist/index.html'));
    });
  }

}

module.exports = new ApiController();
