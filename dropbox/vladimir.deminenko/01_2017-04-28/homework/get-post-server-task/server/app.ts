/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */

import fs = require("fs");
import http = require("http");
import mime = require("mime");
import util = require("util");

const PORT: number = 3000;

let server = http.createServer((req, res) => {
    const BAD_FILE_NAME_EXPRESSION: RegExp = new RegExp(/\/|^$|\.\./);
    const OPTIONS = {
        'autoClose': true
    };

    let fileName: string = req.url.split('/').slice(-1)[0];

    if (~req.url.slice(1).search(BAD_FILE_NAME_EXPRESSION)) {
        res.statusCode = 400;
        return res.end(getMessage(req, res, fileName));
    }

    res.statusCode = 200;
    let path = `./files/${fileName}`;

    switch (req.method) {
        case 'GET': {
            res.setHeader('Content-Type', mime.lookup(path));

            let file = fs.createReadStream(path, OPTIONS);

            file.on("open", () => {
                file.pipe(res);
            });

            file.on("error", (err) => {
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    let tmp = err.message.split('\'')[0];

                    res.end(`${tmp}"${fileName}"`);
                }
                else {
                    res.statusCode = 400;
                    res.end(getMessage(req, res, fileName));
                }
            });

            return;
        }
        case 'POST': {
            fs.open(path, 'wx', (err, fd) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        res.statusCode = 409;
                    }
                    else {
                        res.statusCode = 400;
                    }
                }
                else {
                    fs.write(fd, 'First line', (err) => {
                        if (err) {
                            res.statusCode = 400;
                        }
                    });
                }

                return res.end(getMessage(req, res, fileName));
            });

            break;
        }
        case 'DELETE': {
            // fs.stat(path, function (err, stats) {
            //     if (err) {
            //         if (err.code === 'ENOENT') {
            //             res.statusCode = 404;
            //             let tmp = err.message.split('\'')[0];
            //
            //             res.end(`${tmp}"${fileName}"`);
            //         }
            //         else {
            //             res.statusCode = 400;
            //             res.end(getMessage(req, res, fileName));
            //         }
            //     }
            //     else {
            //         res.end(getMessage(req, res, fileName));
            //     }
            //
            // });

            fs.open(path, 'wx', (err, fd) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        console.log('file already exists-2');
                        return res.end(getMessage(req, res, fileName));
                    }
                    else {
                        console.log(err.message);
                        res.statusCode = 404;
                        return res.end(getMessage(req, res, fileName));
                    }
                }

                res.statusCode = 404;
                return res.end(getMessage(req, res, fileName));
            });
            break;

            // file.on("open", () => {
            //     // file.pipe(res);
            // });
            //
            // file.on("error", (error) => {
            //     if (error.code === 'ENOENT') {
            //         res.statusCode = 404;
            //
            //         let tmp = error.message.split('\'')[0];
            //
            //         res.end(`${tmp}"${fileName}"`);
            //     }
            //     else {
            //         res.statusCode = 400;
            //         res.end(getMessage(req, res, fileName));
            //     }
            // });
            // break;
        }
        default: {
            res.statusCode = 400;
            res.end(getMessage(req, res, fileName));
        }
    }
});

server.listen(PORT, () => {
    console.log(`server starts on port ${PORT}.`);
});

const getMessage = (req, res, aFileName: string): string => {
    return `${req.method} file "${aFileName}"; status: ${res.statusCode} ${http.STATUS_CODES[res.statusCode]}.`;
};
