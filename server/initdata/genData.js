var InitSymbolController = require('./init.symbol.class');
var InitCountryController = require('./init.country.class');
var InitCurrencyController = require('./init.currency.class');
const listInsert = ['currency'];
var run = function () {
  console.log('vao day');
  listInsert.forEach(element => {
    let initController = null;
    switch (element) {
      case 'symbol':
        initController = new InitSymbolController();
        break;

      case 'country':
        initController = new InitCountryController();
        break;

      case 'currency':
        initController = new InitCurrencyController();
        break;

      default:
        break;
    }
    if(initController){
      initController.addData();
    }
  });
}

run();
