/* route.js */

var userEventHandler = require("./handlers/userEventHandler"),
	dataEventHandler = require("./handlers/dataEventHandler");

exports.route = (function() {
	var handlers = { "/join"   : { POST : userEventHandler.join },
					 "/detail" : { POST : dataEventHandler.save,
						 		   PUT  : dataEventHandler.update }
	};
	
	function route(res, pathname, method, contents) {
//		try {
			console.log(pathname, method, contents);
			
			if (typeof handlers[pathname][method] === "function")
				handlers[pathname][method](res, contents);

			else
				console.log("router error");
//		} catch(e) {
//			console.log("router catch error!");
//			console.log(e);
//		}
	}
	
	return route;
})();
