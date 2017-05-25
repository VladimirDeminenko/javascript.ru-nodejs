/**
 * default.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

const PORT = 3000;

module.exports = {
    connection: "mongodb://localhost:27017/05-koa-users-task",
    debug: false,
    libsPath: "../../../libs",
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    },
    port: PORT,
    trace: true,
    uri: `http://localhost:${PORT}`
};
