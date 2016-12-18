/**
 * Borrowed from node-formidable: https://github.com/felixge/node-formidable
 * When in doubt go here: https://nodejs.org/api/http.html
 * 
 * Usage: node bt_uploader.js
 * 
 * Testing:
 * 
 * Write a form (and rewrite using node-express) or use cURL. Substituting <file_name> and <port>:
 * 
 * curl -i -F name=test -F filedata=@<file_name> http://localhost:<port>/upload
 * 
 */

var port = 8080;
var fileDirectory = '/tmp/';

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

var app = http.createServer(function(req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        req.on('error', function(e) {
            console.log('Problem with request: ' + e.message);
        });
        // parse a file upload
        var form = new formidable.IncomingForm();

        form.keepExtensions = true;
        form.uploadDir = fileDirectory;

        form
            .parse(req, function(err, fields, files) {
                res.writeHead(200, {
                    'content-type' : 'text/plain'
                });
                res.write('Received upload:\r\n\r\n');
                res.end(util.inspect({
                    fields : fields,
                    files : files
                }));
            })
            .on('fileBegin', function(name, file){
                // Rename the incoming file to the file's name
                file.path = form.uploadDir + "/" + file.name;
            });
        return;
    }

    // show a file upload form
    res.writeHead(200, {
        'content-type' : 'text/html'
    });
    res.end('<form action="/upload" enctype="multipart/form-data" method="post">'
            + '<input type="text" name="title"><br>'
            + '<input type="file" name="upload" multiple="multiple"><br>'
            + '<input type="submit" value="Upload">' + '</form>');
});

app.listen(port);
console.log('Server running on port: ' + port)