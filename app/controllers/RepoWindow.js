var args = arguments[0] || {};

Ti.API.info(args); 

$.wv.url = args.url;
$.RepoWindow.title = args.title;