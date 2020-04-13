Array.prototype.getIndexBy = function(key, value) {
	var index = this.map(function(obj) { return obj[key].toString() } ).indexOf(value.toString());
	return index;
};

Array.prototype.getItemBy = function(key, value) {
	var index = this.map(function(obj) { return obj[key].toString() } ).indexOf(value.toString());
	if (index > -1)
		return this[index];
	else
		return null;
};

Array.prototype.removeItemBy = function(key, value) {
	var index = this.map(function(obj) { return obj[key].toString() } ).indexOf(value.toString());
	if (index > -1) {
		this.splice(index, 1);
		return true;
	} else {
		return null;
	}
};

Array.prototype.ConvertObj = function(key) {
	let data = {};
	var index = this.map(function(obj) { data[obj[key].toString()] = 1 } );
	return data;
};

String.prototype.hexEncode = function(){
	var hex, i;

	var result = "";
	for (i=0; i<this.length; i++) {
		hex = this.charCodeAt(i).toString(16);
		result += ("000"+hex).slice(-2);
	}

	return result
};
String.prototype.hexDecode = function(){
	var j;
	var hexes = this.match(/.{1,2}/g) || [];
	var back = "";
	for(j = 0; j<hexes.length; j++) {
		back += String.fromCharCode(parseInt(hexes[j], 16));
	}

	return back;
};