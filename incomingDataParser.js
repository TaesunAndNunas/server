/* incomingDataParser.js */

var	url    = require("url"),
	router = require("./router");
	

exports.dataParser = (function() {
	function dataParser(req, res, form) {
		form.parse(req, function(err, incomingContents, file) {
			if (err) {
				console.log("data parsing error");
				return ;
			}
			
			console.log(incomingContents.id);
			
			var contents = {};
			
			if (incomingContents.profile)
				contents = JSON.parse(incomingContents.profile);
			
			else if (incomingContents.event) {
				contents = JSON.parse(incomingContents.event);
				contents.id = incomingContents.id;
				contents.name = incomingContents.name;
			}
			
			else if (incomingContents.detail) {
				contents = JSON.parse(incomingContents.detail);
				contents.id = incomingContents.id;
				contents.name = incomingContents.name;
			}
			
			if (file.image)
				contents.imageUrl = file.image.path;
			
			var method   = req.method.toUpperCase();
			var pathname = url.parse(req.url).pathname;
			
			if (method === "GET") {
				var path = [];
				path = pathname.split("/");
				pathname = "/" + path[1];
				contents.imageName = path[2];
			}
			
			router.route(res, pathname, method, contents);
		});

	}
	
	return dataParser;
})();
