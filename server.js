var http = require('http');
var route = require('./route.js');
var formidable = require('formidable')

// util = require('util'),
//     path = require('path'),
//     url = require('url'),
//     fs = require('fs'),
//     mime = require('mime'),
//     querystring = require('querystring');

function onRequest(req, res){
	var body = '';

	if (req.url == '/cardList' && req.method.toUpperCase() == 'POST') {
   		 var form = new formidable.IncomingForm();
   		 route.route(req, res, form);

    // form.parse(req, function(err, fields, files) {
    //   res.writeHead(200, {'content-type': 'text/plain'});
    //   res.write('received upload:\n\n');
    //   res.end(util.inspect({fields: fields, files: files}));
    } else {

		req.on('end', function(){
			route.route(req, res, body);
		});
    }


	req.on('data', function(chunk){
		body += chunk;
	});
	

}
var server = http.createServer(onRequest);
server.listen(9999);

