var args = arguments[0] || {};

var net = require('net');
var tableData = [];
var tableRows = [];
var annotations = [];
$.annotations = annotations;
//$.tableData = tableData;

var style;
if (Ti.Platform.name === 'iPhone OS'){
  style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
}
else {
  style = Ti.UI.ActivityIndicatorStyle.BIG;
}
var activityIndicator = Ti.UI.createActivityIndicator({
	message: 'Loading...',
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
// Adds th ActivityIndicator to the window 
$.window.add(activityIndicator);

function searchBarHideKeyboard(){	
	$.search.blur();
	if(OS_IOS)
		$.searchDone.color = "#838383";
};

function enableSearchDone(){
	if(OS_IOS)
		$.searchDone.color = Alloy.Globals.css.tintColor;
};

var lastRow = 50;
var lastDistance = 0;
var updating = false;
function loadOnScroll(e) {
 	var totalRows = tableData.length;
 	if (OS_IOS){
	 	// calculate location to determine direction
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;
	
		// going down is the only time we dynamically load,
		// going up we can safely ignore -- note here that
		// the values will be negative so we do the opposite	
		if(distance < lastDistance){
			// adjust the % of rows scrolled before we decide to start fetching
			var nearEnd = theEnd * .96;
	
			Ti.API.info("!updating && (total >= nearEnd) && (lastRow < totalRows) ---> " + (!updating) + " && (" + total +" >= " + nearEnd + ") && (" + lastRow + " < " + totalRows + ")");
			if (!updating && (total >= nearEnd) && lastRow < totalRows)
			{
				Ti.API.info("loadMore(lastRow); ---> "+lastRow);
				updating = true;
				loadMore(lastRow);
				lastRow += 50;
				// inserisco un setTimeout per evitare che il loadMore() venga scatenato
				// più volte prima che updating diventi di nuovo false
				setTimeout(function(){
					updating = false;
				},1000);
			}
		};
		lastDistance = distance;
	}else if (OS_ANDROID && (e.totalItemCount < e.firstVisibleItem + e.visibleItemCount + 3)){
		Ti.API.info("e.totalItemCount < (e.firstVisibleItem + e.visibleItemCount + 3) --> " + e.totalItemCount +" < ( "+ e.firstVisibleItem + " "+  e.visibleItemCount + " " + 3 + ")");
		Ti.API.info("!updating && lastRow < totalRows ---> " + (!updating) + " && " + lastRow +" < " + totalRows);
		if (!updating && lastRow < totalRows)
		{
			Ti.API.info("loadMore(lastRow); ---> "+lastRow);
			updating = true;
			loadMore(lastRow);
			lastRow += 50;
			setTimeout(function(){
				updating = false;
			},1000);
		}		
	};
};

/*var lastRow = 50;
var lastDistance = 0;
var updating = false;
var isAndroid = Ti.Platform.osname === 'android';*/
function loadOnScroll2(e){
	if (!updating && isAndroid && (e.totalItemCount < e.firstVisibleItem + e.visibleItemCount + 1) 
            || (!updating && !isAndroid && (e.contentOffset.y + e.size.height + 100 > e.contentSize.height))) {
	        // tell our interval (above) to load more rows
	        updating = true;
	        loadMore(lastRow, 50);
	        lastRow += 50;
	        updating = false;
	       //Ti.API.info("DEVO CARICARE");
    	}
	/*if(OS_IOS){
		var offset = e.contentOffset.y;
	    var height = e.size.height;
	    var total = offset + height;
	    var theEnd = e.contentSize.height;
	    var distance = theEnd - total;

	    // going down is the only time we dynamically load,
	    // going up we can safely ignore -- note here that
	    // the values will be negative so we do the opposite
	    if (distance < lastDistance)
	    {
	            // adjust the % of rows scrolled before we decide to start fetching
	            var nearEnd = theEnd * .75;

	            if (!updating && (total >= nearEnd) && lastRow < tableData.length)
	            {
	                    loadMore(lastRow, 50);
	                    lastRow += 50;
	            }
	    }
	    lastDistance = distance;
	} else {
		var theEnd 		= e.visibleItemCount;
		var distance 	= theEnd - e.totalItemCount;
		if(distance < lastDistance){
			var nearEnd = theEnd *.75;
			if(!updating && (e.totalItemCount >= nearEnd) && (lastRow < tableData.length)){
				loadMore(lastRow, 50);
	            lastRow += 50;
			}
		}
		lastDistance = distance;
    }*/
}

function loadMore(start){
	//Ti.API.info("tableData.length ----> " + tableData.length);
	activityIndicator.show();
	var limit = start + 50;
	if(limit>=tableData.length)
		limit = tableData.length;
	for (var i = start; i < limit; i++) {

			//Ti.API.info(tableData[i].name_rep);

			var row = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				//className : "docClass"
			});
			/*if (OS_IOS) {
				row.hasChild = true;
			}*/
			
			var thumb = Ti.UI.createImageView({
				top : "5dp",
				left : "10dp",
				width : "24dp",
				height : "24dp",
				image : "http://grid.ct.infn.it/api/flags/" + tableData[i].iso2Code + ".png"
			});			
			var title = Ti.UI.createLabel({
				text : tableData[i].name_rep.replace(/\\/g,""),
				top : "5dp",
				left : "45dp",
				right : /*OS_IOS ? "0dp" :*/ "25dp",
				height : "20dp",
				//verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
				font : {
					fontWeight : "bold",
					fontSize : "14sp"
				},
				color: Alloy.Globals.css.titleRowColor
			});
			var domain = Ti.UI.createLabel({
				text : tableData[i].institution,
				top : "25dp",
				bottom : "5dp",
				left : "45dp",				
				right : /*OS_IOS ? "0dp" :*/ "20dp",
				height : Ti.UI.SIZE,
				verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
				font : {
					fontSize : "12sp"
				},
				color: Alloy.Globals.css.subtitleRowColor
			});
			row.add(thumb);
			row.add(title);
			row.add(domain);
			
			//if(OS_ANDROID){
				var arrowIcon = Ti.UI.createImageView({
					right : "5dp",
					width : "15dp",
					height : "15dp",
					image : "/arrow.png"
				});
				row.add(arrowIcon);
			//};

			//$.tv.appendRow(row);
			//Ti.API.info(i);
			
			tableRows.push(row);
		}
		$.tv.setData(tableRows);
		
		//Titanium.API.info("*** DOCUMENTS Item count: " + $.tv.data[0].rows.length + " ***");
		if($.tv.visible != true){
			$.tv.visible = true;
			//activityIndicator.hide();
		}
		activityIndicator.hide();		
}

function doLoadData(){

	activityIndicator.show();
	//if(OS_IOS){		
		$.mapContainer.mapview.visible = true;
		$.window.remove($.tv);
	//};

	net.getDocuments(function(documents) {
		Ti.API.info("finito di caricare DR");
		tableData = documents;
		//Ti.API.info(JSON.stringify(documents));
		Ti.API.info(JSON.stringify(documents.length));
		for (var i = 0; i < documents.length; i++) {
			var annotation = Alloy.Globals.Map.createAnnotation({
				latitude : documents[i].lat,
				longitude : documents[i].long_rep,
				title : documents[i].name_rep,
				pincolor : Alloy.Globals.Map.ANNOTATION_RED,
				subtitle: documents[i].institution,
				link_rep: tableData[i].link_rep,
				domain : tableData[i].domain,
				country : tableData[i].country,
				iso2Code : tableData[i].iso2Code,
				myid : i // Custom property to uniquely identify this annotation.
			});
			
			if (OS_IOS)
				annotation.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;

			annotations.push(annotation);
			
		}
		
		// Inserisco le annotations nel database
		Ti.API.info("Numero di annotazioni in Documenti: " + annotations.length);
		require("db").insertDocumentsRepos(annotations);
			
		//if (OS_IOS) {
			//$.mapview.setAnnotations(annotations);			

			$.mapContainer.mapview.tab = $.tab;
			$.mapContainer.mapview.index = 0;
			//$.mapContainer.mapview.updateAnnotation(annotations);
		//}
		 
		activityIndicator.hide();
		loadMore(0);
		//$.tv.visible = true;
		Alloy.Globals.documentsAnnotationsLoaded = true;

		// Per scatenare il 'regionchanged' dopo il caricamento dei dati
		setTimeout(function(){			
			if(Ti.Geolocation.locationServicesEnabled){
				Ti.Geolocation.getCurrentPosition(function(e){
					Ti.API.info(JSON.stringify(e));
					if(e.success){
						$.mapContainer.mapview.applyProperties({
						    region: {latitude: e.coords.latitude, longitude: e.coords.longitude, latitudeDelta:8, longitudeDelta:8},
						    animate:true,
						    regionFit:true,
						    userLocation:true
						});		
					}else{
						$.mapContainer.mapview.setRegion({
							latitude: 42.563671,
							longitude: 12.642658,
							latitudeDelta: 12,
							longitudeDelta: 12
						});						
					};			
				});
			}else{			
				$.mapContainer.mapview.setRegion({
					latitude: 42.563671,
					longitude: 12.642658,
					latitudeDelta: 12,
					longitudeDelta: 12
				});
			};
		},1000);
		

		if(OS_IOS){
			$.window.remove(activityIndicator);
			activityIndicator.applyProperties({
				top : "50dp",
			});
			$.tv.add(activityIndicator);			
		};
	});
}

function showRepo(e) {
	Ti.API.info(tableData[e.index].link_rep);
	Ti.API.info(tableData[e.index].name_rep);
	var repoWindow = Alloy.createController("RepoWindow", {
		url : tableData[e.index].link_rep,
		title : tableData[e.index].name_rep
	}).getView();
	$.tab.open(repoWindow);
}

function switchView(e) {
	Ti.API.info("ho switchato e passato at :" + e.index);
	if (e.index == 0) {
		$.window.remove($.tv);
		$.mapContainer.mapview.visible = true;
		if(OS_ANDROID)
			$.mapShown = true;
		//$.tv.visible = false;
	} else {
		$.mapContainer.mapview.visible = false;
		$.window.add($.tv);
		if(OS_ANDROID)
			$.mapShown = false;
		//$.tv.visible = true;
	}
}
if(OS_ANDROID){
	$.switchView = switchView;
	$.mapShown = true;
};

/*
if (OS_IOS) {
	$.mapview.addEventListener('click', function (evt) {
	
		Ti.API.info("Annotation " + evt.annotation.title + " clicked, id: " + evt.annotation.myid);
		Ti.API.info(evt.clicksource);
		if (evt.clicksource == "rightButton") {
			var repoWindow = Alloy.createController("RepoWindow", {
				url : tableData[evt.annotation.myid].link_rep,
				title : tableData[evt.annotation.myid].name_rep
			}).getView();
			$.tab.open(repoWindow);
		}
	});
}


//addSpy("mappa", $.mapview);
//addSpy("doc", $);
*/

// Implemento un sistema per eseguire la ricerca solo dopo un certo
// intervallo di tempo dall'ultimo carattere digitato nella searchbar.
// Questo mi consente di limitatre il numero le query al database
var timeoutDuration = 1500;
var lastTimeout = setTimeout(function(){},timeoutDuration);
function searchRepos(e){	
	clearTimeout(lastTimeout);	
	var keyword = e.value.replace(/'/g,"\\'").replace(/"/g,"");		
	//$.window.remove($.tv);
	activityIndicator.show();
	lastRow = 50;
	updating = false;
	tableRows = [];
	tableData = [];
	$.tv.setData(tableRows);
	
	lastTimeout = setTimeout(function(){
		Ti.API.info("Sono trascorsi " + timeoutDuration + "ms dall'ultimo carattere digitato. Eseguo la query per la keyword ---> " + keyword);
		require("db").searchDocRepos(keyword, function(repos){
			tableData = repos;
			//Ti.API.info("repos.length ----> " + repos.length);
			//Ti.API.info("tableData.length ----> " + tableData.length);
			loadMore(0);
			activityIndicator.hide();
			//$.window.add($.tv);		
		});
	},timeoutDuration);
};