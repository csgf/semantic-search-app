Ti.Geolocation.purpose = "Semantich Search would like to use your current location to find the repositories around you";
require("db").createTables();
require("db").deleteAllAnnotations();

$.searchWin.tab = $.searchTab;
$.docWin.tab = $.docTab;
$.dataWin.tab = $.dataTab; 

Ti.API.info('yeahh');

if (OS_ANDROID) {
	$.index.addEventListener('open', function(e) {
		var activity = $.index.activity;

		if (activity.actionBar) {
			activity.actionBar.title = "Semantic Search";
		}

	});

	$.docTab.addEventListener('focus', addMapMenu);
	$.dataTab.addEventListener('focus', addMapMenu);
	//$.searchTab.addEventListener('focus', removeMapMenu);

	/*function annotationsReady(e) {
		if (e.source.itemId == 0) {
			if (Alloy.Globals.documentsAnnotationsLoaded) {
				addMapMenu(e);
			}
		} else {
			if (Alloy.Globals.dataAnnotationsLoaded) {
				addMapMenu(e);
			}
		}
	}

	Ti.App.addEventListener("showMapMenu", function(tab) {
		//$.docTab.fireEvent('focus')
	});*/


	function addMapMenu(e) {
		var menuItemTitle = "List";
		if($.index.activeTab == $.docTab){
			if($.docWin.mapShown){
				menuItemTitle = "List";
			}else{
				menuItemTitle = "Map";
			};
		}else{
			if($.dataWin.mapShown){
				menuItemTitle = "List";
			}else{
				menuItemTitle = "Map";
			};			
		};
		
		Ti.API.info("sto creando un bel menu");
		var activity = $.index.activity;
		activity.onCreateOptionsMenu = function(e) {
			var menuInfo = e.menu.add({
				title : "Info & Credits",
				showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW,
				itemId : 2
				//icon : "KS_nav_ui.png"
			});
			/*var menuSettings = e.menu.add({
				title : "Settings",
				showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
				itemId : 3
				//icon : "KS_nav_ui.png"
			});*/
			menuInfo.addEventListener("click", showInfoWindow);
			//menuSettings.addEventListener("click", showSettingsWindow);

			var menuItem = e.menu.add({
				title : menuItemTitle,
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
				itemId : ($.index.activeTab == $.docTab) ? 0 : 1
				//icon : "KS_nav_ui.png"
			});
			var indexSwitch; // Per passare da mappa a lista
			menuItem.addEventListener("click", function(e) {
				//alert(e.source.itemId);
				if(menuItem.title === "List"){
					menuItem.title = "Map";
					indexSwitch = 1;
				}else{
					menuItem.title = "List";
					indexSwitch = 0;
				};
				
				if (e.source.itemId == 0) {
					/*var mappaDoc = Alloy.createController("MapWindow", {
							title: "DR Map View",
							ann: $.docWin.annotations,
							index : 0
						}).getView();
					//addSpy("mappa", mappaDoc);
					mappaDoc.open();
					Ti.API.info("map should be open!");*/
					$.docWin.switchView({
						index : indexSwitch
					});
				} else {
					/*var mappaDoc = Alloy.createController("MapWindow", {
							title: "OADR Map View",
							ann: $.dataWin.annotations,
							index : 1
						}).getView();
						
					mappaDoc.open();*/
					//Ti.API.info("map should be open!");
					$.dataWin.switchView({
						index : indexSwitch
					});
				}
			});
		};
		
		activity.invalidateOptionsMenu();
	}

	function removeMapMenu() {
		var activity = $.index.activity;
		activity.invalidateOptionsMenu();
		activity.onCreateOptionsMenu = function(e) {
			var menuItem = e.menu.removeItem(0);
			
		};
	}

	//$.docTab.addEventListener('load', addMenu);
	//$.dataTab.addEventListener('load', addMenu);
	$.searchTab.addEventListener('focus', addMenu);

	function addMenu() {
		var activity = $.index.activity;
		activity.onCreateOptionsMenu = function(e) {
			//var menuItem = e.menu.removeItem(0);
			var menuInfo = e.menu.add({
				title : "Info & Credits",
				showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW ,
				itemId : 2
				//icon : "KS_nav_ui.png"
			});
			/*var menuSettings = e.menu.add({
				title : "Settings",
				showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
				itemId : 3
				//icon : "KS_nav_ui.png"
			});*/
			menuInfo.addEventListener("click", showInfoWindow);
			//menuSettings.addEventListener("click", showSettingsWindow);
		};
		
		activity.invalidateOptionsMenu();
	}

	/*Ti.App.addEventListener('app:foo', function(data) {
		var name = data.name; 
		Ti.API.info("***********YEEEEEESSSSSSSS: " + name);
		addMapMenu("");
	});*/
}

$.index.open();

function showSettingsWindow(e){
	var settingsWindow = Alloy.createController("SettingsWindow").getView();
	settingsWindow.open();
}

function showInfoWindow(e){
	var infoWindow = Alloy.createController("InfoWindow", {
		url: "/html/info.html"
	}).getView();
	infoWindow.open();
}


if(OS_ANDROID){
	var closeAppAlert = Ti.UI.createAlertDialog({
		title : "Semantic Search",
		message : "Do you want to quit\nSemantic Search?",
		buttonNames : ["YES", "NO"],
		cancel: 1
	});
	closeAppAlert.addEventListener("click", function(e){
		if(e.index === 0){			
			$.index.close();			
			Ti.API.info("CLOSE APP");
			if($.index.getActivity()){
				var activity = $.index.getActivity();
				activity.finish();
			};
		};
		$.index.animate({
			backgroundColor : "#fff",
			duration : 250
		});
	});

	function androidBack(){
		$.index.animate({
			backgroundColor : "#ccc",
			duration : 250
		});
		closeAppAlert.show();
	};
};

// CHECK CONNECTION
var winNoConnection = Ti.UI.createWindow({
	backgroundColor : "#fff"
});
var noConnectionLbl = Ti.UI.createLabel({
	text : "Semantic Search requires an internet connection.\nPlease check your connection.",
	font : {
		fontSize : "18sp",
		fontWeight : 'bold'
	},
	color : Alloy.Globals.css.tintColor,	
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE	,
	textAlign : "center"
});
winNoConnection.add(noConnectionLbl);
var alertDialog = 	Ti.UI.createAlertDialog({
	title : "Semantic Search",
	message : "Semantic Search requires an internet connection.\nPlease check your connection."
});

if(!Titanium.Network.getOnline()){
	alertDialog.show();
	winNoConnection.open();
};
Titanium.Network.addEventListener("change", function(e){
	Ti.API.info("Connection change. Is online? ----> " + e.online);
	if(e.online){
		winNoConnection.close();
	}else{
		alertDialog.show();
		winNoConnection.open();		
	};
});