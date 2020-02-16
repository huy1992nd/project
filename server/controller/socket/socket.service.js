var Socket = require('socket.io-client')
class socketService {
 constructor() {

     this.socket = Socket('http://172.16.20.164:3000/');    
     this.initSocket();
 }

 initSocket(){
    this.socket.on('connect', ()=>{
        console.log('connected');
    });
    this.socket.on('event', function(data){});
    this.socket.on('disconnect', function(){});
 }
 sendData(type,data) {
     this.socket.emit(type,data);
 }
}
module.exports = new socketService();