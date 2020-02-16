var mongoose = require('mongoose');
var TaskSettingModel = require('../../model/mongo/task_setting');

class taskSetting {
    constructor() {
    }

    list_task(req, res) {
        var user = req.user;
       
        TaskSettingModel.find({
            username: user.username
        }, function(err, listTask) {
            if (err) throw err;
            if (!user) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (user) {
                var result =[];
                listTask.map(task=>{
                    task.notify.map(device=>{
                       if(device.token == req.body.token_device){
                        var is_active = device.active? 1:0
                        result.push({
                            name:task.task_name,
                            active:is_active
                        })
                       }            
                    })
                });
                res.json(
                    {
                    resultCode:0,    
                    list_task:result
                    }
                );
            }
        });
    };

    edit_list_task(req, res) {
        var user = req.user;
        JSON.parse(req.body.listTask).map(task=>{
            TaskSettingModel.findOne({
                username:user.username,
                task_name:task.name
            },function (err,taskSetting) {
                var index_device = taskSetting.notify.map(function(notify) { return notify.token; }).indexOf(req.body.token_device);
                if(index_device >=0){
                    taskSetting.notify[index_device].active = task.active? true:false;
                }
                TaskSettingModel.findOneAndUpdate({
                    username:user.username,
                    task_name:task.name
                },{$set: taskSetting},function(err,task){
                    console.log('save success', task);
                    if(err){
                        console.log('err is', err)
                    }
                    
                });
            })
        });
        res.json({resultCode :0});
    };

    getAll(res) {
        TaskSettingModel.find({}, function(err, listTask) {
                res(err,listTask);
            }
        );
    }

    getById(id) {
        return TaskSettingModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    getByUserNameAndTask(username,task_name) {
        return TaskSettingModel.findOne({username: username, task_name:task_name}).exec();
    }
    getByTask(task_name) {
        return TaskSettingModel.find({task_name:task_name}).exec();
    }

    insert(test) {
        var model = new TaskSettingModel(test);
        return model.save();
    }

    insertMany(list){
        var model = new TaskSettingModel();
        return model.insertMany(list)
    }

    update(id, data) {
        return TaskSettingModel.update({ _id: id }, { $set: data} );
    }

    delete(id) {
        return TaskSettingModel.find({_id: id}).remove().exec();
    }

    deleteAll() {
        return TaskSettingModel.deleteMany({}).exec();
    }

}

module.exports = new taskSetting();