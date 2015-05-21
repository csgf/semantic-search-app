//$.iv.top = (Ti.Platform.displayCaps.platformHeight <= 480) ? "70dp" : "140dp" ;
var slide_in =  Titanium.UI.createAnimation({bottom: 0, duration:250});
var slide_out =  Titanium.UI.createAnimation({bottom:-1000, duration:250});

function openSearch() {
	if($.filterLbl.text === "Title"){
		var input = $.searchTxt.value;
	}else{
		var input = $.filterLbl.text.toLowerCase() + ":" + $.searchTxt.value;
	};
	if (!$.searchTxt.value) {
		Ti.UI.createAlertDialog({
			title : "Semantic Search",
			message : "Please type some keywords!"
		}).show();
	} else {
		var resultWinCtrl = Alloy.createController("ResultWindow", {keyword: input, title: $.filterLbl.text+": "+$.searchTxt.value});
		var resultWin = resultWinCtrl.getView();
		
		resultWinCtrl.tab = $.tab;
		$.tab.open(resultWin);
	}
}

function doClick(e){
	$.searchTxt.blur();
}

var filterList = ["Title", "Author", "Subject", "Type", "Format", "Publisher"];
for(var i in filterList){
	var row = Ti.UI.createTableViewRow({
		hasCheck : (parseInt(i)===0),
		filterName : filterList[i],
		height : "45dp"
	});
	var filterName = Ti.UI.createLabel({
		text : filterList[i],
		color : Alloy.Globals.css.tintColor,
		font : {fontSize : "16sp"},
		left : "20dp",
		right : "50dp"
	});
	row.add(filterName);
	$.filterTv.appendRow(row);
};

function openFilterListView(){
	$.filterListView.animate(slide_in);
	$.SearchWindow.animate({
		backgroundColor : "#ccc",
		duration : 500
	});
};

function closeFilterListView(){
	$.filterListView.animate(slide_out);
	$.SearchWindow.animate({
		backgroundColor : "#fff",
		duration : 500
	});
};

function selectFilter(e){
	for(var i in $.filterTv.sections[0].rows){
		$.filterTv.sections[0].rows[i].hasCheck = false;
	};
	$.filterTv.sections[0].rows[e.index].hasCheck = true;
	$.filterLbl.applyProperties({
		text : e.row.filterName
	});
	closeFilterListView();
};


// ESEMPI EN
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : "Examples in English",
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);
var sectionEnglish = Ti.UI.createTableViewSection({
	headerView : headerView
});
var examplesList = [
	{filterName : "Author", keyword : "Smith G.", title: "Author: Smith G."},
	{filterName : "Subject", keyword : "policy", title: "Subject: policy"},
	{filterName : "Type", keyword : "thesis", title: "Type: thesis"},
	{filterName : "Format", keyword : "image/jpeg", title: "Format: image/jpeg"},
	{filterName : "Publisher", keyword : "elsevier", title: "Publisher: elsevier"},
];
for(var i in examplesList){
	var row = Ti.UI.createTableViewRow({
		filterName : examplesList[i].filterName,
		keyword : examplesList[i].keyword,
		tit :  examplesList[i].title,
		height : "45dp"
	});
	var filterName = Ti.UI.createLabel({
		text : examplesList[i].title,
		color : Alloy.Globals.css.tintColor,
		font : {fontSize : "16sp"},
		left : "20dp",
		right : "50dp"
	});
	row.add(filterName);
	sectionEnglish.add(row);
};
$.examplesTv.appendSection(sectionEnglish);

// ARABIC
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : "Examples in Arabic",
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);
var sectionArabic = Ti.UI.createTableViewSection({
	headerView : headerView
});
var examplesList = [
	{filterName : "Author", keyword : "الحامد", title: "Author: الحامد"},
	{filterName : "Subject", keyword : "التربوية", title: "Subject: الإدارة التربوية"},
	{filterName : "Type", keyword : "ومراجع", title: "Type: مصادر ومراجع"},
	{filterName : "Publisher", keyword : "مجلة", title: "Publisher: مجلة جامعة الملك سعود"},
];
for(var i in examplesList){
	var row = Ti.UI.createTableViewRow({
		filterName : examplesList[i].filterName,
		keyword : examplesList[i].keyword,
		tit :  examplesList[i].title,
		height : "45dp"
	});
	var filterName = Ti.UI.createLabel({
		text : examplesList[i].title,
		color : Alloy.Globals.css.tintColor,
		font : {fontSize : "16sp"},
		left : "20dp",
		right : "50dp"
	});
	row.add(filterName);
	sectionArabic.add(row);
};
$.examplesTv.appendSection(sectionArabic);

// CHINESE
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : "Examples in Chinese",
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);
var sectionChinese = Ti.UI.createTableViewSection({
	headerView : headerView
});
var examplesList = [
	{filterName : "Author", keyword : "邓祥征", title: "Author: 邓祥征"},
	{filterName : "Subject", keyword : "台灣文學", title: "Subject: 台灣文學"},
	{filterName : "Type", keyword : "期刊论文", title: "Type: 期刊论文"},
	{filterName : "Publisher", keyword : "信州大学人文学部", title: "Publisher: 信州大学人文学部"},
];
for(var i in examplesList){
	var row = Ti.UI.createTableViewRow({
		filterName : examplesList[i].filterName,
		keyword : examplesList[i].keyword,
		tit :  examplesList[i].title,
		height : "45dp"
	});
	var filterName = Ti.UI.createLabel({
		text : examplesList[i].title,
		color : Alloy.Globals.css.tintColor,
		font : {fontSize : "16sp"},
		left : "20dp",
		right : "50dp"
	});
	row.add(filterName);
	sectionChinese.add(row);
};
$.examplesTv.appendSection(sectionChinese);

// RUSSIAN
var headerView = Ti.UI.createView({
	height : "30dp",
	backgroundColor : Alloy.Globals.css.tintColor
});
var headerTitle = Ti.UI.createLabel({
	text : "Examples in Russian",
	font : {fontSize : "14sp", fontWeight : "bold"},
	left : "10dp",
	width : Ti.UI.SIZE,
	color : "#fff"
});
headerView.add(headerTitle);
var sectionRussian = Ti.UI.createTableViewSection({
	headerView : headerView
});
var examplesList = [
	{filterName : "Author", keyword : "ИвановичСкупский", title: "Author: ИвановичСкупский"},
	{filterName : "Subject", keyword : "Христианство", title: "Subject: Христианство"},
	{filterName : "Type", keyword : "Монография", title: "Type: Монография"},
	{filterName : "Format", keyword : "электронная", title: "Format: электронная копия"},
	{filterName : "Publisher", keyword : "Тбилиси", title: "Publisher: Тбилиси"},
];
for(var i in examplesList){
	var row = Ti.UI.createTableViewRow({
		filterName : examplesList[i].filterName,
		keyword : examplesList[i].keyword,
		tit :  examplesList[i].title,
		height : "45dp"
	});
	var filterName = Ti.UI.createLabel({
		text : examplesList[i].title,
		color : Alloy.Globals.css.tintColor,
		font : {fontSize : "16sp"},
		left : "20dp",
		right : "50dp"
	});
	row.add(filterName);
	sectionRussian.add(row);
};
$.examplesTv.appendSection(sectionRussian);

function openExamplesListView(){
	$.examplesListView.animate(slide_in);
	$.SearchWindow.animate({
		backgroundColor : "#ccc",
		duration : 500
	});	
};

function closeExamplesListView(){
	$.examplesListView.animate(slide_out);
	$.SearchWindow.animate({
		backgroundColor : "#fff",
		duration : 500
	});
};

function selectExample(e){	
	$.filterLbl.applyProperties({
		text : e.row.filterName
	});
	$.searchTxt.applyProperties({
		value : e.row.keyword
	});
	closeExamplesListView();
	setTimeout(function(){
		openSearch();
	},1000);
};