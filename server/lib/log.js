var log4js = require('log4js');
log4js.configure({
appenders: {
out:{ type: 'console' },
app:{ type: 'dateFile', filename: 'logs/site',"pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true}
},
categories: {
warning: { appenders: [ 'out', 'app' ], level: 'debug' },
default: { appenders: [ 'out', 'app' ], level: 'debug' }
}
});
var log = log4js.getLogger('sctv');
var logError = log4js.getLogger('sctv-error');
var logHacker = log4js.getLogger('sctv-hacker');
exports.log = log;
exports.logError = logError;
exports.logHacker = logHacker;


exports.qlog = (txt, ...agrs) =>{
    const err = new Error();
    const caller_line = err.stack.split("\n")[2];
    const clean = caller_line.trim().substring(3);

    console.log(` \n\n\n <<<================ <LOG::${txt}> ================ `);
    if(agrs) console.log(` ${clean}`, `\n`, ...agrs);
    console.log(` ================ </LOG::${txt}> ================>>> \n `,);
};
