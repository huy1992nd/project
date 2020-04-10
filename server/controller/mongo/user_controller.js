const model = require('../model/model');
const UserSocial = model.UserSocial;

class User {
    constructor() {
    }

    async registerFace(req, res) {
        var data = req.body;
        try {
            var user = data.user;
            if (user && user.id && user.authToken) {
                await UserSocial.findOneAndUpdate({ id: user.id }, {
                    $set: {
                        name: user.name,
                        email: user.email,
                        photoUrl: user.photoUrl,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        authToken: user.authToken,
                        provider: user.provider,
                        facebook: user.facebook
                    }
                }, { upsert: true }, (err, result) => {
                    if (err) {
                        console.log('Have error when insert social user',err, data.user);
                    } else {
                        console.log("update ", data.user.id, "ok");
                    }
                });
                res.json({
                    result_code: global.define.ResultCode.WRONG_PASSWORD
                });
            } else if (data.authToken) {
                var user = await UserSocial.findOne({authToken : data.authToken}, (error, result)=>{});
                if (user) {
                    res.status(200).json({
                        result_code : 0,
                        user : user
                    });
                } else {
                    res.status(400).json({
                        result_code: global.define.ResultCode.NOT_SUCCESS
                    });
                }
            } else {
                res.status(400).json({
                    result_code: global.define.ResultCode.INCORRECT_DATA
                });
            }
        } catch (error) {
            res.status(500).json({
                result_code: global.define.ResultCode.INCORRECT_DATA
            });
        }
        
    };
    
    // //mobilde
    // sign_in(req, res) {
    //     var data = req.body;
    //     UserModel.findOne({
    //         username: data.username
    //     }, function(err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //         res.status(401).json({ 
    //             resultCode :10
    //         });
    //         } else if (user) {
    //         if (!user.comparePassword(data.password)) {
    //             res.status(401).json({ 
    //                 resultCode :20
    //             });
    //         } else {
    //             //add token device
    //             taskSettingModel.find({
    //                 username:user.username
    //             },function(err,list_task){
    //                 //Add device for task setting
    //                 list_task.map(task=>{
    //                     var index_exit_old = task.notify.map(function(notify) { return notify.token; }).indexOf(data.token_device_old);
    //                     if(index_exit_old >= 0){
    //                         task.notify[index_exit_old].token = data.token_device_new;
    //                         task.notify[index_exit_old].login = 1;
    //                         taskSettingModel.findOneAndUpdate({
    //                             username:task.username,
    //                             task_name:task.task_name
    //                         },{$set: task},function(err,task){
    //                             console.log('save success', task);
    //                         });
    //                     }else{
    //                         var index_exit_new = task.notify.map(function(notify) { return notify.token; }).indexOf(data.token_device_new);
    //                         console.log('index exit',index_exit_new)
    //                         if(index_exit_new == -1){
    //                             task.notify.push({
    //                                 token:data.token_device_new,
    //                                 type:'ios',
    //                                 login:1,
    //                                 active:true
    //                             });
    //                             taskSettingModel.findOneAndUpdate({
    //                                 username:task.username,
    //                                 task_name:task.task_name
    //                             },{$set: task},function(err,task){
    //                                 console.log('save success', task);
    //                             });
                            
    //                         }else{
    //                             task.notify[index_exit_new].login = 1;
    //                             taskSettingModel.findOneAndUpdate({
    //                                 username:task.username,
    //                                 task_name:task.task_name
    //                             },{$set: task},function(err,task){
    //                                 console.log('save success', task);
    //                             });
    //                         }
    //                     }
                        
                       
    //                 });

    //             })

    //             return res.json({
    //                  resultCode :0,
    //                  username: user.username,
    //                  token_authen: jwt.sign({username: user.username, _id: user._id, Date: Date.now()}, 'MONEYANDLOVE')
    //                 }
    //                 );
    //         }
    //         }
    //     });
    // };

    // list_user(req, res) {
    //     console.log('aaaaa');
    //     var data = req.body;
    //     UserModel.find({}, function(err, list_user) {
    //         if (err) throw err;
    //         return res.json(list_user); 
    //     });
    // };

    // sign_out(req, res) {
    //     var data = req.body;
    //     taskSettingModel.find({
    //         username:req.user.username
    //     },function(err,list_task){
    //         list_task.map(task=>{
    //             var index_device = task.notify.map(function(notify) { return notify.token; }).indexOf(data.token_device);
    //             if(index_device > -1){
    //                 task.notify[index_device].login = 0;
    //                 taskSettingModel.findOneAndUpdate({
    //                     username:task.username,
    //                     task_name:task.task_name
    //                 },{$set: task},function(err,task){});
                    
    //             }
                
    //         });
    //         return res.json({ resultCode: 0});

    //     })
        
    // };

    // // web
    // login(req, res) {
    //     var data = req.body;
    //     UserModel.findOne({
    //         username: data.username
    //     }, function(err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //         res.status(401).json({ 
    //             resultCode :10
    //         });
    //         } else if (user) {
    //         if (!user.comparePassword(data.password)) {
    //             res.status(401).json({ 
    //                 resultCode :20
    //             });
    //         } else {
    //             //add token device
    //             return res.json({
    //                  resultCode :0,
    //                  username: user.username,
    //                  token_authen: jwt.sign({username: user.username, _id: user._id, Date: Date.now()}, 'MONEYANDLOVE')
    //                 }
    //             );
    //         }
    //         }
    //     });
    // };

    // logout(req, res) {
    //     var data = req.body;
    // };

    // loginRequired(req, res, next) {
    //     if (req.user) {
    //       next();
    //     } else {
    //       return res.status(401).json({
    //         resultCode :40
    //      });
    //     }
    //   };

    // getByUsernameAndPassword(username, password, callback) {
    //     UserModel.findOne({username: username}).exec().then(function(user) {
    //         if (user && user.comparePassword(password)) {
    //             callback(user);
    //         }
    //         else callback(null);
    //     });
    // }


    // getAll() {
    //     var result = UserModel.find({}).exec();
    //     return result;
    // }

    // getByUsername(username) {
    //     var result = UserModel.findOne({username: username}).exec();
    //     return result;
    // }

    // getById(id) {
    //     var result = UserModel.findOne({_id: id}).exec();
    //     return result;
    // }

    // insert(user) {
    //     var model = new UserModel(user);
    //     return model.save();
    // }

    // update(id, data) {
    //     return UserModel.findByIdAndUpdate(id, data);
    // }

    // deleteAll() {
    //     return UserModel.deleteMany({}).exec();
    // }
}

module.exports = new User();