/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */

import fs = require("fs");
import http = require("http");
import mime = require("mime");

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

    switch (req.method) {
        case 'GET': {
            let path = `./files/${fileName}`;
            res.setHeader('Content-Type', mime.lookup(path));

            let file = fs.createReadStream(path, OPTIONS);

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
        case 'POST': {
            break;
        }
        case 'DELETE': {
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
