/**
 * server.js
 * Created by Vladimir Deminenko on 05.06.2017
 */

(function() {
    'use strict';

    const Koa = require('koa');
    const server = new Koa();

    server.use(ctx => {
        ctx.body = 'Hello World';
    });

    server.listen(3000);

    module.exports = {
        server: server
    };
})();
