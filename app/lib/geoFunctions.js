/**
 * Get the screen boundaries as latitude and longitude values 
 */
exports.getMapBounds = function(region) {
    var b = {};
    b.nw = {}; b.ne = {};
    b.sw = {}; b.se = {};
 
    b.nw.lat = parseFloat(region.latitude) + 
        parseFloat(region.latitudeDelta) / 2.0;
    b.nw.lng = parseFloat(region.longitude) - 
        parseFloat(region.longitudeDelta) / 2.0;
 
    b.sw.lat = parseFloat(region.latitude) - 
        parseFloat(region.latitudeDelta) / 2.0;
    b.sw.lng = parseFloat(region.longitude) - 
        parseFloat(region.longitudeDelta) / 2.0;
 
    b.ne.lat = parseFloat(region.latitude) + 
        parseFloat(region.latitudeDelta) / 2.0;
    b.ne.lng = parseFloat(region.longitude) + 
        parseFloat(region.longitudeDelta) / 2.0;
 
    b.se.lat = parseFloat(region.latitude) - 
        parseFloat(region.latitudeDelta) / 2.0;
    b.se.lng = parseFloat(region.longitude) + 
        parseFloat(region.longitudeDelta) / 2.0;
 
    return b;
};