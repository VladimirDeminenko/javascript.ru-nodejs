/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */

import url = require("url");
import fs = require("fs");
import http = require("http");
import mime = require("mime");

const PORT: number = 3000;
const BAD_FILE_NAME_EXPRESSION: RegExp = new RegExp(/\/|^$|\.\./);

var server = http.createServer((req, res) => {
    res.statusCode = 200;

    if (~req.url.slice(1).search(BAD_FILE_NAME_EXPRESSION)) {
        res.statusCode = 400;
        res.end(getMessage(req, res));

        return;
    }

    switch (req.method) {
        case 'GET': {
            break;
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

    res.end(getMessage(req, res));
});

server.listen(PORT, () => {
    console.log(`server starts on port ${PORT}.`);
});

const getMessage = (req, res): string => {
    const FILE_NAME: string = req.url.split('/').slice(-1)[0];

    return `${req.method} file ${FILE_NAME}; status: ${http.STATUS_CODES[res.statusCode]}.`;
};
