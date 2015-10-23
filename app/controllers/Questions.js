var serviceAgent = require("serviceAgent");
var args = arguments[0] || {};

function renderQA(){
	Alloy.Globals.Loader.hide();
	if (Alloy.Globals.FormSchema == null){
		alert ("Unable to load data");
	}
	var houseHoldMembers = _.find(Alloy.Globals.FormSchema.Fields, function(e){
		return e.Name == "HouseHoldMembers";
	});
	var questions = _.filter(houseHoldMembers.Fields, function (field){
		if (field.Name != null &&
			field.Name.substring(0,2) == "MQ")
			return true;
	});
	questions.forEach(function(e){
		if (args.data[e.Name] == null){
			return;
		}
		var qLabel = $.UI.create("Label", {
			classes: ["cQ"],
			text: e.DescriptionPlainText
		});
		$.svMain.add(qLabel);
		var answer = args.data[e.Name].toUpperCase();
		var aLabel = $.UI.create("Label", {
			classes: ["cA"],
			color: answer == "YES" || answer == "UNSURE" ? "#e52f0c" : "#5ba710",
			text: answer
		});
		$.svMain.add(aLabel);
	});
	$.svMain.add(Ti.UI.createLabel({
		height: 20
	}));
}

function init(){
	$.winQ.title = args.data.MemberName_fullname_first_name + " " + args.data.MemberName_fullname_last_name;
	if (Alloy.Globals.FormSchema == null){
		Alloy.Globals.Loader.show();
		serviceAgent.getFormSchema(renderQA);
	}else{
		renderQA();
	}
	Alloy.Globals.Tracker.trackScreen({
	    screenName: "Questions"
	});
}

init();
