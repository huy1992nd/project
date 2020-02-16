'use strict';
var mySqlController = require('./../controller/mysql/mysql.controller');

const contruct_data_symbol = {
    "symbol": "",
    "market": "demo",
    "left": "",
    "right": "",
    "group": "",
    "site": "localhost",
    "mt4_group": "",
    "server_mt4": "HoldingFx-Demo",
    "status": "active"
}

const list_data_default = [
    {
        group: {
            "site": "localhost",
            "group_name": "currency",
            "group_display": ["Tiền tệ", "Currency"],
            "description": ["Nhóm tiền kỹ thuật số", "Digital money group"],
            "language": ["vi", "en"]
        },
        symbol: {
            list_left: ["EUR", "USD", "CHF", "GBP"],
            list_right: ["USD", "EUR", "CAD", "CHF", "JPY"]
        }
    },
    {
        group: {
            "site": "localhost",
            "group_name": "metals",
            "group_display": ["Kim loại", "Metals"],
            "description": ["Nhóm kim loại quý", "Metals"],
            "language": ["vi", "en"]
        },
        symbol: {
            list_left: ["XAU", "XPT", "XAG", "XPD"],
            list_right: ["USD", "GBP"]
        }
    }
]

class InitSymbolController {
    constructor(list_data = null) {
        if (list_data) {
            this.list_data = list_data
        } else {
            this.list_data = list_data_default
        }
    }

    async addData() {
        // Remove all data 
        let clear_data = await this.removeAllData();
        // Add new data 
        if (clear_data) {
            let add_data_group_symbol = await this.insertDataGroupSymbol();
            let add_data_symbol = await this.insertDataSymbol();
            if (add_data_group_symbol && add_data_symbol) {
                console.log("Add data symbol and group symbol ok !");
            }
        }
    }

    async removeAllData() {
        return new Promise((resolve, reject) => {
            let sql = `
            DELETE FROM fx_mt4_symbols WHERE 1 ;
            DELETE FROM fx_mt4_group_symbol WHERE 1 ;
            `;
            mySqlController.ExeQuery({
                query: sql,
                values: []
            }, function (err, rows, fields) {
                if (!err) {
                    resolve(true)
                } else {
                    console.log('clear table symbol and group symbol ok');
                    resolve(false)
                }
            });
        });
    }

    async insertDataGroupSymbol() {
        return new Promise((resolve, reject) => {
            let values = [];
            let sql = 'INSERT INTO `fx_mt4_group_symbol` ( `site`, `group_name`, `group_display`, `description`, `language`) VALUES';
            var list_join = [];
            this.list_data.forEach(item => {
                item.group.language.forEach((language, index) => {
                    list_join.push("( ?, ?, ?, ?, ?)");
                    values.push(item.group.site);
                    values.push(item.group.group_name);
                    values.push(item.group.group_display[index]);
                    values.push(item.group.description[index]);
                    values.push(language);
                });
            });
            sql = sql + list_join.join(",");
            mySqlController.ExeQuery({
                query: sql,
                values: values
            }, async (err, rows, fields) => {
                if (!err) {
                    resolve(true);
                } else {
                    console.log("Have error when add group symbol", err);
                    resolve(false);
                }
            });
        })
    }

    async insertDataSymbol() {
        return new Promise((resolve, reject) => {
            let values = [];
            let sql = 'INSERT INTO `fx_mt4_symbols` ( `symbol`, `market`, `left`, `right`, `site`, `group`, `mt4_group`, `server_mt4`, `status`) VALUES';
            var list_join = [];
            this.list_data.forEach(item => {
                item.symbol.list_left.forEach(left_character => {
                    item.symbol.list_right.forEach(right_character => {
                        if (right_character != left_character) {
                            list_join.push("( ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                            values.push(left_character + right_character);
                            values.push(contruct_data_symbol.market);
                            values.push(left_character);
                            values.push(right_character);
                            values.push(contruct_data_symbol.site);
                            values.push(item.group.group_name);
                            values.push(contruct_data_symbol.mt4_group);
                            values.push(contruct_data_symbol.server_mt4);
                            values.push(contruct_data_symbol.status);
                        }
                    })

                })

            });
            sql = sql + list_join.join(",");
            mySqlController.ExeQuery({
                query: sql,
                values: values
            }, async (err, rows, fields) => {
                if (!err) {
                    resolve(true);
                } else {
                    console.log("Have error when add symbol", err);
                    resolve(false);
                }
            });
        })
    }


}

module.exports = InitSymbolController;