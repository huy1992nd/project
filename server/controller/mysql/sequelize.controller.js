const config = require('config');
const Sequelize = require('sequelize');
var mysql = require('mysql');
let { log } = require('./../../lib/log');
let { gSequence } = require('./../../define');

class SequelizeController {
    constructor() {
		this.sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
            host: config.mysql.host,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
        });
	}
}

module.exports = new SequelizeController();