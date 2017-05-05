/**
 * index.js
 * Created by Vladimir Deminenko on 28.04.2017
 */

const {Server} = require('http');
const PORT = 8000;
const FAVICON_REGEX = new RegExp('^\/favicon.ico$');

let sender = require('server-count.module');
let i = 0;

const server = new Server((req, res) => {
    if (~req.url.search(FAVICON_REGEX)) {
        console.log('req.url:', req.url);
    }
    else {
        i++;
    }

    sender.sendResponse(res, i);
});

server.listen(PORT);
console.log('server starts on port %s', PORT);
