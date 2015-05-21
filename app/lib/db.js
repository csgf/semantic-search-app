exports.createTables = function(){		
	
	//apro il database e carico, o costruisco se non esiste, la struttura della tabella
	var db = Ti.Database.open("SSDB");

	// TABELLA DATA
	db.execute("CREATE TABLE IF NOT EXISTS data (myid INTEGER, latitude INTEGER, longitude INTEGER, title TEXT, subtitle TEXT, link_rep TEXT, domain TEXT, country_code TEXT, name TEXT)");

	// TABELLA DOCUMENTS
	db.execute("CREATE TABLE IF NOT EXISTS documents (myid INTEGER, latitude INTEGER, longitude INTEGER, title TEXT, subtitle TEXT, link_rep TEXT, domain TEXT, country TEXT, iso2Code TEXT)");

	// TABELLA DATABASE INFO
	db.execute("CREATE TABLE IF NOT EXISTS databaseInfo (dbVersion INTEGER)");
	db.execute("INSERT INTO databaseInfo (dbVersion) VALUES (?)", 1);
	
	db.close();
};

exports.readRepos = function(table) {
	var repos = [];
	var db = Ti.Database.open("SSDB");
	var result = db.execute("SELECT * FROM " + table);
	
	while(result.isValidRow()) {		
		var repo = {
			latitude : result.fieldByName("latitude"),
			longitude : result.fieldByName("longitude"),
			title : result.fieldByName("title"),
			pincolor : Alloy.Globals.Map.ANNOTATION_RED,
			subtitle : result.fieldByName("subtitle"),
			link_rep: result.fieldByName("link_rep"),
			myid : result.fieldByName("myid") // Custom property to uniquely identify this annotation.
		};
		repos.push(repo);
		result.next();
	};
	
	result.close();
	db.close();
	return repos;
};

exports.insertDocumentsRepos = function(repos) {
	var db = Ti.Database.open("SSDB");
	
	db.execute('BEGIN'); // begin the transaction		
	for(var i in repos){
		var insert = "INSERT INTO documents (myid, latitude, longitude, title, subtitle, link_rep, domain, country, iso2Code) VALUES (?,?,?,?,?,?,?,?,?)";
		db.execute(insert, repos[i].myid, repos[i].latitude, repos[i].longitude, repos[i].title, repos[i].subtitle, repos[i].link_rep, repos[i].domain, repos[i].country, repos[i].iso2Code);
	};
	db.execute('COMMIT'); // commit the transaction
	db.close();
};

exports.insertDataRepos = function(repos) {
	var db = Ti.Database.open("SSDB");
	
	db.execute('BEGIN'); // begin the transaction		
	for(var i in repos){
		var insert = "INSERT INTO data (myid, latitude, longitude, title, subtitle, link_rep, domain, country_code, name) VALUES (?,?,?,?,?,?,?,?,?)";
		db.execute(insert, repos[i].myid, repos[i].latitude, repos[i].longitude, repos[i].title, repos[i].subtitle, repos[i].link_rep, repos[i].domain, repos[i].country_code, repos[i].name);
	};
	db.execute('COMMIT'); // commit the transaction
	db.close();
};

exports.visibleAnnotations = function(table, mapBounds) {
	var visibleAnnotations = [];
	var availableAnnotations = 0;
	var db = Ti.Database.open("SSDB");
	var select = "SELECT * FROM " + table + " WHERE (longitude BETWEEN ? and ?) AND (latitude BETWEEN ? and ?)";
	var result = db.execute(select, mapBounds.sw.lng, mapBounds.ne.lng, mapBounds.sw.lat, mapBounds.ne.lat);

	// Se ci sono troppe annotazioni nella regione di mappa visible, chiedo di zoommare la mappa
	availableAnnotations = result.rowCount;
	Ti.API.info("availableAnnotations ---> " + availableAnnotations);
	Ti.API.info("availableAnnotations > " +Alloy.Globals.maxNumberShownRepos+" ---> " + (availableAnnotations > Alloy.Globals.maxNumberShownRepos));
	
	var i = 0;
	while(result.isValidRow() && i < Alloy.Globals.maxNumberShownRepos) {		
		var annotation = Alloy.Globals.Map.createAnnotation({
			latitude : result.fieldByName("latitude"),
			longitude : result.fieldByName("longitude"),
			title : result.fieldByName("title"),
			pincolor : Alloy.Globals.Map.ANNOTATION_RED,
			subtitle : result.fieldByName("subtitle"),
			link_rep: result.fieldByName("link_rep"),
			myid : result.fieldByName("myid") // Custom property to uniquely identify this annotation.
		});
		if (OS_IOS)
			annotation.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
		visibleAnnotations.push(annotation);
		i++;
		result.next();
	};
		
	result.close();
	db.close();
	return {
		visibleAnnotations: visibleAnnotations,
		availableAnnotations: availableAnnotations
	};
};

exports.searchDocRepos = function(keyword, callback) {
	var repos = [];
	var db = Ti.Database.open("SSDB");
	var select = 'SELECT * FROM documents WHERE (title || subtitle || domain || country || iso2Code) LIKE  "%'+keyword+'%"';
	var result = db.execute(select);

	// Se ci sono troppe annotazioni nella regione di mappa visible, chiedo di zoommare la mappa
	Ti.API.info("Record corrispondenti trovati: " + result.rowCount);

	while(result.isValidRow()) {		
		var repo = {
			iso2Code : result.fieldByName("iso2Code"),
			name_rep : result.fieldByName("title"),
			institution : result.fieldByName("subtitle"),
			link_rep : result.fieldByName("link_rep")
		};		
		repos.push(repo);
		result.next();
	};
		
	result.close();
	db.close();
	
	callback(repos);
};

exports.searchDataRepos = function(keyword, callback) {
	var repos = [];
	var db = Ti.Database.open("SSDB");
	var select = 'SELECT * FROM data WHERE (title || subtitle || domain || country_code || name) LIKE  "%'+keyword+'%"';
	var result = db.execute(select);

	// Se ci sono troppe annotazioni nella regione di mappa visible, chiedo di zoommare la mappa
	Ti.API.info("Record corrispondenti trovati: " + result.rowCount);

	while(result.isValidRow()) {		
		var repo = {
			country_code : result.fieldByName("country_code"),
			name_rep : result.fieldByName("title"),
			institution : result.fieldByName("subtitle"),
			link_rep : result.fieldByName("link_rep")
		};		
		repos.push(repo);
		result.next();
	};
		
	result.close();
	db.close();
	
	callback(repos);
};

exports.deleteAllAnnotations = function() {
	var db = Ti.Database.open("SSDB");
	db.execute("DELETE FROM data");
	db.execute("DELETE FROM documents");
	db.close();
};
