


var mySqlController = require('./mysql.controller');
const myEmitter = require('./../../lib/myemitter.js');
let {EmitType,SocketApiKey,LogAction,LOGType,OrderStatus} = require('./../../define');


class LogController {
    constructor() {
    
    }
    GetProductCode(list_product) {
        let str = "";
            if(list_product.length > 0)
            str =list_product[0];
           for(let i =1; i < list_product.length;i++){
                str+= ","
                str+= list_product.product_code;
           }  
           return str; 
        }     

        NewLog(obj){
            obj.account_create  = obj.account_create ? obj.account_create: "";
            obj.type = obj.type ? obj.type : LOGType.NOTIFY;
            var sql_query = `insert into fx_logs (account_id,account_create,message,type,action) values (?,?,?,?,?);`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [obj.account_id, obj.account_create,obj.message, obj.type,obj.action]
            }, function (err, rows, fields) {
                if (!err) {
                    myEmitter.emit(EmitType.SOCKET_EMIT,[{                        
                            account_id: [obj.account_id],
                            type: SocketApiKey.NOTIFICATION,
                            data: obj
                    }])
                } else {
                   this.SystemError({
                       message: err
                   });
                }
            });
        }
        CreateLogNotificationSQL(obj,stream){
            obj.account_create  = obj.account_create ? obj.account_create: "system";
            obj.type = obj.type ? obj.type : LOGType.NOTIFY;
            obj.message =  obj.message ? obj.message : this.GetMessage(obj.action,obj.data);
            stream.sql += `insert into fx_logs (account_id,account_create,message,type,action) values (?,?,?,?,?);`;
            stream.values.push(obj.account_id);
            stream.values.push(obj.account_create);
            stream.values.push(obj.message);
            stream.values.push(obj.type);
            stream.values.push(obj.action);

            stream.list.push({
                socket_user: obj.socket_user ? obj.socket_user: [],
                socket_id: obj.socket_id ? obj.socket_id : null,
                socket_group:obj.socket_group ? obj.socket_group : [],
                type: SocketApiKey.NOTIFICATION,
                data: obj,
                group_id: []
            });
        }
        SystemError(obj) {
            obj.account_id ="root";
            obj.type = LOGType.ERROR;
            obj.action = LogAction.SYSTEM_ERROR;
            var sql_query = `insert into fx_logs (account_id,account_create,message,type,action) values (?,?,?,?,?);`;
            mySqlController.ExeQuery({
                query: sql_query,
                values: [obj.account_id,obj.account_id,obj.message,obj.type,obj.action]
            }, function (err, rows, fields) {
                if (!err) {
                    myEmitter.emit(EmitType.SOCKET_EMIT,{                        
                            account_id: [obj.account_id],
                            type: SocketApiKey.NOTIFICATION,
                            data: obj
                    })
                
                } else {
                   
                }
            });
        }
        GetMessage(action,obj){
            switch(action){
                case  LogAction.UPDATE_ORDER: {
                    return `Order ${obj.order_code} được cập nhật. Trạng thái: ${this.GetOrderStatus(obj.status)}.`;
                }
                case  LogAction.NEW_ORDER_PUBLISHER: {
                    return `Ctv : ${obj.account_create} vừa tạo order mã: ${obj.order_code}.`;
                }
                case LogAction.NEW_PRODUCT: {
                    return `Sản phẩm: ${obj.product_name} có mã: ${obj.product_code} vừa được thêm vào. Thuộc campagin: ${obj.campaign_id}. Giá: ${obj.price} deposit: ${obj.deposit}`
                }
                case LogAction.UPDATE_ORDER: {
                    return `Sản phẩm: ${obj.product_name} có mã: ${obj.product_code} vừa được cập nhật . Thuộc campaign: ${obj.campaign_id}. Giá: ${obj.price} deposit: ${obj.deposit}`
                }
                case LogAction.REMOVE_PRODUCT: {
                    return `Sản phẩm: ${obj.product_name} thuộc đại lý: ${obj.account_create} có mã: ${obj.product_code}  đã dừng bán. Thuộc campagin: ${obj.campaign_id}. Giá: ${obj.price} deposit: ${obj.deposit}`
                }


                case LogAction.REMOVE_PRODUCT_GROUP: {
                    return `Group: ${obj.group_id} Sản phẩm: ${obj.product_name} có mã: ${obj.product_code} bị xóa khỏi group.`
                }
                
                case LogAction.ADD_PRODUCT_GROUP: {
                    return `Group: ${obj.group_id} Sản phẩm: ${obj.product_name} có mã: ${obj.product_code}  được thêm vào group. Thuộc campagin: ${obj.campaign_id}. Giá: ${obj.price} deposit: ${obj.deposit}`
                }
                
                case LogAction.UPDATE_PRODUCT_GROUP: {
                    return ` Group: ${obj.group_id} Sản phẩm: ${obj.product_name} có mã: ${obj.product_code}  được cập nhật. Thuộc campagin: ${obj.campaign_id}. Giá: ${obj.price} deposit: ${obj.deposit}`
                }
                case LogAction.NEW_CUSTOMER:{
                    return `Khách hành ${obj.user_name} với mã: ${obj.customer_code} vừa được tạo.`;
                }
                case LogAction.REMOVE_CUSTOMER:{
                    return `Khách hành ${obj.user_name} với mã: ${obj.customer_code} đã bị xóa.`;
                }
                case LogAction.UPDATE_CUSTOMER:{
                    return `Khách hành ${obj.user_name} với mã: ${obj.customer_code} đã được cập nhật thông tin.`;
                }
                case LogAction.NEW_MUTIL_PRODUCT:{
                    return `Đại lý ${obj.account_create} vừa thêm: ${obj.quantity}  sản phẩm mới.`;
                }
                case LogAction.ADD_MEMBER_GROUP:{
                    return `Tài khoản: ${obj.account_id} vừa được thêm vào Nhóm: ${obj.group_name}  .`;
                }
                case LogAction.CREATE_GROUP:{
                    return `Group: ${obj.group_name} với group_id: ${obj.group_id} vừa được tạo thành công.`;
                }
                case LogAction.NEW_ORDER_CUS:{
                    return `Vừa có order mới từ khách hàng. Mã order: ${obj.order_code}.`;
                }
            }
        }

        GetOrderStatus(status){
            let str= "Lỗi";
            switch(status){
                case  OrderStatus.WAIT_VERIFY: {
                    str = "Đợi xác nhận";
                    break;
                };
                case  OrderStatus.NEW: {
                    str ="Mới";
                    break;
                };
                case  OrderStatus.INPROCESS: {
                    str = "Đang xử lý";
                    break;
                };
                case  OrderStatus.REJECT: {
                    str = "Hệ thống báo lỗi";
                    break;
                };
                case  OrderStatus.CANCEL: {
                    str = "Đại lý từ chối";
                    break;
                };
                case  OrderStatus.EDITED: {
                    str = "Được sửa đổi";
                    break;
                };
                case  OrderStatus.FINISHED: {
                    str = "Hoàn thành";
                    break;
                };
                case  OrderStatus.DELIVERY: {
                    str = "Đang giao hàng";
                    break;
                };
                case  OrderStatus.REFUND: {
                    str = "Hoàn tiền";
                    break;
                };
                default: {
                console.log("Status", status);
                }
            }
            return str;
        }

        NotifyHistory(req, res) {
            var data = req.body;
            let user = req.user;
            if (user) {
                var sql_query = `SELECT * FROM fx_logs where account_id = '${user.account_id}' or account_create = '${user.account_id}'`;
                mySqlController.ExeQuery({
                    query: sql_query
                }, function (err, rows, fields) {
                    if (!err) {
                        res.json({
                            resultCode: 0,
                            data: rows
                        });
                    } else {
                        res.status(401).json({
                            resultCode: 20
                        });
                    }
                });
            }
            else {
                res.status(401).json({
                    resultCode: 100
                });
            }
        }
    
        
}


module.exports = new LogController();