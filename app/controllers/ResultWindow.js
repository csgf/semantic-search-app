var args = arguments[0] || {};

var keyword = args.keyword;
Ti.API.info(keyword);
$.resWin.title = args.title; 

var net = require('net');
//Ti.API.info("net fwefwemodule loaded");
//Ti.API.info(JSON.stringify(net));

var activityIndicator;
var style;
if (OS_IOS){
  style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
}
else {
  style = Ti.UI.ActivityIndicatorStyle.BIG;
}

activityIndicator = Ti.UI.createActivityIndicator({
	message: 'Searching...',
	style:style,
	color : "#fff",
	//backgroundColor : "white",
	font : {fontSize : "20dp", fontWeight : OS_ANDROID ? "bold" : "normal"},	
	width : OS_IOS ? "180dp" : "200dp",
	height : "80dp",
	backgroundColor : Alloy.Globals.css.tintColor,
	borderRadius : 10,
	visible : true,
	opacity : 0.8,
	zIndez : 10	
});

$.resWin.add(activityIndicator);
activityIndicator.show();

var tableData = [];
var TableRows = [];

var footerRow = Ti.UI.createTableViewRow({height : "50dp"});
if(OS_IOS)
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
var footerActivityIndicator = Ti.UI.createActivityIndicator({
  message: 'Loading...',
  style:style,
  color : Alloy.Globals.css.tintColor,
  backgroundColor : "white",
  font : {fontSize : "16dp"},
  height:Ti.UI.SIZE,
  width:Ti.UI.SIZE
});
footerActivityIndicator.show();
footerRow.add(footerActivityIndicator);

function loadResult(){
	callSearch(0);	
}

var lastRow = Alloy.Globals.numOfResult;
var lastDistance = 0;
var updating = false;
var isAndroid = Ti.Platform.osname === 'android';
function loadOnScroll(e){
	if (!updating && isAndroid && (e.totalItemCount < e.firstVisibleItem + e.visibleItemCount + 3)
        || (!updating && !isAndroid && (e.contentOffset.y + e.size.height + 100 > e.contentSize.height))) {
        // tell our interval (above) to load more rows
        
        callSearch(lastRow);
        lastRow += Alloy.Globals.numOfResult;

       //Ti.API.info("DEVO CARICARE");
	}
}
var firstCallSearch = true;
function callSearch(offset){
	updating = true;
	net.simpleResourcesSearch(keyword, offset, function(result) {
		
		activityIndicator.message = "Loading...";
		Ti.API.info(result);
		Ti.API.info("Loaded: " + result.length + " results.");
		
		if(firstCallSearch && result.length === 0){
			var alertDialog = Ti.UI.createAlertDialog({
				title : "SemanticSearch",
				message : "No results for this search"
			});
			alertDialog.show();
			setTimeout(function(){
				$.resWin.close();
			},3000);
			return;
		};
		
		if(firstCallSearch && !result){
			setTimeout(function(){
				$.resWin.close();
			},OS_IOS ? 1000 : 4000);
			return;
		};
		
		
		for (var i = 0; i < result.length; i++) {

			if(i==0 && tableData.length != 0){
				$.tv.deleteRow(tableData.length);
			}

			var row = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				//className : "pippo"
			});
			/*if (OS_IOS) {
				row.hasChild = true;
			}else if(OS_ANDROID){*/
				var arrowIcon = Ti.UI.createImageView({
					right : "5dp",
					width : "15dp",
					height : "15dp",
					image : "/arrow.png"
				});
				row.add(arrowIcon);
			//};
			
			var thumb = Ti.UI.createImageView({
				top : "13dp",
				left : "5dp",
				width : "24dp",
				height : "24dp",
				image : "/images/accessOrange.png"
			});
			
			var labelsView = Ti.UI.createView({
				left : "35dp",
				right : /*OS_IOS ? "0dp" :*/ "25dp",
				layout : "vertical",
				top : "5dp",
				height : Ti.UI.SIZE,
				bottom : "5dp",
				//borderColor : "red"
			});
			var title = Ti.UI.createLabel({
				top : "5dp",
				text : result[i].titles[0],
				left : "0dp",
				//right : OS_IOS ? "0dp" : "25dp",
				//top : "2dp",
				//width: "95%",
				height : Ti.UI.SIZE,
				//borderWidth: 1,
				font : {
					fontWeight : "bold",
					fontSize : "14dp"
				},
				color: Alloy.Globals.css.tintColor,
				//borderColor : "blue"
			});
			//Ti.API.info(result[i].authors)
			var authors = Ti.UI.createLabel({
				text : result[i].authors[0],
				left : "0dp",
				//right : OS_IOS ? "0dp" : "25dp",
				top : "3dp",
				bottom : "5dp",
				height : Ti.UI.SIZE,
				font : {
					fontSize : "12dp"
				},
				color: Alloy.Globals.css.subtitleRowColor,
				//borderColor : "yellow"
			});

			row.add(thumb);
			//row.add(title);
			//row.add(authors);
			labelsView.add(title);
			labelsView.add(authors);
			row.add(labelsView);

			//TableRows.push(row);
			$.tv.appendRow(row);
			tableData.push(result[i]);
		}
		//TI.API.info("########"+TableRows.length+"############");
		//$.tv.appendRow(TableRows);
		$.tv.appendRow(footerRow);
		if(result.length === 0 || ((result.length < Alloy.Globals.numOfResult) && firstCallSearch))
			$.tv.deleteRow(footerRow);
		if(activityIndicator.visible){
			activityIndicator.hide();
			$.tv.visible = true;
		}
		Titanium.API.info("*** DATA Item count: " + $.tv.data[0].rows.length + " ***");
        setTimeout(function(){
			updating = false;
        },1000); // Altrimenti, nel caso in cui non ci sono più risultati, la funzione con l'evento onScroll viene invocata più volte
        firstCallSearch = false;        
	});
	
}

var showDetailsRun = false; // Per evitare di cliccare su più risorse. Visualizzo una sola pagina di dettaglio alla volta
function showDetails(e) {
	Ti.API.info(tableData[e.index]);
	if(!tableData[e.index]){
		return;
	};
	if(showDetailsRun)
		return;
	showDetailsRun = true;
	activityIndicator.show();	
	$.resWin.animate({
		backgroundColor : "#ccc",
		duration : 500
	});	
	net.singleResourcesSearch(tableData[e.index].idResource, function(result) {
		Ti.API.info(tableData[e.index].titles[0]);
		//Ti.API.info(tableData[e.index].name_rep);
		var detailsCtrl = Alloy.createController("DetailWindow", {	
			resource : result
		});
		detailsCtrl.tab = $.tab;
		var detailsWindow = detailsCtrl.getView();
		//alert($.tab);
		//alert("Dovrei aprire")
		$.tab.open(detailsWindow);
		activityIndicator.hide();		
		$.resWin.animate({
			backgroundColor : "#fff",
			duration : 500
		});
		setTimeout(function(){
			showDetailsRun = false;
		},1000);
	});
}
