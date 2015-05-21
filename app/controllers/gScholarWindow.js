var args = arguments[0] || {};
var resource = args.results;
var tab = args.tab;

// TITLE
var rowTitle = Ti.UI.createTableViewRow({
	height : Ti.UI.SIZE,
	backgroundColor : Alloy.Globals.css.tintColor,
	selectionStyle: (OS_IOS) ? Ti.UI.iPhone.TableViewCellSelectionStyle : ""
});
var googleScholarIV = Ti.UI.createImageView({
	left : "5dp",
	width : "35dp",
	height : "35dp",
	image : "/images/gscholarWhite.png"
});
var title = Ti.UI.createLabel({
	text : args.title,
	top : "5dp",
	bottom : "5dp",
	right: "5dp",
	left : "50dp",
	height : Ti.UI.SIZE,
	font : {
		fontWeight : "bold",
		fontSize : "14dp"
	},
	color: "#fff" //Alloy.Globals.css.tintColor
});
rowTitle.add(googleScholarIV);
rowTitle.add(title);
$.tv.appendRow(rowTitle);

for(var key in resource){
	if(resource.hasOwnProperty(key)){
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

		var isURL = false;
		if(resource[key].indexOf("http") != -1){
			isURL = true;
		}

		var text = Ti.UI.createLabel({
			text : resource[key],
			left : "10dp",
			top : "30dp",
			bottom : "5dp",
			height : Ti.UI.SIZE,
			font : {
				fontSize : "12dp"			},
			right: "5dp",
			color: 'black' //(isURL) ? Alloy.Globals.css.tintColor :'black'
		});
		if(isURL){			
			//if(OS_ANDROID){
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
			/*}else{
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
					title : args.title
				}).getView();
				tab.open(repoWindow);				
			});
		}
		row.add(label);
		row.add(text);
		
		$.tv.appendRow(row);
	};
};