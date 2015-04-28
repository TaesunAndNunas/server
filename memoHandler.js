/** memoHandler.js **/   
  
var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {});
var db = new mongodb.Db('ImFine', server, {w: 1});
var querystring = require('querystring'); 
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    mime = require('mime'),
    querystring = require('querystring'),
    formidable = require('formidable');

var UPLOAD_FOLDER = "./upload/"

 
// exports.create = function(req, res, body) { 
//     _insertMemo(body, function(error, result) { 
//         res.writeHead(200, {
//             "Content-Type": "application/json"
//         }); 
//         res.write('{"type": "creatememo"}'); 
//         res.end(); 
//     }); 
// };  
 
 
exports.create = function(req, res, form){

      // var form = new formidable.IncomingForm(),
     var fields = [],
        files = [],
        resultPaths =[];

      form.uploadDir = UPLOAD_FOLDER;
      form.keepExtensions = true;
      // form
      //     .on('field', function(field, value) {
      //       console.log(field, value);
      //       fields.push([field, value]);

      //     })
      //     .on('file', function(field, file) {
      //       console.log(field, file);
      //       files.push([field, file]);

      //     })
      //     .on('end', function() {

    form
    .on('field', function(field, value) {
        console.log(field, value);
        fields.push([field, value]);
    })
    .on('file', function(field, file) {
        console.log(field, file);
        files.push([field, file]);
    })
    // .on('progress', function(bytesReceived, bytesExpected) {
    //     console.log('progress: ' + bytesReceived + '/' + bytesExpected);
    // })
    .on('end', function() {

        var card ={};

        for(var i in files){
            resultPaths.push(files[i][1].path);
        }
        for(var i in fields){
            if(fields[i][0] == "type") card.type = fields[i][1];
            else if(fields[i][0] == "date") card.date = fields[i][1];
        }

        card.date = new Date();
        card.file = resultPaths;


        db.open(function(err) {
             if (err) throw err;
    


        // _insertMemo(memo, function(error, result) { 
        //         res.writeHead(200, {
        //     "Content-Type": "application/json"
        //     });
        // });
        db.open(function(err) {
            if (err) throw err;
            db.collection('card').insert(card, function(err, inserted) {
                if (err) throw err;
                console.dir("successfully inserted: " + JSON.stringify(inserted));
                db.close();
            });
        });
    });
 });




            // console.log('-> upload done');
            // res.writeHead(200, {'content-type': 'text/plain'});
            // res.write('received fields:\n\n '+util.inspect(fields));


    form.parse(req, function(err, fields, files) {

            res.writeHead(200, {
                'content-type': 'application/json'
            });

            res.end(JSON.stringify(resultPaths));
        });
};

//       // } else {

//       //   res.writeHead(404, {'content-type': 'text/plain'});
//       //   res.end('404');
      
//       // }

exports.read = function(req, res, body) {



    var query = url.parse(req.url).query;

    console.log('query : ' + query);

    var vpath = querystring.parse(query)['path'];
    console.log('vpath : ' + typeof vpath);

    if (typeof vpath !== 'undefined') {

        console.log(vpath);

        fs.readFile(UPLOAD_FOLDER + vpath, function(err, data) {

            if (err) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });
                res.end('404');
            }

            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.end(data);

        });

    } else {
        _findMemo({}, function(error, results) {

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.write(JSON.stringify(results));

            res.end();

        });

    }
};

 
// exports.read = function(req, res) { 
//     _findMemo({}, function(error, results) { 
//         res.writeHead(200, {
//             "Content-Type": "application/json"
//         }); 
        
//         res.write(JSON.stringify(results)); 
 
//         //res.write(results); 
//         res.end(); 
//     }); 
// };  
 
exports.update = function(req, res, body) { 
    var query = url.parse(req.url).query; 
    var where = querystring.parse(query);  
 
 
    console.log(where);
 
    console.log(body);
 
 
    _updateMemo(where, body, function(error, results) { 
        res.writeHead(200, {
            "Content-Type": "application/json"
        }); 
        res.write('{"type": "updatememo"}'); 
        res.end(); 
    }); 
};  
 
exports.remove = function(req, res, body) { 
    var query = url.parse(req.url).query; 
    var where = querystring.parse(query);  
 
    console.log(where);
 
    console.log(body);
 
    
         //nedb    
        _removeMemo(where, function(error, results) { 
            res.writeHead(200, {
                "Content-Type": "application/json"
            }); 
            res.write('{"type": "removememo"}'); 
            res.end(); 
        }); 
 
 
  
};   
 
function _insertMemo(body, callback) { 
    body = typeof body === 'string' ? JSON.parse(body) : body;  
    //연산자가 3개 ===는 타입을 비교하는 것!
    var memo = { 
        author: body.author,
         memo: body.memo,
         date: new Date() 
    };  
    
    
    //mongodb only
    db.open(function(err) {
     if (err) throw err;
    
 
 
        db.collection('card').insert(memo , function(err, inserted){
            if (err) throw err;
 
            console.dir("successfully inserted: " + JSON.stringify(inserted));
 
            db.close();
 
            callback();
 
 
        });
 
    
 
      
    });
   
}  
 
function _findMemo(where, callback) { 
 
 
    where = where || {} 
    //where애 뭐라도 데이터가 있으면 where로 가는데, 그게 아니면~
 
    //mongodb only
    db.open(function(err) {
        if (err) throw err;
   
       
        console.log("where " + where.toString());
                
 
        db.collection('card').find(where).toArray(function (err,docs){
             if (err) throw err;
        //.toArray등 
            
            console.log("test");
            console.dir(docs);

            //console.log대신 console.dir을 쓴 이유는 문서이기 때문에
            //cursor대신 뭉텡이 ㅋㅋ로 보내는 것이 더 빠름 당연히.
 
            db.close();
 
            callback(null, docs);
 
 
        });
    });
}  
 
function _updateMemo(where, body, callback) { 
 
    body = typeof body === 'string' ? JSON.parse(body) : body;
 
    //mongodb only
    db.open(function(err) {
        if (err) throw err;
 
        db.collection('card').update(where, { $set: body }, {multi: true}, function(err, updated) {

            //multi: true는 해당하는 모든 것을 선택한다는 의미!
            if (err) throw err;
 
            console.dir("Successfully updated " + updated + " document!");
            db.close();    
 
            callback();
 
        }); 
    });
}  
 
//삭제할때도, where문을 받아서 조건을문을 넣어서 해당하는 것만 삭제할수 없을가?   
//update memo를 참고하면 될듯. 
 
 
function _removeMemo(where, callback) { 
    
 
    //mongodb only
    db.open(function(err) {
        if (err) throw err;
 
        db.collection('card').remove(where, { multi: true}, function(err, removed) {
 
            if(err) throw err;
 
            console.dir("Successfully deleted " + removed + " documents!");
            db.close();
 
            callback();
 
        }); 
 
      
    });
 
}
 
