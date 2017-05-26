/**
 * server.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

let config = require('config');

if (config.get('trace')) require(`${config.get('libPath')}/trace`);

let mongoose = require('mongoose');
require('./models/users');
let User = mongoose.model('User');

const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();
const PORT = config.get('port');
const fs = require('fs');
const handlers = fs.readdirSync('./handlers').sort();

handlers.forEach(handler => require('./handlers/' + handler).init(app));

mongoose.connect(config.get('connection'), config.get('server'));

// GET
router.get('/users', async (ctx, next) => {
    ctx.body = await User.find({});
    await next();
});

router.get('/users/:id', async (ctx, next) => {
    ctx.body = await User.findById(ctx.params.id) || ctx.throw(404);
    await next();
});

// POST
router.post('/users', async (ctx, next) => {
    let user = {
        email: ctx.request.body.email,
        displayName: ctx.request.body.displayName
    };

    try {
        ctx.body = await User.create(user);
    }
    catch (error) {
        if (~error.message.indexOf('email')) {
            ctx.throw(400, JSON.stringify({
                    errors: {
                        email: error.message
                    }
                }
            ));
        }
        else if (~error.message.indexOf('displayName')) {
            ctx.throw(400, JSON.stringify({
                    errors: {
                        displayName: error.message
                    }
                }
            ));
        }
        else {
            return ctx.throw(error);
        }
    }

    await next();
});

app.use(router.routes());

app.listen(PORT, () => {
    console.log(`\nserver starts on port ${PORT}`);
});
