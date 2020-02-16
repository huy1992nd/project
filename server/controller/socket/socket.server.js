//var http = require('http').createServer();
//var io = require('socket.io')
let config = require("config");
let { gTask, KeySocket, KeyJwt, TaskType,SocketApi,MessageType,EmitType} = require('./../../define')
let {log} = require('./../../lib/log')
var jwt = require('jsonwebtoken');
let myEmitter = require('./../../lib/myemitter')
class SocketServer {
    constructor() {
        this.listSocket = {};
        this.listCoreClient = {};
        this.listClient = {};
        //this.server = io(http);
        this.ext_token = config.get("ext_token") * 1000;
        this.listenEmmiter();

    }

    listenEmmiter() {
        myEmitter.on(EmitType.SOCKET_EMIT,(data)=> {
            console.log("socket_emit reciever",data);
                data.forEach(item=>{
                    if(item.socket_user && item.socket_user.length >0) {
                        item.socket_user.forEach(it=>{
                            this.SendDataToCLient(it,item.type,item.data);
                        }) 
                    }
                    if(item.socket_id){
                        this.SendDataToSocketID(item.socket_id,item.type,item.data);
                    }
                    if(item.socket_group && item.socket_group.length >0){
                        item.socket_group.forEach(it=>{
                            this.SendDataToSocketGroup(it,item.data);
                        }) 
                    }
            })
        });


        myEmitter.on(EmitType.SEND_MAIL,(data)=> {
            console.log("socket_emit reciever",data);
                data.forEach(item=>{
                    item.account_id.forEach(it=>{
                        this.SendDataToCLient(it,item.type,item.data);
                    }) 
            })
        });
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
    Init(server) {
        this.server = server;
        this.server.on('connection', (client) => {
            console.log("client info", client.id);
            client.isSctvCore = false;
            this.listSocket[client.id] = client;
            client.on('event', (data) => {
                console.log("data:", data);
            });
            client.on("get_action", (data) => {
                this.ClientgetDataAction(client);
            })

            client.on("client_callback", (data) => {
                log.info("data client_callback", data);
                switch (data.type) {
                    case TaskType.TASK_ORDER: {

                        client.clientType.TASK_ORDER = 1;
                        // let oData = data.data;
                        // if(data.status) {
                        //     this.SendDataToCLient(oData.account_create,SocketApi.ORDER,data);
                        // }else {
                        //     if(data.message == MessageType.NOT_ENOUGH_MONEY|| data.message == MessageType.TRANSACTION_ERROR) {
                        //         this.SendDataToCLient(oData.account_create,SocketApi.ORDER,data);
                        //     }else if(data.message == MessageType.RETAILER_NOT_ENOUGH_MONEY) {
                        //         this.SendDataToCLient(oData.account_to,SocketApi.ORDER,data);
                        //     }
                        // }
                        break;
                    }
                    case TaskType.TASK_ADD_MONEY: {
                        client.clientType.TASK_ADD_MONEY = 1;
                      //  this.SendDataToCLient(data.data.account_id,SocketApi.ADD_MONEY,data);
                        break;
                    }
                    case TaskType.TASK_TRANSFER: {
                        client.clientType.TASK_TRANSFER = 1;
                     //   this.SendDataToCLient(data.data.account_id,SocketApi.TRANSFER,data);
                        break;
                    }
                    case TaskType.TASK_PAYMENT: {
                        client.clientType.TASK_PAYMENT = 1;
                        //this.SendDataToCLient(data.data.account_id,SocketApi.TRANSFER,data);
                        break;
                    }
                }

                this.ClientgetDataAction(client);

            })
            client.on("socket_emit",data=>{
                console.log("socket_emit reciever",data);
                data.forEach(item=>{
                    item.account_id.forEach(it=>{
                        this.SendDataToCLient(it,item.type,item.data);
                    })   
                })
            })
            client.on("fx_client", data => {
                //console.log("fx_client", data);
                if (data && data.token) {
                    jwt.verify(data.token, KeyJwt, (err, user) => {
                        if (!err) {
                            if (this.checkExtDate(user.Date)) {
                                //console.log("vao day",this.listClient,user);
                                if (!this.listClient[user.account_id]){
                                //console.log("vao day1",this.listClient);
                                    
                                    this.listClient[user.account_id] =  {
                                    }
                                    this.listClient[user.account_id][client.id] = client;
                                }else {
                                
                                    
                                    this.listClient[user.account_id][client.id] = client;
                                }

                                client.account_id = user.account_id;
                                console.log("listClient",  Object.keys(this.listClient[user.account_id]).length);
                                client.emit("fx_client",{
                                    resultCode:0,
                                    message: "success"
                                })
                            } else {
                                client.emit("fx_client",{
                                    resultCode:1,
                                    message: "error"
                                })
                            }
                        }else {
                            client.emit("fx_client",{
                                resultCode:1,
                                message: "error"
                            })
                        }
                    });
                }
            })
            client.on("sharectv_core", (data) => {
                console.log(data);
                if (data.key == KeySocket) {
                    client.isSctvCore = true;
                    client.clientType = data;
                    console.log(client.clientType);
                    this.listCoreClient[client.id] = client;
                }
            })
          


            client.on('disconnect', () => {
                if(!client.isSctvCore && client.account_id && this.listClient[client.account_id] && this.listClient[client.account_id][client.id]){
                    delete this.listClient[client.account_id][client.id];
                }else if(client.isSctvCore) {
                     if(this.listCoreClient[client.id]) {
                        delete this.listCoreClient[client.id];
                     }
                }
                delete this.listSocket[client.id];
                console.log("client number: ", Object.keys(this.listSocket).length);
            });

      
        client.on('subscribe', function (msg) {
            var handshake = client.handshake;
			log.info('New subscribe from ', handshake);
            console.log("subscribe",msg);
            try {
                if (!msg.topics || msg.topics.length == 0)	// yyyy-mm-dd hh:mm:ss.ttt
                    throw "topics is empty"

                log.info("subscribe", JSON.stringify(msg, null, "\t"));

                msg.topics.forEach(function (item) {
                    client.join(item);
                    log.info(client.id, ' has just join chanel ', item);
                });
                client.emit('subscribe', {
                    result_code: "0",
                    error_message: ""
                });
            }
            catch (err) {
                log.info('subscribe error', msg, err);
                client.emit('subscribe', { result_code: "1", error_message: "subscribe err" });

            }
        });

    });
        // http.listen(1224, () => {
        //     console.log("listen port 1224");
        // });
    }
    
    ClientgetDataAction(client) {
        if (!client.isSctvCore)
            return;
        if(client.clientType.TASK_PAYMENT && gTask.listPayment.length >0) {
            client.emit("server_callback", { type: TaskType.TASK_PAYMENT, data: gTask.listPayment.shift() });
            client.clientType.TASK_PAYMENT = 0;
        }else if (client.clientType.TASK_ORDER && gTask.listOrder.length > 0) {
            client.emit("server_callback", { type: TaskType.TASK_ORDER, data: gTask.listOrder.shift() });
            client.clientType.TASK_ORDER = 0;
        } else if (client.clientType.TASK_TRANSFER && gTask.listTransferMoney.length > 0) {
            client.emit("server_callback", { type: TaskType.TASK_TRANSFER, data: gTask.listTransferMoney.shift() });
            client.clientType.TASK_TRANSFER = 0;
        } else if (client.clientType.TASK_ADD_MONEY && gTask.listAddMoney.length > 0) {
            client.emit("server_callback", { type: TaskType.TASK_ADD_MONEY, data: gTask.listAddMoney.shift() });
            client.clientType.TASK_ADD_MONEY = 0;
        }
    }

    SendDataToCLient(account_id,type,data) {
        if(this.listClient[account_id]) {
           // console.log("Send data to client",this.listClient[account_id]);
            for (var k in this.listClient[account_id]){
                console.log("send data socket ",account_id,type,data);
                this.listClient[account_id][k].emit(type,data);
                
            }
        }
    } 
    SendDataToSocketID(socketId,type,data) {
        
        if(this.listSocket[socketId])
        {
            this.listSocket[socketId].emit(type,data);
        }
    }

    SendDataToSocketGroup(group_id,data) {
        log.info("SendDataToSocketGroup Group_id",group_id,data);
        this.server.to(group_id).emit(group_id,data);
    }
    
}

module.exports = new SocketServer();