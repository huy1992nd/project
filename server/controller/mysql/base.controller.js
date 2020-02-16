var mysql = require('mysql');
class BaseController {
    constructor(){

    }

    async asyncForEach (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    getDataInput(list_input, body){
        var data = {};
        list_input.forEach(key =>{
            data[key] = this.validateInput(body,key);
        });
        return data;
    }

    validateInput(body, key, value_default = "") {
        let result = value_default;
        if (typeof body[key] !== "undefined") {
            result = body[key];
        } else {
            console.log(" Don't have data input ---> " + key);
        }
        return result;
    }
}

module.exports = BaseController;