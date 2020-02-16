/**
 * Created by hieutv on 10/04/2017.
 */

"use strict";

// init config
const config = require('config');
const log = require('log4js').getLogger("api");
const bpex_define = require('./../define')
// init redis
const redis = require("redis"),
	redis_cli = redis.createClient(config.get('redis').port, config.get('redis').server, { password: config.get('redis').password });
redis_cli.on("error", function (err) {
	log.info("Error " + err);
});


exports.list = function (type, options, callback) {
	log.info("list begin lrange begin");
	redis_cli.lrange(type, options.from, options.to, function (err, reply) {
		log.info("lrange callback begin");
		if (err)
			callback(err);
		else {
			var lst = [];
			if (reply && reply.length) {
				reply.forEach(function (item) {
					if (item) {
						lst.push(JSON.parse(item));
					}
				})
			}
			callback(null, lst);
		}
		log.info("list end lrange callback end lrange end");
	});
};

exports.keys = function (callback) {
	redis_cli.keys('*', function (err, keys) {
		if (err) return console.log(err);
		callback(keys)
	});
}

exports.lpop = function (type, callback) {
	log.info("lpop begin");
	redis_cli.lpop(type, function (err, message) {
		if (err) {
			callback(err);
		}
		else {
			callback(message);
		}
		log.info("lpop end");
	});
};

exports.ltrim = function (type, option, callback) {
	log.info("ltrim begin");
	redis_cli.ltrim(type, option.from, option.to, function (err, message) {
		if (err) {
			callback(err);
			log.info("ltrim end error.");
		}
		else {
			callback(message);
			log.info("ltrim end normal.");
		}
	});
};
exports.get = function (type, callback) {
	redis_cli.get(type, function (err, reply) {
		if (err)
			callback(err);
		else {
			callback(null, JSON.parse(reply));
		}
	});
};
exports.getAsync = async function (type) {
	return new promise((resolve) => {
		redis_cli.get(type, function (err, reply) {
			if (err)
				resolve(null);
			else {
				resolve(JSON.parse(reply));
			}
		});
	})
};

exports.set = function (type, data, callback) {
	redis_cli.set(type, data);
};
exports.setAsync = async function (type, data) {
	return new Promise((resolve => {
		redis_cli.set(type, data, function (err) {
			resolve();
		});
	}))

};
exports.delete = function (type) {
	redis_cli.del(type);
};
exports.publish = function (type, data, callback) {
	redis_cli.publish(type, data);
};
exports.create_client = function () {
	var re = redis.createClient(config.get('redis').port, config.get('redis').server, { password: config.get('redis').password });
	re.on("error", function (err) {
		log.info("Error " + err);
	});
	return re;
};
