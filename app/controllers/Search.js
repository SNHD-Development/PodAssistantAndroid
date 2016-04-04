var serviceAgent = require('serviceAgent');
var util = require("util");
var async = require('async');

var args = arguments[0] || {};

function cbSearchResults(err, searchResults){
	$.btnSearch.enabled = true;
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
	$.txtFirstName.value = "";
	$.txtLastName.value = "";
	$.txtPhoneNumber.value = "";

	view.open();
}

function btnSearch_onClick(){
	var firstName = $.txtFirstName.value.trim();
	var lastName = $.txtLastName.value.trim();
	var phoneNumber = $.txtPhoneNumber.value.trim();
	if ((Ti.App.deployType == "test" || Ti.App.deployType == "development") &&
		(!firstName && !lastName)){
		firstName = "Fred";
		lastName = "Jones";
	}
	if (!phoneNumber && !firstName && !lastName){
		alert ("Please enter search criteria");
		return;
	}
	if (!phoneNumber && firstName && !lastName){
		alert ("Please also enter a last name to search");
		return;
	}
	Alloy.Globals.Loader.show();
	$.btnSearch.enabled = false;
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
	$.winSearch.title = Alloy.Globals.PodLocation.toUpperCase();
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Search"
	});
}

init();
