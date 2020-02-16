/**
 * Created by haipc
 */
const config = require('config');
const log = require('log4js').getLogger("api");
const redis = require("redis");
const bpex_define = require('./../define');
const redis_helper = require('./../lib/redis_helper');
let {RedisChanel} = require('./../define');
let permissionController = require('./mysql/permission.controller')
class RedisController {
    constructor() {
        this.redis_cli = redis.createClient(config.get('redis').port, config.get('redis').server, { password: config.get('redis').password });
      
        this.init();
        //this.cleanDataRedis();
        this.listenEmmiter();
    }
    init() {
    }
    listenEmmiter() {
    
    }
    async GetUserPermission(accountId){
        let obj = redis_helper.getAsync(`${accountId}_${RedisChanel.PERMISSION}`);
        if(!obj){
            let data = await permissionController.GetPermissionByAccount(accountId);
            if(data){
                redis_helper.setAsync(`${accountId}_${RedisChanel.PERMISSION}`, data.ConvertObj("permission_name"));
                obj = data;
            }else {
                obj = {};
            }
        }
        return obj;
    }
    sendStartRestart() {
        config.get("ccy_list").forEach((ccy) => {
            let symbol = ccy.toLowerCase().split("_").join("");
            let keyRestart = bpex_define.Redis.g_redis_msg_reset_start + "_" + symbol;

            redis_helper.publish(bpex_define.Redis.g_redis_subscribe_message, keyRestart);

        });
    }
    cleanDataRedis() {
        try {
        
                // redis_helper.delete([bpex_define.Redis.g_redis_trade, symbol].join("_"));
                // log.info("redis delete", [bpex_define.Redis.g_redis_trade, symbol].join("_"));
        } catch (e) {
            log.info(new Date().toISOString(), 'Error while deleting key redis', e.code, e.message);
        }
    }
    readDataRedis() {
        try {

            // global.trade_symbols.forEach(function (ccy) {
            //     let symbol = ccy.toLowerCase().split("_").join("");
            //     redis_helper.get([bpex_define.Redis.g_redis_eod_b2c, symbol].join("_"), (err, data) => {
            //         if (data && data.sellExpense) {
            //             bpex_define.g_PreDaily_b2c[ccy] = data;
            //             bpex_define.g_PreDaily_b2c[ccy].is_run = true;
            //         }
            //     });
            // });
        } catch (e) {
            log.info(new Date().toISOString(), 'Error while reading key redis', e.code, e.message);
        }
    }

    registerChanels() {
        let redis_subscribe_message = redis_helper.create_client();


        // listen message from redis server
        redis_subscribe_message.on("message", (channel, message) => {

            if (!global.g_SystemStatus.marketStatus || !global.cluster.isMaster) return;
            this.analyzeMessage(message);
        });
            redis_subscribe_message.subscribe(bpex_define.Redis.g_redis_subscribe_message);
            redis_subscribe_price_engine_message.subscribe(bpex_define.Redis.g_redis_subscribe_price_engine_message);	// TODO add more ccy2 here.
    }
    analyzeMessage(message) {
      
    }
}

module.exports = new RedisController();