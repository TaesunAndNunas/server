/* dbHandler.js */

var mongodb = require("mongodb"),
	server  = new mongodb.Server("localhost", 27017, { auto_reconnect : true, poolSize : 10 }),
	db      = new mongodb.Db("imFine", server, { w: 1 });
	collection = db.collection("members");

db.open();

exports.insertDb = function (contents, callback) {
	if(contents.id)
		collection = db.collection(contents.name);
		
    collection.insert(contents, function(err) {
        console.log("insert Data: ", JSON.stringify(contents));
        callback(err);
    });
};
	
exports.findDb = function (where, options, callback) {
	collection.find(where, options).toArray(function(err, data) {
        console.log("find data:", JSON.stringify(data[0]));
        callback(err, data[0]);
    });
};

exports.updateDb = function (collection, where, operator, callback) {
	collection = db.collection(collection);
	
    collection.update(where, operator, function(err, data) {
        console.log("update Data: ", data.result);
        callback(err);
    });
};

exports.removeDb = function (where, callback) {
    collection.remove(where, function (err, data) {
        console.log("remove Data: ", data.result);
        callback(err);
    });
};

exports.createCollection = function (collection, callback) {
	db.createCollection(collection, function (err) {
        console.log("create collection: ", collection);
        callback(err);
	});
}
