/**
 * app.ts
 * Created by Vladimir Deminenko on 01.05.2017
 */

import url = require("url");
import fs = require("fs");
import http = require("http");

const PORT = 3000;

var server = http.createServer(function (req, res) {
    res.end('server was started and stopped#');
});

server.listen(PORT);
console.log('server starts on port %s.', PORT);
