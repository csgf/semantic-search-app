var args = arguments[0] || {};

var expandLbl = {
	left : "15dp",
	text : "Show more info...",
	font : {fontSize:"14sp"},
	color : "#838383"
};
var expandIV = {
	right : "5dp",
	top : "-2dp",
	width : "42dp",
	height : "25dp",
	image : "/images/expand.png"
};
var reduceIV = {
	right : "5dp",
	top : "-2dp",
	width : "42dp",
	height : "25dp",
	image : "/images/reduce.png"
};

var activityIndicator;
var style;
if (OS_IOS){
  style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
}
else {
  style = Ti.UI.ActivityIndicatorStyle.BIG;
}

activityIndicator = Ti.UI.createActivityIndicator({
	message: 'Loading...',
	style:style,
	color : "#fff",
	//backgroundColor : "white",
	font : {fontSize : "20dp", fontWeight : OS_ANDROID ? "bold" : "normal"},	
	width : OS_IOS ? "180dp" : "200dp",
	height : "80dp",
	backgroundColor : Alloy.Globals.css.tintColor,
	borderRadius : 10,
	visible : false,
	opacity : 0.8,
	zIndez : 10	
});

$.detailWin.add(activityIndicator);

// TITLE
var rowTitle = Ti.UI.createTableViewRow({
	height : Ti.UI.SIZE,
	//hasChild : OS_IOS,
	backgroundColor : Alloy.Globals.css.tintColor,
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});

var titleIV = Ti.UI.createImageView({
	left : "5dp",
	wifth : "35dp",
	height : "35dp",
	image : "/images/browser.png"
});

var title = Ti.UI.createLabel({
	text : args.resource.titles[0],
	left : "45dp",
	top : "5dp",
	bottom : "5dp",
	right: /*OS_IOS ? "0dp" :*/ "25dp",
	height : Ti.UI.SIZE,
	font : {
		fontWeight : "bold",
		fontSize : "16dp"
	},
	color: "#fff", //Alloy.Globals.css.tintColor
	verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
	//borderColor : "#fff"
});

// Per centrare la label nella row uso il postlayout
var postLayout = false;
title.addEventListener("postlayout", function(e){
	if(!postLayout){		
		//Ti.API.info(JSON.stringify(e));
		var top = "5dp";
		Ti.API.info(e.source.rect.height);
		if(e.source.rect.height <= 40){
			var top = (60-e.source.rect.height)/2;
			rowTitle.setHeight(63);
			title.setTop(top);
		}else{				
			rowTitle.setHeight(Ti.UI.SIZE);
			title.setTop(top);			
		};
		Ti.API.info("top ---> " + top);
		postLayout = true;
		setTimeout(function(){
			postLayout = false;
		},500); // Altrimenti il postlayout innesca un loop
	};
});

//if(OS_ANDROID){
	var arrowIcon = Ti.UI.createImageView({
		right : "5dp",
		width : "15dp",
		height : "15dp",
		image : "/arrowWhite.png"
	});
	rowTitle.add(arrowIcon);
//};	

rowTitle.add(titleIV);
rowTitle.add(title);
$.tv.appendRow(rowTitle);

// GOOGLE SCHOLAR
var rowGoogleScholar= Ti.UI.createTableViewRow({
	height : "45dp",
	//hasChild : OS_IOS,
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});

var googleScholarIV = Ti.UI.createImageView({
	left : "5dp",
	wifth : "35dp",
	height : "35dp",
	image : "/images/gscholar.png"
});

var titleGoogleScholar = Ti.UI.createLabel({
	text : "Show Google Scholar information for this resource",
	left : "45dp",
	right: /*OS_IOS ? "0dp" :*/ "25dp",
	height : Ti.UI.SIZE,
	font : {
		fontWeight : "bold",
		fontSize : "14dp"
	},
	color: Alloy.Globals.css.tintColor
});
//if(OS_ANDROID){
	var arrowIcon = Ti.UI.createImageView({
		right : "5dp",
		width : "15dp",
		height : "15dp",
		image : "/arrow.png"
	});
	rowGoogleScholar.add(arrowIcon);
//};	

rowGoogleScholar.add(googleScholarIV);
rowGoogleScholar.add(titleGoogleScholar);
$.tv.appendRow(rowGoogleScholar);

var googleScholarLoaded = false;
var gsResults = {};
rowGoogleScholar.addEventListener("click", function(){
	activityIndicator.show();
	if(OS_ANDROID){
		$.loadingBG.show();
	};
	$.loadingBG.animate({
		visible : true,
		opacity : 0.5,
		duration : 250
	});
	if(!googleScholarLoaded){
		require('net').googleScholarSearch(args.resource.titles[0], function(result){
			if(result.length === 0){
				activityIndicator.hide();
				$.loadingBG.animate({
					opacity : 0,
					duration : 250
				});
				setTimeout(function(){
					$.loadingBG.visible = false;
				},250);
				Ti.UI.createAlertDialog({
					title : "SemanticSearch",
					message : "Google Scholar Resource not found"
				}).show();				
				return;
			}else{
				gsResults = result;
				googleScholarLoaded = true;	
				showGoogleScholarDetails();
			};
		});
	}else{
		showGoogleScholarDetails();
	};	
});
function showGoogleScholarDetails(){
	activityIndicator.hide();
	$.loadingBG.animate({
		opacity : 0,
		duration : 250
	});
	setTimeout(function(){
		$.loadingBG.visible = false;
	},250);
	var gScholarWindow = Alloy.createController("gScholarWindow", {
		results : gsResults	,
		title : args.resource.titles[0],
		tab : $.tab
	}).getView();
	if(OS_IOS)
		$.tab.open(gScholarWindow);	
	else
		gScholarWindow.open();
};

// GENERAL SECTION
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : 'General Information',
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);

var sExpandGeneral = Ti.UI.createTableViewSection({ headerView : headerView });
var expandRowGeneral = Ti.UI.createTableViewRow({	
	height : "30dp",
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var expandLblGeneral = Ti.UI.createLabel(expandLbl);
expandRowGeneral.add(expandLblGeneral);
var expandIVGeneral = Ti.UI.createImageView(expandIV);
expandRowGeneral.add(expandIVGeneral);
expandRowGeneral.addEventListener("click", function(e){
	$.tv.deleteSection(1);
	setTimeout(function(){
		$.tv.insertSectionAfter(0,sGeneral);
	},250);
});
sExpandGeneral.add(expandRowGeneral);
$.tv.appendSection(sExpandGeneral);

var sGeneral = Ti.UI.createTableViewSection({ headerView : headerView });
var reduceRowGeneral = Ti.UI.createTableViewRow({
	height : "30dp",
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var reduceIVGeneral = Ti.UI.createImageView(reduceIV);
reduceRowGeneral.add(reduceIVGeneral);
reduceRowGeneral.addEventListener("click", function(e){
	$.tv.deleteSection(1);
	setTimeout(function(){
		$.tv.insertSectionAfter(0,sExpandGeneral);
	},250);
});
sGeneral.add(reduceRowGeneral);

var resource = args.resource;			
var labels = [];
var texts = [];
var index = 0;

for(var key in resource){
	if(resource.hasOwnProperty(key) && ((key != "repository") && (key != "titles")) && (resource[key].length > 0)){
		var row = Ti.UI.createTableViewRow({
				color: "black",
				selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
			});
	//labels.text += key + ": \t\t" + repository[key] + "\n"
		Ti.API.info(key + " ---> " + typeof key.toString());
		var label = Ti.UI.createLabel({
			text : L(key),
			left : "5dp",
			top : "5dp",
			font : {
				fontWeight : "bold",
				fontSize : "14dp"
			},
			height: Ti.UI.SIZE,
			color: Alloy.Globals.css.tintColor
		});
		var s = "";
		for(var j = 0; j < resource[key].length; j++){
			if(j != 0){
				s += "\n" + resource[key][j];
			} else {
				s += resource[key][j];
			}
		}
		//Ti.API.info(s);
		var textrows = s.split('\n');
		var nrig = textrows.length;
		var isURL = false;
		for (var t = 0, srigs = nrig; t < srigs; t++) {
			var offset = textrows[t].length / 42;
			/*if(key == "identifiers" && (textrows[t].indexOf("http") != -1)){
				isURL = true;
			}*/
			if (offset >= 1)
				nrig += Math.ceil(offset);
		}
		//Ti.API.info("num di righe:" + nrig);
		var htext = (nrig+2) * 12;
		//resource[key].join('\n')
		//Ti.API.info(htext);

		var text = Ti.UI.createLabel({
			text : s,
			left : "10dp",
			top : "30dp",
			bottom : "5dp",
			height : Ti.UI.SIZE,
			font : {
				fontSize : "12dp"
			},
			right: "5dp",
			color: 'black'
		});
		/*if(isURL && !OS_IOS){			
			text.addEventListener('click', function(e) {
				Ti.API.info(JSON.stringify(e.source.text));
				var s = e.source.text.split('\n');
				for(var i = 0; i<s.length; i++){
					if(s[i].indexOf("http")!=-1){
						var repoWindow = Alloy.createController("RepoWindow", {
							url : s[i],
							title : "Document"
						}).getView();
						repoWindow.open();
						break;
					}
				}
				
			});
		}*/
		//row.height = htext;
		row.add(label);
		row.add(text);
		
		
		sGeneral.add(row);

		//index++;
	}
}


//$.tv.appendSection(sGeneral);



// 	DATASET SECTION
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : 'Dataset Information',
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);

var sExpandDataset = Ti.UI.createTableViewSection({ headerView : headerView });
var expandRowDataset = Ti.UI.createTableViewRow({	
	height : "30dp",
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var expandLblDataset = Ti.UI.createLabel(expandLbl);
expandRowDataset.add(expandLblDataset);
var expandIVDataset = Ti.UI.createImageView(expandIV);
expandRowDataset.add(expandIVDataset);
expandRowDataset.addEventListener("click", function(e){
	$.tv.deleteSection(2);
	setTimeout(function(){
		$.tv.insertSectionAfter(1,sDataset);
	},250);
});
sExpandDataset.add(expandRowDataset);
$.tv.appendSection(sExpandDataset);

var sDataset = Ti.UI.createTableViewSection({ headerView : headerView });
var reduceRowDataset = Ti.UI.createTableViewRow({
	height : "30dp",
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var reduceIVDataset = Ti.UI.createImageView(reduceIV);
reduceRowDataset.add(reduceIVDataset);
reduceRowDataset.addEventListener("click", function(e){
	$.tv.deleteSection(2);
	setTimeout(function(){
		$.tv.insertSectionAfter(1,sExpandDataset);
	},250);
});
sDataset.add(reduceRowDataset);

var dataset = args.resource.dataset;
var index = 0;
	//alert("CIAO");
for(var key in dataset){
	if(dataset.hasOwnProperty(key) && (dataset[key].length > 0) && (dataset[key][0].length > 0) ){
		//Ti.API.info("repository["+key+"]: " + repository[key]);
		var row = Ti.UI.createTableViewRow({
			color: "black",
			selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
		});
		var label = Ti.UI.createLabel({
			text : L(key),
			left : "5dp",
			top : "5dp",
			font : {
				fontWeight : "bold",
				fontSize : "14dp"
			},
			height: Ti.UI.SIZE,
			color: Alloy.Globals.css.tintColor
		});
		var s = "";
		for(var j = 0; j < dataset[key].length; j++){
			if(j != 0){
				s += "\n" + dataset[key][j];
			} else {
				s += dataset[key][j];
			}
		}
		//Ti.API.info(s);
		var textrows = s.split('\n');
		var nrig = textrows.length;
		var isURL = false;
		for (var t = 0, srigs = nrig; t < srigs; t++) {
			var offset = textrows[t].length / 42;
			if(key == "idDataset" && (textrows[t].indexOf("http") != -1)){
				isURL = true;
			}
			if (offset >= 1)
				nrig += Math.ceil(offset);
		}
		//Ti.API.info("num di righe:" + nrig);
		var htext = (nrig+2) * 12;
		//resource[key].join('\n')
		//Ti.API.info(htext);

		var text = Ti.UI.createLabel({
			text : s,
			left : "10dp",
			top : "30dp",
			bottom : "5dp",
			height : Ti.UI.SIZE,
			font : {
				fontSize : "12dp"
			},
			right: "5dp",
			color: (isURL) ? Alloy.Globals.css.tintColor :'black'
		});
		if(isURL){			
			/*if(OS_ANDROID){
				text.applyProperties({
					right: "25dp",
				});
				var arrowIcon = Ti.UI.createImageView({
					right : "5dp",
					width : "15dp",
					height : "15dp",
					image : "/arrow.png"
				});
				row.add(arrowIcon);				
			}else{
				row.applyProperties({
					hasChild : true
				});
			};*/
			text.addEventListener('click', function(e) {
				Ti.API.info(JSON.stringify(e.source.text));
				var s = e.source.text.split('\n');
				//Ti.Platform.openURL(s[0]);
				var repoWindow = Alloy.createController("RepoWindow", {
					url : s[0],
					title : e.source.text
				}).getView();
				$.tab.open(repoWindow);				
				/*for(var i = 0; i<s.length; i++){
					if(s[i].indexOf("http")!=-1){
						var repoWindow = Alloy.createController("RepoWindow", {
							url : s[i],
							title : "Dataset"
						}).getView();
						repoWindow.open();
						break;
					}
				}*/
				
			});
		}
		//row.height = htext;
		row.add(label);
		row.add(text);
		
		sDataset.add(row);
	}
}
//$.tv.appendSection(sDataset);


var row = Ti.UI.createTableViewRow({
			color: "black",
			selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
		});
var button = Titanium.UI.createButton({
	   title: '  Resource link  ',
	   color: "black",
	   top: 5,
	   bottom: 5,
	   width: "auto",
	   backgroundColor: "#DDD",
	   height: 50
	});
rowTitle.addEventListener('click',function(e)	{
	Ti.API.info(JSON.stringify(e.source.text));
	Ti.Platform.openURL(dataset.idDataset[0]);
	//var s = e.source.text.split('\n');

});
row.add(button);
//$.tv.insertRowBefore(0, row);



// 	REPOSITORY SECTION
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : 'Repository Information',
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);

var sExpandRepository = Ti.UI.createTableViewSection({ headerView : headerView });
var expandRowRepository = Ti.UI.createTableViewRow({	
	height : "30dp",
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var expandLblRepository = Ti.UI.createLabel(expandLbl);
expandRowRepository.add(expandLblRepository);
var expandIVRepository = Ti.UI.createImageView(expandIV);
expandRowRepository.add(expandIVRepository);
expandRowRepository.addEventListener("click", function(e){
	$.tv.deleteSection(3);
	setTimeout(function(){
		$.tv.insertSectionAfter(2,sRepository);
	},250);
});
sExpandRepository.add(expandRowRepository);
$.tv.appendSection(sExpandRepository);

var sRepository = Ti.UI.createTableViewSection({ headerView : headerView });
var reduceRowRepository = Ti.UI.createTableViewRow({
	height : "30dp",
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var reduceIVRepository = Ti.UI.createImageView(reduceIV);
reduceRowRepository.add(reduceIVRepository);
reduceRowRepository.addEventListener("click", function(e){
	$.tv.deleteSection(3);
	setTimeout(function(){
		$.tv.insertSectionAfter(2,sExpandRepository);
	},250);
});
sRepository.add(reduceRowRepository);

var repository = args.resource.repository;
var index = 0;
//alert("CIAO");
for(var key in repository){
	if(repository.hasOwnProperty(key) && (repository[key].length > 0) && (key != "rankRepo")){
		//Ti.API.info("repository["+key+"]: " + repository[key]);
		var row = Ti.UI.createTableViewRow({
			color: "black",
			selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
		});
		var label = Ti.UI.createLabel({
			text : L(key),
			left : "5dp",
			top : "5dp",
			font : {
				fontWeight : "bold",
				fontSize : "14dp"
			},
			height: Ti.UI.SIZE,
			color: Alloy.Globals.css.tintColor
		});
		var s = repository[key];
		
		var textrows = s.split('\n');
		var nrig = textrows.length;
		var isURL = false;
		for (var t = 0, srigs = nrig; t < srigs; t++) {
			var offset = textrows[t].length / 42;
			if(key == "urlRepo" && (textrows[t].indexOf("http") != -1)){
				isURL = true;
			}
			if (offset >= 1)
				nrig += Math.ceil(offset);
		}
		//Ti.API.info("num di righe:" + nrig);
		var htext = (nrig+2) * 12;
		//resource[key].join('\n')
		//Ti.API.info(htext);

		var text = Ti.UI.createLabel({
			text : s,
			left : "10dp",
			top : "30dp",
			bottom : "5dp",
			height : Ti.UI.SIZE,
			font : {
				fontSize : "12dp"
			},
			right: "5dp",
			color: (isURL) ? Alloy.Globals.css.tintColor :'black'
		});

		if(isURL){			
			/*if(OS_ANDROID){
				text.applyProperties({
					right: "25dp",
				});
				var arrowIcon = Ti.UI.createImageView({
					right : "5dp",
					width : "15dp",
					height : "15dp",
					image : "/arrow.png"
				});
				row.add(arrowIcon);				
			}else{
				row.applyProperties({
					hasChild : true
				});
			};*/
			text.addEventListener('click', function(e) {
				Ti.API.info(JSON.stringify(e.source.text));
				var s = e.source.text.split('\n');
				for(var i = 0; i<s.length; i++){
					if(s[i].indexOf("http")!=-1){
						var repoWindow = Alloy.createController("RepoWindow", {
							url : s[i],
							title : repository.nameRepo
						}).getView();
						$.tab.open(repoWindow);	
						break;
					}
				}
				
			});
		}
		//row.height = htext;
		row.add(label);
		row.add(text);
		
		
		sRepository.add(row);
	}
}

// MAP SECTION
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : 'Repository Location',
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);
var sMap = Ti.UI.createTableViewSection({ headerView : headerView });
var repoRow= Ti.UI.createTableViewRow({
				height : "300dp",			
				className : "pippo"
			});

var Map = require('ti.map');

var mountainView = Map.createAnnotation({
    latitude : repository.latitudeRepo,
    longitude : repository.longitudeRepo,
    title : repository.nameRepo,
    subtitle :repository.organizationRepo,
    rightButton : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
    pincolor:Map.ANNOTATION_RED,
    url : repository.urlRepo,
    myid:1 // Custom property to uniquely identify this annotation.
});

var mapview = Map.createView({
    mapType: Map.NORMAL_TYPE,
    region: {latitude : repository.latitudeRepo, longitude : repository.longitudeRepo,
            latitudeDelta:10, longitudeDelta:10},
    animate:true,
    regionFit:true,
    userLocation:true,
    annotations:[mountainView]
});
mapview.addEventListener('click', function(e){
	Ti.API.info("Annotation " + e.annotation.title + " clicked, id: " + e.annotation.url);
	Ti.API.info(e.clicksource);
	if(OS_IOS){
		if(e.clicksource === "rightButton"){
			var repoWindow = Alloy.createController("RepoWindow", {
				url : e.annotation.url,
				title : e.annotation.title
			}).getView();
			$.tab.open(repoWindow);
		};
	}else if(OS_ANDROID){
		if(!e.annotation){ 
			return;
		};
		if (e.clicksource != null && e.clicksource != "pin") {
			//Ti.API.info("Repo should be opened")
			var repoWindow = Alloy.createController("RepoWindow", {
				url : e.annotation.url,
				title : e.annotation.title
			}).getView();
			repoWindow.open();
		}
	};

});
repoRow.add(mapview);
sMap.add(repoRow);
$.tv.appendSection(sMap);

if(OS_ANDROID){
	function removeMap(){
		$.detailWin.remove(mapview);
		mapview = null;
		$.tv.deleteRow(repoRow);
		$.tv.deleteSection(4);
		$.detailWin.close();
	}
	$.detailWin.addEventListener("close",removeMap);
	$.detailWin.addEventListener("android:back", removeMap);
};