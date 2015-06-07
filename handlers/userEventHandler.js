/* userInfoHandler.js */

var	fs   = require("fs"),
	path = require("path"),
	msgHandler = require("./msgHandler"),
	dbHandler  = require("./dbHandler");

var PROFILE_FOLDER = "./profileImages/";
	
exports.join = function(res, contents) {
    contents.joinDate = new Date();
	contents.imageUrl = _getImageUrl(contents);

	_insertUserProfile(contents, function(err, userInfo) {
    	if (err) msgHandler.sendError(res);
    	
    	dbHandler.createCollection(contents.p_id , function(err) {
    		if (err) msgHandler.sendError(res);
    		
    		msgHandler.sendString(res, "ok");
    	});
	});
};

function _getImageUrl(contents) {
	if (!contents.imageUrl)
		return null;
	
	var newImageUrl = PROFILE_FOLDER + contents.accessToken + "_profile_image" + path.extname(contents.imageUrl);
	fs.rename(contents.imageUrl, newImageUrl);
	
	return newImageUrl;
}

function _insertUserProfile(contents, callback) {
	dbHandler.insertDb(contents, callback);
}
