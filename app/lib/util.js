
exports.getMedicineLongName = function(d){
	switch (d){
		case "D":
			return "Doxycycline";
		case "C":
			return "Ciprofloxacin";
		case "M":
			return "Medical";
	}
};

exports.getMedicineShortName = function(d){
	switch (d){
		case "Doxycycline":
			return "D";
		case "Ciprofloxacin":
			return "C";
		case "Medical":
			return "M";
	}
};

exports.newGuid = function(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};


exports.convertPixelsToDip = function(pixels){
	return pixels / (Titanium.Platform.displayCaps.dpi / 160);
};
