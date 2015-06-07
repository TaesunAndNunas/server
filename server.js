/* server.js */

var fs         = require("fs"),
	http       = require("http"),
	formidable = require("formidable"),
	dataParser = require("./incomingDataParser");

var HTTP_PORT = 80;

function onRequest(req, res) {
	var incomingData = new formidable.IncomingForm();
	incomingData.uploadDir = "./profileImages";
	incomingData.keepExtensions = true;
	incomingData.maxFieldsSize  = 5 * 1024 * 1024;  // 최대 보낼 수 있는 파일 용량 5 mb

	dataParser.dataParser(req, res, incomingData);
}

var server = http.createServer(onRequest);
server.listen(HTTP_PORT);

console.log("Server Start!");


