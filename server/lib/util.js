/**
 * Created by hieutv on 21/06/2017.
 */

var crypto = require('crypto');
let {gSequence} = require('./../define')
module.exports.saltAndHash = function(pass) {
		var salt = generateSalt();
		var hash = salt + md5(pass + salt);
		return (hash);
};

module.exports.CreateNewHash = function(data){
	if(gSequence[data.deposit]) {
		if(!gSequence[data.deposit].hash) {
			gSequence[data.deposit].hash = gSequence.hash;
		}
	}else {
		gSequence[data.deposit] = {
			hard: gSequence.hash
		}	
	}
	let str = gSequence[data.deposit].hash + JSON.stringify(data);
	return md5(str);
}

module.exports.md5 = function (str) {
	return md5(str);
};

module.exports.sha256 = function (str) {
	return sha256(str);
};

module.exports.randomToken = function () {
	return randomBytes();
};
module.exports.encrypt = function (text, pass) {
	console.log(text, pass);
	if(!pass)
		pass = password;
	var cipher = crypto.createCipher(algorithm,pass);
	return cipher.update(text,'utf8','hex') + cipher.final('hex');
};

module.exports.decrypt = function (cryptedText, pass) {
	console.log(cryptedText, pass);
	if(!pass)
		pass = password;
	var decipher = crypto.createDecipher(algorithm,pass);
	return decipher.update(cryptedText,'hex','utf8') + decipher.final('utf8');
};

//---------------------------------------private function---------------------------------------------------------------

var generateSalt = function (){
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
};

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var sha256 = function (str) {
	return crypto.createHash('sha256').update(str).digest('hex');
};

var randomBytes = function () {
	crypto.randomBytes(64, function (error, buffer) {
		return buffer.toString('hex');
	});
};

module.exports.validatePassword = validatePassword;
function validatePassword(plainPass, hashedPass)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	return (hashedPass === validHash);
}