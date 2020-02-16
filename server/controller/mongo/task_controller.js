var mongoose = require('mongoose');
var TaskModel = require('../../model/mongo/task');

class Task {
    constructor() {
    }

    getAll() {
        var result = TaskModel.find({}).exec();
        return result;
    }

    list_task(req, res) {
        var result = TaskModel.find({}).select('_id key categories ref question_ids created_date').exec();
        res(result);
    };

    getById(id) {
        return TaskModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    getByName(name) {
        return TaskModel.findOne({task_name: name}).exec();
    }

    insert(test) {
        var model = new TaskModel(test);
        return model.save();
    }

    update(id, data) {
        return TaskModel.update({ _id: id }, { $set: data} );
    }

    delete(id) {
        return TaskModel.find({_id: id}).remove().exec();
    }

    deleteAll() {
        return TaskModel.deleteMany({}).exec();
    }

}

module.exports = new Task();