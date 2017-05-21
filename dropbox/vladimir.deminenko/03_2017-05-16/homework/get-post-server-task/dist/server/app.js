/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */
"use strict";
exports.__esModule = true;
var config = require("config");
var fs = require("fs");
var http = require("http");
var mime = require("mime");
var FILE_SIZE_LIMIT = config.get('fileSizeLimit');
var FILES_ROOT = config.get('filesRoot');
var INDEX_FILE = config.get('indexFile');
var PORT = config.get('port');
var PUBLIC_ROOT = config.get('publicRoot');
var server = http.createServer(function (req, res) {
    var BAD_FILE_NAME_EXPRESSION = new RegExp(/\/|\.\./);
    var fileName = req.url.split('/').slice(-1)[0];
    if (~req.url.slice(1).search(BAD_FILE_NAME_EXPRESSION)) {
        res.statusCode = 400;
        return res.end(getMessage(fileName, req, res));
    }
    var filePath = FILES_ROOT + "/" + fileName;
    switch (req.method) {
        case 'GET': {
            fileName = fileName || INDEX_FILE;
            if (fileName == INDEX_FILE) {
                filePath = PUBLIC_ROOT + "/" + INDEX_FILE;
            }
            sendFile(req, res, filePath);
            break;
        }
        case 'POST': {
            var CONTENT_LENGTH = parseInt(req.headers["content-length"]);
            if (CONTENT_LENGTH > FILE_SIZE_LIMIT) {
                res.statusCode = 413;
                return res.end(getMessage(fileName, req, res));
            }
            receiveFile(filePath, req, res);
            break;
        }
        case 'DELETE': {
            fs.unlink(filePath, function (err) {
                if (err) {
                    res.statusCode = 404;
                }
                else {
                    res.statusCode = 200;
                }
                return res.end(getMessage(fileName, req, res));
            });
            break;
        }
        default: {
            res.statusCode = 400;
            return res.end(getMessage(fileName, req, res));
        }
    }
});
var getMessage = function (aFileName, req, res) {
    return req.method + " file \"" + aFileName + "\"; status: " + res.statusCode + " " + http.STATUS_CODES[res.statusCode];
};
var receiveFile = function (filePath, req, res) {
    fs.open(filePath, 'wx', function (err, fd) {
        var fileName = filePath.split('/').slice(-1);
        if (err) {
            if (err.code === 'EEXIST') {
                res.statusCode = 409;
            }
            else {
                res.statusCode = 500;
            }
            return res.end(getMessage(fileName, req, res));
        }
        var WRITE_OPTIONS = {
            "autoClose": true,
            "fd": fd,
            "flags": "wx"
        };
        var wStream = fs.createWriteStream(filePath, WRITE_OPTIONS);
        var wStreamSize = 0;
        wStream
            .on("error", function (err) {
            if (err.code === 'EEXIST') {
                res.statusCode = 409;
            }
            else {
                console.error(err);
                if (!res.headersSent) {
                    res.setHeader('Connection', 'close');
                }
                res.statusCode = 500;
            }
            res.end(getMessage(fileName, req, res));
        })
            .on('close', function () {
            res.statusCode = 200;
            res.end(getMessage(fileName, req, res));
        });
        req
            .on('data', function (chunk) {
            wStreamSize += chunk.length;
            if (wStreamSize > FILE_SIZE_LIMIT) {
                wStream.close();
                fs.unlink(filePath, function (err) {
                    if (!res.headersSent) {
                        res.setHeader('Connection', 'close');
                    }
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        return res.end(getMessage(fileName, req, res));
                    }
                    res.statusCode = 413;
                    res.end(getMessage(fileName, req, res));
                });
            }
        })
            .pipe(wStream);
    });
};
var sendFile = function (req, res, filePath) {
    var file = fs.createReadStream(filePath);
    file
        .on('error', function (err) {
        var fileName = filePath.split('/').slice(-1);
        if (err.code === 'ENOENT') {
            res.statusCode = 404;
        }
        else {
            res.statusCode = 500;
        }
        return res.end(getMessage(fileName, req, res));
    })
        .on('open', function () {
        res.setHeader('Content-Type', mime.lookup(filePath));
    })
        .on('close', function () {
        res.statusCode = 200;
    })
        .pipe(res)
        .on('close', function () {
        file.destroy();
    });
};
server.listen(PORT, function () {
    console.log("\nserver starts on port " + PORT);
});
var getDirName = function () {
    return process.cwd();
};
module.exports = {
    getDirName: getDirName,
    getMessage: getMessage,
    server: server
};
