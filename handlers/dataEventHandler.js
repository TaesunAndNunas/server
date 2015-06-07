/* dataEventHandler.js */

var ObjectID      = require("mongodb").ObjectID,
	fs            = require("fs"),
	msgHandler    = require("./msgHandler"),
	dbHandler     = require("./dbHandler");

exports.save = function(res, contents) {
	_insertData(contents, function(err, userInfo) {
    	if (err) msgHandler.sendError(res);

    	msgHandler.sendString(res, "ok");
	});
};

exports.update = function(res, contents) {
	_updateData(contents, function(err, userInfo) {
    	if (err) msgHandler.sendError(res);

    	msgHandler.sendString(res, "ok");
	});
};

function _insertData(contents, callback) {
	dbHandler.insertDb(contents, callback);
}

function _updateData(contents, callback) {
	var where    = { "id" : contents.id };
	var operator = { $set : contents };
	
	dbHandler.updateDb(contents.name, where, operator, callback);
}
