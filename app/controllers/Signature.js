var util = require("util");
var args = arguments[0] || {};

Titanium.App.addEventListener("app:signature:capture", cbSignatureCaptured);

function cbSignatureCaptured(e){
	Titanium.App.removeEventListener("app:signature:capture", cbSignatureCaptured);
	$.winSignature.close();
	Alloy.Globals.SignatureCaptured = true;
	Alloy.Globals.PendingChanges = true;
	args.onSave(e);
}

function btnClear_onClick(){
	$.sigCapture.clear();
}

function btnSave_onClick(){
	$.sigCapture.save();
}

$.winSignature.addEventListener('open',function(){
    var activity=$.winSignature.getActivity();
    if (activity){
        var actionBar=activity.getActionBar();
        if (actionBar){
        	actionBar.hide();
        }    
    }
});

function init(){
	var commandButtonHeight = 60;
	var widthMultiplier = parseInt(util.convertPixelsToDip(Ti.Platform.displayCaps.platformHeight) / Alloy.CFG.SignatureImageWidth);
	var heightMultiplier = parseInt((util.convertPixelsToDip(Ti.Platform.displayCaps.platformWidth) - commandButtonHeight) / Alloy.CFG.SignatureImageHeight);
	var multiplier = widthMultiplier > heightMultiplier ? heightMultiplier : widthMultiplier;
	multiplier = multiplier <= 0 ? 1 : multiplier;
	if (!Alloy.Globals.isTablet){
		$.winSignature.setOrientationModes([Ti.UI.LANDSCAPE_LEFT]);
	}
	$.sigCapture.init({
	    borderColor:" #aaa",
		width: multiplier * Alloy.CFG.SignatureImageWidth,
		height: multiplier * Alloy.CFG.SignatureImageHeight
	});
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Signature"
	});
}

init();
