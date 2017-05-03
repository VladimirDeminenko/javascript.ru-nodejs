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
    let message: string = 'Bad Request';

    if (~req.url.slice(1).search(BAD_FILE_NAME_EXPRESSION)) {
        res.statusCode = 400;
        res.end(message);

        return;
    }

    const FILE_NAME: string[] = req.url.split('/').slice(-1);

    switch (req.method) {
        case 'GET': {
            message = `get file: ${FILE_NAME}`;
            break;
        }
        case 'POST': {
            message = `post file: ${FILE_NAME}`;
            break;
        }
        case 'DELETE': {
            message = `delete file: ${FILE_NAME}`;
            break;
        }
        default: {
            res.statusCode = 400;
        }

    }

    console.log(message);
    res.end(message);
});

server.listen(PORT, () => {
    console.log('server starts on port %s.', PORT);
});
