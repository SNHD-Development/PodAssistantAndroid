var serviceAgent = require ("serviceAgent");

var args = arguments[0] || {};
$.lotNumbers = null;

function winOptions_onClick(){
	$.txtDoxyLot.blur();
	$.txtCiproLot.blur();
}

function txtDoxyLot_onClick(){
	setupDoxyPicker();
}

function txtCiproLot_onClick(){
	setupCiproPicker();
}

function pickerValueBuilder(arr){
	var o = {};
	arr.forEach(function(item){
		o[item] = item;
	});
	return o;
}

function pickerDoxy_onDone(e){
	if (e.data == null)
  		return;
	var value = e.data[0].value;
	$.txtDoxyLot.value = value;
}

function pickerCipro_onDone(e){
	if (e.data == null)
  		return;
	var value = e.data[0].value;
	$.txtCiproLot.value = value;
}

function getSelectedValue(vals, txt){
	var a = "";
	vals = vals[0];
	for (var prop in vals){
		if (a==""){
			a = prop;
		}
		if (vals[prop] == txt.value){
			a = prop;
		}
	}
	return [a];
}

function setupDoxyPicker(){
	if (!$.lotNumbers || !$.lotNumbers.Doxy || $.lotNumbers.Doxy.length == 0){
		return;
	}
	$.txtDoxyLot.blur();
	var vals = [pickerValueBuilder($.lotNumbers.Doxy)];
	Alloy.createWidget('danielhanold.pickerWidget', {
	  id: 'mySingleColumn',
	  outerView: $.winOptions,
	  type: 'single-column',
	  selectedValues: getSelectedValue(vals,$.txtDoxyLot),
	  pickerValues: vals,
	  onDone: pickerDoxy_onDone
	});
}

function setupCiproPicker(){
	if (!$.lotNumbers || !$.lotNumbers.Cipro || $.lotNumbers.Cipro.length == 0){
		return;
	}
	$.txtCiproLot.blur();
	var vals = [pickerValueBuilder($.lotNumbers.Cipro)];
	Alloy.createWidget('danielhanold.pickerWidget', {
	  id: 'mySingleColumn',
	  outerView: $.winOptions,
	  hideNavBar: false,
	  type: 'single-column',
	  selectedValues: getSelectedValue(vals,$.txtCiproLot),
	  pickerValues: [pickerValueBuilder($.lotNumbers.Cipro)],
	  onDone: pickerCipro_onDone
	});
}

function btnSave_onClick(){
	Alloy.Globals.DefaultDoxyLotNum = $.txtDoxyLot.value;
	Alloy.Globals.DefaultCiproLotNum = $.txtCiproLot.value;
	$.toast = Alloy.createWidget('net.beyondlink.toast');
	$.winOptions.add($.toast.getView());
	$.toast.success("Saved successfully!");
	Alloy.Globals.Tracker.trackEvent({
	    category: "UserActions",
	    action: "Changed default lot number"
	});
	setTimeout(function(){
		$.winOptions.close();
	}, 2000);
}

function cbLotNumbersReceived(err, lotNumbers){
	if (err || !lotNumbers){
		$.txtDoxyLot.editable = true;
		$.txtCiproLot.editable = true; 

	}
	$.lotNumbers = lotNumbers;
}

function init(){
	$.txtDoxyLot.value = Alloy.Globals.DefaultDoxyLotNum;
	$.txtCiproLot.value = Alloy.Globals.DefaultCiproLotNum;
	serviceAgent.getLotNumbers(cbLotNumbersReceived);
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Options"
	});
}


init();
