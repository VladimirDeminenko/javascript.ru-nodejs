/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */

import url = require("url");
import fs = require("fs");
import http = require("http");
import mime = require("mime");

const PORT: number = 3001;
const BAD_FILE_NAME_EXPRESSION: RegExp = new RegExp(/\/|^$|\.\./);

let fileName: string;

var server = http.createServer((req, res) => {
    fileName = req.url.split('/').slice(-1)[0];
    res.statusCode = 200;

    if (~req.url.slice(1).search(BAD_FILE_NAME_EXPRESSION)) {
        res.statusCode = 400;
        return res.end(getMessage(req, res, fileName));
    }

    switch (req.method) {
        case 'GET': {
            let path = `./files/${fileName}`;
            res.setHeader('Content-Type', mime.lookup(path));

            let file = fs.createReadStream(path, {'encoding': 'utf-8', 'autoClose': true});

            file.on("open", () => {
                file.pipe(res);
            });

            file.on("error", (error) => {
                res.statusCode = 400;

                if (error.code === 'ENOENT') {
                    let tmp = error.message.split('\'')[0];

                    res.end(`${tmp}"${fileName}"`);
                }
                else {
                    res.end(getMessage(req, res, fileName));
                }
            });

            return;
        }
        case
        'POST': {
            break;
        }
        case
        'DELETE': {
            break;
        }
        default: {
            res.statusCode = 400;
        }
    }

    res.end(getMessage(req, res, fileName));
});

server.listen(PORT, () => {
    console.log(`server starts on port ${PORT}.`);
});

const getMessage = (req, res, aFileName: string): string => {
    return `${req.method} file "${aFileName}"; status: ${http.STATUS_CODES[res.statusCode]}.`;
};
