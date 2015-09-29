var serviceAgent = require('serviceAgent');
var animation = require('alloy/animation');
var async = require('async');

function btnLogin_onClick(){
	Alloy.Globals.Loader.show();
	serviceAgent.authenticate($.txtUsername.value, $.txtPassword.value, cbAuth);
}

function cbAuth(err, success){
	Alloy.Globals.Loader.hide();
	if (err || !success){
		animation.shake($.btnLogin,30);
		$.lblAuthResult.text = "Login not successful";
		animation.fadeIn($.lblAuthResult, 30);
		Alloy.Globals.Tracker.trackEvent({
		    category: "UserActions",
		    action: "Login failure"
		});
	}else{
		serviceAgent.getDefaultLotNumbers();
		animation.fadeOut($.lblAuthResult, 1);
		var view = Alloy.createController('Search',{}).getView();
		view.open();
		Alloy.Globals.Tracker.trackEvent({
		    category: "UserActions",
		    action: "Login success"
		});
	}
}

function winIndex_onClick(){
	$.txtUsername.blur();
	$.txtPassword.blur();
}

$.winIndex.addEventListener('open',function(){
    var activity=$.winIndex.getActivity();
    if (activity){
        var actionBar=activity.getActionBar();
        if (actionBar){
        	actionBar.hide();
        }    
    }
});

function init(){
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Login"
	});
}

init();

$.winIndex.open();

