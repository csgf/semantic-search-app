var args = arguments[0] || {};

Ti.API.info(args);

if (!OS_IOS)
    $.wv.url = args.url;
else {
    $.wv.url = "/html/info.html";
    $.wv.addEventListener('load', function(e) {
        //Ti.API.info('loaded!');
        if ($.wv.canGoBack()) {
            $.InfoWindow.leftNavButton = backBtn;
        } else {
            $.InfoWindow.leftNavButton = null;
        }
    });

    var backBtn = Ti.UI.createButton({
        title: "back"
    });
    backBtn.addEventListener('click', function() {
        $.wv.goBack();
    });
}


