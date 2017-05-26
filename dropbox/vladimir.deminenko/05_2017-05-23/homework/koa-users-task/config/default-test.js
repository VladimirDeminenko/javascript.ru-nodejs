/**
 * default-test.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

const PORT = 3001;

module.exports = {
    connection: "mongodb://localhost:27017/05-koa-users-task-test",
    debug: false,
    libPath: "../../../lib",
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    },
    port: PORT,
    trace: true,
    baseUri: `http://localhost:${PORT}`
};
