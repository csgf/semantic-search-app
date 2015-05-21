var style;
if (Ti.Platform.name === 'iPhone OS'){
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
}
else {
  style = Ti.UI.ActivityIndicatorStyle.BIG;
}	
var	activityIndicator = Ti.UI.createActivityIndicator({
	  message: 'Loading...',
	  style:style,
	  color : Alloy.Globals.css.tintColor,
	  font : {fontSize : "20dp"},
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE,
	  visible : false
	});
$.infoView.add(activityIndicator);

$.mapview.updateAnnotation = updateAnnotation;
			
if(OS_ANDROID){

	var regionchanged = function (evt) {		
		if(Alloy.Globals.debubMode){
			Ti.API.info(evt);
		};
		var region = {
			longitudeDelta : evt.longitudeDelta,
			longitude : evt.longitude,
			latitude : evt.latitude,
			latitudeDelta : evt.latitudeDelta
		};		
		updateAnnotation(region);		
	};	
	$.mapview.addEventListener('regionchanged', regionchanged);
			
	$.mapview.addEventListener('click', function (evt) {
		
		if(!evt.annotation){ // se ad esempio clicco sulla infoView
			return;
		};
		
		// Al click su un'annotation, la mappa viene centrata, scatenando un nuovo regionchanged, dunque lo rimuovo temporaneamente
		$.mapview.removeEventListener('regionchanged', regionchanged);
		setTimeout(function(){
			$.mapview.addEventListener('regionchanged', regionchanged);
		},1000);
				
		Ti.API.info("Annotation " + evt.annotation.title + " clicked, id: " + evt.annotation.myid);
		Ti.API.info(evt.clicksource);
		if (evt.clicksource != null && evt.clicksource != "pin") {
			//Ti.API.info("Repo should be opened")
			var repoWindow = Alloy.createController("RepoWindow", {
				url : evt.annotation.link_rep,
				title : evt.annotation.title
			}).getView();
			repoWindow.open();
		}
		
	});
	
	$.mapview.addEventListener('complete', function(e){
		Ti.API.info("***map complete***");
		activityIndicator.hide();
	});
	
}else if(OS_IOS){

	var regionchanged = function (evt) {		
		if(Alloy.Globals.debubMode){
			Ti.API.info(JSON.stringify(evt));
		};
		var region = {
			longitudeDelta : evt.longitudeDelta,
			longitude : evt.longitude,
			latitude : evt.latitude,
			latitudeDelta : evt.latitudeDelta
		};
		updateAnnotation(region);
	};
	// Inserisco un timeout, altrimenti il 'regionchanged' viene scatenato anche al primo avvio dell'app, quando non ho ancora scaricato i dati
	setTimeout(function(){
		$.mapview.addEventListener('regionchanged', regionchanged);
	},2000);
	//$.mapview.addEventListener('regionchanged', regionchanged);
	
	$.mapview.addEventListener('click', function (evt) {

		if(!evt.annotation){ // se ad esempio clicco sulla infoView
			return;
		};
	
		// Al click su un'annotation, la mappa viene centrata, scatenando un nuovo regionchanged, dunque lo rimuovo temporaneamente
		$.mapview.removeEventListener('regionchanged', regionchanged);
		setTimeout(function(){
			$.mapview.addEventListener('regionchanged', regionchanged);
		},1000);
		
		Ti.API.info("Annotation " + evt.annotation.title + " clicked, id: " + evt.annotation.myid);
		Ti.API.info(evt.clicksource);
		if (evt.clicksource == "rightButton") {
			var repoWindow = Alloy.createController("RepoWindow", {
				url : evt.annotation.link_rep,
				title :  evt.annotation.title
			}).getView();
			$.mapview.tab.open(repoWindow);
		}
	});

};

function updateAnnotation(region){
	$.infoLbl.text = "";
	activityIndicator.show();
	//animateInfoView();
	var annotations = [];
	var mapBounds = {};	
	
	if(region){
		mapBounds = require("geoFunctions").getMapBounds(region);
		if(Alloy.Globals.debubMode)
			Ti.API.info(JSON.stringify(mapBounds));
	}else{
		activityIndicator.hide();
		$.infoLbl.text = "No repositories are available in this area!\n Please zoom-out on the map";
		return;
	};
	

	if($.mapview.index === 0){
		annotations = require("db").visibleAnnotations("documents", mapBounds);
	}else{
		annotations = require("db").visibleAnnotations("data", mapBounds);
	}
	Ti.API.info(JSON.stringify(annotations));
	showInfoView();
	if(annotations.availableAnnotations === 0){
		activityIndicator.hide();
		$.infoLbl.text = "No repositories are available in this area!\n Please zoom-out on the map";		
		return;
	}else if(annotations.availableAnnotations > Alloy.Globals.maxNumberShownRepos){
		activityIndicator.hide();
		$.infoLbl.text = "There are " + (annotations.availableAnnotations - Alloy.Globals.maxNumberShownRepos)+ " more repositories in this area!\n Please zoom-in on the map for a new update";
	}else{
		activityIndicator.hide();
		$.infoLbl.text = "There are " + annotations.availableAnnotations + " repositories in this area!\n Click on the markers to see more details";
	};	
	
	$.mapview.removeAllAnnotations();
	$.mapview.setAnnotations(annotations.visibleAnnotations);
};


/*// Animazione info view
var animDuration = 500;
var timeoutDuration = 3000;
var lastTimeout = setTimeout(function(){
	$.infoView.animate({
		opacity : 0,
		duration : animDuration
	});	
},timeoutDuration);
function animateInfoView(){
	clearTimeout(lastTimeout);
	$.infoView.animate({
		opacity : 0.9,
		duration : animDuration
	});
	
	lastTimeout = setTimeout(function(){
		$.infoView.animate({
			opacity : 0,
			duration : animDuration
		});	
	},timeoutDuration);
};
*/

function showInfoView(){
	$.infoView.animate({
		opacity : 0.9,
		duration : 500
	});
};