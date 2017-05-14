/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */

import config = require("config");
import fs = require("fs");
import http = require("http");
import mime = require("mime");

const FILE_SIZE_LIMIT: number = config.get('fileSizeLimit');
const FILES_ROOT: string = config.get('filesRoot');
const INDEX_FILE: string = config.get('indexFile');
const PORT: number = config.get('port');
const PUBLIC_ROOT: string = config.get('publicRoot');

let server = http.createServer((req, res) => {
    const BAD_FILE_NAME_EXPRESSION: RegExp = new RegExp(/\/|\.\./);

    let fileName: string = req.url.split('/').slice(-1)[0];

    if (~req.url.slice(1).search(BAD_FILE_NAME_EXPRESSION)) {
        res.statusCode = 400;
        return res.end(getMessage(req, res, fileName));
    }

    let path = `${FILES_ROOT}/${fileName}`;

    switch (req.method) {
        case 'GET': {
            fileName = fileName || INDEX_FILE;

            if (fileName == INDEX_FILE) {
                path = `${PUBLIC_ROOT}/${INDEX_FILE}`;
            }

            sendFile(req, res, path);

            break;
        }
        case 'POST': {
            const CONTENT_LENGTH: Number = parseInt(req.headers["content-length"]);

            if (CONTENT_LENGTH > FILE_SIZE_LIMIT) {
                res.statusCode = 413;
                return res.end(getMessage(req, res, fileName));
            }

            fs.open(path, 'wx', (err, fd) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        res.statusCode = 409;
                    }
                    else {
                        res.statusCode = 400;
                    }

                    return res.end(getMessage(req, res, fileName));
                }

                const WRITE_OPTIONS = {
                    "autoClose": true,
                    "fd": fd
                };

                let wStream = fs.createWriteStream(path, WRITE_OPTIONS);
                req.pipe(wStream);

                wStream.on("error", (err) => {
                    console.error("wStream ERROR:", err.message);
                    res.statusCode = 400;
                    res.end(getMessage(req, res, fileName));
                });

                res.statusCode = 200;
                return res.end(getMessage(req, res, fileName));
            });

            break;
        }
        case 'DELETE': {
            fs.unlink(path, (err) => {
                if (err) {
                    res.statusCode = 404;
                }

                return res.end(getMessage(req, res, fileName));
            });

            break;
        }
        default: {
            res.statusCode = 400;
            return res.end(getMessage(req, res, fileName));
        }
    }
});

const getMessage = (req, res, aFileName: string): string => {
    return `${req.method} file "${aFileName}"; status: ${res.statusCode} ${http.STATUS_CODES[res.statusCode]}`;
};

const sendFile = (req, res, fileName) => {
    const file = new fs.ReadStream(fileName);

    file
        .on('error', err => { // file.onError()
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
            }
            else {
                res.statusCode = 500;
            }

            return res.end(getMessage(req, res, fileName));
        })
        .on('open', () => { // file.onOpen()
            res.setHeader('Content-Type', mime.lookup(fileName));
        })
        .pipe(res)
        .on('close', () => { // res.onClose()
            file.destroy();
        });
};

server.listen(PORT, () => {
    console.log(`\nserver starts on port ${PORT}`);
});

const getDirName = () => {
    return process.cwd();
};

module.exports = {
    getDirName: getDirName,
    getMessage: getMessage,
    server: server
};
