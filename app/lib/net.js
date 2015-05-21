exports.simpleResourcesSearch = function(keyword, offset, _callback) {
	Ti.API.info("offset: "+offset);
	var defaultLimit = Alloy.Globals.numOfResult;
	var url = "http://www.chain-project.eu/virtuoso/api/simpleResources?keyword=" + keyword + "&limit=" + defaultLimit + "&offset=" +offset;
	url = url.replace(/" "/g,"%20");
	Ti.API.info("url: "+url);
	//var url = "http://api.ct.infn.it/resources.json";
	//var url = "http://192.168.1.6/resources.json";
	//var url = "http://liferay2.ct.infn.it/virtuoso/api/resources?keyword=" + keyword + "&limit=" + defaultLimit;
	var xhr = Ti.Network.createHTTPClient({
		timeout: 30000
	});
	
	xhr.onload = function() {
		//Ti.API.info("risultati");
		Ti.API.info(xhr.responseText);
		_callback(JSON.parse(xhr.responseText).simpleResources);
	};
	
	xhr.onerror = function(e) {
		Ti.API.info("non ce l'ho fatta simpleResourcesSearch\n" + e.error);
		if(e.error.indexOf("timed") != -1){
			var errorMessage = L('serverTimeout');
		}else{
			var errorMessage = L('serverError');
		};
		Ti.UI.createAlertDialog({
			title : "Semantic Search",
			message : errorMessage
		}).show();
		_callback(false);
	};
	
	
	xhr.open('GET', url);
	xhr.send();
	
};

exports.singleResourcesSearch = function(idResource, _callback) {
	var url = "http://www.chain-project.eu/virtuoso/api/singleResource?id=" + idResource;
	Ti.API.info("url: "+url);
	var xhr = Ti.Network.createHTTPClient({
		timeout: 30000
	});
	
	xhr.onload = function() {
		//Ti.API.info("risultati");
		Ti.API.info(xhr.responseText);
		_callback(JSON.parse(xhr.responseText));
	};
	
	xhr.onerror = function(e) {
		Ti.API.info("non ce l'ho fatta singleResourcesSearch\n" + e.error);
		Ti.UI.createAlertDialog({
			title : "Semantic Search",
			message : L('serverError')
		}).show();
	};
	
	
	xhr.open('GET', url);
	xhr.send();
	
};

exports.getDocuments = function(_callback) {
	
	//Ti.API.info("sto caricandooooooooooooooooooooooooooodoodfefefeooodddd");
	var defaultLimit = 10;
	var url = "http://grid.ct.infn.it/api/index.php/dr";
	//var url = "http://10.70.1.180/dr.json";
	var xhr = Ti.Network.createHTTPClient({
		timeout: 60000
	});
	
	xhr.onload = function(e) {
		Ti.API.info("ce l'ho fattagaaaaaaaa");
		//alert("loaded");
		//Ti.API.info(JSON.parse(xhr.responseText).dr);
		_callback(JSON.parse(xhr.responseText).dr);
	};
	
	xhr.onerror = function(e) {
		Ti.API.info("non ce l'ho fattaaaaaa\n " + e.error);
		Ti.UI.createAlertDialog({
			title : "Semantic Search",
			message : L('serverError')
		}).show();
	};
	
	
	xhr.open('GET', url);
	xhr.send();
	
};

exports.getData = function(_callback) {
	
	Ti.API.info("sto caricando glioadr");
	var defaultLimit = 10;
	var url = "http://grid.ct.infn.it/api/index.php/oadr";
	//var url = "http://10.70.1.180/oadr.json";
	var xhr = Ti.Network.createHTTPClient({
		timeout: 60000
	});
	
	xhr.onload = function(e) {
		Ti.API.info("ce l'ho fatta OADR");
		//alert("loaded");
		//Ti.API.info(JSON.parse(xhr.responseText).dr);
		_callback(JSON.parse(xhr.responseText).oadr);
	};
	
	xhr.onerror = function(e) {
		Ti.API.info("non ce l'ho fatta OADR\n" + e.error);
		Ti.UI.createAlertDialog({
			title : "Semantic Search",
			message : L('serverError')
		}).show();
	};
	
	
	xhr.open('GET', url);
	xhr.send();
	
};

exports.googleScholarSearch = function(titleResource, _callback) {
	var url = "http://www.chain-project.eu/virtuoso/api/infoGS?title=" + titleResource;
	url = url.replace(/" "/g,"%20");
	Ti.API.info("url: "+url);
	var xhr = Ti.Network.createHTTPClient({
		timeout: 30000
	});
	
	xhr.onload = function() {
		//Ti.API.info("risultati");
		Ti.API.info(xhr.responseText);
		_callback(JSON.parse(xhr.responseText));
	};
	
	xhr.onerror = function(e) {
		Ti.API.info("non ce l'ho fatta Google Scholar\n" + e.error);
		Ti.UI.createAlertDialog({
			title : "Semantic Search",
			message : L('serverError')
		}).show();
	};
	
	
	xhr.open('GET', url);
	xhr.send();
	
};