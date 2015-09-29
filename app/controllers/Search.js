var serviceAgent = require('serviceAgent');
var util = require("util");

var args = arguments[0] || {};
 
function btnQr_onClick(){
	var view = Alloy.createController('Scanner',{
		onScannerResult: cbScannerResult
	}).getView();
	view.open({modal:true});
}

function cbScannerResult(err, formId){
	if (err){
		alert ("Unable to scan QR code");
		return;
	}
	var isValidMongoId = formId.length == 24;
	if (!isValidMongoId){
		alert ("That was not an acceptable QR code.");
		return;
	}
	serviceAgent.getMsFormById(formId,cbFormLookupResult);
}

function cbFormLookupResult(err, d){
	if (err || d == null){
		alert ("Unable to open form");
		return;
	}
	var view = Alloy.createController('Household',{
		msForm: d
	}).getView();
	view.open(); 
}

function cbSearchResults(err, searchResults){
	Alloy.Globals.Loader.hide();
	if (err || searchResults == null){
		$.toast = Alloy.createWidget('net.beyondlink.toast');
		$.winSearch.add($.toast.getView());
		$.toast.error("Unable to load search results");
		return;
	}
	var view = Alloy.createController('SearchResults',{
		searchResults: searchResults
	}).getView();
	view.open();
}

function btnSearch_onClick(){
	var firstName = $.txtFirstName.value.trim();
	var lastName = $.txtLastName.value.trim();
	var phoneNumber = $.txtPhoneNumber.value.trim();
	if (!phoneNumber && (!firstName || !lastName)){
		alert ("Please enter both first name and last name, or a phone number to search");
		return;
	}
	// if (!firstName || !lastName){
		// firstName = "Mike";
		// lastName = "Jones";
	// }
	Alloy.Globals.Loader.show();
	serviceAgent.getSearchResults(firstName,lastName,phoneNumber,cbSearchResults);
}

function winSearch_onClick(){
	$.txtFirstName.blur();
	$.txtLastName.blur();
	$.txtPhoneNumber.blur();
}

$.winSearch.addEventListener('open',function(){
    var activity=$.winSearch.getActivity();
    if (activity){
    	activity.onCreateOptionsMenu = function(e) {
			var menuItem = e.menu.add({
				itemId : 0,
	            icon: "/images/gears.png",
	            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			});
			menuItem.addEventListener("click", function(e) {
				var view = Alloy.createController('Options',{}).getView();
				view.open();
	        });
	        menuItem = e.menu.add({
				itemId : 1,
	            icon: "/images/logout.png",
	            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			});
			menuItem.addEventListener("click", function(e) {
				$.winSearch.close();
	        });
		};
	};
});

function init(){
	$.btnQr.height = util.convertPixelsToDip(Ti.Platform.displayCaps.platformHeight) / 3;
	$.winSearch.title = Alloy.Globals.PodLocation.toUpperCase();
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Search"
	});
}

init();
