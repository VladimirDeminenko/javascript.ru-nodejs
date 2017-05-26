/**
 * server.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

let config = require('config');

if (config.get('trace')) require(`${config.get('libsPath')}/trace`);

let mongoose = require('mongoose');
require('./models/users');
let User = mongoose.model('User');

const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();
const PORT = config.get('port');

mongoose.connect(config.get('connection'), config.get('server'));

router.get('/users',
    async (ctx, next) => {
        ctx.body = await User.find({});
        await next();
    });

router.get('/users/:id', async (ctx, next) => {
    ctx.body = await User.findById(ctx.params.id) || ctx.throw(404);

    await next();
});

app.use(router.routes());

app.listen(PORT, () => {
    console.log(`\nserver starts on port ${PORT}`);
});
