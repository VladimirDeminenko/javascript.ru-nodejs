/**
 * koa-chat.js
 * Created by Vladimir Deminenko on 21.05.2017
 */

var Koa = require('koa');
var app = new Koa();

app.use(function (ctx) {
    ctx.body = 'Hello World';
});

app.listen(3000);
